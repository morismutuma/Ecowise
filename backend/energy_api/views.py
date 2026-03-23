from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Appliance, UsageRecord, Notification, UserSettings
from .serializers import (
    RegisterSerializer, UserSerializer, UserSettingsSerializer,
    ApplianceSerializer, UsageRecordSerializer, NotificationSerializer
)


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


# ── Settings ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def settings_view(request):
    settings, _ = UserSettings.objects.get_or_create(user=request.user)
    if request.method == 'GET':
        return Response(UserSettingsSerializer(settings).data)
    serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# ── Appliances ────────────────────────────────────────────────────────────────

class ApplianceViewSet(viewsets.ModelViewSet):
    serializer_class = ApplianceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appliance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        appliance = serializer.save(user=self.request.user)
        self._check_and_notify(appliance)

    def perform_update(self, serializer):
        appliance = serializer.save()
        self._check_and_notify(appliance)

    def _check_and_notify(self, appliance):
        try:
            settings = appliance.user.settings
            threshold = settings.alert_threshold_kwh
        except UserSettings.DoesNotExist:
            threshold = 5.0

        if appliance.daily_kwh > threshold:
            Notification.objects.create(
                user=appliance.user,
                appliance=appliance,
                notification_type='high_usage',
                message=f"⚠ {appliance.name} is consuming high energy — {appliance.daily_kwh:.2f} kWh/day exceeds your {threshold} kWh threshold."
            )


# ── Usage Records ─────────────────────────────────────────────────────────────

class UsageRecordViewSet(viewsets.ModelViewSet):
    serializer_class = UsageRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = UsageRecord.objects.filter(appliance__user=self.request.user)
        days = self.request.query_params.get('days')
        if days:
            since = date.today() - timedelta(days=int(days))
            qs = qs.filter(date__gte=since)
        return qs

    def perform_create(self, serializer):
        record = serializer.save()
        self._check_notify(record)

    def _check_notify(self, record):
        try:
            settings = record.appliance.user.settings
            threshold = settings.alert_threshold_kwh
        except UserSettings.DoesNotExist:
            threshold = 5.0
        if record.kwh_consumed > threshold:
            Notification.objects.create(
                user=record.appliance.user,
                appliance=record.appliance,
                notification_type='high_usage',
                message=f"⚠ {record.appliance.name} consumed {record.kwh_consumed:.2f} kWh on {record.date} — above your threshold."
            )


# ── Notifications ─────────────────────────────────────────────────────────────

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked read'})


# ── Dashboard ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    user = request.user
    today = date.today()
    appliances = Appliance.objects.filter(user=user, is_active=True)

    try:
        settings = user.settings
        cost_per_kwh = settings.cost_per_kwh
        threshold = settings.alert_threshold_kwh
    except UserSettings.DoesNotExist:
        cost_per_kwh = 0.12
        threshold = 5.0

    appliance_data = []
    total_kwh = 0
    for a in appliances:
        kwh = a.daily_kwh
        total_kwh += kwh
        if kwh < threshold * 0.33:
            level = 'low'
        elif kwh < threshold * 0.66:
            level = 'medium'
        else:
            level = 'high'
        appliance_data.append({
            'id': a.id,
            'name': a.name,
            'category': a.category,
            'watt_rating': a.watt_rating,
            'daily_hours': a.daily_hours,
            'daily_kwh': round(kwh, 3),
            'usage_level': level,
        })

    appliance_data.sort(key=lambda x: x['daily_kwh'], reverse=True)

    total_cost = round(total_kwh * cost_per_kwh, 2)
    unread_count = Notification.objects.filter(user=user, is_read=False).count()

    # 7-day trend
    trend = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_records = UsageRecord.objects.filter(appliance__user=user, date=d)
        day_kwh = sum(r.kwh_consumed for r in day_records)
        # fallback to calculated if no records
        if day_kwh == 0 and i == 0:
            day_kwh = total_kwh
        trend.append({'date': d.isoformat(), 'kwh': round(day_kwh, 3)})

    return Response({
        'total_kwh_today': round(total_kwh, 3),
        'estimated_cost_today': total_cost,
        'cost_per_kwh': cost_per_kwh,
        'alert_threshold': threshold,
        'appliances': appliance_data,
        'unread_notifications': unread_count,
        'trend': trend,
    })


# ── Charts Data ───────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def charts_view(request):
    user = request.user
    today = date.today()
    days = int(request.query_params.get('days', 30))
    since = today - timedelta(days=days - 1)

    # daily totals
    daily = {}
    for i in range(days):
        d = since + timedelta(days=i)
        daily[d.isoformat()] = 0

    records = UsageRecord.objects.filter(appliance__user=user, date__gte=since)
    for r in records:
        key = r.date.isoformat()
        if key in daily:
            daily[key] += r.kwh_consumed

    daily_chart = [{'date': k, 'kwh': round(v, 3)} for k, v in daily.items()]

    # per-appliance totals
    appliances = Appliance.objects.filter(user=user, is_active=True)
    appliance_chart = [{'name': a.name, 'kwh': round(a.daily_kwh, 3)} for a in appliances]
    appliance_chart.sort(key=lambda x: x['kwh'], reverse=True)

    return Response({'daily': daily_chart, 'appliances': appliance_chart})

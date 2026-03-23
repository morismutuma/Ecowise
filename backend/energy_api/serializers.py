from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Appliance, UsageRecord, Notification, UserSettings


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        UserSettings.objects.create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ('cost_per_kwh', 'alert_threshold_kwh')


class ApplianceSerializer(serializers.ModelSerializer):
    daily_kwh = serializers.ReadOnlyField()

    class Meta:
        model = Appliance
        fields = ('id', 'name', 'category', 'watt_rating', 'daily_hours', 'is_active', 'daily_kwh', 'created_at')
        read_only_fields = ('id', 'created_at')


class UsageRecordSerializer(serializers.ModelSerializer):
    appliance_name = serializers.ReadOnlyField(source='appliance.name')

    class Meta:
        model = UsageRecord
        fields = ('id', 'appliance', 'appliance_name', 'date', 'hours_used', 'kwh_consumed', 'created_at')
        read_only_fields = ('id', 'kwh_consumed', 'created_at')


class NotificationSerializer(serializers.ModelSerializer):
    appliance_name = serializers.ReadOnlyField(source='appliance.name')

    class Meta:
        model = Notification
        fields = ('id', 'appliance', 'appliance_name', 'notification_type', 'message', 'is_read', 'created_at')
        read_only_fields = ('id', 'created_at')

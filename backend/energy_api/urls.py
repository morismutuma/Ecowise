from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'appliances', views.ApplianceViewSet, basename='appliance')
router.register(r'usage', views.UsageRecordViewSet, basename='usage')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.me_view, name='me'),

    # Settings
    path('settings/', views.settings_view, name='settings'),

    # Dashboard & Charts
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('charts/', views.charts_view, name='charts'),

    # ViewSets
    path('', include(router.urls)),
]

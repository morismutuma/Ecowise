from django.db import models
from django.contrib.auth.models import User


class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    cost_per_kwh = models.FloatField(default=20.0)  # $ per kWh
    alert_threshold_kwh = models.FloatField(default=5.0)  # daily kWh threshold

    def __str__(self):
        return f"{self.user.username} settings"


class Appliance(models.Model):
    CATEGORY_CHOICES = [
        ('heating', 'Heating & Cooling'),
        ('kitchen', 'Kitchen'),
        ('entertainment', 'Entertainment'),
        ('lighting', 'Lighting'),
        ('charging', 'Charging'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appliances')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    watt_rating = models.FloatField()  # watts
    daily_hours = models.FloatField(default=1.0)  # hours per day
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def daily_kwh(self):
        return (self.watt_rating * self.daily_hours) / 1000

    def __str__(self):
        return f"{self.name} ({self.watt_rating}W)"


class UsageRecord(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='usage_records')
    date = models.DateField()
    hours_used = models.FloatField()
    kwh_consumed = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('appliance', 'date')
        ordering = ['-date']

    def save(self, *args, **kwargs):
        self.kwh_consumed = (self.appliance.watt_rating * self.hours_used) / 1000
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.appliance.name} - {self.date}: {self.kwh_consumed:.2f} kWh"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('high_usage', 'High Usage Alert'),
        ('daily_summary', 'Daily Summary'),
        ('tip', 'Energy Tip'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    appliance = models.ForeignKey(Appliance, on_delete=models.SET_NULL, null=True, blank=True)
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.message[:50]}"

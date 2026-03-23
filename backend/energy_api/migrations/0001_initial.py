from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cost_per_kwh', models.FloatField(default=20.0)),
                ('alert_threshold_kwh', models.FloatField(default=5.0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='settings', to='auth.user')),
            ],
        ),
        migrations.CreateModel(
            name='Appliance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.CharField(choices=[('heating', 'Heating & Cooling'), ('kitchen', 'Kitchen'), ('entertainment', 'Entertainment'), ('lighting', 'Lighting'), ('charging', 'Charging'), ('other', 'Other')], default='other', max_length=50)),
                ('watt_rating', models.FloatField()),
                ('daily_hours', models.FloatField(default=1.0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appliances', to='auth.user')),
            ],
        ),
        migrations.CreateModel(
            name='UsageRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('hours_used', models.FloatField()),
                ('kwh_consumed', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('appliance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usage_records', to='energy_api.appliance')),
            ],
            options={
                'ordering': ['-date'],
                'unique_together': {('appliance', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('high_usage', 'High Usage Alert'), ('daily_summary', 'Daily Summary'), ('tip', 'Energy Tip')], max_length=50)),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('appliance', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='energy_api.appliance')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='auth.user')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]

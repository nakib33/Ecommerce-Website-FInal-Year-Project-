# Generated by Django 3.1.4 on 2021-11-27 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0021_auto_20211127_2219'),
    ]

    operations = [
        migrations.AddField(
            model_name='couponredemption',
            name='is_used',
            field=models.BooleanField(default=False),
        ),
    ]
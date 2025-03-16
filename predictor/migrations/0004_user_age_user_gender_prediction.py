# Generated by Django 5.1.6 on 2025-03-15 08:43

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("predictor", "0003_blogimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="age",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="gender",
            field=models.CharField(
                blank=True,
                choices=[("male", "Male"), ("female", "Female")],
                max_length=10,
                null=True,
            ),
        ),
        migrations.CreateModel(
            name="Prediction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[("male", "Male"), ("female", "Female")], max_length=10
                    ),
                ),
                ("age", models.IntegerField()),
                ("weight", models.FloatField()),
                ("height", models.FloatField()),
                ("bmi", models.FloatField()),
                ("pregnancies", models.IntegerField()),
                ("glucose", models.FloatField()),
                ("blood_pressure", models.FloatField()),
                ("skin_thickness", models.FloatField()),
                ("insulin", models.FloatField()),
                ("prediction_result", models.CharField(max_length=50)),
                ("created_at", models.DateTimeField(default=datetime.datetime.now)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="predictions",
                        to="predictor.user",
                    ),
                ),
            ],
        ),
    ]

from django.db import models
import datetime
from django.contrib.auth.hashers import make_password

# Create your models here.
# Register Model
class User(models.Model):
    user_name = models.CharField(max_length=120, primary_key=True)
    email = models.CharField(max_length=120, unique=True)
    password = models.CharField(max_length=120, blank=True, null=True)
    retype_password = models.CharField(max_length=120, blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.datetime.now)
    


    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

# Login Model
class Login(models.Model):
    user_name = models.CharField(max_length=120, primary_key=True)
    password = models.CharField(max_length=120, blank=True, null=True)

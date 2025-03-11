from django.db import models
import datetime
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

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
    
    def authenticate(self, user_name=None, password=None):
        try:
            user = User.objects.get(user_name=user_name)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        
    def check_password(self, password):
        return check_password(password, self.password)

    def __str__(self):
        return self.email

# Login Model
class Login(models.Model):
    user_name = models.CharField(max_length=120, primary_key=True)
    password = models.CharField(max_length=120, blank=True, null=True)

# Blog Model
class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.title


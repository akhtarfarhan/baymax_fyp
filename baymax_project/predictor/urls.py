from django.contrib import admin
from django.urls import path, include
from predictor import views

app_name = 'predictor'

urlpatterns = [
   path('', views.index_view, name='index'),          # Root URL for index
    path('login/', views.login_view, name='login'),    # Login URL
    path('signup/', views.signup_view, name='signup'), # Signup URL
    path('dashboard/', views.dashboard_view, name='dashboard'), # Dashboard URL
    path('blog/', views.blog_view, name='blog'), # Blog URL
    path('predict/', views.predict_view, name='predict'), # Predict URL
    
    
]
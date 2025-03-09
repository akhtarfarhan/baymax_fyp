from django.shortcuts import render, redirect
from django.http import HttpResponse 


# Create your views here.
def index_view(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
    return render(request, 'signup.html')


def dashboard_view(request):
    return render(request, 'dashboard.html')

def blog_view(request):
    return render(request, 'blog.html')

def predict_view(request):
    return render(request, 'predict.html')


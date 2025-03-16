from django.shortcuts import render, redirect
from django.http import HttpResponse 
from .models import User, Blog
import json
from django.http import JsonResponse

# Create your views here.

#index view
def index_view(request):
    return render(request, 'index.html')

#login view
def login_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        password = request.POST.get('password')
    
        try:
            #Lookup user by username
            user = User.objects.get(user_name=user_name)
            #check password
            if user.check_password(password):
                # request.session['user_id'] = user.id
                request.session['user_name'] = user.user_name
                request.session['email'] = user.email
                return redirect('predictor:dashboard')
            else:
                return render(request, 'login.html', {'error_message': 'Invalid username or password'})
        except User.DoesNotExist:
            return render(request, 'login.html', {'error_message': 'Invalid username or password'})
    return render(request, 'login.html')



#signup view
def signup_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        retype_password = request.POST.get('retype_password')
        if password == retype_password:
            user = User.objects.create(user_name=user_name, email=email, password=password)
            user.save()
            return redirect('predictor:login')
        else:
            return render(request, 'signup.html', {'error_message': 'Passwords do not match'})
        
        if not all([user_name, email, password, retype_password]):
            return render(request, 'signup.html', {'error_message': 'All fields are required'})
        
        #check if user already exists
        if User.objects.filter(user_name=user_name).exists() or User.objects.filter(email=email).exists():
            return render(request, 'signup.html', {'error_message': 'User already exists'})
        
        #create user with hashed password
        user = User(user_name=user_name, email=email, password=password)
        user.save()
        return redirect('predictor:login')
        
        
    return render(request, 'signup.html')







#dashboard view
def dashboard_view(request):
    #check if user is logged in
    user_name = request.session.get('user_name')
    if not user_name:
        return redirect('predictor:login')
    
    try:
        user = User.objects.get(user_name=user_name)
        context = {
            'name': user.user_name,
            'email': user.email,
            # 'age': user.age, #optional
            # 'gender': user.gender, #optional
        }
        return render(request, 'dashboard.html', context)
    except User.DoesNotExist:
        del request.session['user_name']
        return redirect('predictor:login')

    except User.DoesNotExist:
        return redirect('predictor:login')
    
    return render(request, 'dashboard.html', {'user': user})






def blog_view(request):
    if request.method == 'POST':
        if not request.session.get('user_name'):
            return JsonResponse({'success': False, 'message': 'You must be logged in to submit a blog.'}, status=403)

        try:
            user = User.objects.get(user_name=request.session['user_name'])
            data = json.loads(request.POST.get('data'))
            title = data.get('title')
            content = data.get('content')

            # Handle image upload
            image = request.FILES.get('image') if 'image' in request.FILES else None

            if title and content:
                blog = Blog.objects.create(
                    title=title,
                    content=content,
                    image=image,
                    author=user
                )
                # Return the new blog data for front-end display
                return JsonResponse({
                    'success': True,
                    'title': blog.title,
                    'content': blog.content[:100] + ('...' if len(blog.content) > 100 else ''),
                    'image_url': blog.image.url if blog.image else None,
                })
            else:
                return JsonResponse({'success': False, 'message': 'Title and content are required.'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    # GET request: Display all blogs
    blogs = Blog.objects.all().order_by('-created_at')  # Newest first
    context = {
        'blogs': blogs,
        'user_name': request.session.get('user_name')  # For login status
    }
    return render(request, 'blog.html', context)

# Logout view
def logout_view(request):
    del request.session['user_name']
    return redirect('predictor:login')

def predict_view(request):
    return render(request, 'predict.html')


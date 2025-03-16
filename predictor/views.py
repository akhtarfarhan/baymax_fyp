from django.shortcuts import render, redirect
from django.http import HttpResponse 
from .models import User, Blog, Prediction
import json
from django.http import JsonResponse
import logging

# Create your views here.

#index view
def index_view(request):
    context = {
        'user_name': request.session.get('user_name')
    }
    return render(request, 'index.html', context)

#login view
def login_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        password = request.POST.get('password')
        print(f"Attempting to login with username: {user_name} and password: {password}")
    
        try:
            #Lookup user by username
            user = User.objects.get(user_name=user_name)
            print(f"stored password: {user.password}")
            #check password
            if user.check_password(password):
                # request.session['user_id'] = user.id
                print(f"Password is correct")
                request.session['user_name'] = user.user_name
                request.session['email'] = user.email
                return redirect('predictor:dashboard')
            else:
                print(f"Password is incorrect")
                return render(request, 'login.html', {'error_message': 'Invalid username or password'})
        except User.DoesNotExist:
            print(f"User does not exist")
            return render(request, 'login.html', {'error_message': 'Invalid username or password'})
    context = {
        'user_name': request.session.get('user_name')
    }
    return render(request, 'login.html', context)



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
        
        
    context = {
        'user_name': request.session.get('user_name')
    }
    return render(request, 'signup.html', context)







#dashboard view
def dashboard_view(request):
    user_name = request.session.get('user_name')
    if not user_name:
        return redirect('predictor:login')

    try:
        user = User.objects.get(user_name=user_name)
        predictions = Prediction.objects.filter(user=user).order_by('-created_at')  # Newest first
        latest_prediction = predictions.first() if predictions.exists() else None

        context = {
            'name': user.user_name,
            'email': user.email,
            'age': user.age if user.age else 'Not provided',
            'gender': getattr(user, 'gender', 'Not provided'),
            'user_name': user_name,
            'predictions': predictions,
            'latest_prediction': latest_prediction,  # Pass the latest prediction
        }
        return render(request, 'dashboard.html', context)
    except User.DoesNotExist:
        if 'user_name' in request.session:
            del request.session['user_name']
        return redirect('predictor:login')






def blog_view(request):
    if request.method == 'POST':
        if not request.session.get('user_name'):
            return JsonResponse({'success': False, 'message': 'You must be logged in to submit a blog.'}, status=403)

        try:
            user = User.objects.get(user_name=request.session['user_name'])
            data = json.loads(request.POST.get('data'))
            title = data.get('title')
            content = data.get('content')
            image = request.FILES.get('image') if 'image' in request.FILES else None

            if image and not image.name.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                return JsonResponse({'success': False, 'message': 'Invalid image format.'}, status=400)

            if title and content:
                blog = Blog.objects.create(
                    title=title,
                    content=content,
                    image=image,
                    author=user
                )
                author_display = "Created by you" if user.user_name == request.session.get('user_name') else f"Created by {user.user_name}"
                return JsonResponse({
                    'success': True,
                    'id': blog.id,
                    'title': blog.title,
                    'content': blog.content,
                    'image_url': blog.image.url if blog.image else None,
                    'author_display': author_display,
                    'created_at': blog.created_at.strftime('%B %d, %Y'),
                    'author_age': user.age if user.age else 'Not provided'
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
        'user_name': request.session.get('user_name')
    }
    return render(request, 'blog.html', context)


# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def predict_view(request):
    user_name = request.session.get('user_name')
    if not user_name:
        return redirect('predictor:login')

    if request.method == 'POST':
        logger.debug(f"Received POST request with data: {request.POST}")
        try:
            user = User.objects.get(user_name=user_name)
            logger.debug(f"Found user: {user}")
            data = json.loads(request.POST.get('data'))
            logger.debug(f"Parsed data: {data}")
            prediction = Prediction.objects.create(
                user=user,
                gender=data.get('gender'),
                age=int(data.get('age')),
                weight=float(data.get('weight')),
                height=float(data.get('height')),
                pregnancies=int(data.get('pregnancies', 0)),
                glucose=float(data.get('glucose')),
                blood_pressure=float(data.get('bloodPressure')),
                skin_thickness=float(data.get('skinThickness')),
                insulin=float(data.get('insulin')),
            )
            logger.debug(f"Created prediction: {prediction}")
            risk_level = "Low" if float(data.get('glucose')) < 140 else "High"
            prediction.risk_level = risk_level
            prediction.save()
            logger.debug(f"Saved prediction with risk_level: {risk_level}")

            return JsonResponse({
                'success': True,
                'message': 'Prediction data saved successfully.',
                'redirect_url': '/dashboard/'
            })
        except User.DoesNotExist as e:
            logger.error(f"User not found: {e}")
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON data: {e}")
            return JsonResponse({'success': False, 'message': 'Invalid data format.'}, status=400)
        except ValueError as e:
            logger.error(f"Value error: {e}")
            return JsonResponse({'success': False, 'message': 'Invalid numeric values.'}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    context = {
        'user_name': user_name
    }
    return render(request, 'predict.html', context)

# Logout view
def logout_view(request):
    del request.session['user_name']
    return redirect('predictor:login')

def predict_view(request):
    context = {
        'user_name': request.session.get('user_name')
    }
    return render(request, 'predict.html', context)


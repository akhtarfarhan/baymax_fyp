#this one is hitting the server
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
    print("something something")
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

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Prediction

@csrf_exempt
# def predict_view(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             # Process your prediction data here
#             return JsonResponse({
#                 'success': True,
#                 'redirect_url': '/results/'  # or whatever URL you want to redirect to
#             })
#         except json.JSONDecodeError:
#             return JsonResponse({
#                 'success': False,
#                 'message': 'Invalid JSON data'
#             }, status=400)
#         except Exception as e:
#             return JsonResponse({
#                 'success': False,
#                 'message': str(e)
#             }, status=500)

#     context = {
#         'user_name': request.session.get('user_name')
#     }
#     return render(request, 'predict.html', context)


# Logout view
def logout_view(request):
    del request.session['user_name']
    return redirect('predictor:login')



#Predict view
@csrf_exempt
def predict_view(request):
    print('this is to check for the predict app')
    if not request.session.get('user_name'):
        return JsonResponse({'success': False, 'message': 'Please log in to make a prediction'}, status=403)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug("Received data: %s", data)

            # Extract all the required fields from the POST data
            prediction_data = {
                'gender': data.get('gender'),
                'age': int(data.get('age', 0)),
                'weight': float(data.get('weight', 0)),
                'height': float(data.get('height', 0)),
                'pregnancies': int(data.get('pregnancies', 0)),
                'glucose': int(data.get('glucose', 0)),
                'bloodPressure': int(data.get('bloodPressure', 0)),
                'skinThickness': int(data.get('skinThickness', 0)),
                'insulin': int(data.get('insulin', 0))
            }

            # Get the current user
            user = User.objects.get(user_name=request.session['user_name'])

            # Simple prediction logic (you can replace this with your ML model)
            risk_level = "Low"
            if prediction_data['glucose'] > 126 or prediction_data['insulin'] > 200:
                risk_level = "High"
            elif prediction_data['glucose'] > 100:
                risk_level = "Medium"

            # Save prediction to database
            prediction = Prediction.objects.create(
                user=user,
                gender=prediction_data['gender'],
                age=prediction_data['age'],
                weight=prediction_data['weight'],
                height=prediction_data['height'],
                pregnancies=prediction_data['pregnancies'],
                glucose=prediction_data['glucose'],
                blood_pressure=prediction_data['bloodPressure'],
                skin_thickness=prediction_data['skinThickness'],
                insulin=prediction_data['insulin'],
                risk_level=risk_level
            )

            # Store in session for immediate display (optional)
            request.session['latest_prediction_id'] = prediction.id

            return JsonResponse({
                'success': True,
                'redirect_url': '/dashboard/'
            })

        except json.JSONDecodeError as e:
            logger.error("JSON decode error: %s", str(e))
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except User.DoesNotExist:
            logger.error("User not found")
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            logger.error("Unexpected error: %s", str(e))
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)

    context = {
        'user_name': request.session.get('user_name')
    }
    return render(request, 'predict.html', context)
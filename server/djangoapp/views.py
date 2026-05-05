from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
import json
from django.views.decorators.csrf import csrf_exempt
from .restapis import get_request, analyze_review_sentiments, post_review
from .populate import initiate
from .models import CarModel

import logging


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request
def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": username, "status": "Logged out"})

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data.get("userName")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"status": "User exists", "message": "Username already taken."}, status=409)

    user = User.objects.create_user(username=username, password=password)
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.save()
    return JsonResponse({"userName": username, "status": "Registered"})

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
def get_dealerships(request):
    dealers = get_request("/fetchDealers")
    return JsonResponse({"status": 200, "dealers": dealers})


def get_dealers_by_state(request, state):
    if state.lower() == "all":
        dealers = get_request("/fetchDealers")
    else:
        dealers = get_request(f"/fetchDealers/{state}")
    return JsonResponse({"status": 200, "dealers": dealers})

# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request, dealer_id):
    reviews = get_request(f"/fetchReviews/dealer/{dealer_id}")
    for review in reviews:
        sentiment = analyze_review_sentiments(review.get("review", ""))
        review["sentiment"] = sentiment
    return JsonResponse({"status": 200, "reviews": reviews})

# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    dealer = get_request(f"/fetchDealer/{dealer_id}")
    return JsonResponse({"status": 200, "dealer": dealer})

# Create a `add_review` view to submit a review
@csrf_exempt
def add_review(request):
    data = json.loads(request.body)
    post_review(data)
    return JsonResponse({"status": 200})


def get_cars(request):
    initiate()
    cars = CarModel.objects.select_related("car_make").all()
    car_list = []
    for car in cars:
        car_list.append({
            "CarMake": car.car_make.name,
            "CarModel": car.name,
            "CarYear": car.year,
        })
    return JsonResponse({"CarModels": car_list})

import requests
from urllib.parse import quote
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(endpoint, **kwargs):
    params = kwargs.get("params")
    response = requests.get(backend_url + endpoint, params=params)
    response.raise_for_status()
    return response.json()


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + quote(text)
    response = requests.get(request_url)
    response.raise_for_status()
    return response.json().get("sentiment", "")


def post_review(data_dict):
    response = requests.post(backend_url + "/insert_review", json=data_dict)
    response.raise_for_status()
    return response.json()

from django.urls import path
from .views import *

urlpatterns = [
    path('users/create/', UserCreateView.as_view()),
]
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,TokenVerifyView)
from .views import *

urlpatterns = [

    # Users
    path('token/get/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('user/register/', UserCreateView.as_view(), name='register'),
    path('user/delete/<int:pk>/', UserDeleteView.as_view(), name='user_delete'),
    path('api-auth/', include('rest_framework.urls')),

    # Events
    path('events/', EventListCreateView.as_view(), name='event_list_create'),
    path('events/<int:pk>/', EventDetails.as_view(), name='event_retrieve_update_delete'),
]
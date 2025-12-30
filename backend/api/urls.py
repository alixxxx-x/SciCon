from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,TokenVerifyView)
from .views import *

urlpatterns = [
    path('token/get/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('user/register/', UserCreateView.as_view(), name='register'),
    path('api-auth/', include('rest_framework.urls')),
    path('events/', EventListCreate.as_view(), name='event_list_create'),
    path('events/delete/<int:pk>/', EventDelete.as_view(), name='event_delete'),
]
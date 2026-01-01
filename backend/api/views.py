from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import *

# User Views 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]
    search_fields = ['username', 'email', 'institution']
    ordering_fields = ['created_at', 'username']


# Event Views

class EventListCreateView(generics.ListCreateAPIView):
    queryset= Event.objects.all()
    serializer_class= EventSerializer
    permission_classes = [EventPermissions]  
    
    def perform_create(self, serializer):  # put the current user as organiser
        serializer.save(organizer=self.request.user)


class EventDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Event.objects.all()
    serializer_class= EventSerializer
    permission_classes = [EventPermissions]  
        
        
# Committee Views
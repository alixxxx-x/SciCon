from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import *

# User Views 

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Event Views

class EventListCreateView(generics.ListCreateAPIView):
    queryset= Event.objects.all()
    serialiser_class= EventSerializer

    def get_permissions(self):    #if the http is post then only organiser can create event
        if self.request.method == 'POST':
            return [IsOrganiser()]  
        if self.request.method == 'GET':  #if the http is GET then anyone can view all events
            return []

    def perform_create(self, serializer):  # put the current user as organiser
        serializer.save(organizer=self.request.user)


class EventDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset= Event.objects.all()
    serializer_class= EventSerializer

    def get_permissions(self):
        if self.request.method == 'GET': #anyone can view event details
            return []
        if self.request.method in ['PUT', 'PATCH', 'DELETE']: #only organiser can update or delete event
            return [IsOrganiser()]
        
# Committee Views
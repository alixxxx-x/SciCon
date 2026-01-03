from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
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
    permission_classes = [AllowAny]  
    
    def perform_create(self, serializer):  # put the current user as organiser
        serializer.save(organizer=self.request.user)


class EventDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Event.objects.all()
    serializer_class= EventSerializer
    permission_classes = [EventPermissions]  
        
        
# Committee Views

# Dashboard View

class DashboardStatsView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        stats = [
            { 
                "title": "Total Events", 
                "value": str(Event.objects.count()), 
                "icon": "Calendar", 
                "color": "bg-blue-500", 
                "trend": "Live Data" 
            },
            { 
                "title": "Participants", 
                "value": str(User.objects.filter(role='participant').count()), 
                "icon": "Users", 
                "color": "bg-green-500", 
                "trend": "Registered" 
            },
            { 
                "title": "Submissions", 
                "value": str(Submission.objects.count()), 
                "icon": "FileText", 
                "color": "bg-purple-500", 
                "trend": "Pending Review" 
            },
            { 
                "title": "Revenue", 
                "value": "$0", 
                "icon": "BarChart3", 
                "color": "bg-yellow-500", 
                "trend": "Estimated" 
            },
        ]
        
        recent_events = Event.objects.order_by('-start_date')[:5]
        recent_events_data = EventSerializer(recent_events, many=True).data
        
        return Response({
            "stats": stats,
            "recent_events": recent_events_data
        })

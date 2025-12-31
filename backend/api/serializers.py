from rest_framework import serializers
from .models import *

# User Serializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
        )
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        print("Creating user with data:", validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
    
# Event Serializer

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model=Event
        fields = [   # <-- use a list, not a set
            'id',
            'title',
            'description',
            'venue',
            'start_date',
            'end_date',
            'organizer',
            'committee',
            'archived',
            'created_at',
            'updated_at',
        ]
        
        read_only_fields = ('created_at', 'updated_at', 'archived', 'organizer')
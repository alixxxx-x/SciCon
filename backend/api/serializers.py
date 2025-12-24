from rest_framework import serializers
from .models import *

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

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields={
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
            'updated_at',
        }
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'author': {'read_only': True},
        }
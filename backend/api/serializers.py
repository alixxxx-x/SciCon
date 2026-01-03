
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'institution', 
                  'research_domain', 'bio', 'photo', 'country', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'institution', 
                  'research_domain', 'bio', 'photo', 'country', 'phone']
        read_only_fields = ['id', 'email', 'role']


class SessionSerializer(serializers.ModelSerializer):
    chair_name = serializers.CharField(source='chair.username', read_only=True)
    
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ['created_at']


class EventListSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    sessions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'event_type', 'theme', 'status', 'start_date', 
                  'end_date', 'city', 'country', 'organizer_name', 'sessions_count']
    
    def get_sessions_count(self, obj):
        return obj.sessions.count()


class EventDetailSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    sessions = SessionSerializer(many=True, read_only=True)
    scientific_committee = UserSerializer(many=True, read_only=True)
    submissions_count = serializers.SerializerMethodField()
    registrations_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at', 'updated_at']
    
    def get_submissions_count(self, obj):
        return obj.submissions.count()
    
    def get_registrations_count(self, obj):
        return obj.registrations.count()


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    average_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['reviewer', 'reviewed_at']
    
    def get_average_score(self, obj):
        return round((obj.relevance_score + obj.quality_score + obj.originality_score) / 3, 2)


class SubmissionSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['author', 'submitted_at', 'updated_at', 'status']
    
    def get_average_score(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        total = sum((r.relevance_score + r.quality_score + r.originality_score) / 3 for r in reviews)
        return round(total / len(reviews), 2)


class RegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ['user', 'registered_at']


class WorkshopSerializer(serializers.ModelSerializer):
    leader = UserSerializer(read_only=True)
    participants_count = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Workshop
        fields = '__all__'
        read_only_fields = ['leader', 'created_at']
    
    def get_participants_count(self, obj):
        return obj.participants.count()
    
    def get_available_seats(self, obj):
        return obj.max_participants - obj.participants.count()


class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'likes']


class SurveyQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyQuestion
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    questions = SurveyQuestionSerializer(many=True, read_only=True)
    responses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Survey
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def get_responses_count(self, obj):
        return obj.responses.values('user').distinct().count()


class SurveyResponseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SurveyResponse
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class CertificateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['user', 'generated_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['sender', 'sent_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
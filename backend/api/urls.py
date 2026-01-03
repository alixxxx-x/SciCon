from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,TokenVerifyView)
from .views import *

urlpatterns = [

 
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name='users'),
    
    # Dashboard
    path('dashboard/', dashboard, name='dashboard'),
    
    # Events
    path('events/', EventListCreateView.as_view(), name='events'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event_detail'),
    path('events/my-events/', MyEventsView.as_view(), name='my_events'),
    path('events/<int:event_id>/statistics/', event_statistics, name='event_stats'),
    
    # Sessions
    path('events/<int:event_id>/sessions/', SessionListCreateView.as_view(), name='sessions'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session_detail'),
    
    # Submissions
    path('events/<int:event_id>/submissions/', SubmissionListCreateView.as_view(), name='submissions'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission_detail'),
    path('submissions/my-submissions/', MySubmissionsView.as_view(), name='my_submissions'),
    path('submissions/<int:submission_id>/assign-reviewers/', assign_reviewers, name='assign_reviewers'),
    
    # Reviews
    path('submissions/<int:submission_id>/reviews/', ReviewListCreateView.as_view(), name='reviews'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
    
    # Registrations
    path('events/<int:event_id>/registrations/', RegistrationListCreateView.as_view(), name='registrations'),
    path('registrations/<int:pk>/', RegistrationDetailView.as_view(), name='registration_detail'),
    path('registrations/my-registrations/', MyRegistrationsView.as_view(), name='my_registrations'),
    
    # Workshops
    path('events/<int:event_id>/workshops/', WorkshopListCreateView.as_view(), name='workshops'),
    path('workshops/<int:pk>/', WorkshopDetailView.as_view(), name='workshop_detail'),
    path('workshops/<int:workshop_id>/register/', register_workshop, name='workshop_register'),
    
    # Questions
    path('sessions/<int:session_id>/questions/', QuestionListCreateView.as_view(), name='questions'),
    path('questions/<int:question_id>/like/', like_question, name='question_like'),
    path('questions/<int:question_id>/answer/', answer_question, name='question_answer'),
    
    # Surveys
    path('events/<int:event_id>/surveys/', SurveyListCreateView.as_view(), name='surveys'),
    path('surveys/<int:pk>/', SurveyDetailView.as_view(), name='survey_detail'),
    path('surveys/responses/', SurveyResponseCreateView.as_view(), name='survey_response'),
    path('surveys/<int:survey_id>/results/', survey_results, name='survey_results'),
    
    # Certificates
    path('certificates/', CertificateListView.as_view(), name='certificates'),
    path('certificates/<int:pk>/', CertificateDetailView.as_view(), name='certificate_detail'),
    path('certificates/<int:certificate_id>/download/', download_certificate, name='certificate_download'),
    path('events/<int:event_id>/generate-certificates/', generate_certificates, name='generate_certs'),
    
    # Messages
    path('messages/', MessageListCreateView.as_view(), name='messages'),
    path('messages/<int:pk>/', MessageDetailView.as_view(), name='message_detail'),
    
    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/', mark_notification_read, name='notification_read'),
    path('notifications/read-all/', mark_all_notifications_read, name='notifications_read_all'),
    
]
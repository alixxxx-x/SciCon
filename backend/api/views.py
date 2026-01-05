from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.http import FileResponse
from .models import *
from .serializers import *
from .permissions import *


# Authentication Views

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'institution']
    ordering_fields = ['created_at', 'username']



# Event Views

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'theme', 'city', 'country']
    ordering_fields = ['start_date', 'created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EventListSerializer
        return EventDetailSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset
    
    def perform_create(self, serializer):
        if self.request.user.role not in ['organizer', 'super_admin']:
            raise serializers.ValidationError("Only organizers can create events.")
        serializer.save(organizer=self.request.user)


class EventRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EventDetailSerializer
        return EventDetailSerializer  # same serializer for update

    def perform_update(self, serializer):
        user = self.request.user

        if user.role not in ['organizer', 'super_admin']:
            raise serializers.ValidationError("Only organizers can update events.")

        # Optional: ensure organizer owns the event
        if user.role == 'organizer' and serializer.instance.organizer != user:
            raise serializers.ValidationError("You can only update your own events.")

        serializer.save()


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticated, IsEventOrganizer]


class MyEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)



# Session Views

class SessionListCreateView(generics.ListCreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Session.objects.filter(event_id=event_id)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(event_id=event_id)


class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated, IsEventOrganizer]




# Submission Views

class SubmissionListCreateView(generics.ListCreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'keywords']
    ordering_fields = ['submitted_at', 'status']
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        queryset = Submission.objects.filter(event_id=event_id)
        
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        if self.request.user.role not in ['organizer', 'super_admin']:
            queryset = queryset.filter(author=self.request.user)
        
        return queryset
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        if self.request.user.role != 'author':
            raise serializers.ValidationError("Only authors can submit submissions.")
        serializer.save(author=self.request.user, event_id=event_id)


class SubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        submission = self.get_object()
        if self.request.user.role == 'organizer' or self.request.user.role == 'super_admin':
            serializer.save()
            return
        if self.request.user.role != 'reviewer' and submission.status != 'pending':
            raise serializers.ValidationError("Cannot modify submission once review process has started.")
        serializer.save()


class MySubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        my_submissions= Submission.objects.filter(author=self.request.user) 
        #remove reviews
        my_submissions= my_submissions.prefetch_related(None)           
        return my_submissions


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsOrganizer])
def assign_reviewers(request, submission_id):
    try:
        submission = Submission.objects.get(id=submission_id)
        reviewer_ids = request.data.get('reviewer_ids', [])
        # Only the event organizer or super_admin may assign reviewers
        if not (request.user == submission.event.organizer or request.user.role == 'super_admin'):
            raise PermissionDenied('Only the event organizer or super admin can assign reviewers')

        if not reviewer_ids:
            return Response({'error': 'No reviewer_ids provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Accept IDs as strings or ints
        try:
            reviewer_ids_list = [int(rid) for rid in reviewer_ids]
        except Exception:
            # If conversion fails, still try using original list in query
            reviewer_ids_list = reviewer_ids

        reviewers = User.objects.filter(id__in=reviewer_ids_list, role='reviewer')

        # Determine which IDs were not found or not reviewers
        found_ids = list(reviewers.values_list('id', flat=True))
        missing_ids = [rid for rid in reviewer_ids_list if rid not in found_ids]

        # Add reviewers individually (do not overwrite existing assignments)
        existing_ids = list(submission.assigned_reviewers.values_list('id', flat=True))
        newly_assigned = []
        already_assigned = []
        for reviewer in reviewers:
            if reviewer.id in existing_ids:
                already_assigned.append(reviewer.id)
                continue
            submission.assigned_reviewers.add(reviewer)
            newly_assigned.append(reviewer.id)

        # If there is at least one assigned reviewer, ensure status is under_review
        if submission.assigned_reviewers.exists():
            submission.status = 'under_review'
        submission.save()

        # Notify only newly assigned reviewers
        for reviewer in reviewers.filter(id__in=newly_assigned):
            Notification.objects.create(
                user=reviewer,
                notification_type='review_assigned',
                title='New Review Assigned',
                message=f'You have been assigned to review: {submission.title}',
                related_event=submission.event
            )

        return Response({
            'message': 'Reviewers assigned successfully',
            'newly_assigned_ids': newly_assigned,
            'already_assigned_ids': already_assigned,
            'missing_ids': missing_ids
        }, status=status.HTTP_200_OK)
    except Submission.DoesNotExist:
        return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)




# Review Views

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsReviewerOrOrganizer]
    
    def get_queryset(self):
        submission_id = self.kwargs.get('submission_id')
        if self.request.user.role == 'reviewer':
            user=self.request.user.id
            return Review.objects.filter(reviewer_id=user ,submission_id=submission_id)
        elif self.request.user.role in ['super-admin', 'organizer']:
            return Review.objects.filter(submission_id=submission_id)
        else:
            return PermissionDenied("You don't have the privilege to access this information.")
                
    
    def perform_create(self, serializer):
        submission_id = self.kwargs.get('submission_id')
        submission = Submission.objects.get(id=submission_id)
        
        if self.request.user not in submission.assigned_reviewers.all():
            raise PermissionDenied('You are not assigned to review this submission')
        if submission.reviews.filter(reviewer=self.request.user).exists():
            raise PermissionDenied("You have already submitted a review for this submission.")
        serializer.save(reviewer=self.request.user, submission=submission)
        
        reviews_count = submission.reviews.count()
        if reviews_count >= 2:
            avg_score = submission.reviews.aggregate(
                avg=(Avg('relevance_score') + Avg('quality_score') + Avg('originality_score'))
            )['avg'] / 3
            
            if avg_score >= 4:
                submission.status = 'accepted'
            elif avg_score < 2.5:
                submission.status = 'rejected'
            else:
                submission.status = 'revision_requested'
            submission.save()
            
            Notification.objects.create(
                user=submission.author,
                notification_type=f'submission_{submission.status}',
                title=f'Decision on your submission',
                message=f'Your submission "{submission.title}" has been {submission.get_status_display()}',
                related_event=submission.event
            )


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsReviewerOrOrganizer]



# Registration Views

class RegistrationListCreateView(generics.ListCreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['organizer', 'super_admin']:
            event_id = self.kwargs.get('event_id')
            return Registration.objects.filter(event_id=event_id)
        return Registration.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(user=self.request.user, event_id=event_id)

class RegistrationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if 'payment_status' in self.request.data:
            raise PermissionDenied('This endpoint cannot set payment status')
        serializer.save()

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user)

class AssignPaymentView(generics.UpdateAPIView):
    queryset = Registration.objects.all()
    serializer_class= RegistrationSerializer
    permission_classes = [IsOrganizer | IsSuperAdmin]


# Workshop Views

class WorkshopListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkshopSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Workshop.objects.filter(event_id=event_id)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(leader=self.request.user, event_id=event_id)


class WorkshopDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_workshop(request, workshop_id):
    try:
        workshop = Workshop.objects.get(id=workshop_id)
        
        if workshop.participants.count() >= workshop.max_participants:
            return Response({'error': 'Workshop is full'}, status=status.HTTP_400_BAD_REQUEST)
        workshop.participants.add(request.user)
        return Response({'message': 'Successfully registered to workshop'}, status=status.HTTP_200_OK)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)




# Question Views


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthorOrReadOnly]
    
    def get_queryset(self):
        session_id = self.kwargs.get('session_id')
        return Question.objects.filter(session_id=session_id)
    
    def perform_create(self, serializer):
        session_id = self.kwargs.get('session_id')
        serializer.save(user=self.request.user, session_id=session_id)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_question(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
        if QuestionLikes.objects.filter(question=question, user=request.user).exists():
            return Response({'error': 'You have already liked this question'}, status=status.HTTP_400_BAD_REQUEST)

        QuestionLikes.objects.create(question=question, user=request.user)
        likes_count = QuestionLikes.objects.filter(question=question).count()
        return Response({'likes': likes_count}, status=status.HTTP_200_OK)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAuthorOrReadOnly])
def answer_question(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
        question.answer = request.data.get('answer', '')
        if question.user != request.user:
            raise PermissionDenied('Only the question author can answer this question')
        if question.answer == '':
            raise serializers.ValidationError({'detail': "Answer can't be empty."})
        question.is_answered = True
        question.save()
        return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)




# Survey Views

class SurveyListCreateView(generics.ListCreateAPIView):
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Survey.objects.filter(event_id=event_id)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(event_id=event_id)


class SurveyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]


class SurveyResponseCreateView(generics.CreateAPIView):
    serializer_class = SurveyResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def survey_results(request, survey_id):
    try:
        survey = Survey.objects.get(id=survey_id)
        results = []
        
        for question in survey.questions.all():
            responses = question.responses.all()
            
            if question.question_type == 'rating':
                avg_rating = responses.aggregate(Avg('response_rating'))['response_rating__avg']
                results.append({
                    'question': question.question_text,
                    'type': 'rating',
                    'average_rating': round(avg_rating, 2) if avg_rating else 0,
                    'total_responses': responses.count()
                })
            elif question.question_type == 'choice':
                choice_counts = {}
                for response in responses:
                    choice = response.response_text
                    choice_counts[choice] = choice_counts.get(choice, 0) + 1
                results.append({
                    'question': question.question_text,
                    'type': 'choice',
                    'choices': choice_counts,
                    'total_responses': responses.count()
                })
            else:
                results.append({
                    'question': question.question_text,
                    'type': 'text',
                    'responses': [r.response_text for r in responses],
                    'total_responses': responses.count()
                })
        
        return Response(results, status=status.HTTP_200_OK)
    except Survey.DoesNotExist:
        return Response({'error': 'Survey not found'}, status=status.HTTP_404_NOT_FOUND)



# Certificate Views (FIXED - NO utils.py dependency)


class CertificateListView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)


class CertificateDetailView(generics.RetrieveAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsOrganizer])
def generate_certificates(request, event_id):
    """
    Generate certificate records for all participants
    Note: This creates database records only. Actual PDF files can be uploaded via admin panel.
    """
    try:
        event = Event.objects.get(id=event_id)
        generated_count = 0
        
        # Generate for all registrations
        for registration in event.registrations.all():
            cert_type = 'participation'
            if registration.registration_type == 'speaker':
                cert_type = 'presentation'
            
            certificate, created = Certificate.objects.get_or_create(
                event=event,
                user=registration.user,
                certificate_type=cert_type
            )
            if created:
                generated_count += 1
        
        # Generate for scientific committee members
        for member in event.scientific_committee.all():
            certificate, created = Certificate.objects.get_or_create(
                event=event,
                user=member,
                certificate_type='committee'
            )
            if created:
                generated_count += 1
        
        # Generate for organizer
        certificate, created = Certificate.objects.get_or_create(
            event=event,
            user=event.organizer,
            certificate_type='organization'
        )
        if created:
            generated_count += 1
        
        return Response({
            'message': f'{generated_count} new certificates created successfully',
            'total_certificates': event.certificates.count(),
            'note': 'Certificate PDFs can be uploaded through the admin panel'
        }, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_certificate(request, certificate_id):
    """
    Download certificate PDF if it exists
    """
    try:
        certificate = Certificate.objects.get(id=certificate_id, user=request.user)
        
        if certificate.certificate_file:
            return FileResponse(
                certificate.certificate_file.open('rb'),
                as_attachment=True,
                filename=f'certificate_{certificate.user.username}_{certificate.event.title}.pdf'
            )
        else:
            return Response({
                'error': 'Certificate PDF not available yet. Please contact the event organizer.',
                'certificate_info': {
                    'event': certificate.event.title,
                    'type': certificate.get_certificate_type_display(),
                    'generated_at': certificate.generated_at
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
    except Certificate.DoesNotExist:
        return Response({'error': 'Certificate not found'}, status=status.HTTP_404_NOT_FOUND)



# Message Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(recipient=self.request.user)
        ).order_by('-sent_at')
    
    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        Notification.objects.create(
            user=message.recipient,
            notification_type='new_message',
            title='New Message',
            message=f'You have received a message from {message.sender.username}',
            related_event=message.related_event
        )


class MessageDetailView(generics.RetrieveDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrRecipient]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.recipient == request.user and not instance.is_read:
            instance.is_read = True
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)



# Notification Views

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read'}, status=status.HTTP_200_OK)



# Statistics & Dashboard Views

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsOrganizer])
def event_statistics(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        submissions = event.submissions.all()
        registrations = event.registrations.all()
        
        stats = {
            'total_submissions': submissions.count(),
            'accepted_submissions': submissions.filter(status='accepted').count(),
            'rejected_submissions': submissions.filter(status='rejected').count(),
            'pending_submissions': submissions.filter(status='pending').count(),
            'acceptance_rate': round(submissions.filter(status='accepted').count() / submissions.count() * 100, 2) if submissions.count() > 0 else 0,
            'total_registrations': registrations.count(),
            'participants': registrations.filter(registration_type='participant').count(),
            'speakers': registrations.filter(registration_type='speaker').count(),
            'invited': registrations.filter(registration_type='invited').count(),
            'submissions_by_institution': list(submissions.values('author__institution').annotate(count=Count('id')).order_by('-count')[:10]),
            'submissions_by_country': list(submissions.values('author__country').annotate(count=Count('id')).order_by('-count')),
            'registrations_by_country': list(registrations.values('user__country').annotate(count=Count('id')).order_by('-count')),
            'total_sessions': event.sessions.count(),
            'total_workshops': event.workshops.count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    
    data = {
        'upcoming_events': EventListSerializer(
            Event.objects.filter(start_date__gte=timezone.now().date(), status='open_call').order_by('start_date')[:5],
            many=True
        ).data,
        'my_registrations': RegistrationSerializer(
            Registration.objects.filter(user=user).order_by('-registered_at')[:5],
            many=True
        ).data,
        'unread_notifications': user.notifications.filter(is_read=False).count(),
        'unread_messages': user.received_messages.filter(is_read=False).count(),
    }
    
    if user.role == 'organizer':
        data['my_events'] = EventListSerializer(
            Event.objects.filter(organizer=user).order_by('-created_at')[:5],
            many=True
        ).data
    
    if user.role == 'author':
        data['my_submissions'] = SubmissionSerializer(
            Submission.objects.filter(author=user).order_by('-submitted_at')[:5],
            many=True
        ).data
    
    if user.role == 'reviewer':
        data['pending_reviews'] = Submission.objects.filter(
            assigned_reviewers=user
        ).exclude(
            reviews__reviewer=user
        ).count()
    
    return Response(data, status=status.HTTP_200_OK)
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class User(AbstractUser):
    """Custom User model for all platform users"""
    
    ROLE_CHOICES = [
        ('super_admin', 'Super Administrator'),
        ('organizer', 'Event Organizer'),
        ('author', 'Author/Speaker'),
        ('reviewer', 'Scientific Committee Member'),
        ('participant', 'Participant'),
        ('invited_speaker', 'Invited Speaker'),
        ('workshop_leader', 'Workshop Leader'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')
    institution = models.CharField(max_length=200, blank=True)
    research_domain = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"


class Event(models.Model):
    """Scientific events (congresses, seminars, workshops, etc.)"""
    
    EVENT_TYPE_CHOICES = [
        ('congress', 'Congress'),
        ('seminar', 'Seminar'),
        ('scientific_day', 'Scientific Day'),
        ('workshop', 'Workshop'),
        ('colloquium', 'Colloquium'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open_call', 'Call for Papers Open'),
        ('reviewing', 'Under Review'),
        ('program_ready', 'Program Ready'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    title = models.CharField(max_length=300)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    theme = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    submission_deadline = models.DateTimeField()
    notification_date = models.DateField()
    
    # Location
    venue = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    
    # Contact
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    
    # Registration fees
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Scientific committee
    scientific_committee = models.ManyToManyField(User, related_name='committee_memberships', blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} ({self.start_date.year})"


class Session(models.Model):
    """Sessions within an event"""
    
    SESSION_TYPE_CHOICES = [
        ('plenary', 'Plenary Session'),
        ('parallel', 'Parallel Session'),
        ('poster', 'Poster Session'),
        ('workshop', 'Workshop'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=200)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES)
    description = models.TextField(blank=True)
    room = models.CharField(max_length=100)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    chair = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='chaired_sessions')
    max_participants = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"{self.title} - {self.date}"


class Submission(models.Model):
    """Communication proposals submitted by authors"""
    
    TYPE_CHOICES = [
        ('oral', 'Oral Presentation'),
        ('poster', 'Poster'),
        ('display', 'Display Presentation'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('revision_requested', 'Revision Requested'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='submissions')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    co_authors = models.TextField(help_text="Co-authors separated by commas")
    
    title = models.CharField(max_length=300)
    abstract = models.TextField()
    keywords = models.CharField(max_length=200, help_text="Keywords separated by commas")
    submission_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Files
    abstract_file = models.FileField(upload_to='submissions/abstracts/')
    full_paper = models.FileField(upload_to='submissions/papers/', null=True, blank=True)
    
    # Assignment
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True, related_name='submissions')
    assigned_reviewers = models.ManyToManyField(User, related_name='assigned_submissions', blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.title} - {self.author.email}"


class Review(models.Model):
    """Reviews of submissions by scientific committee members"""
    
    DECISION_CHOICES = [
        ('accept', 'Accept'),
        ('reject', 'Reject'),
        ('revision', 'Revision Required'),
    ]
    
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    # Scores (1-5)
    relevance_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    quality_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    originality_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    comments = models.TextField()
    decision = models.CharField(max_length=20, choices=DECISION_CHOICES)
    
    reviewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['submission', 'reviewer']
    
    def __str__(self):
        return f"Review by {self.reviewer.email} for {self.submission.title}"


class Registration(models.Model):
    """Event registrations"""
    
    REGISTRATION_TYPE_CHOICES = [
        ('participant', 'Participant'),
        ('speaker', 'Speaker'),
        ('invited', 'Invited Guest'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('paid_onsite', 'Paid Onsite'),
        ('paid_online', 'Paid Online'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    registration_type = models.CharField(max_length=20, choices=REGISTRATION_TYPE_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    special_requirements = models.TextField(blank=True)
    
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'user']
    
    def __str__(self):
        return f"{self.user.email} - {self.event.title}"


class Workshop(models.Model):
    """Parallel workshops within an event"""
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='workshops')
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='led_workshops')
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=100)
    max_participants = models.IntegerField()
    
    # Materials
    materials = models.FileField(upload_to='workshops/materials/', null=True, blank=True)
    video_link = models.URLField(blank=True)
    
    participants = models.ManyToManyField(User, related_name='attended_workshops', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.date}"


class Question(models.Model):
    """Questions asked during sessions"""
    
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='questions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    content = models.TextField()
    is_answered = models.BooleanField(default=False)
    answer = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-likes', '-created_at']
    
    def __str__(self):
        return f"Question by {self.user.email} in {self.session.title}"


class Survey(models.Model):
    """Post-session surveys"""
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='surveys')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='surveys', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.event.title}"


class SurveyQuestion(models.Model):
    """Questions within a survey"""
    
    QUESTION_TYPE_CHOICES = [
        ('rating', 'Rating (1-5)'),
        ('text', 'Free Text'),
        ('choice', 'Multiple Choice'),
    ]
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=300)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    choices = models.TextField(blank=True, help_text="Options separated by commas (for multiple choice)")
    
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.question_text


class SurveyResponse(models.Model):
    """User responses to surveys"""
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(SurveyQuestion, on_delete=models.CASCADE, related_name='responses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='survey_responses')
    response_text = models.TextField(blank=True)
    response_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Response by {self.user.email}"


class Certificate(models.Model):
    """Generated certificates for participants"""
    
    CERTIFICATE_TYPE_CHOICES = [
        ('participation', 'Participation'),
        ('presentation', 'Presentation'),
        ('committee', 'Scientific Committee'),
        ('organization', 'Organization'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='certificates')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPE_CHOICES)
    certificate_file = models.FileField(upload_to='certificates/', null=True, blank=True)
    
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'user', 'certificate_type']
    
    def __str__(self):
        return f"{self.get_certificate_type_display()} - {self.user.email}"


class Message(models.Model):
    """Internal messaging system"""
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    related_event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True)
    
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"From {self.sender.email} to {self.recipient.email}"


class Notification(models.Model):
    """System notifications"""
    
    NOTIFICATION_TYPE_CHOICES = [
        ('submission_accepted', 'Submission Accepted'),
        ('submission_rejected', 'Submission Rejected'),
        ('review_assigned', 'Review Assigned'),
        ('program_updated', 'Program Updated'),
        ('new_message', 'New Message'),
        ('event_reminder', 'Event Reminder'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} for {self.user.email}"
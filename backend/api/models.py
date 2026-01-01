from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

# User model

class User(AbstractUser):

    ROLE_CHOICES = [
        ('superadmin', 'Super Administrator'),
        ('organizer', 'Event Organizer'),
        ('author', 'Author / Communicant'),
        ('reviewer', 'Scientific Committee Member'),
        ('participant', 'Participant'),
        ('invited_speaker', 'Invited Speaker'),
        ('workshop_leader', 'Workshop Leader'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='participant')
    research_domain = models.CharField(max_length=200, blank=True)
    institution = models.CharField(max_length=255, blank=True)
    biography = models.TextField(blank=True)
    photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    country = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"
    
# Event model

class Event(models.Model):
    
    EVENT_TYPE_CHOICES = [
    ('congress','Congress' ),
    ('seminar','Seminar'),
    ('scientific_day','Scientific Day'),
    ('workshop','Workshop'),
    ('colloquium','Colloquium'),
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

    organizer = models.ForeignKey(User, related_name='organized_events', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    theme = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')

    # Dates
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    submission_deadline = models.DateTimeField()
    notification_date = models.DateTimeField()

    # location
    venue = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)

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


# Session model

class Session(models.Model):

    SESSION_TYPE_CHOICES = [
        ('plenary', 'Plenary Session'), 
        ('parallel', 'Parallel Session'),
        ('poster', 'Poster Session'),
        ('workshop', 'Workshop')
    ]

    # Session details
    event = models.ForeignKey(Event, related_name='sessions', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    session_type = models.CharField(max_length=50, choices=SESSION_TYPE_CHOICES)
    description = models.TextField(blank=True)

    # room and chair
    room = models.CharField(max_length=128,blank=True)
    chair = models.ForeignKey(User, related_name='chaired_sessions',on_delete=models.SET_NULL, null=True, blank=True)
    max_participants = models.IntegerField(null=True,blank=True)

    # Schedule
    date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"{self.title} - {self.date}"
    
# Workshop model
    
class Workshop(models.Model):

    # Workshop details
    event = models.ForeignKey(Event, related_name='workshops', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    leader = models.ForeignKey(User, related_name='leader_workshops', on_delete=models.SET_NULL)
    description = models.TextField(blank=True)
    

    # Schedule 
    date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    # room and capacity
    participants = models.ManyToManyFiled(User, realted_name='attended_workshops', blank=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    room = models.CharField(max_length=128)

    # resources and materials
    materials = models.FileField(upload_to='workshop_materials/', blank=True, null=True)
    video_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.event.title} - {self.date}" 



# participant registration class

class Registration(models.Model):

    #event registration details

    REGISTRATION_TYPE_CHOICES = [
        ('participant','Participant'),
        ('speaker','Speaker'),
        ('guest','Guest'),
    ]

    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('paid_onsite', 'Paid'),
        ('paid_online', 'Paid on spot'),
    ]

    # realated models
    user = models.ForeignKey(User, related_name='registrations', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name='registrations', on_delete=models.CASCADE)

    # registration details
    registration_type = models.CharField(max_Length=20, choices=REGISTRATION_TYPE_CHOICES)
    registered_at = models.DateTimeField(auto_now_add=True)

    # payment details
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')
    special_requirements = models.TextField(blank=True)


    class Meta:
        unique_together = ['event', 'user']
    
    def __str__(self):
        return f"{self.user.email} - {self.event.title}"
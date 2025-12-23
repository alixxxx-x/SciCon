from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('superadmin', 'Super Administrator'),
        ('organizer', 'Event Organizer'),
        ('author', 'Author / Communicant'),
        ('committee', 'Scientific Committee'),
        ('participant', 'Participant'),
        ('speaker', 'Guest Speaker'),
        ('workshop_leader', 'Workshop Leader'),
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='participant')
    institution = models.CharField(max_length=255, blank=True)
    biography = models.TextField(blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    



class Event(models.Model):
    title = models.CharField(max_length=255)
    descrition = models.TextField(blank=True)
    venue = models.CharField(max_length=255,blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    organizer = models.ForeignKey(User, related_name='organized_events', on_delete=models.CASCADE)
    committee = models.ForeignKey(User, related_name='committee_events',blank=True, null=True, on_delete=models.SET_NULL)
    archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Session(models.Model):
    event = models.ForeignKey(Event, related_name='sessions', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    room = models.CharField(max_length=128,blank=True)
    chair = models.ForeignKey(User, related_name='chaired_sessions',on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} ({self.event.title})"
    
class Workshop(models.Model):
    event = models.ForeignKey(Event, related_name='workshops', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    leader = models.ForeignKey(User, related_name='leader_workshops', on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    capacity = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} ({self.event.title})"    

class ParticipantRegistration(models.Model):
    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('on_spot', 'Paid on spot'),
    ]

    user = models.ForeignKey(User, related_name='registrations', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name='registrations', on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=[('participant','Participant'),('author','Author'),('guest','Guest')], default='participant')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')
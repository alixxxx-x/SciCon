from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    User, Event, Session, Submission, Review, Registration,
    Workshop, Question, Survey, SurveyQuestion, SurveyResponse,
    Certificate, Message, Notification
)

# ============================================
# User Admin
# ============================================

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'institution', 'country', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'country', 'created_at']
    search_fields = ['email', 'username', 'institution', 'research_domain']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'username', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'photo', 'bio', 'phone')
        }),
        ('Professional Info', {
            'fields': ('role', 'institution', 'research_domain', 'country')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'date_joined']
    
    add_fieldsets = (
        ('Create New User', {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )


# ============================================
# Event Admin
# ============================================

class SessionInline(admin.TabularInline):
    model = Session
    extra = 0
    fields = ['title', 'session_type', 'date', 'start_time', 'end_time', 'room']


class SubmissionInline(admin.TabularInline):
    model = Submission
    extra = 0
    fields = ['title', 'author', 'submission_type', 'status']
    readonly_fields = ['title', 'author', 'submission_type']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'status_badge', 'start_date', 'end_date', 'city', 'country', 'organizer', 'submissions_count', 'registrations_count']
    list_filter = ['event_type', 'status', 'start_date', 'country', 'created_at']
    search_fields = ['title', 'description', 'theme', 'city', 'organizer__email']
    date_hierarchy = 'start_date'
    ordering = ['-start_date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'event_type', 'theme', 'status', 'organizer')
        }),
        ('Dates & Deadlines', {
            'fields': ('start_date', 'end_date', 'submission_deadline', 'notification_date')
        }),
        ('Location', {
            'fields': ('venue', 'city', 'country', 'address')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'website')
        }),
        ('Registration', {
            'fields': ('registration_fee',)
        }),
        ('Scientific Committee', {
            'fields': ('scientific_committee',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['scientific_committee']
    inlines = [SessionInline, SubmissionInline]
    
    def status_badge(self, obj):
        colors = {
            'draft': '#6b7280',
            'open_call': '#3b82f6',
            'reviewing': '#f59e0b',
            'program_ready': '#8b5cf6',
            'ongoing': '#10b981',
            'completed': '#059669',
            'archived': '#374151'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, '#gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def submissions_count(self, obj):
        return obj.submissions.count()
    submissions_count.short_description = 'Submissions'
    
    def registrations_count(self, obj):
        return obj.registrations.count()
    registrations_count.short_description = 'Registrations'


# ============================================
# Session Admin
# ============================================

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'event', 'session_type', 'date', 'start_time', 'end_time', 'room', 'chair']
    list_filter = ['session_type', 'date', 'event']
    search_fields = ['title', 'description', 'room', 'event__title']
    date_hierarchy = 'date'
    ordering = ['date', 'start_time']
    
    fieldsets = (
        ('Session Information', {
            'fields': ('event', 'title', 'session_type', 'description')
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time', 'room')
        }),
        ('Management', {
            'fields': ('chair', 'max_participants')
        }),
    )


# ============================================
# Submission Admin
# ============================================

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    fields = ['reviewer', 'relevance_score', 'quality_score', 'originality_score', 'decision']
    readonly_fields = ['reviewer']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'event', 'submission_type', 'status_badge', 'average_score', 'submitted_at']
    list_filter = ['submission_type', 'status', 'event', 'submitted_at']
    search_fields = ['title', 'abstract', 'keywords', 'author__email']
    date_hierarchy = 'submitted_at'
    ordering = ['-submitted_at']
    
    fieldsets = (
        ('Submission Details', {
            'fields': ('event', 'author', 'title', 'abstract', 'keywords', 'submission_type', 'status')
        }),
        ('Authors', {
            'fields': ('co_authors',)
        }),
        ('Files', {
            'fields': ('abstract_file', 'full_paper')
        }),
        ('Review & Assignment', {
            'fields': ('session', 'assigned_reviewers')
        }),
        ('Timestamps', {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['submitted_at', 'updated_at']
    filter_horizontal = ['assigned_reviewers']
    inlines = [ReviewInline]
    
    def status_badge(self, obj):
        colors = {
            'pending': '#6b7280',
            'under_review': '#f59e0b',
            'accepted': '#10b981',
            'rejected': '#ef4444',
            'revision_requested': '#8b5cf6'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, '#gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def average_score(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return '-'
        total = sum((r.relevance_score + r.quality_score + r.originality_score) / 3 for r in reviews)
        avg = total / len(reviews)
        return f"{avg:.2f}/5"
    average_score.short_description = 'Avg Score'


# ============================================
# Review Admin
# ============================================

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['submission', 'reviewer', 'relevance_score', 'quality_score', 'originality_score', 'average', 'decision', 'reviewed_at']
    list_filter = ['decision', 'reviewed_at', 'relevance_score', 'quality_score', 'originality_score']
    search_fields = ['submission__title', 'reviewer__email', 'comments']
    date_hierarchy = 'reviewed_at'
    ordering = ['-reviewed_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('submission', 'reviewer')
        }),
        ('Scores (1-5)', {
            'fields': ('relevance_score', 'quality_score', 'originality_score')
        }),
        ('Decision', {
            'fields': ('decision', 'comments')
        }),
    )
    
    readonly_fields = ['reviewed_at']
    
    def average(self, obj):
        avg = (obj.relevance_score + obj.quality_score + obj.originality_score) / 3
        return f"{avg:.2f}"
    average.short_description = 'Average Score'


# ============================================
# Registration Admin
# ============================================

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'registration_type', 'payment_status_badge', 'registered_at']
    list_filter = ['registration_type', 'payment_status', 'registered_at', 'event']
    search_fields = ['user__email', 'event__title', 'special_requirements']
    date_hierarchy = 'registered_at'
    ordering = ['-registered_at']
    
    fieldsets = (
        ('Registration Information', {
            'fields': ('event', 'user', 'registration_type')
        }),
        ('Payment', {
            'fields': ('payment_status',)
        }),
        ('Additional Information', {
            'fields': ('special_requirements',)
        }),
    )
    
    readonly_fields = ['registered_at']
    
    def payment_status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'paid_onsite': '#10b981',
            'paid_online': '#059669'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.payment_status, '#gray'),
            obj.get_payment_status_display()
        )
    payment_status_badge.short_description = 'Payment Status'


# ============================================
# Workshop Admin
# ============================================

@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ['title', 'event', 'leader', 'date', 'start_time', 'room', 'participants_count', 'max_participants']
    list_filter = ['date', 'event']
    search_fields = ['title', 'description', 'leader__email', 'event__title']
    date_hierarchy = 'date'
    ordering = ['date', 'start_time']
    
    fieldsets = (
        ('Workshop Information', {
            'fields': ('event', 'title', 'description', 'leader')
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time', 'room')
        }),
        ('Capacity', {
            'fields': ('max_participants', 'participants')
        }),
        ('Materials', {
            'fields': ('materials', 'video_link')
        }),
    )
    
    filter_horizontal = ['participants']
    
    def participants_count(self, obj):
        count = obj.participants.count()
        percentage = (count / obj.max_participants * 100) if obj.max_participants > 0 else 0
        color = '#10b981' if percentage < 80 else '#f59e0b' if percentage < 100 else '#ef4444'
        return format_html(
            '<span style="color: {};">{}/{} ({}%)</span>',
            color, count, obj.max_participants, int(percentage)
        )
    participants_count.short_description = 'Participants'


# ============================================
# Question Admin
# ============================================

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['content_preview', 'user', 'session', 'is_answered', 'likes', 'created_at']
    list_filter = ['is_answered', 'created_at', 'session__event']
    search_fields = ['content', 'answer', 'user__email', 'session__title']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Question', {
            'fields': ('session', 'user', 'content')
        }),
        ('Answer', {
            'fields': ('is_answered', 'answer')
        }),
        ('Engagement', {
            'fields': ('likes',)
        }),
    )
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Question'


# ============================================
# Survey Admin
# ============================================

class SurveyQuestionInline(admin.TabularInline):
    model = SurveyQuestion
    extra = 1
    fields = ['question_text', 'question_type', 'choices', 'order']


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ['title', 'event', 'session', 'is_active', 'responses_count', 'created_at']
    list_filter = ['is_active', 'created_at', 'event']
    search_fields = ['title', 'description', 'event__title']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Survey Information', {
            'fields': ('event', 'session', 'title', 'description', 'is_active')
        }),
    )
    
    inlines = [SurveyQuestionInline]
    
    def responses_count(self, obj):
        return obj.responses.values('user').distinct().count()
    responses_count.short_description = 'Responses'


@admin.register(SurveyQuestion)
class SurveyQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'survey', 'question_type', 'order']
    list_filter = ['question_type', 'survey__event']
    search_fields = ['question_text', 'survey__title']
    ordering = ['survey', 'order']


@admin.register(SurveyResponse)
class SurveyResponseAdmin(admin.ModelAdmin):
    list_display = ['user', 'survey', 'question', 'response_preview', 'response_rating', 'created_at']
    list_filter = ['created_at', 'survey__event']
    search_fields = ['user__email', 'response_text']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def response_preview(self, obj):
        if obj.response_text:
            return obj.response_text[:50] + '...' if len(obj.response_text) > 50 else obj.response_text
        return '-'
    response_preview.short_description = 'Response'


# ============================================
# Certificate Admin
# ============================================

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'certificate_type_badge', 'has_file', 'generated_at']
    list_filter = ['certificate_type', 'generated_at', 'event']
    search_fields = ['user__email', 'event__title']
    date_hierarchy = 'generated_at'
    ordering = ['-generated_at']
    
    fieldsets = (
        ('Certificate Information', {
            'fields': ('event', 'user', 'certificate_type')
        }),
        ('File', {
            'fields': ('certificate_file',)
        }),
    )
    
    readonly_fields = ['generated_at']
    
    def certificate_type_badge(self, obj):
        colors = {
            'participation': '#3b82f6',
            'presentation': '#10b981',
            'committee': '#8b5cf6',
            'organization': '#f59e0b'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.certificate_type, '#gray'),
            obj.get_certificate_type_display()
        )
    certificate_type_badge.short_description = 'Type'
    
    def has_file(self, obj):
        if obj.certificate_file:
            return format_html('<span style="color: #10b981;">✓ Yes</span>')
        return format_html('<span style="color: #ef4444;">✗ No</span>')
    has_file.short_description = 'PDF Generated'


# ============================================
# Message Admin
# ============================================

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'sender', 'recipient', 'is_read', 'related_event', 'sent_at']
    list_filter = ['is_read', 'sent_at', 'related_event']
    search_fields = ['subject', 'content', 'sender__email', 'recipient__email']
    date_hierarchy = 'sent_at'
    ordering = ['-sent_at']
    
    fieldsets = (
        ('Message Details', {
            'fields': ('sender', 'recipient', 'subject', 'content')
        }),
        ('Related Event', {
            'fields': ('related_event',)
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
    )
    
    readonly_fields = ['sent_at']


# ============================================
# Notification Admin
# ============================================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type_badge', 'is_read', 'related_event', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at', 'related_event']
    search_fields = ['title', 'message', 'user__email']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('user', 'notification_type', 'title', 'message')
        }),
        ('Related Event', {
            'fields': ('related_event',)
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def notification_type_badge(self, obj):
        colors = {
            'submission_accepted': '#10b981',
            'submission_rejected': '#ef4444',
            'review_assigned': '#3b82f6',
            'program_updated': '#f59e0b',
            'new_message': '#8b5cf6',
            'event_reminder': '#06b6d4'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-size: 11px;">{}</span>',
            colors.get(obj.notification_type, '#gray'),
            obj.get_notification_type_display()
        )
    notification_type_badge.short_description = 'Type'
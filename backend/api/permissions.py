from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions

    # i worked on this permission class to make it more flexible 
    # event permissions with role-based control per HTTP method.


    # Safe methods (GET / HEAD / OPTIONS) => allowed for everyone
    # Unsafe methods (POST / PUT / PATCH / DELETE) =? allowed only for roles in 'allowed_roles' mapping



# Event Permissions
class EventPermissions(BasePermission):
    """
    Event permissions with role-based control per HTTP method AND status-based restrictions.

    Rules:
    - GET / HEAD / OPTIONS → anyone
    - POST → organizer only (only for upcoming events)
    - PUT / PATCH → organizer + committee (only for upcoming or happening events)
    - DELETE → organizer only (only for upcoming or happening events)
    - Finished events cannot be modified or deleted
    """

    # Mapping HTTP methods to allowed roles for "unsafe" methods
    role_map = {
        'POST': ['organizer'],
        'PUT': ['organizer', 'committee'],
        'PATCH': ['organizer','committee '],
        'DELETE': ['organizer'],
    }

    def has_permission(self, request, view):
        # Safe methods: anyone can read
        if request.method in SAFE_METHODS:
            return True

        # Unsafe methods: check role_map
        allowed_roles = self.role_map.get(request.method, [])
        return request.user.is_authenticated and request.user.role in allowed_roles

    def has_object_permission(self, request, view, obj):
        """
        Object-level permission: prevent modifying finished events
        """
        # Safe methods: always allowed
        if request.method in SAFE_METHODS:
            return True

        # If the event is finished, block unsafe methods
        if getattr(obj, 'status', None) == 'finished':
            return False

        # Otherwise, fallback to role-based permissions
        allowed_roles = self.role_map.get(request.method, [])
        return request.user.is_authenticated and request.user.role in allowed_roles
    
class IsSuperAdmin(permissions.BasePermission):
    """Only super admins can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'super_admin'


class IsOrganizer(permissions.BasePermission):
    """Only organizers can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['organizer', 'super_admin']


class IsEventOrganizer(permissions.BasePermission):
    """Only the event organizer can modify"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user
        if hasattr(obj, 'event'):
            return obj.event.organizer == request.user
        return False


class IsAuthorOrReadOnly(permissions.BasePermission):
    """Author can edit, others can only read"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsReviewerOrOrganizer(permissions.BasePermission):
    """Reviewers and organizers can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.role in ['reviewer', 'organizer', 'super_admin']


class IsOwnerOrRecipient(permissions.BasePermission):
    """Message owner or recipient can access"""
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user or obj.recipient == request.user

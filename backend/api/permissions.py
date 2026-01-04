from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    #Only super admins can access
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'super_admin'


class IsOrganizer(permissions.BasePermission):
    #Only organizers can access
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['organizer', 'super_admin']


class IsEventOrganizer(permissions.BasePermission):
    #Only the event organizer can modify
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user
        if hasattr(obj, 'event'):
            return obj.event.organizer == request.user
        return False


class IsAuthorOrReadOnly(permissions.BasePermission):
    #Author can edit, others can only read

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsReviewerOrOrganizer(permissions.BasePermission):
    #Reviewers and organizers can access

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.role in ['reviewer', 'organizer', 'super_admin']


class IsOwnerOrRecipient(permissions.BasePermission):
    #Message owner or recipient can access
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user or obj.recipient == request.user

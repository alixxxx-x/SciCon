from rest_framework.permissions import BasePermission

class IsOrganiser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'organizer'

class IsCommittee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'committee'
    
class IsAuthor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'author'

class IsParticipant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'participant'

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'    
        
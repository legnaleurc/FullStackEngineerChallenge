from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user
            and request.user.is_authenticated
            and request.user.user_extra.is_active
            and request.user.user_extra.is_admin
        )


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user
            and request.user.is_authenticated
            and request.user.user_extra.is_active
        )

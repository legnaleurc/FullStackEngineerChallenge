from django.contrib.auth.models import User
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from .permissions import IsAdmin, IsAuthenticated
from .serializers import UserCreateSerializer, UserUpdateSerializer


class TokenCreateDestroyView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={
                'request': request,
            }
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if not user.user_extra.is_active:
            raise AuthenticationFailed('user not exists')
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserUpdateSerializer(user).data,
        })


class EmployeeListCreateView(ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserCreateSerializer
    queryset = User.objects.filter(
        user_extra__is_admin=False,
        user_extra__is_active=True,
    )


class EmployeeRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserUpdateSerializer
    queryset = User.objects.filter(
        user_extra__is_admin=False,
        user_extra__is_active=True,
    )

    def perform_destroy(self, instance: User):
        instance.user_extra.is_active = False
        instance.user_extra.save()


class EmployeeRetrieveSelfView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

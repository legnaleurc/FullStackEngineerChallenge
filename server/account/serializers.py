from django.contrib.auth.models import User
from rest_framework import serializers

from account.models import create_user


class UserCreateSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    def create(self, validated_data):
        user = create_user(is_admin=False, **validated_data)
        return user

    def to_representation(self, instance):
        rv = super().to_representation(instance)
        rv.pop('password')
        return rv

    def get_is_admin(self, instance):
        return instance.user_extra.is_admin

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'is_admin']


class UserUpdateSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    def get_is_admin(self, instance):
        return instance.user_extra.is_admin

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin']
        read_only_fields = ['username', 'is_admin']

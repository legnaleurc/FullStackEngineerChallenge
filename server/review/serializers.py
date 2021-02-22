from rest_framework import serializers

from account.serializers import UserUpdateSerializer
from .models import Review, ReviewRequest, ReviewResponse


class ReviewSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()
    requested = serializers.SerializerMethodField()
    responsed = serializers.SerializerMethodField()

    def get_score(self, instance: Review):
        responsed = ReviewResponse.objects.filter(request__review=instance).values_list('score', flat=True)
        if responsed.count() <= 0:
            return 0
        sum_ = sum(responsed)
        return sum_ / responsed.count()

    def get_requested(self, instance: Review):
        requested = ReviewRequest.objects.filter(review=instance)
        return requested.count()

    def get_responsed(self, instance: Review):
        responsed = ReviewResponse.objects.filter(request__review=instance)
        return responsed.count()

    class Meta:
        model = Review
        fields = ['id', 'title', 'owner', 'score', 'requested', 'responsed']


class ReviewSimpleSerializer(serializers.ModelSerializer):
    owner = UserUpdateSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'title', 'owner']


class ReviewRequestBatchCreateSerializer(serializers.Serializer):
    participants = serializers.ListField(
        child=serializers.IntegerField()
    )


class ReviewRequestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewRequest
        fields = ['id', 'review', 'owner']


class ReviewRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewResponse
        fields = ['id', 'request', 'score', 'memo']


class ReviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewResponse
        fields = ['id', 'request', 'score', 'memo']


class ReviewRequestRetriveSerializer(serializers.ModelSerializer):
    review = ReviewSimpleSerializer(read_only=True)
    owner = UserUpdateSerializer(read_only=True)
    reviewresponse = ReviewResponseSerializer(read_only=True)

    class Meta:
        model = ReviewRequest
        fields = ['id', 'review', 'owner', 'reviewresponse']

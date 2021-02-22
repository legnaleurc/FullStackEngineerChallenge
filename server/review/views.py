from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    CreateAPIView,
    UpdateAPIView,
)
from rest_framework import status
from rest_framework.response import Response

from account.permissions import IsAdmin, IsAuthenticated
from account.serializers import UserUpdateSerializer

from .models import Review, ReviewRequest, ReviewResponse
from .serializers import (
    ReviewSerializer,
    ReviewRequestBatchCreateSerializer,
    ReviewRequestListSerializer,
    ReviewRequestRetriveSerializer,
    ReviewRequestUpdateSerializer,
    ReviewResponseSerializer,
)


class ReviewListCreateView(ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(owner_id=user)
        return queryset


class ReviewRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class ReviewRequestBatchCreateView(CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ReviewRequestBatchCreateSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data

        review = Review.objects.get(pk=self.kwargs['pk'])
        for user_id in data['participants']:
            user = User.objects.get(pk=user_id)
            review_request = ReviewRequest(review=review, owner=user)
            review_request.save()

        review_request_list = ReviewRequest.objects.filter(review=review)
        serializer = ReviewRequestListSerializer(review_request_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewRequestListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewRequestRetriveSerializer

    def get_queryset(self):
        queryset = ReviewRequest.objects.filter(owner=self.request.user)
        return queryset


class ReviewRequestUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        feedback = ReviewRequest.objects.get(pk=self.kwargs['pk'])

        # if we already have a response, use the existing one
        try:
            instance = feedback.reviewrequest
        except Exception:
            instance = None
        serializer = ReviewResponseSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        feedback.refresh_from_db()
        serializer = ReviewRequestRetriveSerializer(feedback)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save(request_id=self.kwargs['pk'])

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class ReviewUserListView(ListAPIView):
    permission_classes = [IsAdmin]

    def list(self, request, *args, **kwargs):
        review = Review.objects.get(pk=self.kwargs['pk'])
        request_list = ReviewRequest.objects.filter(review=review)
        user_set = set(request_list.values_list('owner_id', flat=True))
        candidate_list = User.objects.filter(user_extra__is_admin=False, user_extra__is_active=True)
        serializer = UserUpdateSerializer(candidate_list, many=True)
        data = serializer.data
        # should not self review
        data = [user for user in data if user['id'] != review.owner_id]
        for user in data:
            user['requested'] = user['id'] in user_set
        return Response(data)

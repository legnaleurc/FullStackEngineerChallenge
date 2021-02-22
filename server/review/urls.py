from django.urls import path

from . import views


urlpatterns = [
    # create new reivew or list all reviews
    path('api/v1/reviews/', views.ReviewListCreateView.as_view()),
    # retrive/update the review
    path('api/v1/reviews/<int:pk>/', views.ReviewRetrieveUpdateDestroyView.as_view()),
    # list possible employees to participate the review
    path('api/v1/reviews/<int:pk>/:employees', views.ReviewUserListView.as_view()),
    # batch send review invitations to employees
    path('api/v1/reviews/<int:pk>/:invite', views.ReviewRequestBatchCreateView.as_view()),
    # list feedbacks to answer
    path('api/v1/feedbacks/', views.ReviewRequestListView.as_view()),
    # answer the feedback
    path('api/v1/feedbacks/<int:pk>/', views.ReviewRequestUpdateView.as_view()),
]

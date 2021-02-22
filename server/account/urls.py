from django.urls import path

from . import views


urlpatterns = [
    path('api/v1/tokens/', views.TokenCreateDestroyView.as_view()),
    path('api/v1/employees/', views.EmployeeListCreateView.as_view()),
    path('api/v1/employees/<int:pk>/', views.EmployeeRetrieveUpdateDestroyView.as_view()),
    path('api/v1/employees/:self', views.EmployeeRetrieveSelfView.as_view()),
]

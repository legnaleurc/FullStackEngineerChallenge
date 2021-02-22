from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=255)


class ReviewRequest(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False)


class ReviewResponse(models.Model):
    request = models.OneToOneField(ReviewRequest, on_delete=models.CASCADE, null=False)
    score = models.IntegerField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(100),
    ])
    memo = models.TextField()

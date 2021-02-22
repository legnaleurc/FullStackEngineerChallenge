from django.db import models, transaction
from django.contrib.auth.models import User


class UserExtra(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_extra')
    is_admin = models.BooleanField(null=False)
    is_active = models.BooleanField(null=False, default=True)


@transaction.atomic
def create_user(
    is_admin: bool,
    username: str,
    password: str,
):
    user: User = User.objects.create_user(username=username, password=password)
    user.save()
    extra = UserExtra(user=user, is_admin=is_admin)
    extra.save()
    return user

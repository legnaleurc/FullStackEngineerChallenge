from django.core.management.base import BaseCommand

from account.models import create_user


class Command(BaseCommand):
    help = 'Create default set of users for testing'

    def handle(self, *args, **kwargs):
        # create admin account
        user = create_user(is_admin=True, username=f'admin', password='1234')
        self.stdout.write(f'Created {user.username}')
        # create 10 normal accounts
        for i in range(10):
            user = create_user(is_admin=False, username=f'user{i}', password='1234')
            self.stdout.write(f'Created {user.username}')

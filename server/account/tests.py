from django.test import TestCase, Client
from django.contrib.auth.models import User

from .models import create_user


def get_auth_header(client: Client, username: str, password: str):
    response = client.post('/api/v1/tokens/', {
        'username': username,
        'password': password,
    })
    data = response.json()
    return {
        'HTTP_AUTHORIZATION': f'Token {data["token"]}'
    }


class TestAccount(TestCase):

    def setUp(self):
        user = create_user(is_admin=True, username='admin', password='1234')
        for i in range(10):
            user = create_user(is_admin=False, username=f'user{i}', password='1234')

    def testCreateUser(self):
        user = create_user(is_admin=True, username='adminadmin', password='1234')
        self.assertTrue(user.user_extra.is_admin)
        user = create_user(is_admin=False, username='user', password='1234')
        self.assertFalse(user.user_extra.is_admin)

    def testCreateToken(self):
        response = self.client.post('/api/v1/tokens/', {
            'username': 'admin',
            'password': '1234',
        })
        self.assertEqual(response.status_code, 200)

    def testListEmployees(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.get('/api/v1/employees/', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 10)

    def testCreateEmployee(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.post('/api/v1/employees/', {
            'username': 'vanilla',
            'password': '1234',
        }, **headers)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['username'], 'vanilla')
        user = User.objects.get(username='vanilla')
        self.assertFalse(user.user_extra.is_admin)

    def testRetriveEmployee(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.get('/api/v1/employees/2/', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['username'], 'user0')

    def testUpdateEmployee(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.put('/api/v1/employees/11/', {
            'email': 'aa@bb.cc',
        }, content_type='application/json', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['email'], 'aa@bb.cc')

    def testDeleteEmployee(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.delete('/api/v1/employees/11/', **headers)
        self.assertEqual(response.status_code, 204)
        user = User.objects.get(pk=11)
        self.assertFalse(user.user_extra.is_active)

    def testRetriveSelf(self):
        headers = get_auth_header(self.client, username='admin', password='1234')
        response = self.client.get('/api/v1/employees/:self', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['username'], 'admin')

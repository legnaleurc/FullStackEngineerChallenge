from django.contrib.auth.models import User
from django.test import TestCase, Client

from account.models import create_user

from .models import Review, ReviewRequest, ReviewResponse


def get_auth_header(client: Client, username: str, password: str):
    response = client.post('/api/v1/tokens/', {
        'username': username,
        'password': password,
    })
    data = response.json()
    return {
        'HTTP_AUTHORIZATION': f'Token {data["token"]}'
    }


class ReviewTestCase(TestCase):

    def setUp(self) -> None:
        for i in range(10):
            create_user(is_admin=False, username=f'user{i}', password='1234')
        create_user(is_admin=True, username='admin', password='1234')

    def testCreateReview(self):
        headers = get_auth_header(self.client, username='admin', password='1234')

        response = self.client.post('/api/v1/reviews/', {
            'owner': 1,
            'title': 'Q1 review',
        }, **headers)
        self.assertEqual(response.status_code, 201)

    def testGetReview(self):
        user1 = User.objects.get(pk=1)
        review = Review(owner=user1, title='Q1 review')
        review.save()
        user2 = User.objects.get(pk=2)
        request_ = ReviewRequest(review=review, owner=user2)
        request_.save()
        response_ = ReviewResponse(request=request_, score=80, memo='')
        response_.save()
        user3 = User.objects.get(pk=3)
        request_ = ReviewRequest(review=review, owner=user3)
        request_.save()
        response_ = ReviewResponse(request=request_, score=20, memo='')
        response_.save()
        user4 = User.objects.get(pk=4)
        request_ = ReviewRequest(review=review, owner=user4)
        request_.save()

        headers = get_auth_header(self.client, username='admin', password='1234')

        response = self.client.get('/api/v1/reviews/1/', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['score'], 50)
        self.assertEqual(data['requested'], 3)
        self.assertEqual(data['responsed'], 2)

    def testListReview(self):
        user = User.objects.get(pk=1)
        review = Review(owner=user, title='Q1 review')
        review.save()
        user = User.objects.get(pk=2)
        review = Review(owner=user, title='Q1 review')
        review.save()

        headers = get_auth_header(self.client, username='admin', password='1234')

        response = self.client.get('/api/v1/reviews/', {
            'user': 1,
        }, **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)

    def testBatchCreateReviewRequest(self):
        user = User.objects.get(pk=1)
        review = Review(owner=user, title='Q1 review')
        review.save()

        headers = get_auth_header(self.client, username='admin', password='1234')

        response = self.client.post(f'/api/v1/reviews/1/:invite', {
            'participants': [1, 2],
        }, **headers)
        self.assertEqual(response.status_code, 201)

    def testListReviewRequest(self):
        user1 = User.objects.get(pk=1)
        review = Review(owner=user1, title='Q1 review')
        review.save()
        user2 = User.objects.get(pk=2)
        request_ = ReviewRequest(review=review, owner=user2)
        request_.save()
        review = Review(owner=user1, title='Q2 review')
        review.save()
        request_ = ReviewRequest(review=review, owner=user2)
        request_.save()

        headers = get_auth_header(self.client, username='user1', password='1234')

        response = self.client.get(f'/api/v1/feedbacks/', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)

    def testCreateReviewResponse(self):
        user1 = User.objects.get(pk=1)
        review = Review(owner=user1, title='Q1 review')
        review.save()
        user2 = User.objects.get(pk=2)
        review_request = ReviewRequest(review=review, owner=user2)
        review_request.save()

        headers = get_auth_header(self.client, username='user2', password='1234')

        response = self.client.patch('/api/v1/feedbacks/1/', {
            'score': 80,
            'memo': 'nothing',
        }, content_type='application/json', **headers)
        self.assertEqual(response.status_code, 200)

    def testListReviewUser(self):
        user1 = User.objects.get(pk=1)
        review = Review(owner=user1, title='Q1 review')
        review.save()
        user2 = User.objects.get(pk=2)
        request_ = ReviewRequest(review=review, owner=user2)
        request_.save()
        user3 = User.objects.get(pk=3)
        request_ = ReviewRequest(review=review, owner=user3)
        request_.save()
        user4 = User.objects.get(pk=4)
        request_ = ReviewRequest(review=review, owner=user4)
        request_.save()

        headers = get_auth_header(self.client, username='admin', password='1234')

        response = self.client.get('/api/v1/reviews/1/:employees', **headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 9)
        dict_ = {u['id']: u for u in data}
        self.assertEqual(dict_[2]['requested'], True)
        self.assertEqual(dict_[10]['requested'], False)

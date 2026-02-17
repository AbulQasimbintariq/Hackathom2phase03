import json
from fastapi.testclient import TestClient
from backend.main import app
import os
import jwt

client = TestClient(app)

AUTH = {"Authorization": "Bearer testuser"}


def test_create_task_and_list():
    # create
    resp = client.post('/api/tasks', json={"title": "Test Task", "description": "desc"}, headers=AUTH)
    assert resp.status_code == 201
    data = resp.json()
    assert data['title'] == 'Test Task'
    task_id = data['id']

    # list
    resp = client.get('/api/tasks', headers=AUTH)
    assert resp.status_code == 200
    tasks = resp.json()
    assert any(t['id'] == task_id for t in tasks)


def test_due_date_sorting():
    # create tasks with due dates
    client.post('/api/tasks', json={"title": "Task A", "due_date": "2026-02-05T00:00:00"}, headers=AUTH)
    client.post('/api/tasks', json={"title": "Task B", "due_date": "2026-02-01T00:00:00"}, headers=AUTH)
    client.post('/api/tasks', json={"title": "Task C", "due_date": "2026-02-03T00:00:00"}, headers=AUTH)

    resp = client.get('/api/tasks?sort=due_date', headers=AUTH)
    assert resp.status_code == 200
    tasks = resp.json()
    titles = [t['title'] for t in tasks]
    # expect ascending due dates: B (Feb 1), C (Feb 3), A (Feb 5)
    assert titles[:3] == ['Task B', 'Task C', 'Task A']


def test_create_requires_title():
    resp = client.post('/api/tasks', json={"title": "", "description": "x"}, headers=AUTH)
    assert resp.status_code == 422


def test_description_length_limit():
    long_desc = 'x' * 2000
    resp = client.post('/api/tasks', json={"title": "Ok", "description": long_desc}, headers=AUTH)
    assert resp.status_code == 422


def test_auth_required():
    resp = client.get('/api/tasks')
    assert resp.status_code == 401


def test_jwt_auth():
    # set a JWT_SECRET and sign a token
    os.environ['JWT_SECRET'] = 'testsecret'
    token = jwt.encode({'sub': 'jwtuser'}, 'testsecret', algorithm='HS256')

    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post('/api/tasks', json={"title": "JWT Task"}, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data['user_id'] == 'jwtuser'
    # cleanup
    del os.environ['JWT_SECRET']

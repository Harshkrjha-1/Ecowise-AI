import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_student():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "student1@campus.edu",
            "password": "Password123!",
            "full_name": "Alex Student",
            "role": "student",
            "department": "Computer Science"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student1@campus.edu"
    assert data["user"]["role"] == "student"
    assert data["user"]["eco_points"] == 100

def test_register_admin():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin1@campus.edu",
            "password": "AdminPassword123!",
            "full_name": "Dr. Sarah Admin",
            "role": "admin",
            "department": "Sustainability Office"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["role"] == "admin"

def test_duplicate_register():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "student1@campus.edu",
            "password": "Password123!",
            "full_name": "Duplicate Alex",
            "role": "student"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "student1@campus.edu",
            "password": "Password123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student1@campus.edu"

def test_login_failure():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "student1@campus.edu",
            "password": "WrongPassword!"
        }
    )
    assert response.status_code == 401

def test_get_me():
    # Login to get token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "student1@campus.edu", "password": "Password123!"}
    )
    token = login_res.json()["access_token"]

    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "student1@campus.edu"

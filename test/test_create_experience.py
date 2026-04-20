#!/usr/bin/env python3

import requests
from datetime import datetime
import pytest

BASE_URL = "http://localhost:8000/admin-work-experience"

def test_create_experience():
    url = f"{BASE_URL}/create"
    payload = {
        "company": "Tech Solutions Inc.",
        "company_url": "https://www.techsolutions.com",
        "role": "Software Engineer",
        "responsabilities": "Developed and maintained web applications.",
        "start_date": datetime(2022, 1, 1).isoformat(),
        "end_date": datetime(2023, 1, 1).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["response"] == "New Experience Created"
    assert data["data"]["company"] == payload["company"]
    assert data["data"]["role"] == payload["role"]
    assert data["data"]["responsabilities"] == payload["responsabilities"]
    assert data["data"]["start_date"] == payload["start_date"]
    assert data["data"]["end_date"] == payload["end_date"]

def test_update_experience():
    # create a new experience first
    url = f"{BASE_URL}/create"
    payload = {
        "company": "Tech Solutions Inc.",
        "company_url": "https://www.techsolutions.com",
        "role": "Software Engineer",
        "responsabilities": "Developed and maintained web applications.",
        "start_date": datetime(2022, 1, 1).isoformat(),
        "end_date": datetime(2023, 1, 1).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    experience_id = data["data"]["experience_id"]

    # update the experience entry
    url = f"{BASE_URL}/update/{experience_id}"
    updated_payload = {
        "company": "Updated Tech Solutions",
        "company_url": "https://www.updatedtech.com",
        "role": "Senior Software Engineer",
        "responsabilities": "Led a team and developed scalable web applications.",
        "start_date": datetime(2022, 1, 1).isoformat(),
        "end_date": datetime(2024, 1, 1).isoformat()
    }
    response = requests.put(url, json=updated_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Experience Updated"
    assert data["data"]["company"] == updated_payload["company"]
    assert data["data"]["role"] == updated_payload["role"]
    assert data["data"]["responsabilities"] == updated_payload["responsabilities"]
    assert data["data"]["start_date"] == updated_payload["start_date"]
    assert data["data"]["end_date"] == updated_payload["end_date"]

def test_delete_experience():
    # create a new experience first
    url = f"{BASE_URL}/create"
    payload = {
        "company": "Tech Solutions Inc.",
        "company_url": "https://www.techsolutions.com",
        "role": "Software Engineer",
        "responsabilities": "Developed and maintained web applications.",
        "start_date": datetime(2022, 1, 1).isoformat(),
        "end_date": datetime(2023, 1, 1).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    experience_id = data["data"]["experience_id"]

    # delete the experience entry
    url = f"{BASE_URL}/delete/{experience_id}"
    response = requests.delete(url)
    assert response.status_code == 200
    data = response.json()
    # backend returns a string, not a dict
    assert data["response"] == "Experience Deleted"

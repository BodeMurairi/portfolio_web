#!/usr/bin/env python3

import requests
from datetime import datetime
import pytest

def test_create_education():
    url = "http://localhost:8000/admin-education/create"
    payload = {
        "institution_name": "Test University",
        "institution_url": "https://www.testuniversity.edu",
        "degree": "Bachelor of Science in Computer Science",
        "description": "A comprehensive program covering fundamental and advanced topics in computer science.",
        "start_date": datetime(2018, 9, 1).isoformat(),
        "end_date": datetime(2022, 6, 30).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["response"] == "New Education Created"
    assert data["data"]["institution_name"] == payload["institution_name"]
    assert data["data"]["degree"] == payload["degree"]
    assert data["data"]["description"] == payload["description"]
    assert data["data"]["start_date"] == payload["start_date"]
    assert data["data"]["end_date"] == payload["end_date"]

def test_update_education():
    # create a new education entry first
    url = "http://localhost:8000/admin-education/create"
    payload = {
        "institution_name": "Test University",
        "institution_url": "https://www.testuniversity.edu",
        "degree": "Bachelor of Science in Computer Science",
        "description": "A comprehensive program covering fundamental and advanced topics in computer science.",
        "start_date": datetime(2018, 9, 1).isoformat(),
        "end_date": datetime(2022, 6, 30).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200,201)
    data = response.json()
    education_id = data["data"]["education_id"]

    # update the education entry
    url = f"http://localhost:8000/admin-education/update/{education_id}"
    
    updated_payload = {
        "institution_name": "Updated Test University",
        "institution_url": "https://www.updatedtestuniversity.edu",
        "degree": "Master of Science in Computer Science",
        "description": "An advanced program covering cutting-edge topics in computer science.",
        "start_date": datetime(2018, 9, 1).isoformat(),
        "end_date": datetime(2024, 6, 30).isoformat()
    }
    response = requests.put(url, json=updated_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["response"] == "Education Updated"
    assert data["data"]["institution_name"] == updated_payload["institution_name"]
    assert data["data"]["degree"] == updated_payload["degree"]
    assert data["data"]["description"] == updated_payload["description"]
    assert data["data"]["start_date"] == updated_payload["start_date"]
    assert data["data"]["end_date"] == updated_payload["end_date"]

def test_delete_education():
    # create a new education entry first
    url = "http://localhost:8000/admin-education/create"
    payload = {
        "institution_name": "Test University",
        "institution_url": "https://www.testuniversity.edu",
        "degree": "Bachelor of Science in Computer Science",
        "description": "A comprehensive program covering fundamental and advanced topics in computer science.",
        "start_date": datetime(2018, 9, 1).isoformat(),
        "end_date": datetime(2022, 6, 30).isoformat()
    }
    response = requests.post(url, json=payload)
    assert response.status_code in (200,201)
    data = response.json()
    education_id = data["data"]["education_id"]

    # delete the education entry
    url = f"http://localhost:8000/admin-education/delete/{education_id}"
    response = requests.delete(url)
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == {
        "message": f"Education with ID {education_id} has been deleted successfully."
        }

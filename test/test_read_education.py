#!/usr/bin/env python3

import requests
from datetime import datetime
import pytest

BASE_URL = "http://localhost:8000"

def test_get_educations():
    """Test retrieving all education entries."""
    url = f"{BASE_URL}/education/list"
    response = requests.get(url)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for education in data:
        assert "education_id" in education
        assert "institution_name" in education
        assert "degree" in education
        assert "description" in education
        assert "start_date" in education
        assert "end_date" in education

def test_get_education_by_id():
    """Test retrieving a single education entry by ID."""

    create_url = f"{BASE_URL}/admin-education/create"
    payload = {
        "institution_name": "Test University",
        "institution_url": "https://www.testuniversity.edu",
        "degree": "Bachelor of Science in Computer Science",
        "description": "A comprehensive program covering fundamental and advanced topics in computer science.",
        "start_date": datetime(2018, 9, 1).isoformat(),
        "end_date": datetime(2022, 6, 30).isoformat()
    }
    create_response = requests.post(create_url, json=payload)
    assert create_response.status_code in (200, 201)
    created_data = create_response.json()
    education_id = created_data["data"]["education_id"]

    get_url = f"{BASE_URL}/education/list/{education_id}"
    response = requests.get(get_url)
    assert response.status_code == 200
    data = response.json()

    assert data["education_id"] == education_id
    assert data["institution_name"] == payload["institution_name"]
    assert data["degree"] == payload["degree"]
    assert data["description"] == payload["description"]
    assert data["start_date"] == payload["start_date"]
    assert data["end_date"] == payload["end_date"]

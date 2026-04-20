#!/usr/bin/env python3

import requests
import pytest

def test_read_experience():
    response = requests.get('http://localhost:8000/experience/experiences')
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for experience in data:
        assert 'experience_id' in experience
        assert 'company' in experience
        assert 'role' in experience
        assert 'start_date' in experience
        assert 'end_date' in experience
        assert 'responsabilities' in experience

def test_read_experience_by_id():
    experience_id = "cb2f815d"
    response = requests.get(f'http://localhost:8000/experience/experiences/{experience_id}')
    assert response.status_code == 200
    experience = response.json()
    assert experience['experience_id'] == experience_id
    assert 'company' in experience
    assert 'role' in experience
    assert 'start_date' in experience
    assert 'end_date' in experience
    assert 'responsabilities' in experience

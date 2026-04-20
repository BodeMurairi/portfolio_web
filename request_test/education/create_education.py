#!/usr/bin/env python3

from datetime import datetime
import requests

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
    response.raise_for_status()  # Raise an exception for HTTP errors
    data = response.json()
    print(data)

if __name__ == "__main__":
    test_create_education()
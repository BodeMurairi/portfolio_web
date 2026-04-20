#!/usr/bin/env python3

from datetime import datetime
import requests


def test_create_skill():
    url = "http://localhost:8000/skill-management/create"

    payload = {
        "skill_name": "Linux programming",
        "is_certificate_available": True
    }

    response = requests.post(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_create_skill()

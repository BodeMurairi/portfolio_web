#!/usr/bin/env python3

from datetime import datetime
import requests


def test_update_skill():
    skill_id = "26af3a98"

    url = f"http://localhost:8000/skill-management/update/{skill_id}"

    payload = {
        "skill_name": "Tech Corp Updated",
        "is_certificate_available": False
        }

    response = requests.put(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_update_skill()

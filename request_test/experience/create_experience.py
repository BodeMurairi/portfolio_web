#!/usr/bin/env python3

from datetime import datetime
import requests


def test_create_work_experience():
    url = "http://localhost:8000/admin-work-experience/create"

    payload = {
        "company": "Tech Corp",
        "company_url": "https://www.techcorp.com",
        "role": "Backend Developer",
        "responsabilities": "Worked on building scalable APIs and microservices.",
        "start_date": datetime(2020, 1, 15).isoformat(),
        "end_date": datetime(2023, 12, 31).isoformat()
    }

    response = requests.post(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_create_work_experience()

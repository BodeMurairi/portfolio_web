#!/usr/bin/env python3

from datetime import datetime
import requests


def test_update_work_experience():
    experience_id = "9b219b98"

    url = f"http://localhost:8000/admin-work-experience/update/{experience_id}"

    payload = {
        "company": "Tech Corp Updated",
        "company_url": "https://www.techcorp.com",
        "role": "Senior Backend Developer",
        "responsabilities": "Leading API architecture and mentoring junior developers.",
        "start_date": datetime(2020, 1, 15).isoformat(),
        "end_date": datetime(2024, 1, 1).isoformat()
    }

    response = requests.put(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_update_work_experience()
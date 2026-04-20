#!/usr/bin/env python3

from datetime import datetime
import requests

def test_update_project():
    project_id = "eae8f4c0"
    url = f"http://localhost:8000/project-management/update/{project_id}"

    payload = {
        "title": "Portfolio",
        "description": "A scalable project management and portfolio tracking system built with FastAPI.",
        "image_url": "https://github.com/username/portfolio-management",
        "demo_url": "https://portfolio-demo.example.com",
        "start_date": datetime(2023, 1, 10).isoformat(),
        "end_date": datetime(2024, 2, 15).isoformat()
    }

    response = requests.put(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_update_project()
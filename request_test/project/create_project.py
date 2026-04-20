#!/usr/bin/env python3

from datetime import datetime
import requests


def test_create_project():
    url = "http://localhost:8000/project-management/create"

    payload = {
        "title": "Portfolio Management System",
        "description": "A scalable project management and portfolio tracking system built with FastAPI.",
        "image_url": "https://github.com/username/portfolio-management",
        "demo_url": "https://portfolio-demo.example.com",
        "start_date": datetime(2023, 1, 10).isoformat(),
        "end_date": datetime(2024, 2, 15).isoformat()
    }

    response = requests.post(url, json=payload)

    print("Status Code:", response.status_code)

    response.raise_for_status()
    data = response.json()
    print("Response JSON:", data)


if __name__ == "__main__":
    test_create_project()

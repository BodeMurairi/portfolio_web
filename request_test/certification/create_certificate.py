#!/usr/bin/env python3

from datetime import datetime
import requests

def test_create_certificate():
    url = "http://localhost:8000/certificates/create"

    payload = {
        "name": "FastAPI Developer Certification",
        "organization": "Test Organization",
        "description": "Certification for completing the FastAPI developer program.",
        "date": datetime(2025, 12, 15).isoformat(),
        "credential_url": "https://www.testorganization.org/certificates/fastapi123",
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    print("Response:", data)

if __name__ == "__main__":
    test_create_certificate()
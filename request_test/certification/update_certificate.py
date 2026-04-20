#!/usr/bin/env python3

from datetime import datetime
import requests

def test_update_certificate():
    certificate_id = "4f6a078d"
    url = f"http://localhost:8000/certificates/update/{certificate_id}"

    payload = {
        "name": "FastAPI Developer Certification",
        "organization": "OPEN API TEST Organization",
        "description": "Certification for completing the FastAPI developer program.",
        "date": datetime(2025, 12, 15).isoformat(),
        "credential_url": "https://www.testorganization.org/certificates/fastapi123",
    }

    response = requests.put(url, json=payload)
    response.raise_for_status()
    data = response.json()
    print("Response:", data)

if __name__ == "__main__":
    test_update_certificate()
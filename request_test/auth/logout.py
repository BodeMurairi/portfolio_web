#!/usr/bin/env python3

import requests


def test_logout_user():
    url = "http://localhost:8000/auth/logout"

    access_token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJhZG1pbl9pZCI6MiwiZXhwIjoxNzcyOTk0NTg1fQ"

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.post(url, headers=headers)

    try:
        response.raise_for_status()
        data = response.json()
        print("Response:", data)
    except requests.exceptions.HTTPError:
        print("Status Code:", response.status_code)
        print("Error:", response.text)


if __name__ == "__main__":
    test_logout_user()

#!/usr/bin/env python3

#!/usr/bin/env python3

from datetime import datetime
import requests


def test_login_user():
    url = "http://localhost:8000/auth/login"

    payload = {
        "email": "bodemurairi2@gmail.com",
        "password": "BMMalustud@2030##"
    }

    response = requests.post(url, json=payload)

    try:
        response.raise_for_status()
        data = response.json()
        print("Response:", data)
    except requests.exceptions.HTTPError:
        print("Status Code:", response.status_code)
        print("Error:", response.text)


if __name__ == "__main__":
    test_login_user()

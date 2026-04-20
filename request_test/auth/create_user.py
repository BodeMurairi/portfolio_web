#!/usr/bin/env python3

from datetime import datetime
import requests


def test_register_user():
    url = "http://localhost:8000/auth/register"

    payload = {
        "id": 0,
        "first_name": "Bode",
        "last_name": "Murairi",
        "middle_name": "Murai",
        "email": "bodemurairi2@gmail.com",
        "password": "BMMalustud@2030##",
        "address": "KG 11 AV 128, Kimironko Rwanda",
        "phone_number": "250795020998",
        "about": "I am a software developer",
        "profile_picture": "https://example.com/profile.jpg",
        "github_link": "https://github.com/example",
        "linkedin_link": "https://linkedin.com/in/example",
        "twitter_link": "https://twitter.com/example",
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
    test_register_user()

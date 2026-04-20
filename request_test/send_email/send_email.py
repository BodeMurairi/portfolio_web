#!/usr/bin/env python3

import requests

def test_send_email():
    url = "http://localhost:8000/send_email/send"
    payload = {
        "client_first_name": "Bode",
        "client_last_name": "Murairi",
        "client_email": "b.murairi@alustudent.com",
        "client_phone_number": "250795020998",
        "subject": "Get to know each other better",
        "body": "Hey! I would like to get to know you more. Contact me"
        }
    response = requests.post(url=url, json=payload)
    print(response.text)
    response.raise_for_status()
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_send_email()

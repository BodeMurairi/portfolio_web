#!/usr/bin/env python3

import requests

def test_post_comment():
    url = "http://localhost:8000/comments/8"

    payload = {
        "author_name": "Bode Murairi",
        "author_email": "b.murairi@alustudent.com",
        "content": "I agree",
        "parent_id":""
        }
    response = requests.post(url=url, json=payload)
    response.raise_for_status()
    print(f"Response: {response.json()}")

def test_get_comments():
    url = "http://localhost:8000/comments/5"
    response = requests.get(url=url)
    response.raise_for_status()
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_post_comment()
    test_get_comments()

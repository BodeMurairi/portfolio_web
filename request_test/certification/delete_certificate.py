#!/usr/bin/env python3

import requests

def delete_certificate(certificate_id):
    url = f"http://localhost:8000/certificates/delete/{certificate_id}"
    response = requests.delete(url)
    return response.status_code, response.json()

if __name__ == "__main__":
    certificate_id = "44d50c4f"
    status_code, response_data = delete_certificate(certificate_id)
    print(f"Status Code: {status_code}")
    print(f"Response Data: {response_data}")

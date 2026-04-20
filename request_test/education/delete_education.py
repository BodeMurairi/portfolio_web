#!/usr/bin/env python3

import requests

def delete_education(education_id):
    url = f"http://localhost:8000/admin-education/delete/{education_id}"
    response = requests.delete(url)
    return response.status_code, response.json()

if __name__ == "__main__":
    education_id = "86be27a9"
    status_code, response_data = delete_education(education_id)
    print(f"Status Code: {status_code}")
    print(f"Response Data: {response_data}")

#!/usr/bin/env python3

import requests

def test_delete_project():
    project_id = "d1d9227b"

    url = f"http://localhost:8000/project-management/delete/{project_id}"

    response = requests.delete(url)

    print("Status Code:", response.status_code)

    if response.content:
        response.raise_for_status()
        print("Response JSON:", response.json())
    else:
        print("No content returned.")


if __name__ == "__main__":
    test_delete_project()

#!/usr/bin/env python3

import requests

def test_delete_articles():
    article_id = "99c9722f"
    url = f"http://localhost:8000/articles_management/delete?article_id={article_id}"
    response = requests.delete(url=url)
    response.raise_for_status()
    data = response.json()
    print(f"Response: {data}")

if __name__ == "__main__":
    test_delete_articles()

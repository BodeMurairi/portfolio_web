#!/usr/bin/env python3

import requests

def test_view_count():
    article_id = "9c11d490"
    url = f"http://localhost:8000/articles/articles_stat/view_count?article_id={article_id}"
    response = requests.put(url=url)
    response.raise_for_status()
    data = response.json()
    print(f"Response: {data}")

if __name__ == "__main__":
    test_view_count()

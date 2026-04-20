#!/usr/bin/env python3

import uuid
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

from sqlalchemy.orm import Session
from sqlalchemy import delete, text
from database.session import get_db

from models.database_model import Article

load_dotenv()

api_key = os.getenv("NEWS_API")
if not api_key:
    raise KeyError("No API key provided")

q_words = "Opinion & Editorials"

def clean_html(html_content: str) -> str:
    """Remove HTML tags and extra whitespace from content."""
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator="\n").strip()


def get_articles():
    from_date = "2026-03-01"
    to_date = "2026-03-10"
    news_api_url = (
        f"https://newsapi.org/v2/everything?"
        f"q={q_words}&from={from_date}&to={to_date}&"
        f"sortBy=popularity&apiKey={api_key}"
    )
    response = requests.get(news_api_url)
    response.raise_for_status()
    return response.json().get("articles", [])[:5]


def get_article_details():
    """Return a list of articles with relevant details (dict keys preserved)."""
    all_articles = get_articles()
    article_list = []

    for article in all_articles:
        content = clean_html(article.get("content", ""))
        subtitle = clean_html(article.get("description", ""))

        article_list.append({
            "article_sys_id":str(uuid.uuid4()).split("-")[0],
            "type":q_words,
            "title": article.get("title", "N/A"),
            "subtitle": subtitle,
            "headline": article.get("headline", "N/A"),
            "content": content,
            "author_name": article.get("author", "N/A"),
            "article_source": article.get("url", "N/A"),
        })

    return article_list


def save_articles_to_db():
    """Standalone function to save articles to the database."""
    all_articles = get_article_details()

    # Get a session
    db: Session = next(get_db())

    for article in all_articles:
        new_article = Article(**article)
        try:
            db.add(new_article)
            db.commit()
            db.refresh(new_article)
            print(f"Saved article: {new_article.title}")
        except Exception as db_error:
            db.rollback()
            print(f"Failed to save article '{article['title']}': {db_error}")

    db.close()

def delete_content():
    db = next(get_db())
    try:
        db.execute(delete(Article))
        db.execute(text("ALTER SEQUENCE articles_id_seq RESTART WITH 1"))
        db.commit()
        print("All articles deleted successfully.")
    except Exception as e:
        db.rollback()
        print(f"Failed to delete articles: {e}")
    finally:
        db.close()
if __name__ == "__main__":
    save_articles_to_db()
    #delete_content()

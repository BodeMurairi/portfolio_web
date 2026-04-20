#!/usr/bin/env python3

from fastapi import UploadFile
from utils.http_status_code import NotFound, BadRequest, Unauthorized
from utils.helpers import orm_to_dict_articles
from services.admin.blog.article_management import ArticleManagement
from schemas.blog import Articles as article_schema
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from models.database_model import Article, ArticleStat, Comment


def create_article(db: Session, payload: article_schema):
    """create new article"""
    article_management = ArticleManagement(db=db)
    new_article = article_management.create_article(article_payload=payload)
    if not new_article:
        raise BadRequest("Failed to create a new article")
    return orm_to_dict_articles(new_article)


def update_article(db: Session, article_id: str, payload: article_schema):
    """update an article"""
    article_management = ArticleManagement(db=db)
    updated_article = article_management.update_article(
        article_id=article_id, article_payload=payload
    )
    if not updated_article:
        raise NotFound("Article Not Found with the given ID")
    return orm_to_dict_articles(updated_article)


def delete_article(db: Session, article_id: str):
    """delete an article"""
    article_management = ArticleManagement(db=db)
    deleted = article_management.delete_article(article_id=article_id)
    if not deleted:
        raise NotFound("Article not found")
    return {"detail": "Article deleted successfully"}


def save_article_image(db: Session, article_id: str, image: UploadFile):
    """save article image via file upload"""
    article_management = ArticleManagement(db=db)
    return article_management.save_article_image(article_id=article_id, image=image)


def save_article_image_url(db: Session, article_id: str, image_url: str):
    """save article image via URL"""
    article_management = ArticleManagement(db=db)
    return article_management.save_article_image_url(article_id=article_id, image_url=image_url)


def remove_article_image(db: Session, article_id: str, image_url: str):
    """remove an article image"""
    article_management = ArticleManagement(db=db)
    return article_management.delete_article_image(article_id=article_id, image_url=image_url)


def get_analytics(db: Session) -> dict:
    """Return aggregate stats per-article breakdown for the admin analytics view"""
    articles = (
        db.query(Article)
        .options(joinedload(Article.stats))
        .order_by(Article.updated_at.desc())
        .all()
    )

    rows = []
    total_views = 0
    total_likes = 0
    total_reads = 0

    for a in articles:
        s = a.stats
        views = s.views_count if s else 0
        likes = s.likes_count if s else 0
        reads = s.read_count  if s else 0
        total_views += views
        total_likes += likes
        total_reads += reads
        rows.append({
            "article_sys_id": a.article_sys_id,
            "title":          a.title,
            "type":           a.type if a.type and a.type != "N/A" else None,
            "updated_at":     a.updated_at.isoformat() if a.updated_at else None,
            "views_count":    views,
            "likes_count":    likes,
            "read_count":     reads,
        })

    return {
        "total_posts":  len(articles),
        "total_views":  total_views,
        "total_likes":  total_likes,
        "total_reads":  total_reads,
        "articles":     rows,
    }


def get_comments_summary(db: Session) -> dict:
    """Return total comment count and per-article breakdown (all comments including replies)"""
    counts = (
        db.query(Article.article_sys_id, func.count(Comment.id).label("count"))
        .outerjoin(Comment, Comment.article_id == Article.id)
        .group_by(Article.article_sys_id)
        .all()
    )

    per_article = {row.article_sys_id: row.count for row in counts}
    total = sum(per_article.values())

    return {
        "total_comments": total,
        "per_article": per_article,
    }

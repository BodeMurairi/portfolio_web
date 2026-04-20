# app/routes/comment_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.comment import CommentCreate
from models.database_model import Article
from controller.comment.comment import (
    create_comment_controller,
    get_comments_controller
)
from database.session import get_db

router = APIRouter(prefix="/comments", tags=["Comments"])


def _resolve_article_id(article_sys_id: str, db: Session) -> int:
    """Look up the integer DB id from article_sys_id."""
    article = db.query(Article).filter(Article.article_sys_id == article_sys_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article.id


@router.post("/{article_sys_id}")
def create_comment(article_sys_id: str, payload: CommentCreate, db: Session = Depends(get_db)):
    article_id = _resolve_article_id(article_sys_id, db)
    return create_comment_controller(article_id, payload, db)


@router.get("/{article_sys_id}")
def get_comments(article_sys_id: str, db: Session = Depends(get_db)):
    article_id = _resolve_article_id(article_sys_id, db)
    return get_comments_controller(article_id, db)

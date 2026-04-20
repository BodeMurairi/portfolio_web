# app/controllers/comment_controller.py

from sqlalchemy.orm import Session
from schemas.comment import CommentCreate
from services.comment.comment import (
    create_comment_service,
    get_comments_service
)

def create_comment_controller(article_id: int, payload: CommentCreate, db: Session):
    return create_comment_service(article_id, payload, db)


def get_comments_controller(article_id: int, db: Session):
    return get_comments_service(article_id, db)

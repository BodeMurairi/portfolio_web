# app/services/comment_service.py

from sqlalchemy.orm import Session
from models.database_model import Comment
from schemas.comment import CommentCreate
from fastapi import HTTPException


def create_comment_service(article_id: int, payload: CommentCreate, db: Session):
    """
    Creates a new comment for an article.
    Ensures parent_id is valid and not self-referencing.
    """
    if payload.parent_id:
        parent_comment = db.query(Comment).filter(Comment.id == payload.parent_id).first()
        if not parent_comment:
            raise HTTPException(status_code=400, detail="Parent comment does not exist")
        
        # Ensure the parent belongs to the same article
        if parent_comment.article_id != article_id:
            raise HTTPException(status_code=400, detail="Parent comment belongs to a different article")
    
    comment = Comment(
        article_id=article_id,
        author_name=payload.author_name,
        author_email=payload.author_email,
        content=payload.content,
        parent_id=payload.parent_id
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    #if comment.parent_id == comment.id:
    #    comment.parent_id = None
    #    db.commit()
    #    db.refresh(comment)

    return comment


def get_comments_service(article_id: int, db: Session):
    """
    Returns all comments for an article in a nested tree structure.
    """
    comments = (
        db.query(Comment)
        .filter(Comment.article_id == article_id)
        .order_by(Comment.commented_at)
        .all()
    )

    print("COMMENTS FROM DB:", comments)

    tree = build_tree(comments)
    return [serialize_comment(c) for c in tree]


def build_tree(comments):
    """
    Build a nested tree from flat comment list.
    Handles missing parents and prevents self-referencing loops.
    """
    comment_map = {c.id: c for c in comments}
    roots = []

    for c in comments:
        c.children = []

    for comment in comments:
        # Ignore self-referencing parent
        if comment.parent_id and comment.parent_id != comment.id:
            parent = comment_map.get(comment.parent_id)
            if parent:
                parent.children.append(comment)
            else:
                roots.append(comment)
        else:
            roots.append(comment)

    return roots


def serialize_comment(comment):
    """
    Serialize comment to JSON-friendly dict with nested replies
    """
    return {
        "id": comment.id,
        "author_name": comment.author_name,
        "author_email": comment.author_email,
        "content": comment.content,
        "parent_id": comment.parent_id,
        "commented_at": comment.commented_at,
        "replies": [serialize_comment(child) for child in comment.children]
    }

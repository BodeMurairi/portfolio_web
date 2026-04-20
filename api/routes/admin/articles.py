#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends, UploadFile, File, Form, Header
from database.session import get_db
from schemas.blog import Articles as article_schema, ArticleImagePayload
from controller.admin.articles import (
    create_article,
    update_article,
    delete_article,
    save_article_image,
    save_article_image_url,
    remove_article_image,
    get_analytics,
    get_comments_summary,
)
from sqlalchemy.orm import Session

from dependencies import get_current_admin


router = APIRouter(
    prefix="/articles_management",
    tags=["ArticlesManagement"]
)


@router.get("/comments/summary")
async def comments_summary_route(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """Return total comment count and per-article breakdown"""
    return get_comments_summary(db=db)


@router.get("/analytics")
async def analytics_route(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """Return aggregate article stats for the admin analytics dashboard"""
    return get_analytics(db=db)


@router.post("/create")
async def create_new_article(payload: article_schema,
                             db: Session = Depends(get_db),
                             admin_id:int = Depends(get_current_admin)
                             ):
    """create a new article"""
    return create_article(db=db, payload=payload)


@router.put("/update")
async def update_new_article(payload: article_schema,
                             article_id: str,
                             db: Session = Depends(get_db),
                             admin_id:int = Depends(get_current_admin)):
    """update an article"""
    return update_article(db=db, article_id=article_id, payload=payload)


@router.delete("/delete")
async def delete_article_route(article_id: str,
                               db: Session = Depends(get_db),
                               admin_id:int = Depends(get_current_admin)):
    """delete article"""
    return delete_article(article_id=article_id, db=db)

@router.post("/articles/upload_images")
async def upload_article_image_route(
    article_id: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin_id:int = Depends(get_current_admin)
):
    return save_article_image(db=db, article_id=article_id, image=image)


@router.post("/articles/add_image_url")
async def add_image_url_route(
    payload: ArticleImagePayload,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    return save_article_image_url(db=db, article_id=payload.article_id, image_url=payload.image_url)


@router.delete("/articles/remove_image")
async def remove_image_route(
    payload: ArticleImagePayload,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    return remove_article_image(db=db, article_id=payload.article_id, image_url=payload.image_url)

#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from fastapi.responses import Response
from database.session import get_db
from controller.articles.view_articles import (
    get_article_id,
    read_article_type,
    read_articles,
    update_count_view,
    update_likes,
    read_count,
    get_article_stats,
    get_popular_topics,
    generate_article_pdf,
    )

from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/articles",
    tags = ["View-articles"]
    )

@router.get("/all")
async def get_all_articles(db:Session = Depends(get_db))-> list:
    """get all articles"""
    return read_articles(db=db)

@router.get("/topics/popular")
async def popular_topics(db: Session = Depends(get_db)) -> list:
    """Get article types sorted by total likes"""
    return get_popular_topics(db=db)

@router.get("/type/{article_type}")
async def get_articles_pertype(article_type:str, db:Session = Depends(get_db))-> list:
    """get all articles per type"""
    return read_article_type(db=db, article_type=article_type)

@router.get("/{article_id}/stats")
async def article_stats(article_id: str, db: Session = Depends(get_db)) -> dict:
    """Get likes and views count for an article"""
    return get_article_stats(db=db, article_id=article_id)

@router.get("/{article_id}/download")
async def download_pdf(article_id: str, db: Session = Depends(get_db)):
    """Download article as PDF"""
    pdf_bytes, title = generate_article_pdf(db=db, article_id=article_id)
    # Strip characters that can't be encoded in the latin-1 HTTP header
    safe_title = title.encode("latin-1", errors="replace").decode("latin-1")
    safe_title = safe_title.replace('"', '').replace("'", "")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{safe_title}.pdf"'}
    )

@router.get("/{article_id}")
async def read_article_id(article_id:str, db:Session = Depends(get_db))-> dict:
    """Get articles per id"""
    return get_article_id(db=db, article_id=article_id)

@router.put("/articles_stat/read_count")
async def read_count_nb(article_id:str, db:Session= Depends(get_db)):
    """update article read"""
    return read_count(article_id=article_id, db=db)

@router.put("/articles_stat/likes_count")
async def likes_count(article_id:str, db:Session = Depends(get_db)):
    """update likes count"""
    return update_likes(db=db, article_id=article_id)

@router.put("/articles_stat/view_count")
async def view_count(article_id:str, db:Session = Depends(get_db)):
    """update view count"""
    return update_count_view(db=db, article_id=article_id)

#!/usr/bin/env python3

from utils.crud_handler import CRUDService
from sqlalchemy.orm import Session, joinedload
from schemas.blog import Articles, ArticleStat, Comment
from models.database_model import Article, ArticleStat, ArticleImage
from database.session import get_db

class ViewArticles:
    def __init__(self, db:Session):
        self.db = db
    
    def view_articles(self):
        """View all available articles — eager-loads images so image_url is available"""
        return (
            self.db.query(Article)
            .options(joinedload(Article.images))
            .order_by(Article.updated_at.desc())
            .all()
        )
    
    def get_article(self, article_id:str):
        """article crud — eager-loads images so image_url is available outside the session"""
        return (
            self.db.query(Article)
            .options(joinedload(Article.images))
            .filter(Article.article_sys_id == article_id)
            .first()
        )
    
    def get_article_perType(self, article_type:str):
        """get article per type"""
        return self.db.query(Article).where(Article.type == article_type).all()

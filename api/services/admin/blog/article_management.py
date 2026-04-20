#!/usr/bin/env python3

from utils.http_status_code import NotFound
from services.articles.view_articles import ViewArticles
from utils.crud_handler import CRUDService
from sqlalchemy.orm import Session
from schemas.blog import Articles, ArticlesImages
from models.database_model import Article, ArticleStat, ArticleImage
from schemas.blog import Articles as articles_schema
from database.session import get_db
from services.upload import upload_article_image


class ArticleManagement(ViewArticles):
    """Article management class"""

    def __init__(self, db):
        super().__init__(db)

    def create_article(self, article_payload: articles_schema):
        """create a new article"""
        article_management = CRUDService(db=self.db, model=Article)
        new_articles = article_payload.model_dump()
        new_articles.pop("image_url", None)
        new_articles.pop("updated_at", None)
        
        if new_articles.get("article_source") is not None:
            new_articles["article_source"] = str(new_articles["article_source"])

        for field in ("subtitle", "headline", "article_source"):
            if new_articles.get(field) == "":
                new_articles[field] = None
        return article_management.create(payload=new_articles)

    def update_article(self, article_id: str, article_payload: articles_schema):
        """Update an article"""
        article_management = CRUDService(db=self.db, model=Article)
        
        updated_article = article_payload.model_dump()
        
        for field in ("article_sys_id", "image_url"):
            updated_article.pop(field, None)
        
        if updated_article.get("article_source") is not None:
            updated_article["article_source"] = str(updated_article["article_source"])
        
        for field in ("subtitle", "headline", "article_source"):
            if updated_article.get(field) == "":
                updated_article[field] = None
        return article_management.update("article_sys_id", article_id, updated_article)

    def delete_article(self, article_id):
        """delete an article"""
        article_management = CRUDService(db=self.db, model=Article)
        return article_management.delete("article_sys_id", article_id)

    def save_article_image(self, article_id, image):
        """save article image"""
        article_management = CRUDService(db=self.db, model=Article)
        article = article_management.get("article_sys_id", value=article_id)

        if not article:
            raise NotFound("No article found")

        image_url = upload_article_image(file=image, article_slug=article_id)

        new_article_image = ArticleImage(
            image_url=image_url,
            article_id=article.id
        )

        try:
            self.db.add(new_article_image)
            self.db.commit()
            self.db.refresh(new_article_image)

            return {
                "article_id": article_id,
                "image_url": image_url
            }

        except Exception as database_error:
            raise database_error

    def save_article_image_url(self, article_id: str, image_url: str):
        """Save an image by URL (no file upload needed)"""
        article_management = CRUDService(db=self.db, model=Article)
        article = article_management.get("article_sys_id", value=article_id)
        
        if not article:
            raise NotFound("No article found")
        
        new_image = ArticleImage(image_url=image_url, article_id=article.id)
        
        self.db.add(new_image)
        self.db.commit()
        self.db.refresh(new_image)
        return {"article_id": article_id, "image_url": image_url}

    def delete_article_image(self, article_id: str, image_url: str):
        """Remove an image from an article"""
        
        article_management = CRUDService(db=self.db, model=Article)
        article = article_management.get("article_sys_id", value=article_id)
        
        if not article:
            raise NotFound("No article found")
        
        img = self.db.query(ArticleImage).filter(
            ArticleImage.article_id == article.id,
            ArticleImage.image_url == image_url
        ).first()
        
        if img:
            self.db.delete(img)
            self.db.commit()
        return {"detail": "Image removed"}

    def count_view(self, article_id: str):
        """Increment article view count"""
        
        article = self.db.query(Article).filter(
            Article.article_sys_id == article_id
        ).first()

        if not article:
            raise ValueError("Article not found")

        stat = self.db.query(ArticleStat).filter(
            ArticleStat.article_id == article.id
        ).first()

        if not stat:
            stat = ArticleStat(
                article_id=article.id,
                views_count=1,
                likes_count=0,
                read_count=0
            )
            self.db.add(stat)
        else:
            stat.views_count += 1

        self.db.commit()
        self.db.refresh(stat)
        return stat


    def likes_count(self, article_id: str):
        """Increment article likes count"""
        article = self.db.query(Article).filter(
            Article.article_sys_id == article_id
        ).first()

        if not article:
            raise ValueError("Article not found")

        stat = self.db.query(ArticleStat).filter(
            ArticleStat.article_id == article.id
        ).first()

        if not stat:
            stat = ArticleStat(
                article_id=article.id,
                views_count=0,
                likes_count=1,
                read_count=0
            )
            self.db.add(stat)
        else:
            stat.likes_count += 1

        self.db.commit()
        self.db.refresh(stat)
        return stat


    def read_count(self, article_id: str):
        """Increment article read count"""
        
        article = self.db.query(Article).filter(
            Article.article_sys_id == article_id
        ).first()

        if not article:
            raise ValueError("Article not found")

        stat = self.db.query(ArticleStat).filter(
            ArticleStat.article_id == article.id
        ).first()

        if not stat:
            stat = ArticleStat(
                article_id=article.id,
                views_count=0,
                likes_count=0,
                read_count=1
            )
            self.db.add(stat)
        else:
            stat.read_count += 1

        self.db.commit()
        self.db.refresh(stat)
        return stat

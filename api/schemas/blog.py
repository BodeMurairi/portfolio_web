#!/usr/bin/env python3

from typing import Optional
from datetime import datetime
from utils.helpers import generate_id
from pydantic import BaseModel, Field, AnyUrl, model_validator, EmailStr

class Articles(BaseModel):
    """Class model for Articles"""
    article_sys_id:str=Field(
        default_factory=generate_id,
        description="Article system ID"
        )
    title:str=Field(
        description="Article title",
        min_length=4
    )
    subtitle:Optional[str]=Field(
        default=None,
        description="Article subtitle",
    )
    headline:Optional[str]=Field(
        default=None,
        description="Article headlines"
    )
    content:str=Field(
        description="Article content"
    )
    author_name:str=Field(
        description="Author name content"
    )
    article_source:Optional[AnyUrl|str]=Field(
        default=None,
        description="Article source. It can be the article URL or source citation"
    )
    type:Optional[str]=Field(
        default=None,
        description="Article type/category"
    )
    image_url:Optional[str]=Field(
        default=None,
        description="First image URL for the article"
    )
    updated_at:datetime=Field(
        default_factory=datetime.utcnow
    )

class ArticlesImages(BaseModel):
    """Base Model for class Images"""
    article_image_id:str=Field(
        default_factory=generate_id,
        description="Article Images"
    )
    image_url:Optional[AnyUrl]=Field(
        description="Article image url"
    )

class ArticleStat(BaseModel):
    article_stat_id:str=Field(
        default_factory=generate_id,
        description="Article statistiques"
    )
    read_count:int=Field(
        description="Article read count number"
    )
    like_count:int=Field(
        description="Article like count number"
    )
    period_time:datetime=Field(
        description="Article period time"
    )
    updated_at:datetime=Field(
        default_factory=generate_id,
        description="Updated time"
    )

class ArticleImagePayload(BaseModel):
    article_id: str
    image_url: str

class Comment(BaseModel):
    """Base model for comment"""
    comment_id:str=Field(
        default_factory=generate_id,
        description="Comment Id"
    )
    author_name:str=Field(
        description="Author of the comments"
    )
    author_email:Optional[EmailStr]=Field(
        description="Email of the Author"
    )
    commented_at:datetime=Field(
        default_factory=datetime.utcnow,
        description="Time the comment was made"
    )
    updated_at:datetime=Field(
        default_factory=datetime.utcnow,
        description="Time the comment was updated"
    )

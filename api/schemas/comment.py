# app/schemas/comment_schema.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentCreate(BaseModel):
    author_name: str
    author_email: Optional[str] = None
    content: str
    parent_id: Optional[int] = None


class CommentOut(BaseModel):
    id: int
    author_name: str
    content: str
    parent_id: Optional[int]
    commented_at: datetime
    replies: List["CommentOut"] = []

    class Config:
        orm_mode = True

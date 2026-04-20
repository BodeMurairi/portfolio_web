#!/usr/bin/env python3

from pydantic import BaseModel, Field

class ReplyMessage(BaseModel):
    reply_text: str = Field(description="Reply content", min_length=1)

#!/usr/bin/env python3

from pydantic import BaseModel, EmailStr, Field

class SendEmail(BaseModel):
    """Base Model for sending email"""
    name: str = Field(description="Sender name", min_length=2)
    email: EmailStr = Field(description="Sender email")
    subject: str = Field(description="Email subject", min_length=2)
    message: str = Field(description="Email message", min_length=5)

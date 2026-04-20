#!/usr/bin/env python3

from pydantic import BaseModel, EmailStr, Field, validator, AnyUrl
from typing import Optional
from datetime import datetime


class Admin(BaseModel):
    first_name: str = Field(description="Admin first name", min_length=3, max_length=40)
    last_name: str = Field(description="Admin last name", min_length=3, max_length=40)
    middle_name: Optional[str] = Field(default=None, description="Admin middle name", min_length=3, max_length=40)

    email: EmailStr = Field(description="Admin email address")
    password: str = Field(description="Admin password", min_length=8)
    address: str = Field(description="Admin address", min_length=5, max_length=150)
    phone_number: str = Field(description="Admin phone number", min_length=10, max_length=15)
    about: str = Field(description="Admin about content")
    github_link: Optional[AnyUrl] = Field(default=None, description="Admin GitHub profile URL")
    linkedin_link: Optional[AnyUrl] = Field(default=None, description="Admin LinkedIn profile URL")
    twitter_link: Optional[AnyUrl] = Field(default=None, description="Admin Twitter profile URL")

    @validator("phone_number")
    def validate_phone_number(cls, value):
        if not value.isdigit():
            raise ValueError("Phone number must contain only digits")
        return value


class Login(BaseModel):
    email: EmailStr = Field(description="Admin Email address")
    password: str = Field(description="Admin password")


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


class UpdateProfile(BaseModel):
    profileURL: AnyUrl


class UpdateGithub(BaseModel):
    githubURL: AnyUrl


class UpdateAbout(BaseModel):
    about: str


class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp_code: str

class PasswordReset(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

class AboutPayload(BaseModel):
    about: str

class GithubPayload(BaseModel):
    github_link: str

class PasswordPayload(BaseModel):
    old_password: str
    new_password: str

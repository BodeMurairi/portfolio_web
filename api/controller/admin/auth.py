#!/usr/bin/env python3

from typing import Optional
from fastapi import Header, Depends
from utils.http_status_code import NotFound, BadRequest, Unauthorized
from sqlalchemy.orm import Session
from database.session import get_db
from schemas.admin import Login
from services.admin.auth.registration_login.auth_admin import Authentication


def create_admin(
    first_name: str,
    last_name: str,
    middle_name: Optional[str],
    email: str,
    password: str,
    address: str,
    phone_number: str,
    about: str,
    github_link: Optional[str],
    linkedin_link: Optional[str],
    twitter_link: Optional[str],
    profile_picture_url: Optional[str],
    db: Session,
):
    """Create admin function"""
    auth_service = Authentication(db=db)
    return auth_service.register(
        first_name=first_name,
        last_name=last_name,
        middle_name=middle_name,
        email=email,
        password=password,
        address=address,
        phone_number=phone_number,
        about=about,
        github_link=github_link,
        linkedin_link=linkedin_link,
        twitter_link=twitter_link,
        profile_picture_url=profile_picture_url,
    )


def login_admin(login_data: Login, db: Session = Depends(get_db)):
    """Login admin function"""
    if not login_data:
        raise BadRequest("No login data provided")
    login_service = Authentication(db=db)
    return login_service.login(login_data=login_data)


def logout_admin(authorization: str = Header(...), db: Session = Depends(get_db)):
    """Logout feature"""
    if not authorization.startswith("Bearer "):
        raise Unauthorized("Invalid authorization Header! Please Signin first")
    logout_service = Authentication(db=db)
    return logout_service.logout(authorization=authorization)

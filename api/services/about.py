#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models.database_model import Admin
from utils.http_status_code import NotFound

load_dotenv()

def get_about(db: Session):
    admin = db.query(Admin).where(Admin.email == os.getenv("SENDER_EMAIL")).first()
    if not admin:
        return []
    about_content = {
        "about": admin.about if admin.about else "",
        "github_url": admin.github_url if admin.github_url else "",
        "profile_picture": admin.profile_picture if admin.profile_picture else "",
    }
    return about_content

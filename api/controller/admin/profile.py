#!/usr/bin/env python3

from fastapi import UploadFile
from sqlalchemy.orm import Session
from models.database_model import Admin
from services.admin.auth.harsh import hash_password, verify_password
from services.upload import upload_profile_picture
from utils.http_status_code import NotFound, BadRequest


def _get_admin(admin_id: int, db: Session) -> Admin:
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise NotFound("Admin not found")
    return admin


def get_admin_profile(admin_id: int, db: Session) -> dict:
    admin = _get_admin(admin_id, db)
    return {
        "id": admin.id,
        "first_name": admin.first_name or "",
        "last_name": admin.last_name or "",
        "email": admin.email,
        "about": admin.about or "",
        "github_url": admin.github_url or "",
        "linkedin_url": admin.linkedin_url or "",
        "profile_picture": admin.profile_picture or "",
    }


def update_admin_about(admin_id: int, about: str, db: Session) -> dict:
    admin = _get_admin(admin_id, db)
    admin.about = about
    db.commit()
    return {"message": "About updated successfully"}


def update_admin_github(admin_id: int, github_link: str, db: Session) -> dict:
    admin = _get_admin(admin_id, db)
    admin.github_url = github_link
    db.commit()
    return {"message": "GitHub link updated successfully"}


def update_admin_password(admin_id: int, old_password: str, new_password: str, db: Session) -> dict:
    admin = _get_admin(admin_id, db)
    if not verify_password(old_password, admin.password_hash):
        raise BadRequest("Current password is incorrect")
    if len(new_password) < 8:
        raise BadRequest("New password must be at least 8 characters")
    admin.password_hash = hash_password(new_password)
    db.commit()
    return {"message": "Password changed successfully"}


def update_admin_profile_picture(admin_id: int, image: UploadFile, db: Session) -> dict:
    admin = _get_admin(admin_id, db)
    url = upload_profile_picture(image)
    admin.profile_picture = url
    db.commit()
    return {"message": "Profile picture updated successfully", "profile_picture": url}

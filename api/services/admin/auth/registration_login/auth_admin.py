#!/usr/bin/env python3

from typing import Optional
from sqlalchemy.orm import Session
from models.database_model import Admin as Admin_model
from schemas.admin import Login as Login_schema
from services.admin.auth.harsh import hash_password, verify_password
from services.admin.auth.jwt import create_access_token
from services.admin.auth.token_blacklist import add_to_blacklist
from utils.http_status_code import BadRequest


class Authentication:
    def __init__(self, db: Session):
        self.db = db

    def register(
        self,
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
    ):
        """Register a new admin"""
        password_hash = hash_password(password=password)

        try:
            new_admin = Admin_model(
                first_name=first_name,
                last_name=last_name,
                middle_name=middle_name,
                email=email,
                password_hash=password_hash,
                address=address,
                phone_number=phone_number,
                github_url=github_link,
                linkedin_url=linkedin_link,
                about=about,
                profile_picture=profile_picture_url,
            )
            self.db.add(new_admin)
            self.db.commit()
            self.db.refresh(new_admin)
            return {"message": "Admin registered successfully", "admin_id": new_admin.id}
        except Exception as db_error:
            self.db.rollback()
            raise BadRequest(f"An error occurred: {db_error}")

    def login(self, login_data: Login_schema):
        """Login"""
        admin_info = self.db.query(Admin_model).where(Admin_model.email == login_data.email).first()
        if not admin_info or not verify_password(login_data.password, admin_info.password_hash):
            raise BadRequest("Invalid email or password")

        access_token = create_access_token({"admin_id": admin_info.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "admin_id": admin_info.id,
        }

    def logout(self, authorization: str):
        """Logout"""
        token = authorization.split(" ")[1]
        add_to_blacklist(token)
        return {"message": "Admin logged out successfully"}

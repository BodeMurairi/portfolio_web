#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Header, Depends, UploadFile, File, Form
from typing import Optional

from sqlalchemy.orm import Session

from database.session import get_db
from schemas.admin import Login, AboutPayload, GithubPayload, PasswordPayload, OTPRequest, OTPVerify, PasswordReset
from controller.admin.auth import create_admin, login_admin, logout_admin
from controller.admin.password_reset import request_otp, verify_otp, reset_password
from controller.admin.profile import (
    get_admin_profile,
    update_admin_about,
    update_admin_github,
    update_admin_password,
    update_admin_profile_picture,
)
from services.upload import upload_profile_picture
from dependencies import get_current_admin

router = APIRouter(
    prefix="/auth",
    tags=["Admin Authentication"]
)


@router.post("/register")
def register_new_admin(
    first_name: str = Form(...),
    last_name: str = Form(...),
    middle_name: Optional[str] = Form(default=None),
    email: str = Form(...),
    password: str = Form(...),
    address: str = Form(...),
    phone_number: str = Form(...),
    about: str = Form(...),
    github_link: Optional[str] = Form(default=None),
    linkedin_link: Optional[str] = Form(default=None),
    profile_picture: Optional[UploadFile] = File(default=None),
    db: Session = Depends(get_db),
):
    """Register a new admin. Optionally upload a profile picture to Cloudflare R2."""
    profile_picture_url = None
    if profile_picture and profile_picture.filename:
        profile_picture_url = upload_profile_picture(profile_picture)

    return create_admin(
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
        profile_picture_url=profile_picture_url,
        db=db,
    )


@router.post("/login")
def login_user(login_data: Login, db: Session = Depends(get_db)):
    """Login admin"""
    return login_admin(login_data=login_data, db=db)


@router.post("/logout")
def logout_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    """Logout admin"""
    return logout_admin(authorization=authorization)


@router.get("/profile")
def get_profile(admin_id: int = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Get current admin profile"""
    return get_admin_profile(admin_id=admin_id, db=db)


@router.put("/update/about")
def update_about(payload: AboutPayload, admin_id: int = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Update admin about text"""
    return update_admin_about(admin_id=admin_id, about=payload.about, db=db)


@router.put("/update/github")
def update_github(payload: GithubPayload, admin_id: int = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Update admin GitHub link"""
    return update_admin_github(admin_id=admin_id, github_link=payload.github_link, db=db)


@router.put("/update/password")
def update_password(payload: PasswordPayload, admin_id: int = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Change admin password"""
    return update_admin_password(admin_id=admin_id, old_password=payload.old_password, new_password=payload.new_password, db=db)


@router.post("/forgot-password/request-otp")
def forgot_password_request(payload: OTPRequest, db: Session = Depends(get_db)):
    """Send a 6-digit OTP to the admin email (valid 15 min)"""
    return request_otp(email=payload.email, db=db)


@router.post("/forgot-password/verify-otp")
def forgot_password_verify(payload: OTPVerify, db: Session = Depends(get_db)):
    """Verify the OTP is valid and not expired"""
    return verify_otp(email=payload.email, otp_code=payload.otp_code, db=db)


@router.post("/forgot-password/reset")
def forgot_password_reset(payload: PasswordReset, db: Session = Depends(get_db)):
    """Reset the password after OTP verification"""
    return reset_password(email=payload.email, otp_code=payload.otp_code, new_password=payload.new_password, db=db)


@router.post("/update/profile-picture")
def update_profile_picture(
    image: UploadFile = File(...),
    admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Upload and update admin profile picture"""
    return update_admin_profile_picture(admin_id=admin_id, image=image, db=db)

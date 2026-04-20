#!/usr/bin/env python3

import random
import string
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.database_model import Admin, PasswordResetOTP
from services.admin.auth.harsh import hash_password
from services.send_email import send_otp_email


def _generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def request_otp(email: str, db: Session):
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="No account found with that email")

    # Invalidate any previous unused OTPs for this admin
    db.query(PasswordResetOTP).filter(
        PasswordResetOTP.admin_id == admin.id,
        PasswordResetOTP.used == False
    ).update({"used": True})
    db.commit()

    otp_code = _generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    otp = PasswordResetOTP(admin_id=admin.id, otp_code=otp_code, expires_at=expires_at)
    db.add(otp)
    db.commit()

    send_otp_email(to_email=email, otp_code=otp_code)
    return {"message": "OTP sent to your email"}


def verify_otp(email: str, otp_code: str, db: Session):
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="No account found with that email")

    otp = (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.admin_id == admin.id,
            PasswordResetOTP.otp_code == otp_code,
            PasswordResetOTP.used == False,
        )
        .order_by(PasswordResetOTP.created_at.desc())
        .first()
    )

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    if datetime.utcnow() > otp.expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one")

    return {"message": "OTP verified", "valid": True}


def reset_password(email: str, otp_code: str, new_password: str, db: Session):
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="No account found with that email")

    otp = (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.admin_id == admin.id,
            PasswordResetOTP.otp_code == otp_code,
            PasswordResetOTP.used == False,
        )
        .order_by(PasswordResetOTP.created_at.desc())
        .first()
    )

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    if datetime.utcnow() > otp.expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one")

    admin.password_hash = hash_password(new_password)
    otp.used = True
    db.add(admin)
    db.commit()

    return {"message": "Password updated successfully"}

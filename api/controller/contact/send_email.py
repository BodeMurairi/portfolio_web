#!/usr/bin/env python3

from sqlalchemy.orm import Session
from services.send_email import send_email
from schemas.send_email import SendEmail
from models.database_model import ContactMessage

def send_new_email(email_content: SendEmail, db: Session):
    """Send email and save message to database."""
    msg = ContactMessage(
        name=email_content.name,
        email=str(email_content.email),
        message=email_content.message,
    )
    db.add(msg)
    db.commit()

    return send_email(
        name=email_content.name,
        email=str(email_content.email),
        subject=email_content.subject,
        message=email_content.message,
    )

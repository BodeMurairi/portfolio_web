#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from controller.contact.send_email import send_new_email
from schemas.send_email import SendEmail
from database.session import get_db

router = APIRouter(
    prefix="/send_email",
    tags=["SendEmail"]
    )

@router.post("/send")
async def send(email_data: SendEmail, db: Session = Depends(get_db)):
    return send_new_email(email_content=email_data, db=db)

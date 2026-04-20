#!/usr/bin/env python3

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from controller.contact.messages import list_messages, reply_to_message
from schemas.message import ReplyMessage

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("/")
def get_messages(db: Session = Depends(get_db)):
    return list_messages(db)

@router.post("/{message_id}/reply")
def reply(message_id: int, body: ReplyMessage, db: Session = Depends(get_db)):
    return reply_to_message(message_id=message_id, reply_body=body, db=db)

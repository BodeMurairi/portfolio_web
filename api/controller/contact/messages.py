#!/usr/bin/env python3

from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.database_model import ContactMessage, MessageReply
from schemas.message import ReplyMessage
from services.send_email import send_reply

def list_messages(db: Session):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "message": m.message,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "replies": [
                {
                    "id": r.id,
                    "reply_text": r.reply_text,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in m.replies
            ],
        }
        for m in messages
    ]

def reply_to_message(message_id: int, reply_body: ReplyMessage, db: Session):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    send_reply(to_email=msg.email, reply_text=reply_body.reply_text)

    reply = MessageReply(message_id=msg.id, reply_text=reply_body.reply_text)
    db.add(reply)
    db.commit()
    db.refresh(reply)

    return {
        "message": "Reply sent successfully",
        "reply": {
            "id": reply.id,
            "reply_text": reply.reply_text,
            "created_at": reply.created_at.isoformat() if reply.created_at else None,
        }
    }

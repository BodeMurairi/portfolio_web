#!/usr/bin/env python3

from fastapi import WebSocket, WebSocketDisconnect, Depends
from fastapi.routing import APIRouter

from sqlalchemy.orm import Session
from schemas.comment import CommentCreate
from controller.comment.comment import (
    create_comment_controller,
    get_comments_controller
)
from database.session import get_db

router = APIRouter(
    prefix="/ws",
    tags=["Test-websocket"]
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, article_id: int, websocket: WebSocket):
        await websocket.accept()
        if article_id not in self.active_connections:
            self.active_connections[article_id] = []
        self.active_connections[article_id].append(websocket)

    def disconnect(self, article_id: int, websocket: WebSocket):
        self.active_connections[article_id].remove(websocket)

    async def broadcast(self, article_id: int, message: dict):
        if article_id in self.active_connections:
            for connection in self.active_connections[article_id]:
                await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/{article_id}")
async def websocket_comments(websocket: WebSocket, article_id: int):
    await manager.connect(article_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(article_id, websocket)

@router.post("/create/{article_id}")
async def create_comment(
    article_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db)
):
    comment = create_comment_controller(article_id, payload, db)

    await manager.broadcast(article_id, {
        "type": "new_comment",
        "data": {
            "author": comment.author,
            "author_email":comment.author_email,
            "content": comment.content
        }
    })

    return comment


@router.get("/{article_id}")
def get_comments(article_id: int, db: Session = Depends(get_db)):
    return get_comments_controller(article_id, db)

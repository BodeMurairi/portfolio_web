#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from controller.about import about
from database.session import get_db

router = APIRouter(
    prefix="/about",
    tags=["About"]
    )

@router.get("/")
async def home(db:Session = Depends(get_db)):
    get_about = about(db=db)
    return get_about

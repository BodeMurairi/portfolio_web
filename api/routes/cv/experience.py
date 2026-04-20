#!/usr/bin/env python3

from fastapi import Depends
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session
from database.session import get_db
from controller.experience.experience import list_work_experience, get_experienceID

router = APIRouter(
    prefix="/experience",
    tags=["User Professional Experience"],
    )

@router.get("/")
async def home():
    return {"message": "Welcome to the Experience API section!"}

@router.get("/experiences")
async def get_experiences(db:Session = Depends(get_db)):
    """return all user experiences"""
    return list_work_experience(db=db)

@router.get("/experiences/{experience_id}")
async def get_experience(experience_id: str, db:Session = Depends(get_db)):
    return get_experienceID(db=db, experience_id=experience_id)

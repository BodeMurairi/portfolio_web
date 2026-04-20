#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from database.session import get_db
from controller.education.education import list_educations, education_forID
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/education",
    tags=["Education"]
    )

@router.get("/")
async def home():
    return {"message": "Education endpoint is under construction!"}

@router.get("/list")
async def get_education_list(db:Session = Depends(get_db)):
    """Get all educations"""
    return list_educations(db=db)

@router.get("/list/{institution_id}")
async def get_education_by_id(institution_id:str, db:Session = Depends(get_db)):
    """get education by id"""
    return education_forID(db=db, id=institution_id)

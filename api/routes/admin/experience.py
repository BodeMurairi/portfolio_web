#!/usr/bin/env python3

from fastapi import Depends
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session
from database.session import get_db
from controller.admin.experience import change_experience, create_experience, delete_experience
from schemas.cv_model import WorkExperience as Work_Experience_schema
from controller.experience.experience import list_work_experience, get_experienceID
from dependencies import get_current_admin

router = APIRouter(
    prefix="/admin-work-experience",
    tags=["Admin Experience Management"],
    )

@router.get("/")
async def home():
    return {"message": "Welcome to the Admin Experience API section!"}

@router.post("/create")
async def create_new_experience(experience_payload:Work_Experience_schema,
                                db:Session = Depends(get_db),
                                admin_id:int = Depends(get_current_admin)
                                ):
    """Create new experience"""
    return create_experience(db=db, experience_payload=experience_payload)

@router.put("/update/{experience_id}")
async def update_experience(experience_id:str,
                            experience_payload:Work_Experience_schema,
                            db:Session = Depends(get_db),
                            admin_id:int = Depends(get_current_admin)):
    """update experience by Id"""
    return change_experience(db=db, experience_id=experience_id, experience_payload=experience_payload)

@router.delete("/delete/{experience_id}")
async def remove_experience(experience_id:str,
                            db:Session = Depends(get_db),
                            admin_id:int = Depends(get_current_admin)
                            ):
    """delete experience by Id"""
    return delete_experience(db=db, experience_id=experience_id)

#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from database.session import get_db
from schemas.cv_model import Education as Education_schema
from controller.admin.education import create_institution, change_education, delete_education
from sqlalchemy.orm import Session
from dependencies import get_current_admin

router = APIRouter(
    prefix="/admin-education",
    tags=["Admin-education"]
)

@router.post("/create")
async def create_education(education_payload:Education_schema,
                           db:Session = Depends(get_db),
                           admin_id:int = Depends(get_current_admin)):
    "Create education"
    return create_institution(db=db, education_payload=education_payload)

@router.put("/update/{education_id}")
async def update_education(education_id:str,
                           education_payload:Education_schema,
                           db:Session = Depends(get_db),
                           admin_id:int = Depends(get_current_admin)
                           ):
    """update education by Id"""
    return change_education(db=db, education_id=education_id, education_payload=education_payload)

@router.delete("/delete/{education_id}")
async def delete(education_id:str,
                 db:Session = Depends(get_db),
                 admin_id:int = Depends(get_current_admin)
                 ):
    """delete education by Id"""
    return delete_education(db=db, education_id=education_id)

#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from database.session import get_db
from schemas.cv_model import ProfessionalSkill
from controller.admin.skill import create_professional_skill, update_professional_skill, delete_professional_skill
from sqlalchemy.orm import Session
from dependencies import get_current_admin

router = APIRouter(
    prefix="/skill-management",
    tags=["Admin Manage skills"]
)

@router.post("/create")
def create_skill(skill_data:ProfessionalSkill,
                 db: Session = Depends(get_db),
                 admin_id:int = Depends(get_current_admin)
                 ):
    """
    Create a new skill entry in the database.
    """
    return create_professional_skill(skill_data=skill_data, db=db)

@router.put("/update/{skill_id}")
def update_skill(skill_id: str,
                 skill_data: ProfessionalSkill,
                 db: Session = Depends(get_db),
                 admin_id:int = Depends(get_current_admin)
                 ):
    """
    Update an existing skill entry in the database.
    """
    return update_professional_skill(skill_id=skill_id, skill_data=skill_data, db=db)

@router.delete("/delete/{skill_id}")
def delete_skill(skill_id: str,
                 db: Session = Depends(get_db),
                 admin_id:int = Depends(get_current_admin)
                 ):
    """
    Delete a skill entry from the database by its ID.
    """
    return delete_professional_skill(skill_id=skill_id, db=db)

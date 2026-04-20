#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from utils.helpers import orm_to_dict_experience
from database.session import get_db
from controller.professional_skill.skill import list_professional_skills, get_professional_skillID
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/skills",
    tags=["Skills Reader"],
    )

@router.get("/")
async def get_skills(db:Session = Depends(get_db)):
    "get all skills"
    return list_professional_skills(db=db)

@router.get("/{skill_id}")
async def get_skill_by_id(skill_id: str, db:Session = Depends(get_db)):
    "get skill by ID"
    return get_professional_skillID(db=db, skill_id=skill_id)

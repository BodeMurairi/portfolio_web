#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict_experience
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from schemas.cv_model import ProfessionalSkill as ProfessionalSkill_schema
from services.admin.skill import AdminProfessionalSkillService

def create_professional_skill(db, skill_data: ProfessionalSkill_schema):
    """Create a new professional skill"""
    if not skill_data:
        raise BadRequest(detail="Skill data is required")
    service = AdminProfessionalSkillService(db=db)
    return service.create_professional_skill(skill_data)

def update_professional_skill(db, skill_id:str, skill_data: ProfessionalSkill_schema):
    """Update an existing professional skill"""
    if not skill_data:
        raise BadRequest(detail="Skill data is required")
    service = AdminProfessionalSkillService(db=db)
    updated_skill = service.update_professional_skill(skill_id, skill_data)
    return updated_skill

def delete_professional_skill(db, skill_id: str):
    """Delete a professional skill by its ID"""
    service = AdminProfessionalSkillService(db=db)
    return service.delete_professional_skill(skill_id)

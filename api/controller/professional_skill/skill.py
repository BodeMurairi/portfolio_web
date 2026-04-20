#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict_skill
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from services.professional_skill.skill import ProfessionalSkillReader

def list_professional_skills(db):
    """Get list of all professional skills"""
    skill = ProfessionalSkillReader(db=db)
    skills = skill.get_professional_skills()
    if not skills:
        return []
    return [orm_to_dict_skill(skill) for skill in skills]

def get_professional_skillID(db, skill_id:str):
    """get one professional skill by id"""
    all_skills = ProfessionalSkillReader(db=db)
    skill = all_skills.get_professional_skill(skill_id=skill_id)
    if not skill:
        raise NotFound(detail="Professional skill not found")

    return orm_to_dict_skill(skill)

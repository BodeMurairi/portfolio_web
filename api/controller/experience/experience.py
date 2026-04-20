#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict_experience
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from services.experience.experience import WorkExperience
from schemas.cv_model import WorkExperience as Work_experience

def list_work_experience(db):
    """Get list of all experiences"""
    work_experience = WorkExperience(db=db)
    experiences = work_experience.get_workExperiences()
    if not experiences:
        return []
    return [orm_to_dict_experience(exp) for exp in experiences]

def get_experienceID(db, experience_id:str):
    """get one experience by id"""
    all_experiences = WorkExperience(db=db)
    experience = all_experiences.read_workExperience_ID(experience_id=experience_id)
    if not experience:
        raise NotFound(detail="Experience not found")

    return orm_to_dict_experience(experience)

#!/usr/bin/env python3

from utils.helpers import orm_to_dict_experience
from utils.http_status_code import BadRequest, Conflict, NotFound, Unauthorized, Forbidden
from services.admin.experience import AdminExperience as Experience
from schemas.cv_model import WorkExperience as Work_Experience_schema

def create_experience(db, experience_payload:Work_Experience_schema):
    """Create new experience"""
    my_experience = Experience(db=db)
    if not experience_payload:
        raise BadRequest(detail="Experience information missing")
    
    data = my_experience.create_experience(experience_payload=experience_payload)
    
    if not data:
        raise BadRequest(detail="Failed to save to the database. Verify Payload data entered")
    
    return {
        "response": "New Experience Created",
        "data": Work_Experience_schema.model_validate(orm_to_dict_experience(data))
    }

def change_experience(db, experience_id:str, experience_payload:Work_Experience_schema):
    """update experience by Id"""
    my_experience = Experience(db=db)
    if not experience_payload:
        raise BadRequest(detail="Experience information missing")
    
    data = my_experience.update_experience(experience_id=experience_id, experience_payload=experience_payload)
    
    if not data:
        raise BadRequest(detail="Failed to update the database. Verify Payload data entered")
    
    return {
        "response": "Experience Updated",
        "data": Work_Experience_schema.model_validate(orm_to_dict_experience(data))
    }

def delete_experience(db, experience_id: str):
    """Delete experience by Id"""
    my_experience = Experience(db=db)
    
    data = my_experience.delete_experience(experience_id=experience_id)
    
    if not data:
        raise Conflict(detail="Failed to delete experience from the database")
    
    return {
        "response": "Experience Deleted"
    }

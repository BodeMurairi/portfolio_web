#!/usr/bin/env python3
    
from utils.helpers import orm_to_dict
from utils.http_status_code import BadRequest, Conflict
from services.admin.education import AdminEducation as Education
from schemas.cv_model import Education as Education_schema

def create_institution(db, education_payload:Education_schema):
    """Create institution"""
    my_education = Education(db=db)
    if not education_payload:
        raise BadRequest(detail="Education information missing")
    
    data = my_education.create_education(education_payload=education_payload)
    
    if not data:
        raise BadRequest(detail="Failed to save to the database. Verify Payload data entered")
    
    return {
        "response": "New Education Created",
        "data": Education_schema.model_validate(orm_to_dict(data))
    }

def change_education(db, education_id:str, education_payload:Education_schema):
    """update education by Id"""
    my_education = Education(db=db)
    if not education_payload:
        raise BadRequest(detail="Education information missing")
    
    data = my_education.update_education(education_id=education_id, education_payload=education_payload)
    
    if not data:
        raise BadRequest(detail="Failed to update the database. Verify Payload data entered")
    
    return {
        "response": "Education Updated",
        "data": Education_schema.model_validate(orm_to_dict(data))
    }

def delete_education(db, education_id:str):
    """delete education by Id"""
    my_education = Education(db=db)
    
    data = my_education.delete_education(education_id=education_id)
    if not data:
        raise Conflict(detail="Failed to delete education from the database")
    
    return {
        "response": data
    }

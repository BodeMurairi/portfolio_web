#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from services.education.education import Education
from schemas.cv_model import Education as Education_schema

def list_educations(db):
    """get all educations"""
    my_education = Education(db=db)
    educations = my_education.get_all()
    if not educations:
        return []
    return [Education_schema.model_validate(orm_to_dict(data)) for data in educations]


def education_forID(db, id:str):
    """Education for ID"""
    my_education = Education(db=db)
    education_obj = my_education.get_educationId(id=id)
    
    if not education_obj:
        raise NotFound(detail="No education data found")
    
    return Education_schema.model_validate(orm_to_dict(education_obj))

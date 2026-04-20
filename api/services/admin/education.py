#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import Education as Education_schema
from services.education.education import Education
from models.database_model import Education as Education_orm, Admin

class AdminEducation(Education):
    def __init__(self,db:Session):
        super().__init__(db=db)
    
    def create_education(self, education_payload:Education_schema):
        """create a new education"""
        new_education = Education_orm(
            education_id = education_payload.education_id,
            institution = education_payload.institution_name,
            institution_url = str(education_payload.institution_url) if education_payload.institution_url else None,
            degree = education_payload.degree,
            description = education_payload.description,
            start_date = education_payload.start_date,
            end_date = education_payload.end_date,
            admin_id=1
        )
        try:
            self.db.add(new_education)
            self.db.commit()
            self.db.refresh(new_education)
            return new_education
        except Exception as database_error:
            raise database_error

    def update_education(self, education_id:int, education_payload:Education_schema):
        """Update an education"""
        edu_opportunity = self.get_educationId(id=education_id)

        # update the education opportunity with the new data
        updated_info = {
            "institution": education_payload.institution_name,
            "institution_url": str(education_payload.institution_url) if education_payload.institution_url else None,
            "degree": education_payload.degree,
            "description": education_payload.description,
            "start_date": education_payload.start_date,
            "end_date": education_payload.end_date
        }
        for key, value in updated_info.items():
            setattr(edu_opportunity, key, value)
        try:
            self.db.commit()
            self.db.refresh(edu_opportunity)
            self.db.close()
            return edu_opportunity
        except Exception as database_error:
            self.db.rollback()
            self.db.close()
            raise database_error
    
    def delete_education(self, education_id:int):
        """Delete an education"""
        edu_opportunity = self.get_educationId(id=education_id)
        
        try:
            self.db.delete(edu_opportunity)
            self.db.commit()
            self.db.close()
            return {
                "message": f"Education with ID {education_id} has been deleted successfully."
            }

        except Exception as database_error:
            self.db.rollback()
            self.db.close()
            raise database_error

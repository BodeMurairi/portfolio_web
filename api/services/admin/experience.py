#!/usr/bin/env python3

from utils.helpers import orm_to_dict
from utils.http_status_code import BadRequest, Conflict, NotFound, Unauthorized, Forbidden
from services.experience.experience import WorkExperience as Experience
from schemas.cv_model import WorkExperience as Work_Experience_schema
from models.database_model import WorkExperience as Work_Experience_model


class AdminExperience(Experience):
    """Admin Experience controller"""

    def __init__(self, db):
        super().__init__(db=db)
    
    def create_experience(self, experience_payload:Work_Experience_schema):
        """Create new experience"""
        new_experience = Work_Experience_model(
            experience_id = experience_payload.experience_id,
            company = experience_payload.company,
            company_url = str(experience_payload.company_url) if experience_payload.company_url else None,
            role = experience_payload.role,
            responsabilities = experience_payload.responsabilities,
            start_date = experience_payload.start_date,
            end_date = experience_payload.end_date,
            admin_id = 1
        )
        try:
            self.db.add(new_experience)
            self.db.commit()
            self.db.refresh(new_experience)
            return new_experience
        except Exception as database_error:
            raise database_error
    
    def update_experience(self, experience_id:str, experience_payload:Work_Experience_schema):
        """Work Experience update function"""
        experience = self.read_workExperience_ID(experience_id=experience_id)
        updated_experience = {
            "company": experience_payload.company,
            "company_url": str(experience_payload.company_url) if experience_payload.company_url else None,
            "responsabilities": experience_payload.responsabilities,
            "role": experience_payload.role,
            "start_date": experience_payload.start_date,
            "end_date": experience_payload.end_date
        }
        for key, value in updated_experience.items():
            setattr(experience, key, value)
        try:
            self.db.commit()
            self.db.refresh(experience)

            return updated_experience
        except Exception as database_error:
            self.db.rollback()
            raise database_error

    def delete_experience(self, experience_id:str):
        """Delete experience by Id"""
        experience = self.read_workExperience_ID(experience_id=experience_id)

        try:
            self.db.delete(experience)
            self.db.commit()
            return "Experience Deleted"
        except Exception as database_error:
            self.db.rollback()
            raise database_error

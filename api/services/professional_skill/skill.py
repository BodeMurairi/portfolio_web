#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import ProfessionalSkill
from models.database_model import ProfessionalSkill
from utils.crud_handler import CRUDService

class ProfessionalSkillReader:
    """A service class for managing ProfessionalSkill entities"""

    def __init__(self, db: Session):
        self.crud_service = CRUDService(db, ProfessionalSkill)

    def get_professional_skills(self):
        """Get all professional skills"""
        return self.crud_service.db.query(ProfessionalSkill).all()

    def get_professional_skill(self, skill_id: str):
        """Get a professional skill by its ID"""
        return self.crud_service.get('skill_id', skill_id)

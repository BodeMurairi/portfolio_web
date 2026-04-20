#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import ProfessionalSkill as ProfessionalSkill_schema
from models.database_model import ProfessionalSkill
from services.professional_skill.skill import ProfessionalSkillReader
from utils.crud_handler import CRUDService

class AdminProfessionalSkillService(ProfessionalSkillReader):
    """A service class for managing ProfessionalSkill entities with admin privileges"""

    def __init__(self, db: Session):
        super().__init__(db)
        self.crud_service = CRUDService(db, ProfessionalSkill)

    def create_professional_skill(self, skill_data: ProfessionalSkill_schema):
        """Create a new professional skill"""
        new_skill = skill_data.model_dump(mode='json')
        return self.crud_service.create(new_skill)

    def update_professional_skill(self, skill_id: str, skill_data: ProfessionalSkill_schema):
        """Update an existing professional skill"""
        data = skill_data.model_dump(mode='json')
        return self.crud_service.update('skill_id', skill_id, data)

    def delete_professional_skill(self, skill_id: str):
        """Delete a professional skill by its ID"""
        return self.crud_service.delete('skill_id', skill_id)

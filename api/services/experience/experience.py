#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import WorkExperience as Experience_schema
from models.database_model import WorkExperience as Experience_orm

class WorkExperience:
    """This class handles work experience features"""
    def __init__(self,db:Session):
        self.db = db

    def get_workExperiences(self):
        """Get user experience"""
        return (self.db.query(Experience_orm)
                .order_by(Experience_orm.end_date.desc())
                .all()
                )

    def read_workExperience_ID(self, experience_id:str):
        """get work experience by id"""
        return self.db.query(Experience_orm).where(Experience_orm.experience_id == experience_id).first()

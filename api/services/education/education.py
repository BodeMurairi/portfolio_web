#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import Education as Education_schema
from models.database_model import Education as Education_orm, Admin

class Education:
    def __init__(self,db:Session):
        self.db = db

    def get_all(self):
        """get all educations"""
        return (
            self.db.query(Education_orm)
            .order_by(Education_orm.end_date.desc())
            .all()
        )

    def get_educationId(self, id):
        """get education by ID"""
        find_institution = self.db.query(Education_orm).where(Education_orm.education_id == id).first()
        return find_institution

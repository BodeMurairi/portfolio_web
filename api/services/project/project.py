#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import Project as Project_schema
from models.database_model import Project as Project_orm
from utils.crud_handler import CRUDService

class ProjectReader:
    """A service class for managing Project entities"""

    def __init__(self, db: Session):
        self.crud_service = CRUDService(db, Project_orm)

    def get_projects(self):
        """Get all projects"""
        return self.crud_service.db.query(Project_orm).all()

    def get_project(self, project_id: str):
        """Get a project by its ID"""
        return self.crud_service.get('project_id', project_id)

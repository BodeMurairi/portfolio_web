#!/usr/bin/env python3

from fastapi import UploadFile
from sqlalchemy.orm import Session
from schemas.cv_model import Project as Project_schema
from models.database_model import Project as Project_orm
from services.project.project import ProjectReader
from utils.crud_handler import CRUDService
from services.upload import upload_project_image


class ProjectManager(ProjectReader):
    """A service class for managing Project entities with admin privileges"""

    def __init__(self, db: Session):
        super().__init__(db)
        self.crud_service = CRUDService(db, Project_orm)

    def create_project(self, payload: Project_schema):
        """Create a new project"""
        data = payload.model_dump(mode='json')
        data['admin_id'] = 1
        return self.crud_service.create(data)

    def update_project(self, project_id: str, payload):
        """Update a project by its ID"""
        data = payload.model_dump(mode='json', exclude_none=True, exclude_unset=True)
        data.pop('project_id', None)
        data.pop('image_url', None)
        return self.crud_service.update('project_id', project_id, data)

    def delete_project(self, project_id: str):
        """Delete a project by its ID"""
        return self.crud_service.delete('project_id', project_id)

    def upload_image(self, project_id: str, file: UploadFile):
        """Upload a project image to R2 and save the URL"""
        project = self.crud_service.get('project_id', project_id)

        image_url = upload_project_image(file=file, project_slug=project_id)

        project.image_url = image_url
        self.crud_service.db.commit()
        self.crud_service.db.refresh(project)
        return {"project_id": project_id, "image_url": image_url}

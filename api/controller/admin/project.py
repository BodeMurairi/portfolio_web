#!/usr/bin/env python3

from fastapi import UploadFile
from utils.http_status_code import NotFound, BadRequest
from services.admin.project import ProjectManager


def create_project(db, payload):
    """Create a new project"""
    if not payload:
        raise BadRequest(detail="Invalid project data")
    project_manager = ProjectManager(db=db)
    return project_manager.create_project(payload)


def update_project(db, project_id: str, payload):
    """Update a project by its ID"""
    if not payload:
        raise BadRequest(detail="Invalid project data")
    project_manager = ProjectManager(db=db)
    return project_manager.update_project(project_id, payload)


def delete_project(db, project_id: str):
    """Delete a project by its ID"""
    project_manager = ProjectManager(db=db)
    return project_manager.delete_project(project_id)


def upload_project_image(db, project_id: str, file: UploadFile):
    """Upload project image to Cloudflare R2"""
    project_manager = ProjectManager(db=db)
    return project_manager.upload_image(project_id=project_id, file=file)

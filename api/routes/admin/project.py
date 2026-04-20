#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends, UploadFile, File
from database.session import get_db
from schemas.cv_model import Project as Project_schema, UpdateProject
from controller.project.project import list_projects, get_projectID
from controller.admin.project import (
    create_project,
    update_project,
    delete_project,
    upload_project_image,
)
from sqlalchemy.orm import Session
from dependencies import get_current_admin

router = APIRouter(
    prefix="/project-management",
    tags=["Admin Manage projects"]
)


@router.post("/create")
async def create_new_project(
    payload: Project_schema,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Create new project"""
    return create_project(db=db, payload=payload)


@router.post("/upload/{project_id}")
async def upload_project_image_route(
    project_id: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Upload project image to Cloudflare R2"""
    return upload_project_image(db=db, project_id=project_id, file=image)


@router.put("/update/{project_id}")
async def update_existing_project(
    project_id: str,
    payload: UpdateProject,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Update existing project"""
    return update_project(db=db, project_id=project_id, payload=payload)


@router.delete("/delete/{project_id}")
async def delete_existing_project(
    project_id: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Delete existing project"""
    return delete_project(db=db, project_id=project_id)

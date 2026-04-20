#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from database.session import get_db
from schemas.cv_model import Project as Project_schema
from controller.project.project import list_projects, get_projectID
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    )

@router.get("/")
async def home():
    return {"message": "Welcome to the Projects API!"}


@router.get("/view")
async def view_project(db:Session = Depends(get_db)):
    "view project"
    return list_projects(db=db)

@router.get("/view/{project_id}")
async def view_project_by_id(project_id: str, db:Session = Depends(get_db)):
    "view project by ID"
    return get_projectID(db=db, project_id=project_id)

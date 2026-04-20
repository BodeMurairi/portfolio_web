#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict_project
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from services.project.project import ProjectReader

def list_projects(db):
    """Get list of all projects"""
    project = ProjectReader(db=db)
    projects = project.get_projects()
    return [orm_to_dict_project(proj) for proj in projects]

def get_projectID(db, project_id:str):
    """get one project by id"""
    all_projects = ProjectReader(db=db)
    project = all_projects.get_project(project_id=project_id)
    if not project:
        raise NotFound(detail="Project not found")

    return orm_to_dict_project(project)

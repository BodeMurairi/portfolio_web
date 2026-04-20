#!/usr/bin//env python3

from services.about import get_about
from sqlalchemy.orm import Session
from utils.http_status_code import NotFound

def about(db:Session):
    """
    This is the controller function to route the about information
    """
    about = get_about(db=db)
    if not about:
        raise NotFound("About content not found")
    return about

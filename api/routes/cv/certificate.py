#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends
from database.session import get_db
#from schemas.cv_model import Certification as Certificate_schema
from controller.certificate.certificate import list_certificates, get_certificateID
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/certificates",
    tags=["View-certificates"],
    )

@router.get("/")
async def view_certificates(db:Session = Depends(get_db)):
    "view certificates"
    return list_certificates(db=db)

@router.get("/{certificate_id}")
async def view_certificate_by_id(certificate_id: str, db:Session = Depends(get_db)):
    "view certificate by ID"
    return get_certificateID(db=db, certificate_id=certificate_id)

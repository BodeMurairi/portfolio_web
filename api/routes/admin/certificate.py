#!/usr/bin/env python3

from fastapi.routing import APIRouter
from fastapi import Depends, UploadFile, File
from database.session import get_db
from schemas.cv_model import Certification as Certificate_schema
from controller.admin.certificate import (
    create_certificate,
    update_certificate,
    delete_certificate,
    upload_certificate_file,
)
from sqlalchemy.orm import Session
from dependencies import get_current_admin

router = APIRouter(
    prefix="/certificates",
    tags=["Admin-certificates"],
)


@router.post("/create")
async def create_new_certificate(
    certificate: Certificate_schema,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Create new certificate"""
    return create_certificate(db=db, certificate_data=certificate)


@router.post("/upload/{certification_id}")
async def upload_certificate_credential(
    certification_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Upload certificate image or PDF to Cloudflare R2"""
    return upload_certificate_file(db=db, certification_id=certification_id, file=file)


@router.put("/update/{certification_id}")
async def update_certificate_by_id(
    certification_id: str,
    certificate: Certificate_schema,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Update certificate by ID"""
    return update_certificate(db=db, certification_id=certification_id, certificate_data=certificate)


@router.delete("/delete/{certificate_id}")
async def delete_certificate_by_id(
    certificate_id: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin),
):
    """Delete certificate by ID"""
    return delete_certificate(db=db, certificate_id=certificate_id)

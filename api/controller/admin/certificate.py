#!/usr/bin/env python3

from fastapi import UploadFile
from utils.helpers import orm_to_dict_certification
from utils.http_status_code import NotFound, BadRequest
from services.admin.certificate import ManageCertificate
from schemas.cv_model import Certification
from sqlalchemy.orm import Session


def create_certificate(db: Session, certificate_data: Certification):
    """Create a new certificate"""
    certificate = ManageCertificate(db=db)
    new_certificate = certificate.create_certification(certification_data=certificate_data)
    if not new_certificate:
        raise BadRequest(detail="Failed to create certificate")
    return orm_to_dict_certification(new_certificate)


def update_certificate(db: Session, certification_id: str, certificate_data):
    """Update an existing certificate"""
    certificate = ManageCertificate(db=db)
    updated_certificate = certificate.update_certification(
        certification_id=certification_id, certification_data=certificate_data
    )
    if not updated_certificate:
        raise NotFound(detail="Certificate not found")
    return orm_to_dict_certification(updated_certificate)


def delete_certificate(db, certificate_id: str):
    """Delete a certificate by its ID"""
    certificate = ManageCertificate(db=db)
    deleted_certificate = certificate.delete_certification(certification_id=certificate_id)
    if not deleted_certificate:
        raise NotFound(detail="Certificate not found")
    return {"detail": "Certificate deleted successfully"}


def upload_certificate_file(db: Session, certification_id: str, file: UploadFile):
    """Upload certificate credential file to Cloudflare R2"""
    certificate = ManageCertificate(db=db)
    return certificate.upload_credential(certification_id=certification_id, file=file)

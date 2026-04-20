#!/usr/bin/env python3

from fastapi import UploadFile
from sqlalchemy.orm import Session
from schemas.cv_model import Certification as Certification_schema
from models.database_model import Certification as Certification_orm
from utils.crud_handler import CRUDService
from services.upload import upload_certificate


class ManageCertificate:
    """A service class for managing Certification entities"""

    def __init__(self, db: Session):
        self.db = db
        self.crud_service = CRUDService(db, Certification_orm)

    def create_certification(self, certification_data: Certification_schema):
        """Create a new certification"""
        data = certification_data.model_dump()  # keep datetime as Python datetime
        data["admin_id"] = 1
        if data.get("credential_url") is not None:
            data["credential_url"] = str(data["credential_url"])
        return self.crud_service.create(data)

    def update_certification(self, certification_id: str, certification_data: Certification_schema):
        """Update an existing certification"""
        data = certification_data.model_dump()  # keep datetime as Python datetime
        data["admin_id"] = 1
        if data.get("credential_url") is not None:
            data["credential_url"] = str(data["credential_url"])
        return self.crud_service.update('certification_id', certification_id, data)

    def delete_certification(self, certification_id: str):
        """Delete a certification by its ID"""
        return self.crud_service.delete('certification_id', certification_id)

    def upload_credential(self, certification_id: str, file: UploadFile):
        """Upload a certificate file (image or PDF) to R2 and save the URL"""
        cert = self.crud_service.get('certification_id', certification_id)

        file_url = upload_certificate(file=file, certificate_slug=certification_id)

        cert.credential_url = file_url
        self.db.commit()
        self.db.refresh(cert)
        return {"certification_id": certification_id, "credential_url": file_url}

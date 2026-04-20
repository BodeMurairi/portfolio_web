#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy.orm import Session
from schemas.cv_model import Certification as Certification_schema
from models.database_model import Certification as Certification_orm
from utils.crud_handler import CRUDService

class ViewCertificate:
    """A service class for viewing Certification entities"""
    
    def __init__(self, db: Session):
        self.crud_service = CRUDService(db, Certification_orm)

    def get_certificates(self):
        """Get all certifications"""
        return self.crud_service.db.query(Certification_orm).all()

    def view_certificate(self, certification_id: str):
        """Get a certification by its ID"""
        return self.crud_service.get('certification_id', certification_id)

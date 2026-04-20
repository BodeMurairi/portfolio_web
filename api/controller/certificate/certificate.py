#!/usr/bin/env python3

from fastapi import HTTPException, status
from utils.helpers import orm_to_dict_certification
from utils.http_status_code import NotFound, BadRequest, Unauthorized, Forbidden
from services.certificate.certificate import ViewCertificate

def list_certificates(db):
    """Get list of all certificates"""
    certificate = ViewCertificate(db=db)
    certificates = certificate.get_certificates()
    if not certificates:
        return []
    return [orm_to_dict_certification(cert) for cert in certificates]

def get_certificateID(db, certificate_id:str):
    """get one certificate by id"""
    all_certificates = ViewCertificate(db=db)
    certificate = all_certificates.view_certificate(certification_id=certificate_id)
    if not certificate:
        raise NotFound(detail="Certificate not found")

    return orm_to_dict_certification(certificate)

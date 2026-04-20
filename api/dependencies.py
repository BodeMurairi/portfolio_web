#!/usr/bin/env python3

from fastapi import Header
from utils.http_status_code import Unauthorized
from services.admin.auth.jwt import decode_access_token

def get_current_admin(authorization: str = Header(...)):
    """
    Extract the admin_id from a valid JWT token in the Authorization header.
    """
    if not authorization or " " not in authorization:
        raise Unauthorized("Authorization header missing or invalid")
    scheme, token = authorization.split(" ", 1)
    
    if scheme.lower() != "bearer":
        raise Unauthorized("Authorization header must start with Bearer")
    
    payload = decode_access_token(token)
    if payload is None:
        raise Unauthorized("Invalid or expired token")

    return payload.get("admin_id")

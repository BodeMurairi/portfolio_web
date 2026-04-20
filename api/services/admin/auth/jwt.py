#!/usr/bin/env python3

import os
import jwt
from datetime import datetime, timedelta
from services.admin.auth.token_blacklist import is_token_blacklisted
from config.security import jwt_security_config

JWT_SECRET = jwt_security_config()[0]
JWT_ALGORITHM = jwt_security_config()[1]
MINS_TO_EXPIRE = jwt_security_config()[2]

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=1))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        if is_token_blacklisted(token):
            return None
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

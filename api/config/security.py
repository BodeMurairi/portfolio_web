#!/usr/bin/env python3

import os
from dotenv import load_dotenv

load_dotenv()

JWT_Security_config = {
    "JWT_SECTET": os.getenv("SECRET"),
    "JWT_ALGORITHM": os.getenv("ALGORITHM"),
    "MINS_TO_EXPIRE": os.getenv("MINS_TO_EXPIRE")
    }

def jwt_security_config():
    """JWT Config"""
    if not any([JWT_Security_config["JWT_SECTET"], JWT_Security_config["JWT_ALGORITHM"], JWT_Security_config["MINS_TO_EXPIRE"]]):
        raise ValueError("No JWT configurations found")
    return (JWT_Security_config["JWT_SECTET"],
            JWT_Security_config["JWT_ALGORITHM"],
            JWT_Security_config["MINS_TO_EXPIRE"]
            )

#!/usr/bin/env python3
"""
Direct password change script.
Run from the api/ directory:

    python change_script/password.py           # asks for current password
    python change_script/password.py --force   # skips current password check (use when unknown)
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from getpass import getpass
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from database.create_session import SessionLocal
from models.database_model import Admin
from services.admin.auth.harsh import hash_password, verify_password


def change_password(force: bool = False):
    email = input("Admin email: ").strip()
    if not email:
        print("Error: email is required.")
        sys.exit(1)

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            print(f"Error: no admin found with email '{email}'.")
            sys.exit(1)

        if not force:
            current = getpass("Current password: ")
            if not verify_password(current, admin.password_hash):
                print("Error: current password is incorrect.")
                print("Tip: run with --force to skip this check.")
                sys.exit(1)

        new_pw = getpass("New password (min 8 chars): ")
        if len(new_pw) < 8:
            print("Error: new password must be at least 8 characters.")
            sys.exit(1)

        confirm = getpass("Confirm new password: ")
        if new_pw != confirm:
            print("Error: passwords do not match.")
            sys.exit(1)

        admin.password_hash = hash_password(new_pw)
        db.commit()
        print(f"Password for '{email}' changed successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    force = "--force" in sys.argv
    change_password(force=force)

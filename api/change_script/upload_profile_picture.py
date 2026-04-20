#!/usr/bin/env python3
"""
Upload a local image to R2 and save the URL as the admin's profile picture.
Run from the api/ directory:

    python change_script/upload_profile_picture.py --email your@email.com --image ../frontend/frontend/src/assets/bode.webp
"""

import sys
import os
import argparse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

import boto3
from botocore.client import Config
from urllib.parse import quote
from database.create_session import SessionLocal
from models.database_model import Admin


def upload_and_save(email: str, image_path: str):
    if not os.path.isfile(image_path):
        print(f"Error: file not found — {image_path}")
        sys.exit(1)

    # R2 config
    r2_access_key  = os.getenv("CLOUDFLARE_ACCESS_KEYID")
    r2_secret_key  = os.getenv("SECRET_ACCESS_KEY")
    r2_bucket      = os.getenv("R2_BUCKET_NAME")
    r2_public_base = os.getenv("R2_PUBLIC_URL_BASE", "").rstrip("/")
    r2_endpoint    = os.getenv("R2_ENDPOINT", "").rstrip("/").removesuffix(f"/{r2_bucket}")

    s3 = boto3.client(
        "s3",
        aws_access_key_id=r2_access_key,
        aws_secret_access_key=r2_secret_key,
        endpoint_url=r2_endpoint,
        config=Config(signature_version="s3v4"),
    )

    filename  = os.path.basename(image_path)
    safe_name = quote(filename.replace(" ", "-").lower())
    r2_key    = f"profile/{safe_name}"

    print(f"Uploading '{filename}' → R2 path '{r2_key}' ...")
    with open(image_path, "rb") as f:
        s3.put_object(Bucket=r2_bucket, Key=r2_key, Body=f)

    public_url = f"{r2_public_base}/{r2_key}"
    print(f"Uploaded successfully. Public URL: {public_url}")

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            print(f"Error: no admin found with email '{email}'.")
            sys.exit(1)

        admin.profile_picture = public_url
        db.commit()
        print(f"Profile picture saved to DB for '{email}'.")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload profile picture to R2 and save URL to DB")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--image", required=True, help="Path to the image file")
    args = parser.parse_args()

    upload_and_save(email=args.email, image_path=os.path.abspath(args.image))

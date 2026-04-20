#!/usr/bin/env python3
import os
from urllib.parse import quote
from fastapi import UploadFile, HTTPException
import boto3
from botocore.client import Config
from dotenv import load_dotenv

load_dotenv()

# Cloudflare R2 credentials
R2_ACCESS_KEY_ID = os.getenv("CLOUDFLARE_ACCESS_KEYID")
R2_SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_PUBLIC_URL_BASE = (os.getenv("R2_PUBLIC_URL_BASE") or "").rstrip("/")

# Strip the bucket name from the endpoint URL if present
_raw_endpoint = os.getenv("R2_ENDPOINT", "").rstrip("/")
R2_ENDPOINT_URL = _raw_endpoint.removesuffix(f"/{R2_BUCKET_NAME}")

# Initialize S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    endpoint_url=R2_ENDPOINT_URL,
    config=Config(signature_version="s3v4"),
)

IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
PDF_EXTENSIONS = [".pdf"]


def sanitize_for_url(text: str) -> str:
    """Replace spaces with dashes and URL encode."""
    return quote(text.replace(" ", "-").lower())


def upload_to_r2(file: UploadFile, path: str) -> str:
    """Generic uploader to R2. Returns the public URL."""
    try:
        s3.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=path,
            Body=file.file,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    return f"{R2_PUBLIC_URL_BASE}/{path}"


def upload_profile_picture(file: UploadFile) -> str:
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Profile picture must be an image.")
    safe_name = sanitize_for_url(file.filename)
    path = f"profile/{safe_name}"
    return upload_to_r2(file, path)


def upload_article_image(file: UploadFile, article_slug: str) -> str:
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Article image must be an image.")
    safe_slug = sanitize_for_url(article_slug)
    safe_name = sanitize_for_url(file.filename)
    path = f"articles/{safe_slug}/{safe_name}"
    return upload_to_r2(file, path)


def upload_certificate(file: UploadFile, certificate_slug: str) -> str:
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in IMAGE_EXTENSIONS + PDF_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Certificate must be an image or PDF.",
        )
    safe_slug = sanitize_for_url(certificate_slug)
    safe_name = sanitize_for_url(file.filename)
    path = f"certificates/{safe_slug}/{safe_name}"
    return upload_to_r2(file, path)


def upload_project_image(file: UploadFile, project_slug: str) -> str:
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Project image must be an image.")
    safe_slug = sanitize_for_url(project_slug)
    safe_name = sanitize_for_url(file.filename)
    path = f"projects/{safe_slug}/{safe_name}"
    return upload_to_r2(file, path)

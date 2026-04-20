#!/usr/bin/env python3

import uuid
from datetime import datetime

def generate_id() -> str:
    """Generate short unique ID"""
    return str(uuid.uuid4()).split('-')[0]

def orm_to_dict(edu):
    return {
        "education_id": edu.education_id,
        "institution_name": edu.institution,
        "institution_url": edu.institution_url,
        "degree": edu.degree,
        "description": edu.description,
        "start_date": edu.start_date,
        "end_date": edu.end_date
    }

def orm_to_dict_experience(exp):
    return {
        "experience_id": exp.experience_id,
        "company": exp.company,
        "company_url": exp.company_url,
        "role": exp.role,
        "responsabilities": exp.responsabilities,
        "start_date": exp.start_date,
        "end_date": exp.end_date,
        "admin_id": exp.admin_id
    }

def orm_to_dict_project(proj):
    return {
        "project_id": proj.project_id,
        "title": proj.title,
        "description": proj.description,
        "image_url": proj.image_url or "",
        "demo_url": proj.demo_url or "",
        "admin_id": proj.admin_id,
        "start_date": proj.start_date,
        "end_date": proj.end_date
    }

def orm_to_dict_certification(cert):
    return {
        "certification_id": cert.certification_id,
        "name": cert.name,
        "organization": cert.organization,
        "date": cert.date,
        "description": cert.description,
        "credential_url": cert.credential_url,
    }

def orm_to_dict_skill(skill):
    return {
        "skill_id": skill.skill_id,
        "skill_name": skill.skill_name,
        "is_certificate_available": skill.is_certificate_available
    }

def orm_to_dict_articles(articles):
    images = getattr(articles, "images", [])
    first_image = images[0].image_url if images else None
    data = {
        "title": getattr(articles, "title", ""),
        "subtitle": getattr(articles, "subtitle", None),
        "type": getattr(articles, "type", None),
        "headline": getattr(articles, "headline", None),
        "content": getattr(articles, "content", ""),
        "author_name": getattr(articles, "author_name", ""),
        "article_source": getattr(articles, "article_source", None),
        "updated_at": getattr(articles, "updated_at", datetime.utcnow()),
        "image_url": first_image,
    }
    real_id = getattr(articles, "article_sys_id", None)
    data["article_sys_id"] = real_id
    return data

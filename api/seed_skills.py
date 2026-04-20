#!/usr/bin/env python3
"""Seed script — inserts original skills into the database, skipping existing ones."""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.database_model import ProfessionalSkill
from utils.helpers import generate_id

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
Session = sessionmaker(bind=engine)
db = Session()

skills = [
    "JavaScript",
    "React",
    "Python",
    "FastAPI",
    "Django",
    "PostgreSQL",
    "Docker",
    "Git",
    "Nginx",
    "HTML5",
    "CSS3",
    "Linux",
]

existing = {s.skill_name.lower() for s in db.query(ProfessionalSkill).all()}
print(f"Existing skills in DB: {existing}")

to_insert = [
    ProfessionalSkill(
        skill_id=generate_id(),
        skill_name=name,
        is_certificate_available=False,
    )
    for name in skills
    if name.lower() not in existing
]

if not to_insert:
    print("All skills already exist, nothing to insert.")
else:
    try:
        db.add_all(to_insert)
        db.commit()
        print(f"Inserted {len(to_insert)} skills:")
        for s in to_insert:
            print(f"  - {s.skill_name}")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

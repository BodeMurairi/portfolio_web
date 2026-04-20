#!/usr/bin/env python3
"""Seed script — inserts 3 sample projects into the database."""

import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.database_model import Project, Admin
from utils.helpers import generate_id

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
Session = sessionmaker(bind=engine)
db = Session()

# Resolve admin id
admin = db.query(Admin).first()
if not admin:
    print("No admin found in the database. Register an admin first.")
    db.close()
    exit(1)

admin_id = admin.id
print(f"Seeding projects for admin: {admin.first_name} {admin.last_name} (id={admin_id})")

projects = [
    Project(
        project_id=generate_id(),
        title="Portfolio Web Application",
        description=(
            "A full-stack personal portfolio built with React + Vite on the frontend "
            "and FastAPI on the backend. Features a dynamic CV section, blog, admin "
            "dashboard, and Cloudflare R2 for media storage."
        ),
        demo_url="https://github.com/bodemurairi/portfolio",
        image_url=None,
        start_date=datetime(2024, 1, 1),
        end_date=None,
        admin_id=admin_id,
    ),
    Project(
        project_id=generate_id(),
        title="REST API Boilerplate",
        description=(
            "A production-ready FastAPI boilerplate with JWT authentication, "
            "SQLAlchemy ORM, Alembic migrations, and Docker Compose setup. "
            "Designed for rapid API development with best-practice project structure."
        ),
        demo_url="https://github.com/bodemurairi/api-boilerplate",
        image_url=None,
        start_date=datetime(2023, 6, 1),
        end_date=datetime(2023, 9, 30),
        admin_id=admin_id,
    ),
    Project(
        project_id=generate_id(),
        title="Real-time Chat Application",
        description=(
            "A WebSocket-based chat application using FastAPI and React. "
            "Supports multiple rooms, message history stored in PostgreSQL, "
            "and live user presence indicators."
        ),
        demo_url=None,
        image_url=None,
        start_date=datetime(2023, 3, 1),
        end_date=datetime(2023, 5, 15),
        admin_id=admin_id,
    ),
]

try:
    db.add_all(projects)
    db.commit()
    print(f"Successfully inserted {len(projects)} projects.")
    for p in projects:
        print(f"  - [{p.project_id}] {p.title}")
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()

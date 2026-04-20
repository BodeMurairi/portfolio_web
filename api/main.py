#!/usr/bin/env python3

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.cv.project import router as project_router
from routes.cv.education import router as education_router
from routes.cv.about import router as about_router
from routes.cv.experience import router as experience_router
from routes.cv.project import router as project_router
from routes.cv.certificate import router as certificate_router
from routes.cv.skill import router as skill_router
from routes.articles.articles import router as article_router
from routes.contact.send_email import router as send_email_router
from routes.contact.messages import router as messages_router
from routes.comment.comment import router as comment_router
from routes.admin.education import router as admin_education_router
from routes.admin.experience import router as admin_experience_router
from routes.admin.project import router as admin_project_router
from routes.admin.certificate import router as admin_certificate_router
from routes.admin.skill import router as admin_skill_router
from routes.admin.auth.auth_reg_login import router as admin_auth
from routes.admin.articles import router as admin_articles_router
from routes.comment.comment_routes import router as router_test_websocket
from database.init_tables import create_tables

app = FastAPI(
    title="Bode Portfolio Web API",
    description="API for the Bode Portfolio Web Application",
    version="1.0.0"
)

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://portfolio-web-4qrj.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(project_router)
app.include_router(education_router)
app.include_router(about_router)
app.include_router(experience_router)
app.include_router(certificate_router)
app.include_router(skill_router)
app.include_router(article_router)
app.include_router(send_email_router)
app.include_router(messages_router)
app.include_router(comment_router)
app.include_router(admin_education_router)
app.include_router(admin_experience_router)
app.include_router(admin_project_router)
app.include_router(admin_certificate_router)
app.include_router(admin_skill_router)
app.include_router(admin_auth)
app.include_router(admin_articles_router)
app.include_router(router_test_websocket)

@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/")
async def home():
    return {"message": "Welcome to the Bode Portfolio Web API!"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        port=8000,
        reload=True,
        log_level="info"
    )

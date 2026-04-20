#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    create_engine,
    func
)
from database.base import Base
from sqlalchemy.orm import relationship, sessionmaker


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, autoincrement=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)

    phone_number = Column(String, unique=True, nullable=True)
    address = Column(String, nullable=True)

    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    profile_picture = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)

    about = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    work_experiences = relationship("WorkExperience", back_populates="admin", cascade="all, delete")
    educations = relationship("Education", back_populates="admin", cascade="all, delete")
    projects = relationship("Project", back_populates="admin", cascade="all, delete")
    certifications = relationship("Certification", back_populates="admin", cascade="all, delete")
    visitor_experiences = relationship("VisitorExperience", back_populates="admin", cascade="all, delete")

    def __repr__(self):
        return f"<Admin {self.first_name} {self.last_name} - {self.email}>"

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_sys_id = Column(String, unique=True, nullable=False)

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    headline = Column(String, nullable=True)
    content = Column(Text, nullable=False)

    author_name = Column(String, nullable=False)
    article_source = Column(String, nullable=True)
    type = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    images = relationship("ArticleImage", back_populates="article", cascade="all, delete")
    comments = relationship("Comment", back_populates="article", cascade="all, delete")
    stats = relationship("ArticleStat", back_populates="article", uselist=False, cascade="all, delete")

class ArticleImage(Base):
    __tablename__ = "article_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    image_url = Column(String, nullable=False)

    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)

    article = relationship("Article", back_populates="images")

class ArticleStat(Base):
    __tablename__ = "article_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey("articles.id"), unique=True)

    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    read_count = Column(Integer, default=0)

    updated_at = Column(DateTime, default=datetime.utcnow)

    article = relationship("Article", back_populates="stats")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)

    author_name = Column(String, nullable=False)
    author_email = Column(String, nullable=True)
    content = Column(Text, nullable=False)

    commented_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)

    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)

    article = relationship("Article", back_populates="comments")
    replies = relationship(
        "Comment",
        backref="parent",
        remote_side=[id]
    )

class WorkExperience(Base):
    __tablename__ = "work_experiences"

    id = Column(Integer, primary_key=True, autoincrement=True)
    experience_id = Column(String, unique=True, nullable=False)
    
    company = Column(String, nullable=False)
    company_url = Column(String, nullable=True)

    role = Column(String, nullable=False)
    responsabilities = Column(Text, nullable=True)

    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)

    updated_at = Column(DateTime, default=datetime.utcnow)

    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)

    admin = relationship("Admin", back_populates="work_experiences")
    milestones = relationship("MilestoneAchievement", back_populates="work_experience", cascade="all, delete")

class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    education_id = Column(String, unique=True, nullable=False)
    institution = Column(String, nullable=False)
    institution_url = Column(String, nullable=True)
    
    degree = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)

    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)

    admin = relationship("Admin", back_populates="educations")
    milestones = relationship("MilestoneAchievement", back_populates="education", cascade="all, delete")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String, unique=True, nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)

    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)

    updated_at = Column(DateTime, default=datetime.utcnow)

    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)

    admin = relationship("Admin", back_populates="projects")
    milestones = relationship("MilestoneAchievement", back_populates="project", cascade="all, delete")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    certification_id = Column(String, unique=True, nullable=False)

    name = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)

    description = Column(Text, nullable=True)
    credential_url = Column(String, nullable=True)

    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)

    admin = relationship("Admin", back_populates="certifications")

class MilestoneAchievement(Base):
    __tablename__ = "milestone_achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False)
    image_url = Column(String, nullable=True)

    work_experience_id = Column(Integer, ForeignKey("work_experiences.id"), nullable=True)
    education_id = Column(Integer, ForeignKey("educations.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)

    work_experience = relationship("WorkExperience", back_populates="milestones")
    education = relationship("Education", back_populates="milestones")
    project = relationship("Project", back_populates="milestones")

class VisitorExperience(Base):
    __tablename__ = "visitor_experiences"

    id = Column(Integer, primary_key=True, autoincrement=True)

    ip_address = Column(String, nullable=False)
    role = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    visited_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)

    admin = relationship("Admin", back_populates="visitor_experiences")

class ContactMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    replies = relationship("MessageReply", back_populates="message", cascade="all, delete")


class MessageReply(Base):
    __tablename__ = "message_replies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey("messages.id"), nullable=False)
    reply_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    message = relationship("ContactMessage", back_populates="replies")

class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    admin_id   = Column(Integer, ForeignKey("admins.id"), nullable=False)
    otp_code   = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used       = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProfessionalSkill(Base):
    __tablename__ = "professional_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_id = Column(String, unique=True, nullable=False)
    skill_name = Column(String, nullable=False)
    is_certificate_available = Column(Boolean, default=False)

if __name__ == "__main__":
    engine = create_engine("sqlite:///portfolio.db", echo=True)
    Base.metadata.create_all(engine)

    print("Database and tables created successfully.")

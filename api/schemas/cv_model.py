#!/usr/bin/env python3

from typing import Optional
from datetime import datetime
from utils.helpers import generate_id
from pydantic import BaseModel, Field, AnyUrl, model_validator


class Education(BaseModel):
    """
    Base Model for Education class
    """
    education_id: str = Field(
        default_factory=generate_id,
        description="Unique identifier for the education entry"
    )

    institution_name: str = Field(
        description="Name of the educational institution",
        min_length=2,
        max_length=150
    )

    institution_url: Optional[AnyUrl] = Field(
        default=None,
        description="Institution website page"
    )

    degree: str = Field(
        description="Degree obtained or pursued",
        min_length=2,
        max_length=150
    )

    description: Optional[str] = Field(
        default=None,
        description="Education degree description",
        max_length=2000
    )

    start_date: datetime = Field(
        description="Start date of education"
    )

    end_date: Optional[datetime] = Field(
        default=None,
        description="End date of education"
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class WorkExperience(BaseModel):
    """Base Model for WorkExperience"""

    experience_id: str = Field(
        default_factory=generate_id,
        description="Unique identifier for the experience entry"
    )

    company: str = Field(
        description="Name of the company",
        min_length=2,
        max_length=150
    )

    company_url: Optional[AnyUrl] = Field(
        default=None,
        description="Company website page"
    )

    role: str = Field(
        description="Role within the company",
        min_length=3,
    )

    responsabilities: Optional[str] = Field(
        default=None,
        description="Responsabilities around the role"
    )

    start_date: datetime = Field(
        description="Start date"
    )

    end_date: Optional[datetime] = Field(
        default=None,
        description="End date"
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class Project(BaseModel):
    """
    Base Model for Project/Portfolios
    """

    project_id: str = Field(
        default_factory=generate_id,
        description="Unique identifier for the project entry"
    )

    title: str = Field(
        description="Title of the project",
        min_length=2,
        max_length=200
    )

    description: str = Field(
        description="Description of the project",
        min_length=5,
        max_length=3000
    )

    demo_url: Optional[AnyUrl] = Field(
        default=None,
        description="Link to the project demo URL"
    )

    image_url: Optional[AnyUrl] = Field(
        default=None,
        description="Link to the project image URL"
    )

    start_date: datetime = Field(
        description="Start date of the project"
    )

    end_date: Optional[datetime] = Field(
        default=None,
        description="End date of the project"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class UpdateProject(BaseModel):
    """Partial update schema for Project — all fields optional"""

    title: Optional[str] = Field(default=None, min_length=2, max_length=200)
    description: Optional[str] = Field(default=None, min_length=5, max_length=3000)
    demo_url: Optional[AnyUrl] = Field(default=None)
    start_date: Optional[datetime] = Field(default=None)
    end_date: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class MilestoneAchievement(BaseModel):
    """Milestone Achievement"""

    achievement_id: str = Field(
        default_factory=generate_id,
        description="Unique identifier for achievement entry"
    )

    title: str = Field(
        description="Title of the achievement",
        min_length=2,
        max_length=200
    )

    description: str = Field(
        description="Achievement description",
        min_length=5,
        max_length=3000
    )

    image_url: Optional[AnyUrl] = Field(
        default=None,
        description="Image or demo URL"
    )

    achieved_at: Optional[datetime] = Field(
        default=None,
        description="Date achievement was obtained"
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )

class Certification(BaseModel):
    """
    Base Model for certification
    """
    certification_id:str=Field(
        default_factory=generate_id,
        description="Unique identifier for the certification entry"
    )
    name:str = Field(
        description="Certification title",
        min_length = 3
    )
    organization:str = Field(
        description="Name of the organization",
        min_length=2
    ),

    description:str = Field(
        description="Description of the certification",
        min_length=2
    )
    date:datetime=Field(
        description="Date of completion"
    )
    credential_url:Optional[AnyUrl]=Field(
        default=None,
        description="Certificate URL"
    )
    """
    updated_at:datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    """

class ProfessionalSkill(BaseModel):
    """"Base Model for Professional Skills"""
    skill_id:Optional[str] = Field(
        default_factory=generate_id,
        description="Unique identifier for the skill entry"
    )

    skill_name:str = Field(
        description="Name of the skill",
        min_length=2,
        max_length=200
    ),
    is_certificate_available:bool = Field(
        description="Indicates if a certificate is available for this skill"
    )

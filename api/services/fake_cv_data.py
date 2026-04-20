#!/usr/bin/env python3

from datetime import datetime

from schemas.cv_model import Education, WorkExperience, Project, MilestoneAchievement

education_list = [
    Education(
        institution_name="University of Lagos",
        institution_url="https://www.unilag.edu.ng",
        degree="B.Sc. Computer Science",
        description="Focused on software engineering, data structures, and distributed systems.",
        start_date=datetime(2012, 9, 1),
        end_date=datetime(2016, 7, 1)
    ),
    Education(
        institution_name="Stanford University",
        institution_url="https://www.stanford.edu",
        degree="M.Sc. Artificial Intelligence",
        description="Specialized in machine learning and deep neural networks.",
        start_date=datetime(2018, 9, 1),
        end_date=datetime(2020, 6, 1)
    ),
    Education(
        institution_name="MIT OpenCourseWare",
        institution_url="https://ocw.mit.edu",
        degree="Advanced Algorithms Certification",
        description="Completed advanced coursework in algorithms and optimization.",
        start_date=datetime(2021, 1, 1),
        end_date=datetime(2021, 6, 1)
    )
]

work_experience_list = [
    WorkExperience(
        company="Google",
        company_url="https://www.google.com",
        role="Software Engineer",
        description="Worked on scalable backend systems serving millions of users.",
        start_date=datetime(2016, 8, 1),
        end_date=datetime(2018, 8, 1)
    ),
    WorkExperience(
        company="Microsoft",
        company_url="https://www.microsoft.com",
        role="Senior Backend Engineer",
        description="Designed microservices and improved API performance by 40%.",
        start_date=datetime(2020, 7, 1),
        end_date=datetime(2023, 1, 1)
    ),
    WorkExperience(
        company="Stripe",
        company_url="https://www.stripe.com",
        role="Lead API Engineer",
        description="Led payment processing infrastructure projects.",
        start_date=datetime(2023, 2, 1),
        end_date=None  # Current role
    )
]

project_list = [
    Project(
        title="Distributed Task Queue System",
        description="Built a Redis-backed distributed task queue with retry logic and monitoring dashboard.",
        link="https://github.com/johndoe/task-queue",
        demo_url="https://taskqueue-demo.com",
        start_date=datetime(2021, 3, 1),
        end_date=datetime(2021, 8, 1)
    ),
    Project(
        title="Real-Time Chat Application",
        description="Developed a WebSocket-based chat app supporting 10k+ concurrent users.",
        link="https://github.com/johndoe/chat-app",
        demo_url="https://chat-demo.com",
        start_date=datetime(2022, 1, 1),
        end_date=datetime(2022, 5, 1)
    ),
    Project(
        title="AI Resume Analyzer",
        description="Built an NLP-powered resume analysis system using transformer models.",
        link="https://github.com/johndoe/resume-ai",
        demo_url="https://resume-ai-demo.com",
        start_date=datetime(2023, 4, 1),
        end_date=None
    )
]

achievement_list = [
    MilestoneAchievement(
        title="AWS Certified Solutions Architect",
        description="Earned AWS certification demonstrating cloud architecture expertise.",
        image_url="https://example.com/aws-cert.png",
        achieved_at=datetime(2021, 9, 1)
    ),
    MilestoneAchievement(
        title="Top 1% LeetCode Ranking",
        description="Ranked in the top 1% globally for algorithmic problem solving.",
        image_url="https://example.com/leetcode-badge.png",
        achieved_at=datetime(2022, 4, 1)
    ),
    MilestoneAchievement(
        title="Hackathon Winner - FinTech 2023",
        description="Won first place building a real-time fraud detection system.",
        image_url="https://example.com/hackathon-award.png",
        achieved_at=datetime(2023, 11, 1)
    )
]

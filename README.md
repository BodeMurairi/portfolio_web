# Bode Murairi — Portfolio Web Application

A full-stack personal portfolio with a blog, admin dashboard, and CV management. Built with **React + Vite** on the frontend and **FastAPI** on the backend, deployed on Vercel (frontend) and Render (backend).

---

## Features

**Public**
- Portfolio page — hero, about, work experience, projects, skills, contact form
- Blog — article listing, topic filtering, full article view, PDF download, comments
- Visitor analytics tracking

**Admin Dashboard**
- JWT-authenticated login with OTP-based password reset
- Profile management — bio, photo, GitHub / LinkedIn links
- CV management — education, work experience, projects, certifications, skills
- Article management — create / edit / delete posts, image uploads, engagement stats
- Messages panel — view contact submissions and reply by email
- Analytics — article views, likes, reads, popular topics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Redux Toolkit, React Router 7, Tailwind CSS 4 |
| Backend | FastAPI, SQLAlchemy, Alembic, Uvicorn |
| Database | PostgreSQL 15 |
| Auth | JWT (PyJWT), Bcrypt |
| Storage | Cloudflare R2 (S3-compatible) via Boto3 |
| Email | Gmail SMTP |
| Deployment | Vercel (frontend), Render (backend), Docker Compose (local) |

---

## Project Structure

```
portfolio_web/
├── api/                    # FastAPI backend
│   ├── controller/         # Business logic
│   ├── models/             # SQLAlchemy ORM models
│   ├── routes/             # API route definitions
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # Auth, email, file upload services
│   ├── database/           # DB setup and table creation
│   ├── config/             # App configuration
│   ├── utils/              # Helpers and utilities
│   ├── dependencies.py     # FastAPI dependency injection
│   └── main.py             # Entry point
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # Route-level page components
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # Redux slices and API calls
│   │   ├── store/          # Redux store
│   │   ├── router/         # Route definitions
│   │   └── api/            # Axios client
│   ├── vite.config.js
│   └── vercel.json
├── test/                   # Backend tests (pytest)
├── docker-compose.yml
└── requirements.txt
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 15 (or Docker)

### Option A — Docker Compose (recommended)

```bash
# Start PostgreSQL + FastAPI backend
docker-compose up -d
```

- API: http://localhost:8000
- API docs: http://localhost:8000/docs

Then start the frontend separately (see Option B).

### Option B — Local Setup

**Backend**

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env

# Start the API (tables are created automatically on first run)
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install

# Copy and fill in environment variables
cp .env.example .env

npm run dev
```

**Seed data** (after registering the admin account):

Access the app at **http://localhost:5173** and the admin panel at **http://localhost:5173/login**.


## API Overview

| Category | Prefix | Description |
|---|---|---|
| Public CV | `/` | Projects, education, experience, skills, about |
| Blog | `/articles` | Articles, comments, topic filtering, PDF download |
| Contact | `/` | Send message, admin reply |
| Admin Auth | `/auth` | Register, login, logout, OTP password reset |
| Admin CV | `/project-management`, `/admin-education`, etc. | CRUD for all CV sections |
| Admin Blog | `/articles_management` | Create/edit/delete articles, image uploads, analytics |

Full interactive documentation available at `/docs` (Swagger) and `/redoc`.

---

## Deployment

### Frontend — Vercel

1. Connect the repository to Vercel
2. Set **Root Directory** to `frontend` and **Framework Preset** to Vite
3. Add environment variable: `VITE_API_URL=<your-backend-url>`
4. Vercel picks up `frontend/vercel.json` automatically for SPA routing

### Backend — Render / Docker

1. Deploy using the `api/Dockerfile`
2. Set all backend environment variables in the platform dashboard
3. The app creates database tables automatically on startup

---

## Running Tests

```bash
cd test
pytest --cov=api --cov-report=term-missing
```

---

## License

Bode MMB

🧠 Smart Recruitment Faculty System

https://img.shields.io/badge/Python-3.9%252B-blue.svg
https://img.shields.io/badge/Django-5.0-green.svg
https://img.shields.io/badge/Flask-2.3-lightgrey.svg
https://img.shields.io/badge/React-18-61DAFB.svg
https://img.shields.io/badge/PostgreSQL-12-336791.svg
https://img.shields.io/badge/License-MIT-yellow.svg

📌 Overview
The Smart Recruitment Faculty System is an enterprise‑grade, AI‑powered recruitment platform purpose‑built for academic institutions. It digitises and streamlines the entire faculty hiring lifecycle—from job advertising and candidate application to AI‑driven shortlisting, panel interview management, and offer onboarding.

This system features a completely decoupled, role‑based architecture with three distinct frontends and three dedicated backend services, ensuring strict separation of concerns, enhanced security, and independent scalability for HR Administrators, Interview Panelists, and External Candidates.

Developed by Team CIT 01 as an internship project for the Chennai Institute of Technology Incubation Forums.

🎯 Problem Statement & Solution
Challenge
Design a Smart Faculty Recruitment Management System leveraging AI and ML to streamline automated scheduling, enhance resume matching, promote diversity through insightful reporting, and reduce paper usage. Integrate email and LinkedIn functionalities to improve outreach and communication.

Our Solution
Objective	Implementation
AI Resume Matching	Weighted scoring engine (Qualification, Experience, Skills Match, Research Papers) ranks candidates automatically.
Automated Scheduling	Calendar‑integrated interview scheduling with instant email/SMS notifications.
Diversity Reporting	Real‑time dashboard analytics visualising applicant demographics and selection trends.
Paperless Workflow	Fully digital applications, e‑signatures, and PDF offer letter generation.
Outreach Integration	SMTP email automation and LinkedIn OAuth/Job Posting APIs for wider candidate reach.
🏗️ System Architecture
The platform follows a microservices‑inspired monorepo design with six core components, clearly separated by user role:




















Component Breakdown (6 Major Modules)
Component	Technology	Primary Users	Responsibility
cit-dashboard	React + Vite	HR Administrators	Full recruitment management: job creation, AI‑ranked shortlists, final selection, offer generation, and onboarding.
interview-recruit	React + Vite	Interview Panelists	Panelist‑specific portal: view assigned interviews, access candidate profiles, submit scoring forms, and provide feedback to HR.
gateway-portal	React + Vite	External Candidates	Public job board: browse vacancies, apply with resume upload, and track application status.
django_recruitment_backend	Django 5.0 + DRF	HR Core	Manages Jobs, Candidates, Applications, AI Scoring, Offers. Assigns interviews to panelists and aggregates final reports.
interviewer-recruit-backend	Flask 2.3	Panelist Service	Handles panelist authentication, fetches assigned interview schedules, processes scoring forms, and submits feedback reports directly to HR.
backend-gateway-portal	Python (FastAPI/Flask)	Candidate Gateway	Acts as a secure facade for candidates. Rate‑limits requests, sanitises payloads, handles LinkedIn OAuth, and forwards applications to Django.
✨ Feature Matrix (By Role)
1. 👤 Candidate (via gateway-portal + backend-gateway-portal)
Public Job Board – Browse active faculty vacancies with real‑time filters.

Smart Application – Upload resume (PDF/DOCX); auto‑parsed for skills, experience, and research count.

Status Tracker – Check application status and AI score via unique Application ID.

Outreach Integration – Receive email confirmations; sign up via LinkedIn OAuth.

2. 👨‍💼 HR Administrator (via cit-dashboard + Django)
Dashboard Analytics – Aggregated metrics (vacancies, applications, shortlist ratio, diversity charts).

Job Management – Create, update, close job postings with department & vacancy details.

AI‑Scored Shortlist – View ranked candidates with transparent breakdown (Experience, Skills %, Research).

Interview Assignment – Assign specific panelists to interviews and manage schedules.

Selection & Offer – Finalise candidates; auto‑generate PDF offer letters with digital signatures.

Panelist Report Viewer – Review aggregated scoring forms and feedback submitted by panelists.

3. 🎤 Interview Panelist (via interview-recruit + Flask)
Assigned Schedule – View today’s/upcoming interview lineup with candidate anonymised profiles.

Scoring Interface – Submit technical, communication, and research scores via structured forms.

Qualitative Feedback – Provide private notes to aid HR in final decision‑making.

Report Submission – Finalise and submit the evaluation report directly to the HR database.

🛠️ Technology Stack
Layer	Category	Technology
Frontend	HR Portal	React 18, Vite, React Router, Axios, Chart.js
Frontend	Panelist Portal	React 18, Vite, React Router, Axios
Frontend	Candidate Gateway	React 18, Vite, Tailwind CSS
Backend	HR Core	Python 3.9, Django 5.0, Django REST Framework, SQLAlchemy
Backend	Panelist Service	Python 3.9, Flask 2.3, Flask‑SQLAlchemy, Flask‑JWT‑Extended
Backend	Candidate Gateway	Python 3.9 (FastAPI) / Node.js
Database	Primary	PostgreSQL 12+ (with asyncpg for Django)
AI / ML	Scoring Engine	scikit‑learn, pandas, spaCy (NLP for resume parsing)
Async Tasks	Background Jobs	Celery + Redis (AI scoring, bulk emails)
Storage	Resume/Offers	AWS S3 / Local filesystem with django‑storages
Authentication	All Services	JWT (SimpleJWT for Django, JWT‑Extended for Flask)
Email	Outreach	Django SMTP / SendGrid (transactional emails)
Deployment	Containerisation	Docker & Docker Compose
📁 Project Structure
text
Smart_Recruitment_Faculty_System/
│
├── cit-dashboard/                        # 👨‍💼 HR Admin Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboard/               # Analytics & metrics
│   │   │   ├── jobs/                    # Job CRUD
│   │   │   ├── candidates/              # AI-scored shortlist
│   │   │   ├── interviews/              # Schedule & assign panelists
│   │   │   ├── selection/               # Finalise hiring
│   │   │   └── offers/                  # Generate offer letters
│   │   ├── services/                    # API client (Django endpoints)
│   │   └── components/                  # Reusable UI components
│   ├── package.json
│   └── vite.config.js
│
├── interview-recruit/                    # 🎤 Panelist Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── schedule/                # Assigned interviews
│   │   │   ├── scoring/                 # Scoring forms
│   │   │   └── feedback/                # Submit reports to HR
│   │   ├── services/                    # API client (Flask endpoints)
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
│
├── gateway-portal/                       # 👤 Candidate Frontend (React)
│   ├── src/
│   │   ├── pages/                       # Job Board, Apply, Status Tracker
│   │   ├── services/                    # API client (Gateway)
│   │   └── components/
│   └── package.json
│
├── django_recruitment_backend/           # ⚙️ Django HR Core Backend
│   ├── jobs/                            # Job CRUD
│   ├── candidates/                      # Candidate profiles
│   ├── applications/                    # Applications & AI scores
│   ├── interviews/                      # Scheduling & assignment to panelists
│   ├── evaluation/                      # Aggregated panelist reports
│   ├── offers/                          # Offer generation
│   ├── ai_scoring/                      # AI/ML scoring logic
│   ├── accounts/                        # HR user auth
│   ├── requirements.txt
│   └── manage.py
│
├── interviewer-recruit-backend/          # ⚙️ Flask Panelist Backend
│   ├── app.py                           # Flask entry point
│   ├── routes/
│   │   ├── interviews.py                # GET assigned interviews
│   │   └── evaluation.py                # POST scoring & feedback
│   ├── models.py                        # SQLAlchemy models (shared)
│   ├── requirements.txt
│   └── config.py
│
├── backend-gateway-portal/               # ⚙️ Candidate API Gateway
│   ├── app.py                           # Gateway entry point
│   ├── routes/
│   │   ├── jobs.py                      # GET active jobs
│   │   ├── applications.py              # POST new applications
│   │   └── status.py                    # GET application status
│   ├── requirements.txt
│   └── config.py
│
├── docker-compose.yml                   # Multi-container deployment
├── .env                                 # Global environment variables
├── API_DOCUMENTATION.md                 # Full endpoint specifications
├── SETUP_GUIDE.md                       # Detailed installation steps
└── README.md                            # This file
🔄 Core Workflows
1. End‑to‑End Recruitment Flow
2. Panelist Report-to-HR Integration
The Flask backend (interviewer-recruit-backend) writes scoring data directly into the shared PostgreSQL database.

The Django backend (django_recruitment_backend) reads this data to compile aggregated reports and final selection scores for HR.

📡 API Endpoints Overview
Django Backend (HR Core) – http://localhost:5002/api/
Module	Key Endpoints
Dashboard	GET /dashboard/stats, GET /dashboard/diversity
Jobs	GET /jobs, POST /jobs, PUT /jobs/{id}, DELETE /jobs/{id}
Candidates	GET /candidates, GET /candidates/top
Applications	GET /applications, PATCH /applications/{id}/shortlist
Interviews	POST /interviews, PUT /interviews/{id}/assign
Evaluation Reports	GET /evaluation/reports/{interview_id}
Offers	POST /offers/generate/{app_id}, GET /offers
Flask Backend (Panelist) – http://localhost:5000/api/panelist/
Endpoint	Description
GET /interviews	Fetch interviews assigned to the logged‑in panelist
GET /interviews/{id}/candidate	Fetch anonymised candidate profile
POST /evaluate	Submit technical, communication, research scores & feedback
Backend Gateway (Candidates) – http://localhost:5001/api/public/
Endpoint	Description
GET /jobs	List active job vacancies (sanitised for public)
POST /applications	Submit application with resume file (multipart/form‑data)
GET /status/{app_id}	Fetch AI score and current application status
For detailed request/response schemas, see API_DOCUMENTATION.md.

🤖 AI Scoring Engine
The system uses a weighted composite scoring model to rank candidates objectively:

Criterion	Weight	Data Source
Qualification	25%	PhD = 100, M.Tech = 80, B.Tech = 60
Experience	30%	Years of experience (capped at 10 years)
Skills Match	30%	NLP keyword matching (Resume vs. Job Description)
Research Output	15%	Number of published papers (capped at 5)
Final Score = (Qualification × 0.25) + (Experience × 0.30) + (Skills × 0.30) + (Research × 0.15)

The logic is implemented in django_recruitment_backend/ai_scoring/engine.py and executed asynchronously via Celery.

🔐 Security & Role‑Based Access
Role	Frontend	Backend	Authentication Method
Candidate	gateway-portal	backend-gateway-portal → Django	Self‑registration / LinkedIn OAuth
HR Admin	cit-dashboard	django_recruitment_backend	JWT (issued via Django Admin login)
Panelist	interview-recruit	interviewer-recruit-backend	JWT (issued by HR during interview assignment)
Isolation: Panelists and Candidates never directly access the Django HR database—they operate through their dedicated gateways/services.

Rate‑Limiting: Candidate gateway restricts requests to prevent spam.

CORS: Strictly configured to whitelist only the designated frontend origins.

🚀 Quick Start (Local Development)
Prerequisites
Python 3.9+

Node.js 16+

PostgreSQL 12+

Redis (optional, for Celery)

1. Clone Repository
bash
git clone https://github.com/Semmozhi2008-04-13/Smart_Recruitment_Faculty_System.git
cd Smart_Recruitment_Faculty_System
2. Environment Variables
Create a .env file in the root directory:

env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/recruitment_db

# Backend Ports
DJANGO_PORT=5002
FLASK_PORT=5000
GATEWAY_PORT=5001

# Secrets
SECRET_KEY=your_django_secret_key
JWT_SECRET_KEY=your_jwt_secret

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
3. Setup Django Backend (HR Core)
bash
cd django_recruitment_backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 5002
4. Setup Flask Backend (Panelist Service)
bash
cd interviewer-recruit-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Runs on port 5000
5. Setup Backend Gateway (Candidate API)
bash
cd backend-gateway-portal
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Runs on port 5001
6. Setup HR Frontend (React)
bash
cd cit-dashboard
npm install
npm run dev  # Runs on http://localhost:5173
7. Setup Panelist Frontend (React)
bash
cd interview-recruit
npm install
npm run dev  # Runs on http://localhost:5174
8. Setup Candidate Frontend (React)
bash
cd gateway-portal
npm install
npm run dev  # Runs on http://localhost:3000
🐳 Deployment with Docker
For production, use the provided docker-compose.yml:

bash
docker-compose up --build
This spins up:

PostgreSQL

Redis

Django (Gunicorn + Nginx)

Flask

Backend Gateway

All three React apps (served via Nginx)

👥 Team CIT 01
Name	Role
[Your Name]	Team Lead / Full‑Stack Architect
[Name 2]	Backend Developer (Django / AI)
[Name 3]	Frontend Developer (React)
[Name 4]	Database & DevOps Engineer
[Name 5]	UI/UX Designer
Project completed under the Chennai Institute of Technology Incubation Forums internship programme.

📄 License
Distributed under the MIT License. See LICENSE for more information.

🙏 Acknowledgements
Chennai Institute of Technology for providing the problem statement and mentorship.

Open‑source contributors of Django, Flask, React, and PostgreSQL.

Industry mentors who guided the AI/ML implementation.

📬 Contact & Support
For questions, bug reports, or feature requests, please open an issue on GitHub.

Built with ❤️ to revolutionise academic recruitment.

# backend/main.py
from __future__ import annotations


from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List

from backend.backend.database import get_db, engine, Base
from datetime import datetime
from backend.backend.models import (
    Job,
    Candidate,
    JobApplication,  # Now this exists
    Interview,
    Evaluation,
    Selection,
    OfferOnboarding,
    Skill,
    CandidateSkill,
    ResearchPaper,
    InterviewPanel,
    Notification,
)


class JobCreateRequest(BaseModel):
    jobTitle: str
    department: str
    specialization: Optional[str] = None
    qualifications: Optional[str] = None
    salary: Optional[str] = None
    minExperience: Optional[str] = None
    vacancies: int = 1
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: str = "DRAFT"

app = FastAPI(title="Smart Faculty Recruitment System API")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# STARTUP - Create Tables
# ============================================
@app.on_event("startup")
async def on_startup():
    # backend/backend/database/connection.py exposes a *sync* engine.
    # Use sync table creation.
    with engine.begin() as conn:
        Base.metadata.create_all(bind=conn)
    print("Database tables created/verified!")

# ============================================
# HEALTH CHECK
# ============================================
@app.get("/")
async def root():
    return {"message": "HR Recruitment System API", "status": "running", "port": 3000}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "recruitment_system"}

# ============================================
# DASHBOARD ENDPOINTS
# ============================================
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(session: AsyncSession = Depends(get_db)):
    """Get dashboard statistics"""
    total_candidates = await session.scalar(select(func.count()).select_from(Candidate))
    shortlisted = await session.scalar(
        select(func.count()).select_from(Candidate).where(Candidate.application_status == "shortlisted")
    )
    total_jobs = await session.scalar(select(func.count()).select_from(Job))
    avg_ai_score = await session.scalar(select(func.avg(Candidate.ai_score)))
    
    return {
        "total_candidates": total_candidates or 0,
        "shortlisted_candidates": shortlisted or 0,
        "total_jobs": total_jobs or 0,
        "avg_ai_score": round(float(avg_ai_score or 0), 2),
    }

# ============================================
# JOBS ENDPOINTS
# ============================================

@app.post("/api/jobs")
async def create_job(payload: JobCreateRequest, session: AsyncSession = Depends(get_db)):
    """Create a job vacancy (frontend: JobManagementImpl.jsx -> POST /api/jobs)."""
    if payload.vacancies is None or payload.vacancies <= 0:
        raise HTTPException(status_code=400, detail="vacancies must be > 0")

    position_name = payload.jobTitle.strip()
    department = payload.department.strip()
    if not position_name or not department:
        raise HTTPException(status_code=400, detail="jobTitle and department are required")

    job = Job(
        job_code=None,
        position_name=position_name,
        department=department,
        vacancies=payload.vacancies,
        # frontend doesn't provide applications_received directly
        applications_received=0,
        status=payload.status,
        description=payload.qualifications,
        qualifications_required=payload.qualifications,
        experience_required=None,
        min_salary=None,
        max_salary=None,
        # posted_date/closing_date are Date in models; keep simple parsing for ISO yyyy-mm-dd
        posted_date=None,
        closing_date=None,
    )

    if payload.startDate:
        try:
            job.posted_date = datetime.fromisoformat(payload.startDate).date()
        except ValueError:
            raise HTTPException(status_code=400, detail="startDate must be in YYYY-MM-DD format")

    if payload.endDate:
        try:
            job.closing_date = datetime.fromisoformat(payload.endDate).date()
        except ValueError:
            raise HTTPException(status_code=400, detail="endDate must be in YYYY-MM-DD format")

    async with session.begin():
        session.add(job)

    # After commit, id should be available
    return {"success": True, "job_id": job.id}


@app.get("/api/jobs")
async def get_jobs(session: AsyncSession = Depends(get_db)):
    """Get all jobs"""
    result = await session.execute(select(Job).order_by(Job.id.desc()))
    jobs = result.scalars().all()
    return [
        {
            "id": j.id,
            "job_code": j.job_code,
            "position_name": j.position_name,
            "department": j.department,
            "vacancies": j.vacancies,
            "applications_received": j.applications_received,
            "status": j.status,
        }
        for j in jobs
    ]

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: int, session: AsyncSession = Depends(get_db)):
    """Get job by ID"""
    job = await session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ============================================
# CANDIDATES ENDPOINTS
# ============================================
@app.get("/api/candidates")
async def get_candidates(session: AsyncSession = Depends(get_db)):
    """Get all candidates sorted by AI score (like your PDF)"""
    result = await session.execute(
        select(Candidate).order_by(Candidate.ai_score.desc())
    )
    candidates = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "candidate_code": c.candidate_code,
            "name": f"{c.first_name} {c.last_name}",
            "first_name": c.first_name,
            "last_name": c.last_name,
            "email": c.email,
            "ai_score": c.ai_score,
            "experience_years": c.total_experience_years,
            "qualification": c.highest_qualification,
            "skills_match": c.skills_match_percentage,
            "research_score": c.research_score,
            "status": c.application_status,
        }
        for c in candidates
    ]

@app.get("/api/candidates/top")
async def get_top_candidates(limit: int = 10, session: AsyncSession = Depends(get_db)):
    """Get top AI-scored candidates (matching your PDF format)"""
    result = await session.execute(
        select(Candidate)
        .where(Candidate.application_status == "shortlisted")
        .order_by(Candidate.ai_score.desc())
        .limit(limit)
    )
    candidates = result.scalars().all()
    
    return [
        {
            "Candidate Name": f"{c.first_name} {c.last_name}",
            "AI Score": f"{c.ai_score}%",
            "Experience": f"{c.total_experience_years} yrs" if c.total_experience_years else "0 yrs",
            "Qualification": c.highest_qualification,
            "Skills Match": f"{c.skills_match_percentage}%",
            "Research": f"{c.research_score}%",
            "Status": c.application_status,
        }
        for c in candidates
    ]

@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: int, session: AsyncSession = Depends(get_db)):
    """Get candidate by ID"""
    candidate = await session.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# ============================================
# INTERVIEWS ENDPOINTS
# ============================================
@app.get("/api/interviews")
async def get_interviews(session: AsyncSession = Depends(get_db)):
    """Get all interviews"""
    result = await session.execute(select(Interview).order_by(Interview.interview_date.desc()))
    interviews = result.scalars().all()
    
    return [
        {
            "id": i.id,
            "candidate_name": f"{i.candidate.first_name} {i.candidate.last_name}" if i.candidate else "N/A",
            "interview_type": i.interview_type,
            "interview_date": i.interview_date.isoformat() if i.interview_date else None,
            "round": i.interview_round,
            "status": i.status,
            "overall_score": i.overall_score,
        }
        for i in interviews
    ]

# ============================================
# EVALUATION ENDPOINTS
# ============================================
@app.get("/api/evaluation")
async def get_evaluation_list(session: AsyncSession = Depends(get_db)):
    """Get candidates ready for evaluation"""
    result = await session.execute(
        select(Candidate)
        .where(Candidate.application_status.in_(["shortlisted", "interviewed"]))
        .order_by(Candidate.ai_score.desc())
    )
    candidates = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "name": f"{c.first_name} {c.last_name}",
            "ai_score": c.ai_score,
            "qualification": c.highest_qualification,
            "experience": c.total_experience_years,
            "status": c.application_status,
        }
        for c in candidates
    ]

# ============================================
# SELECTION ENDPOINTS
# ============================================
@app.get("/api/selection")
async def get_selection_list(session: AsyncSession = Depends(get_db)):
    """Get candidates for final selection"""
    result = await session.execute(
        select(Candidate)
        .where(Candidate.application_status.in_(["selected", "offered", "hired"]))
        .order_by(Candidate.ai_score.desc())
    )
    candidates = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "name": f"{c.first_name} {c.last_name}",
            "qualification": c.highest_qualification,
            "ai_score": c.ai_score,
            "status": c.application_status,
        }
        for c in candidates
    ]

# ============================================
# OFFERS ENDPOINTS
# ============================================
@app.get("/api/offers")
async def get_offers(session: AsyncSession = Depends(get_db)):
    """Get issued offers"""
    result = await session.execute(
        select(Candidate)
        .where(Candidate.application_status == "offered")
        .order_by(Candidate.ai_score.desc())
    )
    candidates = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "name": f"{c.first_name} {c.last_name}",
            "email": c.email,
            "position": "Assistant Professor",  # You can fetch from job application
            "status": "Pending Acceptance",
        }
        for c in candidates
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=5001,
        reload=True
    )

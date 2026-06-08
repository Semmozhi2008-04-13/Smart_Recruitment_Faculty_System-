from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date

# ============== JOB SCHEMAS ==============
class JobCreate(BaseModel):
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

class JobUpdate(BaseModel):
    jobTitle: Optional[str] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    qualifications: Optional[str] = None
    salary: Optional[str] = None
    minExperience: Optional[str] = None
    vacancies: Optional[int] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: Optional[str] = None

# ============== CANDIDATE SCHEMAS ==============
class CandidateCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    experience: Optional[float] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None

class CandidateUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    experience: Optional[float] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None

# ============== INTERVIEW SCHEMAS ==============
class InterviewCreate(BaseModel):
    candidateId: int
    jobId: int
    interviewType: str
    interviewDate: str  # ISO datetime string
    interviewRound: Optional[int] = 1
    interviewers: Optional[str] = None
    mode: Optional[str] = "online"
    meetingLink: Optional[str] = None

class InterviewUpdate(BaseModel):
    interviewType: Optional[str] = None
    interviewDate: Optional[str] = None
    interviewRound: Optional[int] = None
    interviewers: Optional[str] = None
    mode: Optional[str] = None
    meetingLink: Optional[str] = None
    status: Optional[str] = None
    overall_score: Optional[float] = None

# ============== EVALUATION SCHEMAS ==============
class EvaluationCreate(BaseModel):
    candidateId: int
    jobApplicationId: int
    aiScore: Optional[float] = None
    technicalScore: Optional[float] = None
    researchScore: Optional[float] = None
    finalScore: Optional[float] = None
    determination: Optional[str] = None
    remarks: Optional[str] = None

class EvaluationUpdate(BaseModel):
    aiScore: Optional[float] = None
    technicalScore: Optional[float] = None
    researchScore: Optional[float] = None
    finalScore: Optional[float] = None
    determination: Optional[str] = None
    remarks: Optional[str] = None

class EvaluationResponse(BaseModel):
    candidateId: int
    jobApplicationId: int
    aiScore: Optional[float] = None
    technicalScore: Optional[float] = None
    researchScore: Optional[float] = None
    finalScore: Optional[float] = None
    determination: Optional[str] = None
    remarks: Optional[str] = None

# ============== SELECTION SCHEMAS ==============
class SelectionCreate(BaseModel):
    candidateId: int
    jobId: int
    offeredPosition: str
    offeredSalary: float
    joiningDate: str  # ISO date string

class SelectionUpdate(BaseModel):
    decision: str  # "Selected" or "Rejected"
    status: Optional[str] = None

class SelectionDecisionRequest(BaseModel):
    decision: str  # "Selected" or "Rejected"

# ============== OFFER SCHEMAS ==============
class OfferCreate(BaseModel):
    candidateId: int
    position: str
    salary: float
    joiningDate: str  # ISO date string

class OfferUpdate(BaseModel):
    position: Optional[str] = None
    salary: Optional[float] = None
    joiningDate: Optional[str] = None
    offer_status: Optional[str] = None

# ============== SKILL SCHEMAS ==============
class SkillCreate(BaseModel):
    skill_name: str
    category: str

class CandidateSkillCreate(BaseModel):
    candidate_id: int
    skill_id: int
    proficiency_level: str
    years_of_experience: Optional[float] = None

# ============== RESEARCH PAPER SCHEMAS ==============
class ResearchPaperCreate(BaseModel):
    candidate_id: int
    title: str
    journal_name: Optional[str] = None
    publication_year: Optional[int] = None
    impact_factor: Optional[float] = None
    citations: int = 0

# ============== INTERVIEW PANEL SCHEMAS ==============
class InterviewPanelCreate(BaseModel):
    interview_id: int
    panel_member_name: str
    designation: Optional[str] = None
    score_given: Optional[float] = None
    comments: Optional[str] = None

# ============== NOTIFICATION SCHEMAS ==============
class NotificationCreate(BaseModel):
    recipient_email: str
    subject: str
    message: str
    notification_type: str
    related_entity_id: Optional[int] = None

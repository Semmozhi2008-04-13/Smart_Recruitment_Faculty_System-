# backend/backend/models.py
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from .database.connection import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_code = Column(String(50), unique=True, nullable=False)
    position_name = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    vacancies = Column(Integer, default=1)
    applications_received = Column(Integer, default=0)
    description = Column(Text)
    qualifications_required = Column(Text)
    experience_required = Column(Integer)
    min_salary = Column(Numeric(10, 2))
    max_salary = Column(Numeric(10, 2))
    posted_date = Column(Date, default=datetime.now().date())
    closing_date = Column(Date)
    status = Column(String(50), default='open')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    applications = relationship("JobApplication", back_populates="job")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_code = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    phone = Column(String(20))
    total_experience_years = Column(Float, default=0)
    highest_qualification = Column(String(100))
    specialization = Column(String(200))
    ai_score = Column(Float)
    skills_match_percentage = Column(Float)
    research_score = Column(Float)
    application_status = Column(String(50), default='applied')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    applications = relationship("JobApplication", back_populates="candidate")
    interviews = relationship("Interview", back_populates="candidate")

class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    application_date = Column(Date, default=datetime.now().date())
    ai_score = Column(Float)
    skills_match = Column(Float)
    research_score = Column(Float)
    application_status = Column(String(50), default='pending')
    review_notes = Column(Text)
    shortlisted_date = Column(Date)
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
    interviews = relationship("Interview", back_populates="job_application")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    job_application_id = Column(Integer, ForeignKey("job_applications.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    interview_type = Column(String(50))
    interview_date = Column(DateTime)
    interview_round = Column(Integer, default=1)
    interviewers = Column(Text)
    mode = Column(String(50))
    meeting_link = Column(Text)
    technical_score = Column(Float)
    communication_score = Column(Float)
    subject_knowledge_score = Column(Float)
    research_score_interview = Column(Float)
    presentation_score = Column(Float)
    overall_score = Column(Float)
    feedback = Column(Text)
    recommendation = Column(String(50))
    status = Column(String(50), default='scheduled')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job_application = relationship("JobApplication", back_populates="interviews")
    candidate = relationship("Candidate", back_populates="interviews")

class Evaluation(Base):
    __tablename__ = "evaluations"
    
    id = Column(Integer, primary_key=True, index=True)
    job_application_id = Column(Integer, ForeignKey("job_applications.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    ai_initial_score = Column(Float)
    interview_score = Column(Float)
    technical_assessment = Column(Float)
    research_evaluation = Column(Float)
    teaching_demo_score = Column(Float)
    final_score = Column(Float)
    final_percentage = Column(Float)
    determination = Column(String(50))
    selection_rank = Column(Integer)
    remarks = Column(Text)
    evaluation_date = Column(Date, default=datetime.now().date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Selection(Base):
    __tablename__ = "selections"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    selection_date = Column(Date, default=datetime.now().date())
    offer_letter_sent = Column(Boolean, default=False)
    offer_letter_date = Column(Date)
    offer_letter_url = Column(Text)
    offered_salary = Column(Numeric(12, 2))
    offered_position = Column(String(200))
    joining_date = Column(Date)
    acceptance_status = Column(String(50), default='pending')
    acceptance_date = Column(Date)
    status = Column(String(50), default='in_progress')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OfferOnboarding(Base):
    __tablename__ = "offer_onboarding"
    
    id = Column(Integer, primary_key=True, index=True)
    selection_id = Column(Integer, ForeignKey("selections.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    offer_letter_generated = Column(Boolean, default=False)
    offer_letter_url = Column(Text)
    offer_expiry_date = Column(Date)
    offer_accepted = Column(Boolean, default=False)
    acceptance_date = Column(Date)
    joining_date = Column(Date)
    onboarding_completed = Column(Boolean, default=False)
    status = Column(String(50), default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100))

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    proficiency_level = Column(String(50))
    years_of_experience = Column(Float)

class ResearchPaper(Base):
    __tablename__ = "research_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    paper_title = Column(String(500), nullable=False)
    journal_name = Column(String(300))
    publication_year = Column(Integer)
    citations_count = Column(Integer, default=0)

class InterviewPanel(Base):
    __tablename__ = "interview_panel"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    department = Column(String(100))
    position = Column(String(100))
    expertise = Column(String(200))
    is_active = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    notification_type = Column(String(50))
    subject = Column(String(500))
    message = Column(Text)
    sent_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default='sent')
    read_date = Column(DateTime(timezone=True))
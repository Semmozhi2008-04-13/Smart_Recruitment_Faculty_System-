# backend/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=False)
    jobs = relationship("Job", back_populates="department")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    status = Column(String, default="Open")  # Open, Closed, Draft
    
    department = relationship("Department", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    highest_qualification = Column(String)
    
    applications = relationship("Application", back_populates="candidate")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    status = Column(String, default="Applied") # Applied, Shortlisted, Selected, Rejected
    
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
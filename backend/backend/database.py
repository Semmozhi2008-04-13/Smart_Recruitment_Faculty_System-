# backend/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Replace with your actual credentials or load from an .env file
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/sfrs_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to yield a database session per request safely
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
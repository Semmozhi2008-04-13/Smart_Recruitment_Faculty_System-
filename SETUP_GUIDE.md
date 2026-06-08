# Complete Backend Setup & Testing Guide

## Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Node.js 16+ (for frontend)
- pip

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 1.2 Set Up Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/recruitment_db

# Server
HOST=0.0.0.0
PORT=5002

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000
```

### 1.3 Create PostgreSQL Database

```bash
# Using psql
psql -U postgres

# In psql:
CREATE DATABASE recruitment_db;
\q
```

### 1.4 Run Database Migrations (if using Alembic)

```bash
# Optional: Initialize Alembic if not done
# alembic init alembic

# Run migrations
python -m alembic upgrade head
```

## Step 2: Start the Backend Server

```bash
# From backend directory
uvicorn main:app --host 127.0.0.1 --port 5002 --reload

# Or using alternative:
python -m uvicorn main:app --host 127.0.0.1 --port 5002 --reload
```

Expected output:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:5002 (Press CTRL+C to quit)
```

## Step 3: Frontend Setup

```bash
cd cit-dashboard
npm install
npm run dev
```

Expected output:
```
VITE v8.0.12  ready in 145 ms

➜  Local:   http://127.0.0.1:5173/
```

## Step 4: Verify API Endpoints

### Using cURL or Postman

#### Test Health Endpoint
```bash
curl http://127.0.0.1:5002/api/health
```

Response:
```json
{
  "status": "healthy",
  "database": "recruitment_system"
}
```

#### Test Dashboard
```bash
curl http://127.0.0.1:5002/api/dashboard
```

#### Test Get Jobs
```bash
curl http://127.0.0.1:5002/api/jobs
```

#### Test Get Candidates
```bash
curl http://127.0.0.1:5002/api/candidates
```

### Using Python requests

```python
import requests

BASE_URL = "http://127.0.0.1:5002"

# Test health
response = requests.get(f"{BASE_URL}/api/health")
print(response.json())

# Get all jobs
jobs = requests.get(f"{BASE_URL}/api/jobs")
print(jobs.json())

# Get all candidates
candidates = requests.get(f"{BASE_URL}/api/candidates")
print(candidates.json())

# Create new job
new_job = {
    "jobTitle": "Senior Professor",
    "department": "School of Engineering",
    "vacancies": 5,
    "status": "PUBLISHED"
}
response = requests.post(f"{BASE_URL}/api/jobs", json=new_job)
print(response.json())

# Create new candidate
new_candidate = {
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phone": "9876543220",
    "experience": 7.5,
    "qualification": "Ph.D. in Engineering",
    "specialization": "Mechanical Engineering"
}
response = requests.post(f"{BASE_URL}/api/candidates", json=new_candidate)
print(response.json())
```

## Step 5: Complete API Testing

### Test All Endpoints

```python
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:5002"

def test_endpoints():
    print("=" * 60)
    print("TESTING SMART RECRUITMENT SYSTEM API")
    print("=" * 60)
    
    # 1. DASHBOARD
    print("\n1. DASHBOARD ENDPOINTS")
    print("-" * 60)
    
    dashboard = requests.get(f"{BASE_URL}/api/dashboard")
    print(f"GET /api/dashboard: {dashboard.status_code}")
    print(json.dumps(dashboard.json(), indent=2))
    
    # 2. JOBS
    print("\n2. JOB MANAGEMENT ENDPOINTS")
    print("-" * 60)
    
    jobs = requests.get(f"{BASE_URL}/api/jobs")
    print(f"GET /api/jobs: {jobs.status_code}")
    print(f"Total jobs: {len(jobs.json())}")
    
    if len(jobs.json()) > 0:
        job_id = jobs.json()[0]['id']
        job_detail = requests.get(f"{BASE_URL}/api/jobs/{job_id}")
        print(f"GET /api/jobs/{job_id}: {job_detail.status_code}")
    
    # 3. CANDIDATES
    print("\n3. CANDIDATE MANAGEMENT ENDPOINTS")
    print("-" * 60)
    
    candidates = requests.get(f"{BASE_URL}/api/candidates")
    print(f"GET /api/candidates: {candidates.status_code}")
    print(f"Total candidates: {len(candidates.json())}")
    
    top_candidates = requests.get(f"{BASE_URL}/api/candidates/top")
    print(f"GET /api/candidates/top: {top_candidates.status_code}")
    
    if len(candidates.json()) > 0:
        cand_id = candidates.json()[0]['id']
        cand_detail = requests.get(f"{BASE_URL}/api/candidates/{cand_id}")
        print(f"GET /api/candidates/{cand_id}: {cand_detail.status_code}")
    
    # 4. INTERVIEWS
    print("\n4. INTERVIEW ENDPOINTS")
    print("-" * 60)
    
    interviews = requests.get(f"{BASE_URL}/api/interviews")
    print(f"GET /api/interviews: {interviews.status_code}")
    print(f"Total interviews: {len(interviews.json())}")
    
    if len(interviews.json()) > 0:
        interview_id = interviews.json()[0]['id']
        interview_detail = requests.get(f"{BASE_URL}/api/interviews/{interview_id}")
        print(f"GET /api/interviews/{interview_id}: {interview_detail.status_code}")
    
    # 5. EVALUATIONS
    print("\n5. EVALUATION ENDPOINTS")
    print("-" * 60)
    
    evaluations = requests.get(f"{BASE_URL}/api/evaluation")
    print(f"GET /api/evaluation: {evaluations.status_code}")
    print(f"Total evaluations: {len(evaluations.json())}")
    
    # 6. SELECTIONS
    print("\n6. SELECTION ENDPOINTS")
    print("-" * 60)
    
    selections = requests.get(f"{BASE_URL}/api/selection")
    print(f"GET /api/selection: {selections.status_code}")
    print(f"Total candidates in selection: {len(selections.json())}")
    
    # 7. OFFERS
    print("\n7. OFFER ENDPOINTS")
    print("-" * 60)
    
    offers = requests.get(f"{BASE_URL}/api/offers")
    print(f"GET /api/offers: {offers.status_code}")
    print(f"Total offers: {len(offers.json())}")
    
    # 8. JOB APPLICATIONS
    print("\n8. JOB APPLICATION ENDPOINTS")
    print("-" * 60)
    
    applications = requests.get(f"{BASE_URL}/api/job-applications")
    print(f"GET /api/job-applications: {applications.status_code}")
    print(f"Total applications: {len(applications.json())}")
    
    # 9. SKILLS
    print("\n9. SKILLS ENDPOINTS")
    print("-" * 60)
    
    skills = requests.get(f"{BASE_URL}/api/skills")
    print(f"GET /api/skills: {skills.status_code}")
    print(f"Total skills: {len(skills.json())}")
    
    # 10. RESEARCH PAPERS
    print("\n10. RESEARCH PAPERS ENDPOINTS")
    print("-" * 60)
    
    papers = requests.get(f"{BASE_URL}/api/research-papers")
    print(f"GET /api/research-papers: {papers.status_code}")
    print(f"Total research papers: {len(papers.json())}")
    
    # 11. NOTIFICATIONS
    print("\n11. NOTIFICATIONS ENDPOINTS")
    print("-" * 60)
    
    notifications = requests.get(f"{BASE_URL}/api/notifications")
    print(f"GET /api/notifications: {notifications.status_code}")
    print(f"Total notifications: {len(notifications.json())}")
    
    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    test_endpoints()
```

Save this as `test_api.py` and run:
```bash
python test_api.py
```

## Step 6: Test Frontend Integration

### Open Browser

1. Navigate to: `http://127.0.0.1:5173`
2. Try each page:
   - **Dashboard**: Should load metrics and schedule
   - **Job Management**: Create/view jobs
   - **Candidates**: View candidate list
   - **Interviews**: Schedule interviews
   - **Evaluation**: Rate candidates
   - **Selection**: Accept/reject candidates
   - **Offers**: Create offers

## Step 7: Troubleshooting

### Issue: Connection refused on port 5002

**Solution:**
```bash
# Check if port is in use
netstat -ano | findstr :5002

# Kill process if needed
taskkill /PID <PID> /F

# Restart backend
uvicorn main:app --host 127.0.0.1 --port 5002 --reload
```

### Issue: Database connection error

**Solution:**
```bash
# Verify PostgreSQL is running
psql -U postgres -d recruitment_db -c "SELECT 1;"

# If error, check DATABASE_URL in .env
# Format: postgresql+asyncpg://user:password@host:port/database
```

### Issue: Frontend shows "Unable to load dashboard data"

**Solution:**
1. Check backend is running
2. Verify CORS is enabled
3. Check API_BASE_URL in frontend env

```javascript
// In cit-dashboard/src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:5002';
```

## Step 8: Production Deployment

### Requirements.txt for Production

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
asyncpg==0.31.0
pydantic==2.13.4
python-dotenv==1.0.0
psycopg2-binary==2.9.9
```

### Run Command

```bash
# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:5002

# Or with Docker
docker build -t recruitment-api .
docker run -p 5002:5002 --env-file .env recruitment-api
```

## Step 9: Database Schema

### Check Created Tables

```sql
-- Connect to database
psql -U postgres -d recruitment_db

-- List tables
\dt

-- Check jobs table structure
\d jobs

-- Check candidates
\d candidates

-- etc.
```

### Sample Data

The backend automatically seeds sample data on startup with:
- 2 Job vacancies
- 4 Candidates
- Multiple job applications
- Sample interviews
- Sample evaluations
- Sample selections

## Step 10: Monitoring

### Check Logs

```bash
# Terminal output shows:
# - API requests
# - Database queries (if echo=True in SQLAlchemy)
# - Errors and exceptions
```

### Database Monitoring

```sql
-- Check table row counts
SELECT 'jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'candidates', COUNT(*) FROM candidates
UNION ALL
SELECT 'interviews', COUNT(*) FROM interviews
UNION ALL
SELECT 'evaluations', COUNT(*) FROM evaluations
UNION ALL
SELECT 'selections', COUNT(*) FROM selections
UNION ALL
SELECT 'offers_onboarding', COUNT(*) FROM offers_onboarding;
```

---

## Quick Start Commands

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 5002 --reload

# Terminal 2: Frontend
cd cit-dashboard
npm install
npm run dev

# Terminal 3: Testing (optional)
python test_api.py
```

Then open: `http://127.0.0.1:5173`

---

## API Summary

| Module | Endpoints | Status |
|--------|-----------|--------|
| Dashboard | GET /api/dashboard | ✅ Complete |
| Jobs | GET/POST/PUT/DELETE /api/jobs | ✅ Complete |
| Candidates | GET/POST/PUT/DELETE /api/candidates | ✅ Complete |
| Interviews | GET/POST/PUT/DELETE /api/interviews | ✅ Complete |
| Evaluations | GET/POST/PUT/DELETE /api/evaluation | ✅ Complete |
| Selections | GET /api/selection, PATCH /api/selection/{id} | ✅ Complete |
| Offers | GET/POST/PUT/DELETE /api/offers | ✅ Complete |
| Job Applications | GET /api/job-applications | ✅ Complete |
| Skills | GET/POST /api/skills | ✅ Complete |
| Research Papers | GET/POST/DELETE /api/research-papers | ✅ Complete |
| Notifications | GET/POST/PATCH /api/notifications | ✅ Complete |

---

**All endpoints are fully implemented and ready for testing!** 🎉


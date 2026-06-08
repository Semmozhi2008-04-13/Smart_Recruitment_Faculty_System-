# Smart Faculty Recruitment System - Complete API Documentation

## Base URL
```
http://127.0.0.1:5002  (as configured in frontend)
```

## Authentication
Currently no authentication. In production, add JWT tokens.

---

## 1. DASHBOARD ENDPOINTS

### GET /api/dashboard
**Description:** Get dashboard metrics, interview schedules, and timeline events  
**Response:**
```json
{
  "metrics": [
    {
      "id": 1,
      "icon": "group",
      "title": "Total Candidates",
      "value": "4"
    }
  ],
  "scheduleRows": [
    {
      "id": 1,
      "name": "Liam Chen",
      "role": "ECE",
      "status": "Ongoing",
      "action": "Interview"
    }
  ],
  "timelineEvents": [
    {
      "id": 1,
      "date": "10:00 AM",
      "description": "Technical Panel CSE Scheduled",
      "active": true
    }
  ]
}
```

### GET /api/dashboard/stats
**Description:** Get aggregated dashboard statistics  
**Response:**
```json
{
  "total_candidates": 4,
  "shortlisted_candidates": 2,
  "total_jobs": 2,
  "avg_ai_score": 92.5
}
```

---

## 2. JOB MANAGEMENT ENDPOINTS

### GET /api/jobs
**Description:** List all job vacancies  
**Query Parameters:**
- None (returns all jobs)

**Response:**
```json
[
  {
    "id": 1,
    "job_code": "JOB-CSE-001",
    "position_name": "Assistant Professor",
    "department": "School of Computer Science & Engineering",
    "vacancies": 10,
    "applications_received": 55,
    "status": "PUBLISHED"
  }
]
```

### GET /api/jobs/{job_id}
**Description:** Get specific job details  
**Response:** Single job object (same structure as GET /api/jobs)

### POST /api/jobs
**Description:** Create a new job vacancy  
**Request Body:**
```json
{
  "jobTitle": "Assistant Professor",
  "department": "School of Computer Science & Engineering",
  "specialization": "AI/ML",
  "qualifications": "Ph.D. in CSE or related field",
  "salary": "12,00,000 - 18,00,000",
  "minExperience": "2 years",
  "vacancies": 10,
  "startDate": "2026-06-15",
  "endDate": "2026-08-15",
  "status": "PUBLISHED"
}
```

**Response:**
```json
{
  "success": true,
  "job_id": 1
}
```

### PUT /api/jobs/{job_id}
**Description:** Update job details  
**Request Body:** Same as POST (all fields optional)  
**Response:**
```json
{
  "success": true,
  "job_id": 1
}
```

### DELETE /api/jobs/{job_id}
**Description:** Delete a job vacancy  
**Response:**
```json
{
  "success": true
}
```

---

## 3. CANDIDATE MANAGEMENT ENDPOINTS

### GET /api/candidates
**Description:** List all candidates  
**Response:**
```json
[
  {
    "id": 1,
    "candidate_code": "CAN-RS-001",
    "name": "Reena Sen",
    "first_name": "Reena",
    "last_name": "Sen",
    "email": "reena.sen@example.com",
    "initials": "RS",
    "color": "bg-purple-100 text-purple-700",
    "score": 94,
    "exp": "8 Years",
    "expYears": 8,
    "qual": "Ph.D. (IIT Kanpur)",
    "match": 95,
    "research": "2 Papers",
    "researchCount": 2,
    "department": "School of Computer Science & Engineering",
    "status": "SHORTLISTED"
  }
]
```

### GET /api/candidates/top
**Description:** Get top candidates (shortlisted)  
**Query Parameters:**
- limit: int (default: 10)

**Response:**
```json
[
  {
    "Candidate Name": "Reena Sen",
    "AI Score": "94%",
    "Experience": "8 yrs",
    "Qualification": "Ph.D. (IIT Kanpur)",
    "Skills Match": "95%",
    "Research": "92%",
    "Status": "shortlisted"
  }
]
```

### GET /api/candidates/{candidate_id}
**Description:** Get candidate details with complete profile  
**Response:**
```json
{
  "id": 1,
  "name": "Reena Sen",
  "first_name": "Reena",
  "last_name": "Sen",
  "email": "reena.sen@example.com",
  "phone": "9876543210",
  "qualification": "Ph.D. (IIT Kanpur)",
  "department": "School of Computer Science & Engineering",
  "basePay": "₹57,700",
  "refNumber": "CIT/HR/2026/001",
  "dateCreated": "05 Jun 2026",
  "status": "shortlisted"
}
```

### POST /api/candidates
**Description:** Create a new candidate  
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "experience": 5.5,
  "qualification": "Ph.D. in Computer Science",
  "specialization": "AI/ML"
}
```

**Response:**
```json
{
  "success": true,
  "candidate_id": 1
}
```

### PUT /api/candidates/{candidate_id}
**Description:** Update candidate details  
**Request Body:** Same as POST (all fields optional)  
**Response:**
```json
{
  "success": true,
  "candidate_id": 1
}
```

### DELETE /api/candidates/{candidate_id}
**Description:** Delete a candidate  
**Response:**
```json
{
  "success": true
}
```

---

## 4. JOB APPLICATIONS ENDPOINTS

### GET /api/job-applications
**Description:** Get job applications  
**Query Parameters:**
- job_id: int (optional)
- candidate_id: int (optional)

**Response:**
```json
[
  {
    "id": 1,
    "job_id": 1,
    "candidate_id": 1,
    "candidate_name": "Reena Sen",
    "job_title": "Assistant Professor",
    "application_status": "shortlisted",
    "ai_score": 94.0,
    "skills_match": 95.0,
    "research_score": 92.0,
    "applied_date": "2026-06-05"
  }
]
```

### GET /api/job-applications/{application_id}
**Description:** Get specific application details  
**Response:** Single application object

---

## 5. INTERVIEW ENDPOINTS

### GET /api/interviews
**Description:** List all interviews  
**Query Parameters:**
- status: string (optional: "Scheduled", "Ongoing", "Completed")

**Response:**
```json
[
  {
    "id": 1,
    "candidate_id": 2,
    "candidate_name": "Liam Chen",
    "interview_type": "Technical Panel ECE",
    "interview_date": "2026-06-08T15:30:00",
    "interview_round": 1,
    "interviewers": "Dr. A. Kumar, Dr. B. Sharma",
    "mode": "online",
    "meeting_link": "https://teams.microsoft.com/...",
    "status": "Ongoing",
    "overall_score": 85.0,
    "remarks": null
  }
]
```

### GET /api/interviews/{interview_id}
**Description:** Get interview details with panel information  
**Response:**
```json
{
  "id": 1,
  "candidate_id": 2,
  "job_application_id": 2,
  "candidate_name": "Liam Chen",
  "interview_type": "Technical Panel ECE",
  "interview_date": "2026-06-08T15:30:00",
  "interview_round": 1,
  "interviewers": "Dr. A. Kumar, Dr. B. Sharma",
  "mode": "online",
  "meeting_link": "https://teams.microsoft.com/...",
  "status": "Ongoing",
  "overall_score": 85.0,
  "remarks": null,
  "interview_panels": [
    {
      "id": 1,
      "panel_member_name": "Dr. A. Kumar",
      "designation": "Associate Professor",
      "score_given": 85.0,
      "comments": "Good technical knowledge"
    }
  ]
}
```

### POST /api/interviews
**Description:** Schedule a new interview  
**Request Body:**
```json
{
  "candidateId": 2,
  "jobId": 2,
  "interviewType": "Technical Panel ECE",
  "interviewDate": "2026-06-08T15:30:00",
  "interviewRound": 1,
  "interviewers": "Dr. A. Kumar, Dr. B. Sharma",
  "mode": "online",
  "meetingLink": "https://teams.microsoft.com/..."
}
```

**Response:**
```json
{
  "id": 1,
  "candidateId": 2,
  "jobId": 2,
  "interviewType": "Technical Panel ECE",
  "interviewDate": "2026-06-08T15:30:00",
  "interviewRound": 1,
  "interviewers": "Dr. A. Kumar, Dr. B. Sharma",
  "mode": "online",
  "meetingLink": "https://teams.microsoft.com/...",
  "status": "scheduled"
}
```

### PUT /api/interviews/{interview_id}
**Description:** Update interview details  
**Request Body:**
```json
{
  "status": "Completed",
  "overall_score": 88.0,
  "remarks": "Excellent interview performance"
}
```

**Response:**
```json
{
  "success": true,
  "interview_id": 1
}
```

### DELETE /api/interviews/{interview_id}
**Description:** Cancel an interview  
**Response:**
```json
{
  "success": true
}
```

---

## 6. EVALUATION ENDPOINTS

### GET /api/evaluation
**Description:** List all evaluations  
**Query Parameters:**
- status: string (optional)

**Response:**
```json
[
  {
    "id": 1,
    "candidate_id": 1,
    "candidate_name": "Reena Sen",
    "job_application_id": 1,
    "ai_initial_score": 94.0,
    "interview_score": 91.0,
    "technical_assessment": 92.0,
    "research_evaluation": 90.0,
    "teaching_demo_score": 88.0,
    "final_score": 91.2,
    "final_percentage": 91.2,
    "determination": "Recommended",
    "remarks": "Strong subject knowledge, good coding skills."
  }
]
```

### GET /api/evaluation/{evaluation_id}
**Description:** Get evaluation details  
**Response:** Single evaluation object

### POST /api/evaluation
**Description:** Create or update evaluation  
**Request Body:**
```json
{
  "candidateId": 1,
  "jobApplicationId": 1,
  "aiScore": 94.0,
  "technicalScore": 92.0,
  "researchScore": 92.0,
  "finalScore": 91.2,
  "determination": "Recommended",
  "remarks": "Strong subject knowledge, good coding skills."
}
```

**Response:**
```json
{
  "success": true,
  "evaluation_id": 1
}
```

### PUT /api/evaluation/{evaluation_id}
**Description:** Update evaluation details  
**Request Body:** Same as POST (all fields optional)  
**Response:**
```json
{
  "success": true,
  "evaluation_id": 1
}
```

### DELETE /api/evaluation/{id}
**Description:** Remove evaluation  
**Response:**
```json
{
  "success": true
}
```

---

## 7. SELECTION ENDPOINTS

### GET /api/selection
**Description:** Get selection list for review  
**Response:**
```json
[
  {
    "id": 1,
    "name": "Priya Subramanian",
    "initials": "PS",
    "type": "Strong Recommended",
    "subType": "Ph.D in AI & ML - Outstanding publication record",
    "score": 94.8,
    "decision": "Selected"
  }
]
```

### PATCH /api/selection/{id}
**Description:** Make selection decision (accept/reject candidate)  
**Request Body:**
```json
{
  "decision": "Selected"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 8. OFFER & ONBOARDING ENDPOINTS

### GET /api/offers
**Description:** Get all offers  
**Response:**
```json
[
  {
    "id": 1,
    "selection_id": 1,
    "candidate_id": 3,
    "candidate_name": "Priya Subramanian",
    "offered_position": "Assistant Professor",
    "offered_salary": 1440000,
    "joining_date": "2026-07-05",
    "offer_letter_date": "2026-06-05",
    "offer_status": "Pending",
    "onboarding_status": "Not Started",
    "remarks": null
  }
]
```

### GET /api/offers/{offer_id}
**Description:** Get offer details  
**Response:** Single offer object

### POST /api/offers
**Description:** Create new offer for selected candidate  
**Request Body:**
```json
{
  "candidateId": 3,
  "position": "Assistant Professor",
  "salary": 1440000,
  "joiningDate": "2026-07-05"
}
```

**Response:**
```json
{
  "success": true,
  "offer_id": 1
}
```

### PUT /api/offers/{offer_id}
**Description:** Update offer status  
**Request Body:**
```json
{
  "offer_status": "Sent",
  "onboarding_status": "In Progress",
  "remarks": "Documents submitted by candidate"
}
```

**Response:**
```json
{
  "success": true,
  "offer_id": 1
}
```

### DELETE /api/offers/{offer_id}
**Description:** Delete offer  
**Response:**
```json
{
  "success": true
}
```

---

## 9. SKILLS ENDPOINTS

### GET /api/skills
**Description:** Get all available skills  
**Response:**
```json
[
  {
    "id": 1,
    "skill_name": "Python",
    "category": "Programming"
  },
  {
    "id": 2,
    "skill_name": "React",
    "category": "Frontend"
  }
]
```

### POST /api/skills
**Description:** Create new skill  
**Request Body:**
```json
{
  "skill_name": "Node.js",
  "category": "Backend"
}
```

**Response:**
```json
{
  "success": true,
  "skill_id": 7
}
```

---

## 10. RESEARCH PAPERS ENDPOINTS

### GET /api/research-papers
**Description:** Get research papers  
**Query Parameters:**
- candidate_id: int (optional)

**Response:**
```json
[
  {
    "id": 1,
    "candidate_id": 1,
    "title": "Deep Learning in Healthcare",
    "journal_name": "IEEE Transactions",
    "publication_year": 2024,
    "impact_factor": 5.2,
    "citations": 10
  }
]
```

### POST /api/research-papers
**Description:** Add research paper  
**Request Body:**
```json
{
  "candidate_id": 1,
  "title": "Deep Learning in Healthcare",
  "journal_name": "IEEE Transactions",
  "publication_year": 2024,
  "impact_factor": 5.2,
  "citations": 10
}
```

**Response:**
```json
{
  "success": true,
  "paper_id": 1
}
```

### DELETE /api/research-papers/{paper_id}
**Description:** Delete research paper  
**Response:**
```json
{
  "success": true
}
```

---

## 11. NOTIFICATIONS ENDPOINTS

### GET /api/notifications
**Description:** Get notifications  
**Query Parameters:**
- recipient_email: string (optional)
- is_read: boolean (optional)

**Response:**
```json
[
  {
    "id": 1,
    "recipient_email": "reena.sen@example.com",
    "subject": "Interview Scheduled",
    "message": "Your interview has been scheduled for June 8, 2026 at 3:30 PM",
    "notification_type": "interview",
    "is_read": false,
    "created_at": "2026-06-05T10:00:00"
  }
]
```

### POST /api/notifications
**Description:** Create notification  
**Request Body:**
```json
{
  "recipient_email": "reena.sen@example.com",
  "subject": "Interview Scheduled",
  "message": "Your interview has been scheduled",
  "notification_type": "interview",
  "related_entity_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "notification_id": 1
}
```

### PATCH /api/notifications/{notification_id}
**Description:** Mark notification as read  
**Response:**
```json
{
  "success": true
}
```

---

## 12. HEALTH & STATUS ENDPOINTS

### GET /
**Description:** Check API status  
**Response:**
```json
{
  "message": "HR Recruitment System API",
  "status": "running",
  "port": 5001
}
```

### GET /api/health
**Description:** Health check  
**Response:**
```json
{
  "status": "healthy",
  "database": "recruitment_system"
}
```

---

## ERROR HANDLING

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Server Error

Error responses:
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## FRONTEND INTEGRATION GUIDE

### Dashboard Page
```javascript
const dashboardData = await apiGet('/api/dashboard');
const stats = await apiGet('/api/dashboard/stats');
```

### Job Management Page
```javascript
const jobs = await apiGet('/api/jobs');
const newJob = await apiPost('/api/jobs', jobData);
const updated = await apiPut('/api/jobs/1', updateData);
await apiDelete('/api/jobs/1');
```

### Candidates Page
```javascript
const candidates = await apiGet('/api/candidates');
const topCandidates = await apiGet('/api/candidates/top?limit=10');
const candidateDetail = await apiGet('/api/candidates/1');
const newCandidate = await apiPost('/api/candidates', candidateData);
```

### Interview Page
```javascript
const interviews = await apiGet('/api/interviews');
const interviewDetail = await apiGet('/api/interviews/1');
const scheduled = await apiPost('/api/interviews', interviewData);
const updated = await apiPut('/api/interviews/1', updateData);
```

### Evaluation Page
```javascript
const evaluations = await apiGet('/api/evaluation');
const evalDetail = await apiGet('/api/evaluation/1');
const created = await apiPost('/api/evaluation', evalData);
const updated = await apiPut('/api/evaluation/1', updateData);
```

### Selection Page
```javascript
const selections = await apiGet('/api/selection');
const decision = await apiPatch('/api/selection/1', { decision: 'Selected' });
```

### Offer Page
```javascript
const offers = await apiGet('/api/offers');
const offerDetail = await apiGet('/api/offers/1');
const created = await apiPost('/api/offers', offerData);
const updated = await apiPut('/api/offers/1', updateData);
```

---

## PAGINATION & FILTERING

Currently, endpoints return all results. For production, add pagination:
```
GET /api/candidates?page=1&limit=10&status=shortlisted
GET /api/interviews?page=1&limit=20&status=Completed
```

---

## DEPLOYMENT NOTES

1. Set `DATABASE_URL` environment variable
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python -m alembic upgrade head`
4. Start server: `uvicorn backend.main:app --host 0.0.0.0 --port 5002`
5. Frontend configured to call `http://127.0.0.1:5002`

---

## SECURITY CONSIDERATIONS

1. Add JWT authentication
2. Add role-based access control (RBAC)
3. Validate all inputs server-side
4. Use HTTPS in production
5. Add rate limiting
6. Implement CORS properly (currently allows all)
7. Add request logging and monitoring


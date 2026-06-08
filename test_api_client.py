"""
Complete API Test Client for Smart Faculty Recruitment System
Tests all endpoints end-to-end for each page
"""

import requests
import json
from datetime import datetime, date, timedelta
from typing import Dict, Any

class RecruitmentAPIClient:
    """Client for Smart Faculty Recruitment System API"""
    
    def __init__(self, base_url: str = "http://127.0.0.1:5002"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def _print_header(self, text: str):
        """Print formatted header"""
        print(f"\n{'='*70}")
        print(f"  {text}")
        print(f"{'='*70}")
    
    def _print_subheader(self, text: str):
        """Print formatted subheader"""
        print(f"\n{'─'*70}")
        print(f"  {text}")
        print(f"{'─'*70}")
    
    def _print_result(self, method: str, endpoint: str, status: int, success: bool = True):
        """Print request result"""
        status_icon = "✅" if success and status < 400 else "❌"
        print(f"{status_icon} {method:6} {endpoint:40} → {status}")
    
    # ============ DASHBOARD TESTS ============
    def test_dashboard(self):
        """Test Dashboard endpoints"""
        self._print_header("DASHBOARD PAGE")
        
        # Get dashboard metrics
        self._print_subheader("Get Dashboard Metrics")
        res = self.session.get(f"{self.base_url}/api/dashboard")
        self._print_result("GET", "/api/dashboard", res.status_code)
        if res.status_code == 200:
            data = res.json()
            print(f"  Metrics: {len(data.get('metrics', []))} items")
            print(f"  Schedule Rows: {len(data.get('scheduleRows', []))} items")
            print(f"  Timeline Events: {len(data.get('timelineEvents', []))} items")
        
        # Get dashboard stats
        self._print_subheader("Get Dashboard Statistics")
        res = self.session.get(f"{self.base_url}/api/dashboard/stats")
        self._print_result("GET", "/api/dashboard/stats", res.status_code)
        if res.status_code == 200:
            stats = res.json()
            print(f"  Total Candidates: {stats.get('total_candidates')}")
            print(f"  Shortlisted: {stats.get('shortlisted_candidates')}")
            print(f"  Total Jobs: {stats.get('total_jobs')}")
            print(f"  Avg AI Score: {stats.get('avg_ai_score')}%")
    
    # ============ JOB MANAGEMENT TESTS ============
    def test_job_management(self):
        """Test Job Management endpoints"""
        self._print_header("JOB MANAGEMENT PAGE")
        
        # Get all jobs
        self._print_subheader("List All Jobs")
        res = self.session.get(f"{self.base_url}/api/jobs")
        self._print_result("GET", "/api/jobs", res.status_code)
        jobs = res.json() if res.status_code == 200 else []
        print(f"  Total Jobs: {len(jobs)}")
        
        if jobs:
            job_id = jobs[0]['id']
            
            # Get specific job
            self._print_subheader("Get Specific Job")
            res = self.session.get(f"{self.base_url}/api/jobs/{job_id}")
            self._print_result("GET", f"/api/jobs/{job_id}", res.status_code)
        
        # Create new job
        self._print_subheader("Create New Job")
        job_data = {
            "jobTitle": "Associate Professor",
            "department": "School of Mechanical Engineering",
            "specialization": "Thermal Engineering",
            "qualifications": "Ph.D. in Mechanical Engineering",
            "salary": "10,00,000 - 15,00,000",
            "minExperience": "3 years",
            "vacancies": 3,
            "startDate": "2026-06-15",
            "endDate": "2026-08-31",
            "status": "PUBLISHED"
        }
        res = self.session.post(f"{self.base_url}/api/jobs", json=job_data)
        self._print_result("POST", "/api/jobs", res.status_code, res.status_code < 400)
        
        if res.status_code < 400 and jobs:
            # Update job
            self._print_subheader("Update Job")
            update_data = {
                "jobTitle": "Senior Associate Professor",
                "vacancies": 4
            }
            res = self.session.put(f"{self.base_url}/api/jobs/{job_id}", json=update_data)
            self._print_result("PUT", f"/api/jobs/{job_id}", res.status_code)
    
    # ============ CANDIDATES TESTS ============
    def test_candidates(self):
        """Test Candidate Management endpoints"""
        self._print_header("CANDIDATES PAGE")
        
        # Get all candidates
        self._print_subheader("List All Candidates")
        res = self.session.get(f"{self.base_url}/api/candidates")
        self._print_result("GET", "/api/candidates", res.status_code)
        candidates = res.json() if res.status_code == 200 else []
        print(f"  Total Candidates: {len(candidates)}")
        
        # Get top candidates
        self._print_subheader("Get Top Candidates")
        res = self.session.get(f"{self.base_url}/api/candidates/top?limit=5")
        self._print_result("GET", "/api/candidates/top", res.status_code)
        
        if candidates:
            cand_id = candidates[0]['id']
            
            # Get specific candidate
            self._print_subheader("Get Candidate Details")
            res = self.session.get(f"{self.base_url}/api/candidates/{cand_id}")
            self._print_result("GET", f"/api/candidates/{cand_id}", res.status_code)
            if res.status_code == 200:
                cand = res.json()
                print(f"  Name: {cand.get('name')}")
                print(f"  Email: {cand.get('email')}")
                print(f"  Status: {cand.get('status')}")
        
        # Create new candidate
        self._print_subheader("Create New Candidate")
        new_cand = {
            "firstName": "Dr. Robert",
            "lastName": "Williams",
            "email": "robert.williams@example.com",
            "phone": "9999888777",
            "experience": 6.5,
            "qualification": "Ph.D. in Electronics",
            "specialization": "Signal Processing"
        }
        res = self.session.post(f"{self.base_url}/api/candidates", json=new_cand)
        self._print_result("POST", "/api/candidates", res.status_code, res.status_code < 400)
    
    # ============ INTERVIEWS TESTS ============
    def test_interviews(self):
        """Test Interview endpoints"""
        self._print_header("INTERVIEWS PAGE")
        
        # Get all interviews
        self._print_subheader("List All Interviews")
        res = self.session.get(f"{self.base_url}/api/interviews")
        self._print_result("GET", "/api/interviews", res.status_code)
        interviews = res.json() if res.status_code == 200 else []
        print(f"  Total Interviews: {len(interviews)}")
        
        # Get scheduled interviews
        self._print_subheader("Get Scheduled Interviews")
        res = self.session.get(f"{self.base_url}/api/interviews?status=Scheduled")
        self._print_result("GET", "/api/interviews?status=Scheduled", res.status_code)
        
        if interviews:
            interview_id = interviews[0]['id']
            
            # Get specific interview
            self._print_subheader("Get Interview Details")
            res = self.session.get(f"{self.base_url}/api/interviews/{interview_id}")
            self._print_result("GET", f"/api/interviews/{interview_id}", res.status_code)
            if res.status_code == 200:
                interview = res.json()
                print(f"  Type: {interview.get('interview_type')}")
                print(f"  Date: {interview.get('interview_date')}")
                print(f"  Status: {interview.get('status')}")
    
    # ============ EVALUATION TESTS ============
    def test_evaluation(self):
        """Test Evaluation endpoints"""
        self._print_header("EVALUATION PAGE")
        
        # Get all evaluations
        self._print_subheader("List All Evaluations")
        res = self.session.get(f"{self.base_url}/api/evaluation")
        self._print_result("GET", "/api/evaluation", res.status_code)
        evaluations = res.json() if res.status_code == 200 else []
        print(f"  Total Evaluations: {len(evaluations)}")
        
        if evaluations:
            eval_id = evaluations[0]['id']
            
            # Get specific evaluation
            self._print_subheader("Get Evaluation Details")
            res = self.session.get(f"{self.base_url}/api/evaluation/{eval_id}")
            self._print_result("GET", f"/api/evaluation/{eval_id}", res.status_code)
            if res.status_code == 200:
                evaluation = res.json()
                print(f"  AI Score: {evaluation.get('ai_initial_score')}")
                print(f"  Final Score: {evaluation.get('final_score')}")
                print(f"  Determination: {evaluation.get('determination')}")
    
    # ============ SELECTION TESTS ============
    def test_selection(self):
        """Test Selection endpoints"""
        self._print_header("SELECTION PAGE")
        
        # Get selection list
        self._print_subheader("Get Selection List")
        res = self.session.get(f"{self.base_url}/api/selection")
        self._print_result("GET", "/api/selection", res.status_code)
        selections = res.json() if res.status_code == 200 else []
        print(f"  Total Candidates in Selection: {len(selections)}")
        
        if selections:
            for sel in selections[:2]:  # Show first 2
                print(f"    - {sel.get('name')} ({sel.get('type')})")
    
    # ============ OFFER TESTS ============
    def test_offers(self):
        """Test Offer endpoints"""
        self._print_header("OFFER PAGE")
        
        # Get all offers
        self._print_subheader("List All Offers")
        res = self.session.get(f"{self.base_url}/api/offers")
        self._print_result("GET", "/api/offers", res.status_code)
        offers = res.json() if res.status_code == 200 else []
        print(f"  Total Offers: {len(offers)}")
        
        if offers:
            offer_id = offers[0]['id']
            
            # Get specific offer
            self._print_subheader("Get Offer Details")
            res = self.session.get(f"{self.base_url}/api/offers/{offer_id}")
            self._print_result("GET", f"/api/offers/{offer_id}", res.status_code)
            if res.status_code == 200:
                offer = res.json()
                print(f"  Position: {offer.get('offered_position')}")
                print(f"  Salary: {offer.get('offered_salary')}")
                print(f"  Status: {offer.get('offer_status')}")
    
    # ============ ADDITIONAL ENDPOINTS TESTS ============
    def test_additional_endpoints(self):
        """Test additional support endpoints"""
        self._print_header("ADDITIONAL ENDPOINTS")
        
        # Job Applications
        self._print_subheader("Job Applications")
        res = self.session.get(f"{self.base_url}/api/job-applications")
        self._print_result("GET", "/api/job-applications", res.status_code)
        print(f"  Total Applications: {len(res.json() if res.status_code == 200 else [])}")
        
        # Skills
        self._print_subheader("Skills")
        res = self.session.get(f"{self.base_url}/api/skills")
        self._print_result("GET", "/api/skills", res.status_code)
        print(f"  Total Skills: {len(res.json() if res.status_code == 200 else [])}")
        
        # Research Papers
        self._print_subheader("Research Papers")
        res = self.session.get(f"{self.base_url}/api/research-papers")
        self._print_result("GET", "/api/research-papers", res.status_code)
        print(f"  Total Papers: {len(res.json() if res.status_code == 200 else [])}")
        
        # Notifications
        self._print_subheader("Notifications")
        res = self.session.get(f"{self.base_url}/api/notifications")
        self._print_result("GET", "/api/notifications", res.status_code)
        print(f"  Total Notifications: {len(res.json() if res.status_code == 200 else [])}")
    
    # ============ HEALTH CHECK ============
    def test_health(self):
        """Test API health"""
        self._print_header("API HEALTH CHECK")
        
        res = self.session.get(f"{self.base_url}/api/health")
        self._print_result("GET", "/api/health", res.status_code)
        if res.status_code == 200:
            health = res.json()
            print(f"  Status: {health.get('status')}")
            print(f"  Database: {health.get('database')}")
    
    # ============ RUN ALL TESTS ============
    def run_all_tests(self):
        """Run all test suites"""
        print("\n")
        print("╔" + "═"*68 + "╗")
        print("║" + " "*10 + "SMART FACULTY RECRUITMENT SYSTEM API TESTS" + " "*16 + "║")
        print("╚" + "═"*68 + "╝")
        
        self.test_health()
        self.test_dashboard()
        self.test_job_management()
        self.test_candidates()
        self.test_interviews()
        self.test_evaluation()
        self.test_selection()
        self.test_offers()
        self.test_additional_endpoints()
        
        self._print_header("ALL TESTS COMPLETED ✅")
        print("\n")


def main():
    """Main test entry point"""
    client = RecruitmentAPIClient()
    
    try:
        client.run_all_tests()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to API server at http://127.0.0.1:5002")
        print("   Please ensure the backend server is running:")
        print("   $ cd backend")
        print("   $ uvicorn main:app --host 127.0.0.1 --port 5002 --reload")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")


if __name__ == "__main__":
    main()

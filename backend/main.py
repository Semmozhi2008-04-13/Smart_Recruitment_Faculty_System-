from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "hr_portal.db"

app = FastAPI(title="CIT HR Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def connect():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def rows(query, params=()):
    with connect() as connection:
        return [dict(row) for row in connection.execute(query, params).fetchall()]


def execute(query, params=()):
    with connect() as connection:
        cursor = connection.execute(query, params)
        connection.commit()
        return cursor.rowcount


def seed_table(connection, table, columns, values):
    count = connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    if count:
        return

    placeholders = ", ".join(["?"] * len(columns))
    column_list = ", ".join(columns)
    connection.executemany(
        f"INSERT INTO {table} ({column_list}) VALUES ({placeholders})",
        values,
    )


def init_db():
    with connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                initials TEXT NOT NULL,
                department TEXT NOT NULL,
                score INTEGER NOT NULL,
                exp TEXT NOT NULL,
                expYears INTEGER NOT NULL,
                qual TEXT NOT NULL,
                match INTEGER NOT NULL,
                research TEXT NOT NULL,
                researchCount INTEGER NOT NULL,
                status TEXT NOT NULL,
                color TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS selection_candidates (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                initials TEXT NOT NULL,
                type TEXT NOT NULL,
                subType TEXT NOT NULL,
                score INTEGER NOT NULL,
                decision TEXT
            );

            CREATE TABLE IF NOT EXISTS evaluation_candidates (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                initials TEXT NOT NULL,
                aiScore TEXT NOT NULL,
                panelScore TEXT NOT NULL,
                recommendation TEXT NOT NULL,
                finalScore INTEGER NOT NULL,
                status TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS interviews (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                initials TEXT NOT NULL,
                avatarBg TEXT NOT NULL,
                panel TEXT NOT NULL,
                dateTime TEXT NOT NULL,
                venue TEXT NOT NULL,
                status TEXT NOT NULL,
                statusStyle TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS dashboard_metrics (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                value TEXT NOT NULL,
                icon TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS dashboard_schedule (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                initial TEXT NOT NULL,
                avatarBg TEXT NOT NULL,
                status TEXT NOT NULL,
                statusClass TEXT NOT NULL,
                action TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS dashboard_timeline (
                id INTEGER PRIMARY KEY,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                active INTEGER NOT NULL
            );
            """
        )

        seed_table(connection, "candidates", ["name", "initials", "department", "score", "exp", "expYears", "qual", "match", "research", "researchCount", "status", "color"], [
            ("Priya Sharma", "PS", "CSE", 95, "4 yrs", 4, "PhD", 90, "4 papers", 4, "SHORTLISTED", "bg-indigo-100 text-indigo-800"),
            ("Mihona", "M", "IT", 91, "3 yrs", 3, "M.Tech", 90, "2 papers", 2, "SHORTLISTED", "bg-amber-100 text-amber-800"),
            ("Meena", "ME", "ECE", 87, "1 yr", 1, "M.Tech", 80, "2 papers", 2, "SHORTLISTED", "bg-purple-100 text-purple-800"),
            ("Kumar", "K", "CSE", 82, "1 yr", 1, "M.Tech", 80, "1 paper", 1, "SHORTLISTED", "bg-blue-100 text-blue-800"),
            ("Sharma Reeya", "SR", "IT", 79, "0 yrs", 0, "M.Tech", 75, "1 paper", 1, "PENDING", "bg-gray-100 text-gray-800"),
            ("Arun Nair", "AN", "CSE", 76, "2 yrs", 2, "M.Tech", 72, "3 papers", 3, "PENDING", "bg-cyan-100 text-cyan-800"),
            ("Latha Menon", "LM", "ECE", 74, "5 yrs", 5, "PhD", 70, "5 papers", 5, "REVIEW", "bg-emerald-100 text-emerald-800"),
            ("Naveen Raj", "NR", "MECH", 69, "2 yrs", 2, "M.E", 68, "1 paper", 1, "REVIEW", "bg-orange-100 text-orange-800"),
            ("Divya Suresh", "DS", "CSE", 66, "0 yrs", 0, "M.Tech", 64, "0 papers", 0, "REJECTED", "bg-rose-100 text-rose-800"),
            ("Rahul Verma", "RV", "IT", 62, "1 yr", 1, "MCA", 61, "0 papers", 0, "REJECTED", "bg-slate-100 text-slate-800"),
        ])

        seed_table(connection, "selection_candidates", ["id", "name", "initials", "type", "subType", "score", "decision"], [
            (1, "Dr. Mihona", "MS", "Strong", "Recommended", 90, "Selected"),
            (2, "Dr. Meena", "MA", "Strong", "Recommended", 87, None),
            (3, "R. Kumar", "RK", "Strong", "Recommended", 85, None),
            (4, "Dr. Reena", "RS", "Recommended", "", 77, None),
            (5, "Dr. Sharma", "SP", "Recommended", "", 78, None),
            (6, "Dr. Priya", "PK", "Recommended", "", 75, None),
            (7, "Dr. Latha Menon", "LM", "Strong", "Recommended", 88, "Selected"),
            (8, "Dr. Arun Nair", "AN", "Recommended", "", 73, None),
            (9, "Dr. Divya Suresh", "DS", "Not", "Recommended", 61, "Rejected"),
            (10, "Dr. Naveen Raj", "NR", "Recommended", "", 72, None),
            (11, "Dr. Rahul Verma", "RV", "Not", "Recommended", 58, None),
            (12, "Dr. Kavya Iyer", "KI", "Strong", "Recommended", 91, None),
            (13, "Dr. Sahana Rao", "SR", "Recommended", "", 79, None),
            (14, "Dr. Omar Khan", "OK", "Not", "Recommended", 55, "Rejected"),
            (15, "Dr. Akash Balan", "AB", "Strong", "Recommended", 86, None),
            (16, "Dr. Neha Thomas", "NT", "Recommended", "", 76, None),
            (17, "Dr. Charan Dev", "CD", "Recommended", "", 74, None),
            (18, "Dr. Ishita Bose", "IB", "Strong", "Recommended", 89, None),
        ])

        seed_table(connection, "evaluation_candidates", ["id", "name", "initials", "aiScore", "panelScore", "recommendation", "finalScore", "status"], [
            (1, "Dr. Reena Sen", "RS", "92 %", "4.7 /5", "Strong Recommended", 90, "Shortlisted"),
            (2, "Dr. Mihona", "MH", "88 %", "4.3 /5", "Strong Recommended", 90, "Shortlisted"),
            (3, "Dr. Meena", "MN", "83 %", "4.1 /5", "Strong Recommended", 87, "Shortlisted"),
            (4, "R. Kumar", "RK", "80 %", "4.0/5", "Strong Recommended", 85, "Shortlisted"),
            (5, "Dr. Sharma Reeya", "SR", "79 %", "3.8 /5", "Recommended", 78, "Shortlisted"),
            (6, "Dr. Reena", "RN", "78 %", "4.3 /5", "Recommended", 77, "Shortlisted"),
            (7, "Dr. priya sharma", "PS", "75%", "4.7 /5", "Recommended", 66, "Shortlisted"),
            (8, "Dr. Latha Menon", "LM", "82 %", "4.0 /5", "Recommended", 81, "Shortlisted"),
            (9, "Dr. Arun Nair", "AN", "72 %", "3.6 /5", "Recommended", 72, "On Hold"),
            (10, "Dr. Divya Suresh", "DS", "68 %", "3.3 /5", "Review Needed", 68, "On Hold"),
            (11, "Dr. Naveen Raj", "NR", "65 %", "3.1 /5", "Review Needed", 64, "On Hold"),
            (12, "Dr. Kavya Iyer", "KI", "90 %", "4.5 /5", "Strong Recommended", 89, "Shortlisted"),
            (13, "Dr. Sahana Rao", "SR", "77 %", "3.9 /5", "Recommended", 76, "Shortlisted"),
            (14, "Dr. Omar Khan", "OK", "58 %", "2.9 /5", "Not Recommended", 58, "Rejected"),
            (15, "Dr. Akash Balan", "AB", "84 %", "4.2 /5", "Strong Recommended", 84, "Shortlisted"),
        ])

        seed_table(connection, "interviews", ["id", "name", "initials", "avatarBg", "panel", "dateTime", "venue", "status", "statusStyle"], [
            (1, "Dr. Reena Sen", "RS", "bg-[#1a237e] text-[#8690ee]", "Dr. Smith", "May 18, 2026 - 11:30 AM", "Meeting Room - 402", "Shortlisted", "bg-[#eddcff] text-[#5a2a9c]"),
            (2, "Dr. Liam Chen", "LC", "bg-[#705d00] text-white", "Dr. Rao", "May 18, 2026 - 10:00 AM", "Meeting Room - 302", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
            (3, "Dr. Atkin Barne", "AB", "bg-gray-200 text-gray-700", "Dr. Rama", "May 18, 2026 - 09:00 AM", "Meeting Room - 104", "Completed", "bg-[#ffe170] text-[#221b00]"),
            (4, "Dr. Sarah Jenkins", "SJ", "bg-emerald-800 text-emerald-100", "Dr. Smith", "May 19, 2026 - 02:00 PM", "Main Seminar Hall", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
            (5, "Dr. Rajesh Kumar", "RK", "bg-cyan-800 text-cyan-100", "Dr. Anand", "May 19, 2026 - 03:30 PM", "Meeting Room - 201", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
            (6, "Dr. Elena Rostova", "ER", "bg-fuchsia-800 text-fuchsia-100", "Dr. Rao", "May 20, 2026 - 09:30 AM", "Meeting Room - 402", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
            (7, "Dr. David Okafor", "DO", "bg-orange-800 text-orange-100", "Dr. Rama", "May 20, 2026 - 11:00 AM", "Meeting Room - 104", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
            (8, "Dr. Yuki Tanaka", "YT", "bg-teal-800 text-teal-100", "Dr. Anand", "May 20, 2026 - 04:00 PM", "Online - Room 2", "Ongoing", "bg-[#e0e0ff] text-[#343d96]"),
        ])

        seed_table(connection, "dashboard_metrics", ["id", "title", "value", "icon"], [
            (1, "Total Faculty", "245", "group"),
            (2, "Vacancies", "20", "business"),
            (3, "Urgent Hiring", "8", "person_add"),
            (4, "Applications", "62", "description"),
            (5, "Interviews", "12", "groups"),
            (6, "Selections", "5", "auto_awesome"),
        ])
        seed_table(connection, "dashboard_schedule", ["id", "name", "role", "initial", "avatarBg", "status", "statusClass", "action"], [
            (1, "Dr. Atkin Barne", "Professor: CSE", "AT", "bg-orange-100 text-orange-600", "Completed", "bg-green-100 text-green-800", "View Results"),
            (2, "Dr. Liam Chen", "Associate professor: CSE", "LC", "bg-blue-100 text-blue-600", "Shortlisted", "bg-purple-100 text-purple-800", "Evaluate"),
            (3, "Dr. Reena Sen", "Assistant professor: CSE", "RS", "bg-purple-100 text-purple-600", "Pending", "bg-gray-100 text-gray-600", "Evaluate"),
        ])
        seed_table(connection, "dashboard_timeline", ["id", "date", "description", "active"], [
            (1, "Today", "4 Interviews Scheduled", 1),
            (2, "Tuesday, May 19", "Committee Briefing", 0),
            (3, "Wednesday, May 20", "Final Decision Meeting", 0),
            (4, "Thursday, May 22", "Review details", 0),
        ])
        connection.commit()


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/health")
def health():
    return {"ok": True}


# Unifies search bar mapping seamlessly for your React Header
@app.get("/api/search")
def search_system(query: str = Query(..., min_length=1)):
    search_pattern = f"%{query}%"
    return rows(
        """
        SELECT id, name as firstName, '' as lastName, department as email, qual as highestQualification 
        FROM candidates 
        WHERE name LIKE ? OR department LIKE ?
        LIMIT 8
        """, 
        (search_pattern, search_pattern)
    )


@app.get("/api/candidates")
def get_candidates():
    return rows("SELECT * FROM candidates ORDER BY score DESC")


@app.get("/api/selection")
def get_selection():
    return rows("SELECT * FROM selection_candidates ORDER BY score DESC")


@app.patch("/api/selection/{candidate_id}")
def update_selection(candidate_id: int, payload: dict):
    decision = payload.get("decision")
    if decision not in {"Selected", "Rejected", None}:
        raise HTTPException(status_code=400, detail="Invalid decision")
    updated = execute("UPDATE selection_candidates SET decision = ? WHERE id = ?", (decision, candidate_id))
    if not updated:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"ok": True}


@app.get("/api/evaluation")
def get_evaluation():
    return rows("SELECT * FROM evaluation_candidates ORDER BY finalScore DESC")


@app.delete("/api/evaluation/{candidate_id}")
def delete_evaluation(candidate_id: int):
    deleted = execute("DELETE FROM evaluation_candidates WHERE id = ?", (candidate_id,))
    if not deleted:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"ok": True}


@app.get("/api/interviews")
def get_interviews():
    return rows("SELECT * FROM interviews ORDER BY id")


@app.delete("/api/interviews/{interview_id}")
def delete_interview(interview_id: int):
    deleted = execute("DELETE FROM interviews WHERE id = ?", (interview_id,))
    if not deleted:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"ok": True}


@app.get("/api/dashboard")
def get_dashboard():
    return {
        "metrics": rows("SELECT * FROM dashboard_metrics ORDER BY id"),
        "scheduleRows": rows("SELECT * FROM dashboard_schedule ORDER BY id"),
        "timelineEvents": rows("SELECT id, date, description, active FROM dashboard_timeline ORDER BY id"),
    }
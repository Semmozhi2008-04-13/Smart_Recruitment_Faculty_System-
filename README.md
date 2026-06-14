# 🎓 Smart Recruitment Faculty System
### ERP for Faculty Hiring

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://python.org)
[![Django Version](https://img.shields.io/badge/django-4.2-green)](https://djangoproject.com)
[![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow)](https://javascript.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)
[![Internship Project](https://img.shields.io/badge/CIT--BIF-Internship%20Project-purple)](https://www.citbif.com)

---

## 📌 Overview

The **Smart Recruitment Faculty System** is an ERP-style web application designed to automate and streamline the faculty recruitment process for educational institutions. Developed during an internship project at **CIT-BIF** (Chennai Institute of Technology Business Incubation Forum), this system digitizes the entire hiring lifecycle—from initial job requisitions and applicant tracking to multi-round interview scheduling and final selections.

By replacing manual, paper-based workflows with a centralized digital ecosystem, the platform significantly reduces hiring turnaround times, improves procedural transparency, and provides real-time recruitment analytics for HR departments and academic leadership.

---

## 🎯 Key Features

| Feature Category | Capabilities |
| :--- | :--- |
| **Job Requisition Management** | Create, approve, and publish faculty positions; clearly define qualifications, target departments, and open vacancy counts. |
| **Applicant Tracking System (ATS)** | Seamless application submission, automated resume/CV parsing, profile builders, and real-time application status tracking. |
| **Interview Workflow** | Coordinate multiple structured interview stages (Technical, HR, Dean), assign distinct interview panels, and dispatch automated calendar invites. |
| **Multi-role Dashboard** | Customized, role-specific portal views tailored for HR Admins, Department Heads, Interviewers, and Candidates. |
| **Email Notifications** | Automated trigger alerts for application status confirmations, interview updates, and automated offer letter deliveries. |
| **Analytics & Reports** | Actionable HR metrics tracking time-to-hire, cost-per-hire, candidate pipelines, and comprehensive institutional demographic breakdowns. |
| **Document Management** | Centralized, secure storage system for resumes, academic certificates, research publications, and supporting background checks. |
| **Feedback System** | Structured evaluation scorecards with objective scoring rubrics and comment sections for cross-interviewer consensus. |

---

## 🧱 Architecture

The system utilizes a modular, service-oriented architecture designed to handle high concurrency and isolate core business operations:

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│               (React/HTML/CSS/JavaScript UI)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Portal                      │
│                (Node.js/Express - Routing)                  │
└─────────┬──────────────┬──────────────┬─────────────────────┘
          │              │              │
          ▼              ▼              ▼
    ┌─────────────┐┌─────────────┐┌─────────────┐
    │   Django    ││  Interview  ││ Interviewer │
    │   Backend   ││   Recruit   ││   Backend   │
    │  (Core ERP) ││   Module    ││   Portal    │
    └──────┬──────┘└──────┬──────┘└──────┬──────┘
           │              │              │
           └──────────────┼──────────────┘
                          ▼
                  ┌─────────────────┐
                  │    Database     │
                  │  (PostgreSQL/   │
                  │     MySQL)      │
                  └─────────────────┘

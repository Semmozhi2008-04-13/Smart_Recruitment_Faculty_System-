@echo off
echo Starting Django Backend Server on port 5002...
call venv\Scripts\activate
python manage.py runserver 127.0.0.1:5002

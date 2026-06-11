from flask import Flask, jsonify, redirect, url_for, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configure your PostgreSQL Connection String
# Format: postgresql://username:password@localhost:port/database_name
# Dbngin default username is usually 'postgres' with no password, running on port 5432
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Model that maps directly to your existing TablePlus table
class InterviewTable(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Map the columns exactly as they are named in TablePlus
    candidate_name = db.Column(db.String(255))
    job_title = db.Column(db.String(255))
    dept=db.Column(db.String(150))
    interview_time = db.Column(db.DateTime)
    status = db.Column(db.String(50))


class EvaluationTable(db.Model):
    __tablename__ = 'evaluations'

    id = db.Column(db.Integer, primary_key=True)
    candidate_name = db.Column(db.String(255))
    job_title = db.Column(db.String(255))
    dept=db.Column(db.String(150))
    venue=db.Column(db.String(150))
    status = db.Column(db.String(50))

    # Core Individual 6 Criteria Scores
    subject_knowledge = db.Column(db.Integer, nullable=False)
    teaching_ability = db.Column(db.Integer, nullable=False)
    communication_skills = db.Column(db.Integer, nullable=False)
    research_aptitude = db.Column(db.Integer, nullable=False)
    problem_solving = db.Column(db.Integer, nullable=False)
    confidence_presentation = db.Column(db.Integer, nullable=False)

    # Aggregated Summary and Long Text Fields
    final_score = db.Column(db.Float, nullable=False) # 2-decimal calculated average
    observations = db.Column(db.Text, nullable=True)
    strengths = db.Column(db.Text, nullable=True)
    improvement = db.Column(db.Text, nullable=True)
    recommendation = db.Column(db.String(50), nullable=False)


    def to_dict(self):
        return {
            "id": self.id,
            "candidate_name": self.candidate_name,
            "dept": self.dept,
            "job_title":self.job_title,
            "venue":self.venue,
            "status":self.status,

            "subject_knowledge": self.subject_knowledge,
            "teaching_ability": self.teaching_ability,
            "communication_skills": self.communication_skills,
            "research_aptitude": self.research_aptitude,
            "problem_solving": self.problem_solving,
            "confidence_presentation": self.confidence_presentation,

            "final_score": self.final_score,
            "observations": self.observations,
            "strengths": self.strengths,
            "improvement": self.improvement,
            "recommendation": self.recommendation
        }

with app.app_context():
    db.create_all()


@app.route('/api/interviews', methods=['GET'])
def get_interviews_dashboard():
    try:
        db_records = InterviewTable.query.all() 
        
        live_interviews = []
        for record in db_records:
            live_interviews.append({
                "candidate_name": record.candidate_name,
                "job_title": record.job_title,
                "dept": record.dept,
                "interview_time": str(record.interview_time),
                "status": record.status
            })
            
        return jsonify(live_interviews)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/submit-indiv-evaluation', methods=['POST'])
def submit_evaluation():
    data = request.json
    if not data:
        return jsonify({"error": "Missing evaluation data payload"}), 400

    try:
        # A. Create and map the new detailed evaluation scorecard row
        new_eval = EvaluationTable(
            candidate_name=data.get('candidate_name'),
            job_title=data.get('job_title'),
            dept=data.get('dept'),
            venue=data.get('venue'),
            status=data.get('status'),

            subject_knowledge=data.get('subject_knowledge'),
            teaching_ability=data.get('teaching_ability'),
            communication_skills=data.get('communication_skills'),
            research_aptitude=data.get('research_aptitude'),
            problem_solving=data.get('problem_solving'),
            confidence_presentation=data.get('confidence_presentation'),

            final_score=data.get('final_score'),
            observations=data.get('observations'),
            strengths=data.get('strengths'),
            improvement=data.get('improvement'),
            recommendation=data.get('recommendation')
        )
        db.session.add(new_eval)

        # B. Linkage Update: Find candidate in 'interviews' table by name and change status to 'Completed'
        candidate_name = data.get('candidate_name')
        scheduled_interview = InterviewTable.query.filter_by(candidate_name=candidate_name).first()
        if scheduled_interview:
            scheduled_interview.status = "Completed"

        # C. Commit changes to PostgreSQL
        db.session.commit()
        return jsonify({"message": "Evaluation recorded and dashboard schedule status updated!"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Submission Error: {str(e)}")
        return jsonify({"error": f"Failed to save evaluation: {str(e)}"}), 500
    

@app.route('/api/evaluations', methods=['GET'])
def get_evaluations():
    try:
        all_evals = EvaluationTable.query.all()
        return jsonify([eval_item.to_dict() for eval_item in all_evals]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/')
def home():
    return redirect(url_for('get_interviews_dashboard'))


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5002, debug=True)
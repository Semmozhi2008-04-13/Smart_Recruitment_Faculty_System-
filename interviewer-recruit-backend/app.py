# In your Flask app.py
from flask import Flask
from flask_cors import CORS

print("Starting Flask application...")

app = Flask(__name__)

# Update this to specifically include the Interviewer port
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5174"}})

# can add more later

if __name__ == '__main__':
    print("Server is starting on port 5001...")
    app.run(debug=True, port=5001)

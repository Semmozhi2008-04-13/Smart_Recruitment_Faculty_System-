import psycopg2
try:
    conn = psycopg2.connect(dbname="your_db", user="postgres", password="your_password", host="127.0.0.1", port="5432")
    print("Successfully connected!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
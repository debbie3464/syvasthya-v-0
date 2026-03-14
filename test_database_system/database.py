import sqlite3

DB_NAME = "syvasthyas.db"


def init_db():

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_details (
        patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        age INTEGER,
        gender TEXT,
        blood_group TEXT,
        existing_conditions TEXT,
        current_medications TEXT,
        post_anonymously_default BOOLEAN
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctor_details (
        doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        medical_license_number TEXT,
        specialization TEXT,
        years_of_experience INTEGER,
        qualification TEXT,
        hospital_affiliation TEXT,
        short_bio TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        content TEXT,
        ai_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        doctor_id INTEGER,
        comment_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()
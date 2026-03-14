# view_db.py

import sqlite3

DB_NAME = "syvasthyas.db"


def print_table(title, columns, rows):

    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

    # print column headers
    header = ""
    for col in columns:
        header += f"{col:<20}"
    print(header)

    print("-" * 60)

    # print rows
    for row in rows:
        row_str = ""
        for item in row:
            row_str += f"{str(item):<20}"
        print(row_str)

    print()


def view_patient_details(cursor):

    cursor.execute("""
    SELECT patient_id, name, email, age, gender, blood_group
    FROM patient_details
    """)

    rows = cursor.fetchall()

    columns = [
        "patient_id",
        "name",
        "email",
        "age",
        "gender",
        "blood_group"
    ]

    print_table("PATIENT DETAILS TABLE", columns, rows)


def view_doctor_details(cursor):

    cursor.execute("""
    SELECT doctor_id, name, email, specialization, years_of_experience
    FROM doctor_details
    """)

    rows = cursor.fetchall()

    columns = [
        "doctor_id",
        "name",
        "email",
        "specialization",
        "experience"
    ]

    print_table("DOCTOR DETAILS TABLE", columns, rows)


def view_posts(cursor):

    cursor.execute("""
    SELECT post_id, patient_id, content
    FROM posts
    """)

    rows = cursor.fetchall()

    columns = [
        "post_id",
        "patient_id",
        "content"
    ]

    print_table("PATIENT POSTS TABLE", columns, rows)


def main():

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    view_patient_details(cursor)
    view_doctor_details(cursor)
    view_posts(cursor)

    conn.close()


if __name__ == "__main__":
    main()
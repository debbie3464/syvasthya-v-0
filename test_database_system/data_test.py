# data_test.py

# Mock databases
patients_db = {}
doctors_db = {}
posts_patient = {}

# simple ID counters
patient_counter = 1
doctor_counter = 1
post_counter = 1


def add_patient(patient_data):
    global patient_counter
    patient_id = patient_counter
    patient_data["patient_id"] = patient_id

    patients_db[patient_id] = patient_data
    patient_counter += 1

    return patient_id


def add_doctor(doctor_data):
    global doctor_counter
    doctor_id = doctor_counter
    doctor_data["doctor_id"] = doctor_id

    doctors_db[doctor_id] = doctor_data
    doctor_counter += 1

    return doctor_id


def add_post(patient_id, content):
    global post_counter

    post = {
        "post_id": post_counter,
        "patient_id": patient_id,
        "content": content
    }

    posts_patient[post_counter] = post
    post_counter += 1

    return post


def show_posts():
    if not posts_patient:
        print("\nNo posts yet.\n")
        return

    print("\n--- Patient Posts ---")
    for post in posts_patient.values():
        print(f"\nPost ID: {post['post_id']}")
        print(f"Patient ID: {post['patient_id']}")
        print(f"Content: {post['content']}")
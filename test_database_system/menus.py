# menus.py

def patient_signup():
    print("\n--- Patient Sign Up ---")

    patient = {
        "name": input("Name: "),
        "email": input("Email: "),
        "age": input("Age: "),
        "gender": input("Gender: "),
        "blood_group": input("Blood Group: "),
        "existing_conditions": input("Existing Conditions: "),
        "current_medications": input("Current Medications: "),
        "post_anonymously_default": False
    }

    toggle = input("Post anonymously by default? (y/n): ").lower()
    if toggle == "y":
        patient["post_anonymously_default"] = True

    return patient


def doctor_signup():
    print("\n--- Doctor Verification ---")

    doctor = {
        "name": input("Name: "),
        "email": input("Email: "),
        "medical_license_number": input("Medical License Number: "),
        "specialization": input("Specialization: "),
        "years_of_experience": input("Years of Experience: "),
        "qualification": input("Qualification: "),
        "hospital_affiliation": input("Hospital Affiliation: "),
        "short_bio": input("Short Bio: ")
    }

    return doctor
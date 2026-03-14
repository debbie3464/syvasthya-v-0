# main.py

from menus import patient_signup, doctor_signup
from database import add_patient, add_doctor, add_post, show_posts
from database import init_db


def patient_dashboard(patient_id):

    while True:
        print("\n--- Patient Dashboard ---")
        print("1. Create Post")
        print("2. View All Posts")
        print("3. Logout")

        choice = input("Select option: ")

        if choice == "1":
            content = input("\nDescribe your symptoms: ")
            add_post(patient_id, content)

            print("\nPost created successfully.")

        elif choice == "2":
            show_posts()

        elif choice == "3":
            print("Logging out...\n")
            break

        else:
            print("Invalid choice.")


def main():

    init_db()   # automatically creates tables if missing 

    while True:
        print("\n===== Syvasthyas CLI =====")
        print("1. Patient Sign Up")
        print("2. Doctor Sign Up")
        print("3. Exit")

        choice = input("Choose option: ")

        if choice == "1":

            patient_data = patient_signup()

            patient_id = add_patient(patient_data)

            print(f"\nPatient registered successfully. ID = {patient_id}")

            patient_dashboard(patient_id)

        elif choice == "2":

            doctor_data = doctor_signup()

            doctor_id = add_doctor(doctor_data)

            print(f"\nDoctor registered successfully. ID = {doctor_id}")

        elif choice == "3":

            print("Exiting Syvasthyas CLI.")
            break

        else:
            print("Invalid option.")


if __name__ == "__main__":
    main()
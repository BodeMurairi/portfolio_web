#!/usr/bin/env python3

from datetime import datetime
import requests

def update_education(education_id, institution, institution_url, degree, field_of_study, start_date, end_date):
    url = f'http://localhost:8000/admin-education/update/{education_id}'    
    
    data = {
        'institution_name': institution,
        "institution_url": institution_url,
        'degree': degree,
        'description': field_of_study,
        'start_date': start_date,
        'end_date': end_date
    }
    response = requests.put(url, json=data)
    return response.json()

if __name__ == "__main__":
    education_id = "86be27a9"
    institution = "Updated University"
    institution_url = "https://www.updateduniversity.edu"
    degree = "Master of Science in Computer Science"
    field_of_study = "Focus on Artificial Intelligence and Machine Learning"
    start_date = datetime(2020, 9, 1).isoformat()
    end_date = datetime(2022, 6, 30).isoformat()

    result = update_education(education_id, institution, institution_url, degree, field_of_study, start_date, end_date)
    print(result)

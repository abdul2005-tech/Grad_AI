import google.generativeai as genai
import os

# Load API key from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def get_ai_advice(data):

    prompt = f"""
    A student is predicted to NOT get placement.

    Student Details:
    Age: {data['Age']}
    Gender: {data['Gender']}
    Degree: {data['Degree']}
    Branch: {data['Branch']}
    CGPA: {data['CGPA']}
    Internships: {data['Internships']}
    Projects: {data['Projects']}
    Coding Skills: {data['Coding_Skills']}
    Communication Skills: {data['Communication_Skills']}
    Aptitude Score: {data['Aptitude_Test_Score']}
    Soft Skills: {data['Soft_Skills_Rating']}
    Certifications: {data['Certifications']}
    Backlogs: {data['Backlogs']}

    Give clear actionable advice to improve placement chances.
    """

    response = model.generate_content(prompt)
    return response.text
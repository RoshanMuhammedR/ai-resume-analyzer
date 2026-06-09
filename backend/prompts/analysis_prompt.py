from schemas.request import AnalyzeRequest

from schemas.request import AnalyzeRequest


def build_analysis_prompt(payload: AnalyzeRequest) -> str:
    return f"""
You are an expert technical recruiter and resume reviewer.

Analyze the resume against the job description.

Return ONLY valid JSON with this structure:

{{
  "match_score": 0,
  "matching_skills": [],
  "missing_skills": [],
  "suggestions": []
}}

Rules:
- match_score must be an integer between 0 and 100.
- matching_skills should include skills present in both resume and job description.
- missing_skills should include important job skills not clearly found in the resume.
- suggestions should be practical resume improvement suggestions.
- Do not include markdown.
- Do not include explanation outside JSON.

Resume:
{payload.resume_text}

Job Description:
{payload.job_description}
"""
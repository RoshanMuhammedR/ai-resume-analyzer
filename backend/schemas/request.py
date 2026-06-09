from pydantic import BaseModel,Field

class AnalyzeRequest(BaseModel):
    resume_text: str = Field(min_length=20)
    job_description: str = Field(min_length=20)
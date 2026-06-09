from pydantic import BaseModel, Field


class AnalyzeResponse(BaseModel):
    match_score: int = Field(ge=0, le=100)
    matching_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
from fastapi import APIRouter, HTTPException, status

from schemas.request import AnalyzeRequest
from schemas.response import AnalyzeResponse
from services.analyzer import ResumeAnalyzer
from services.gemini import GeminiAnalysisError
from utils.logger import logger


router = APIRouter(tags=["Analyze"])

analyzer = ResumeAnalyzer()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_resume(payload: AnalyzeRequest):
    try:
        logger.info("Analyze request received")
        response = analyzer.analyze(payload)
        logger.info("Analyze response returned")
        return response

    except GeminiAnalysisError as error:
        logger.error("Analyze request failed: %s", error)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze resume",
        )
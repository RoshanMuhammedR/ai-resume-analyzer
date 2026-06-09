from prompts.analysis_prompt import build_analysis_prompt
from schemas.request import AnalyzeRequest
from schemas.response import AnalyzeResponse
from services.gemini import GeminiClient
from utils.logger import logger


class ResumeAnalyzer:
    def __init__(self):
        self.gemini_client = GeminiClient()

    def analyze(self, payload: AnalyzeRequest) -> AnalyzeResponse:
        logger.info("Building analysis prompt")

        prompt = build_analysis_prompt(payload)

        return self.gemini_client.analyze(prompt)
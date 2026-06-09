import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import ValidationError

from schemas.response import AnalyzeResponse
from utils.logger import logger

load_dotenv()


class GeminiAnalysisError(Exception):
    pass


class GeminiClient:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

        if not api_key:
            raise GeminiAnalysisError("GEMINI_API_KEY is not configured")

        self.client = genai.Client(api_key=api_key)

    def analyze(self, prompt: str) -> AnalyzeResponse:
        try:
            logger.info("Gemini call started")

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AnalyzeResponse,
                    temperature=0.2,
                ),
            )

            logger.info("Gemini call completed")

            if not response.text:
                raise GeminiAnalysisError("Gemini returned empty response")

            return AnalyzeResponse.model_validate_json(response.text)

        except ValidationError as error:
            logger.error("Gemini response validation failed: %s", error)
            raise GeminiAnalysisError("Invalid response format from Gemini")

        except Exception as error:
            logger.error("Gemini analysis failed: %s", error)
            raise GeminiAnalysisError("Failed to analyze resume")

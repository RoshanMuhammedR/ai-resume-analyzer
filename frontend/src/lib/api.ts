import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/_/backend"
    : "http://127.0.0.1:8000");

export type AnalyzeRequest = {
  resume_text: string;
  job_description: string;
};

export type AnalyzeResponse = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  suggestions: string[];
};

export async function analyzeResume(payload: AnalyzeRequest) {
  const response = await axios.post<AnalyzeResponse>(
    `${API_BASE_URL}/analyze`,
    payload
  );

  return response.data;
}
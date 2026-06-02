import os
import json
from openai import AsyncOpenAI
from app.schemas import ReviewResponse, Issue
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are an expert code reviewer with deep knowledge of software engineering best practices.
Analyze the provided code and return a JSON response with the following structure:
{
  "quality_score": <integer 0-100>,
  "summary": "<brief overall assessment>",
  "issues": [
    {
      "type": "<bug|improvement|warning>",
      "line": "<line number or range, e.g. '12' or '5-8'>",
      "description": "<what the issue is>",
      "suggestion": "<how to fix it>"
    }
  ],
  "strengths": ["<positive aspect 1>", "<positive aspect 2>"],
  "refactored_snippet": "<improved version of the most critical part or the full code if short>"
}
Return ONLY valid JSON, no markdown, no explanation outside the JSON."""


async def analyze_code(code: str, language: str) -> ReviewResponse:
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Language: {language}\n\nCode to review:\n```{language}\n{code}\n```"}
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)

    return ReviewResponse(
        quality_score=data["quality_score"],
        summary=data["summary"],
        issues=[Issue(**i) for i in data.get("issues", [])],
        strengths=data.get("strengths", []),
        refactored_snippet=data.get("refactored_snippet", "")
    )

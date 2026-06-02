import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """You are an expert code reviewer with deep knowledge of software engineering best practices, security, and clean code principles.

Analyze the provided code and return a JSON object with this exact structure:
{
  "quality_score": <integer 0-100>,
  "bugs": [<list of bug descriptions as strings>],
  "improvements": [<list of improvement suggestions as strings>],
  "security_issues": [<list of security concerns as strings>],
  "summary": "<overall summary string>",
  "refactored_snippet": "<optional refactored version of the most critical part, or null>"
}

Be specific, actionable, and concise. Return ONLY the JSON object, no markdown, no extra text."""

async def analyze_code(code: str, language: str) -> dict:
    prompt = f"Language: {language}\n\nCode to review:\n```{language}\n{code}\n```"

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1500
    )

    content = response.choices[0].message.content.strip()
    
    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        import re
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise ValueError("Failed to parse response as JSON")

    return result
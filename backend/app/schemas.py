from pydantic import BaseModel

class ReviewResponse(BaseModel):
    quality_score: int
    bugs: list[str]
    improvements: list[str]
    security_issues: list[str]
    summary: str
    refactored_snippet: str | None = None
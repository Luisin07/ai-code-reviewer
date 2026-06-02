from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.openai_service import analyze_code

router = APIRouter()

class CodeReviewRequest(BaseModel):
    code: str
    language: str

class CodeReviewResponse(BaseModel):
    quality_score: int
    bugs: list[str]
    improvements: list[str]
    security_issues: list[str]
    summary: str
    refactored_snippet: str | None = None

@router.post("/review", response_model=CodeReviewResponse)
async def review_code(request: CodeReviewRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    if len(request.code) > 5000:
        raise HTTPException(status_code=400, detail="Code too long. Max 5000 characters.")

    result = await analyze_code(request.code, request.language)
    return result

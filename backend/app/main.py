from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import review

app = FastAPI(
    title="AI Code Reviewer",
    description="AI-powered code review tool using OpenAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(review.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}

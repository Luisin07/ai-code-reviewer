# AI Code Reviewer

AI-powered code review tool that analyzes JavaScript, TypeScript and Python code for bugs, improvements and quality score.

Built with **Next.js 14** · **FastAPI** · **GPT-4o** · **TypeScript**

---

## Features

- **Multi-language support** — JavaScript, TypeScript, and Python
- **Quality score** — 0–100 rating with visual ring indicator
- **Issue detection** — bugs, warnings, and improvement suggestions with line references
- **Refactored output** — AI-generated improved version of your code
- **Strengths analysis** — highlights what's done well
- **Syntax highlighting** — CodeMirror editor with One Dark theme

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, CodeMirror |
| Backend | FastAPI, Python 3.11, Pydantic v2 |
| AI | OpenAI GPT-4o (`response_format: json_object`) |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your OPENAI_API_KEY to .env

uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

App runs at `http://localhost:3000`

---

## API

### `POST /api/review`

**Request:**
```json
{
  "code": "function add(a, b) { return a + b }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "quality_score": 72,
  "summary": "Clean and readable function, missing type safety and edge case handling.",
  "issues": [
    {
      "type": "improvement",
      "line": "1",
      "description": "No input validation for non-numeric types",
      "suggestion": "Add type checks or use TypeScript"
    }
  ],
  "strengths": ["Simple and readable", "Single responsibility"],
  "refactored_snippet": "function add(a: number, b: number): number {\n  return a + b;\n}"
}
```

---

## Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS
│   │   ├── schemas.py       # Pydantic models
│   │   ├── routes/
│   │   │   └── review.py    # POST /api/review
│   │   └── services/
│   │       └── openai_service.py  # GPT-4o integration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Main UI
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ScoreRing.tsx
│   │   │   └── IssueCard.tsx
│   │   ├── lib/
│   │   │   └── api.ts       # API client
│   │   └── types/
│   │       └── index.ts
│   └── package.json
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Roadmap

- [ ] GitHub integration — review PRs directly
- [ ] History — save and compare reviews over time
- [ ] GitHub Actions integration — automated review on push
- [ ] Support for more languages (Go, Rust, Java)
- [ ] VS Code extension

---

## License

MIT

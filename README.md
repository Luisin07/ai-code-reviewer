# 🔍 AI Code Reviewer

AI-powered code review tool that analyzes **JavaScript**, **TypeScript**, and **Python** code for bugs, security issues, improvements, and quality score.

Built with **Next.js 14** · **FastAPI** · **Groq LLaMA 3.3 70B** · **TypeScript**

---

## ✨ Features

- **Quality Score** — 0–100 rating with animated visual ring indicator
- **Bug Detection** — identifies logic errors and runtime issues
- **Security Analysis** — flags SQL injection, XSS, unsafe patterns
- **Improvement Suggestions** — clean code, performance, best practices
- **Diff Viewer** — side-by-side comparison of original vs refactored code
- **Review History** — tabbed navigation with score indicators per session
- **PDF Export** — styled report with all findings, ready to share with clients
- **Monaco Editor** — full syntax highlighting (same engine as VS Code)
- **Multi-language** — JavaScript, TypeScript, and Python support
- **CI/CD** — GitHub Actions for automated type check and syntax validation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Monaco Editor |
| Backend | FastAPI, Python 3.11, Pydantic |
| AI | Groq API — LLaMA 3.3 70B |
| CI | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env (Groq key goes here)
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

App runs at `http://localhost:3000`

---

## 🔌 API

### `POST /api/review`

**Request:**
```json
{
  "code": "def get_user(id): query = 'SELECT * FROM users WHERE id = ' + id",
  "language": "python"
}
```

**Response:**
```json
{
  "quality_score": 20,
  "summary": "Code has critical security issues including SQL injection vulnerability.",
  "bugs": [
    "No error handling for database connection"
  ],
  "security_issues": [
    "SQL injection vulnerability due to string concatenation in query"
  ],
  "improvements": [
    "Use parameterized queries to prevent SQL injection",
    "Add error handling for database operations"
  ],
  "refactored_snippet": "def get_user(user_id):\n    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))\n    return cursor.fetchone()"
}
```

---

## 📁 Project Structure
ai-code-reviewer/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app + CORS
│   │   ├── schemas.py               # Pydantic models
│   │   ├── routes/
│   │   │   └── review.py            # POST /api/review
│   │   └── services/
│   │       └── openai_service.py    # Groq LLaMA integration
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Main UI with history tabs
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ReviewResults.tsx    # Results display
│   │   │   ├── ScoreRing.tsx        # Animated score ring
│   │   │   ├── DiffViewer.tsx       # Side-by-side diff
│   │   │   └── ExportButton.tsx     # PDF export
│   │   └── lib/
│   │       └── api.ts               # API client
│   ├── package.json
│   └── tailwind.config.ts
└── .github/
└── workflows/
└── ci.yml

---

## 🗺 Roadmap

- [ ] GitHub integration — review PRs directly from a URL
- [ ] Persistent history — save reviews across sessions
- [ ] GitHub Actions integration — automated review on push
- [ ] Support for more languages (Go, Rust, Java)
- [ ] VS Code extension

---

## 📄 License

MIT
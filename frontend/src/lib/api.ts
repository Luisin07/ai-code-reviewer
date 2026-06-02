export interface ReviewRequest {
  code: string;
  language: string;
}

export interface ReviewResponse {
  quality_score: number;
  bugs: string[];
  improvements: string[];
  security_issues: string[];
  summary: string;
  refactored_snippet?: string | null;
}

export async function reviewCode(data: ReviewRequest): Promise<ReviewResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to analyze code");
  }

  return res.json();
}
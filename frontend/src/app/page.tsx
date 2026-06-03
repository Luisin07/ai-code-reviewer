"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ReviewResults } from "@/components/ReviewResults";
import { reviewCode, ReviewResponse } from "@/lib/api";
import { Loader2, Zap, Github, X } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
];

const PLACEHOLDER: Record<string, string> = {
  javascript: `function fetchUser(id) {\n  var data = null;\n  fetch('/api/users/' + id).then(function(res) {\n    data = res.json();\n  });\n  return data;\n}`,
  typescript: `async function getUser(id: string) {\n  const res = await fetch(\`/api/users/\${id}\`);\n  const data = await res.json();\n  return data;\n}`,
  python: `def get_user(user_id):\n    import sqlite3\n    conn = sqlite3.connect('db.sqlite')\n    cursor = conn.cursor()\n    query = "SELECT * FROM users WHERE id = " + str(user_id)\n    cursor.execute(query)\n    return cursor.fetchone()`,
  php: `<?php\nfunction getUser($userId) {\n    $conn = mysql_connect('localhost', 'root', '');\n    mysql_select_db('myapp');\n    $query = "SELECT * FROM users WHERE id = " . $userId;\n    $result = mysql_query($query);\n    return mysql_fetch_array($result);\n}\n?>`,
};

interface HistoryItem {
  id: string;
  language: string;
  score: number;
  result: ReviewResponse;
  timestamp: Date;
  codeSnippet: string;
  code: string;
}

const SCORE_COLOR = (score: number) =>
  score >= 80 ? "#00ff88" : score >= 60 ? "#ffaa00" : "#ff4466";

export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(PLACEHOLDER.javascript);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  async function handleReview() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reviewCode({ code, language });
      const newItem: HistoryItem = {
  id: Date.now().toString(),
  language,
  score: data.quality_score,
  result: data,
  timestamp: new Date(),
  codeSnippet: code.slice(0, 60) + (code.length > 60 ? "..." : ""),
  code: code,
};
      setHistory((prev) => [newItem, ...prev].slice(0, 10));
      setActiveTab(newItem.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function removeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeTab === id) {
      const remaining = history.filter((h) => h.id !== id);
      setActiveTab(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  const activeResult = history.find((h) => h.id === activeTab);

  return (
    <main className="relative min-h-screen z-10">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-60" />

      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">

        {/* Header */}
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-accent" />
              <span className="text-xs font-mono text-[#00ff88] tracking-widest uppercase">v1.1.0 — Live</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#e2e2f0]">
              AI Code<br />
              <span className="text-[#00ff88]">Reviewer</span>
            </h1>
            <p className="mt-2 text-[#8888aa] text-sm max-w-sm">
              Paste your code. Get instant AI-powered analysis: bugs, security issues, improvements and a quality score.
            </p>
          </div>

        <a
          href="https://github.com/Luisin07/ai-code-reviewer"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1e1e2e] bg-[#111118] text-[#8888aa] hover:text-[#00ff88] hover:border-[#00ff88] transition-all text-sm font-mono"
          >
            <Github size={16} />
            GitHub
          </a>
        </header>

        {/* Editor Card */}
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#111118] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e1e2e] bg-[#0d0d14]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff4466] opacity-70" />
              <span className="w-3 h-3 rounded-full bg-[#ffaa00] opacity-70" />
              <span className="w-3 h-3 rounded-full bg-[#00ff88] opacity-70" />
            </div>
            <div className="flex rounded-lg overflow-hidden border border-[#1e1e2e]">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setLanguage(lang.value);
                    setCode(PLACEHOLDER[lang.value]);
                  }}
                  className={`px-4 py-1.5 text-xs font-mono transition-all ${
                    language === lang.value
                      ? "bg-[#00ff88] text-[#0a0a0f] font-semibold"
                      : "text-[#8888aa] hover:text-[#e2e2f0] bg-transparent"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px]">
            <MonacoEditor
              height="300px"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
              }}
            />
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e1e2e] bg-[#0d0d14]">
            <span className="text-xs font-mono text-[#4a4a6a]">
              {code.length} chars · {code.split("\n").length} lines
            </span>
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#00ff88] text-[#0a0a0f] font-semibold text-sm hover:bg-[#00cc6a] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Zap size={16} /> Review Code</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[#ff4466]/30 bg-[#ff4466]/10 px-5 py-4 text-sm text-[#ff4466]">
            {error}
          </div>
        )}

        {/* History Tabs + Results */}
        {history.length > 0 && (
          <div className="flex flex-col gap-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0 scrollbar-hide">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-t border-l border-r text-xs font-mono whitespace-nowrap transition-all ${
                    activeTab === item.id
                      ? "bg-[#111118] border-[#1e1e2e] text-[#e2e2f0]"
                      : "bg-[#0d0d14] border-transparent text-[#4a4a6a] hover:text-[#8888aa]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: SCORE_COLOR(item.score) }}
                  />
                  <span>{item.language}</span>
                  <span style={{ color: SCORE_COLOR(item.score) }}>{item.score}</span>
                  <X
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-[#ff4466]"
                    onClick={(e) => removeTab(item.id, e)}
                  />
                </button>
              ))}
            </div>

            {/* Active Result */}
            {activeResult && (
              <div className="border border-[#1e1e2e] rounded-b-2xl rounded-tr-2xl bg-[#111118] p-6">
                <div className="mb-4 pb-3 border-b border-[#1e1e2e]">
                  <p className="text-xs font-mono text-[#4a4a6a]">
                    {activeResult.timestamp.toLocaleTimeString()} · {activeResult.language} ·{" "}
                    <span style={{ color: SCORE_COLOR(activeResult.score) }}>
                      score {activeResult.score}
                    </span>
                  </p>
                  <p className="text-xs text-[#4a4a6a] mt-1 font-mono truncate">
                    {activeResult.codeSnippet}
                  </p>
                </div>
                <ReviewResults result={activeResult.result} originalCode={activeResult.code} language={activeResult.language} />
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-xs text-[#4a4a6a] font-mono pb-4">
          Built with Next.js · FastAPI · Groq · llama-3.3-70b
        </footer>
      </div>
    </main>
  );
}
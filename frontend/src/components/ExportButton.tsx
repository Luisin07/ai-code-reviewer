"use client";

import { Download } from "lucide-react";
import { ReviewResponse } from "@/lib/api";

interface Props {
  result: ReviewResponse;
  language: string;
  originalCode: string;
}

const SCORE_COLOR = (score: number) =>
  score >= 80 ? "#00ff88" : score >= 60 ? "#ffaa00" : "#ff4466";

const SCORE_LABEL = (score: number) =>
  score >= 80 ? "Excellent" : score >= 60 ? "Needs Work" : "Critical";

export function ExportButton({ result, language, originalCode }: Props) {
  function handleExport() {
    const color = SCORE_COLOR(result.quality_score);
    const label = SCORE_LABEL(result.quality_score);

    const renderItems = (items: string[], color: string, emptyMsg: string) =>
      items.length === 0
        ? `<p style="color:#4a4a6a;font-style:italic;font-size:13px;">${emptyMsg}</p>`
        : items.map((item) => `
            <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;">
              <span style="color:${color};margin-top:2px;flex-shrink:0;">›</span>
              <span style="color:#8888aa;font-size:13px;line-height:1.6;">${item}</span>
            </div>`).join("");

    const renderSection = (title: string, items: string[], color: string, emptyMsg: string) => `
      <div style="background:#111118;border:1px solid #1e1e2e;border-radius:12px;padding:20px;break-inside:avoid;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:3px;height:16px;background:${color};border-radius:2px;"></div>
            <span style="color:#e2e2f0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${title}</span>
          </div>
          <span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:2px 10px;font-size:11px;font-family:monospace;">${items.length}</span>
        </div>
        ${renderItems(items, color, emptyMsg)}
      </div>`;

    const renderCode = (title: string, code: string, color: string) => `
      <div style="break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div style="width:3px;height:14px;background:${color};border-radius:2px;"></div>
          <span style="color:${color};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${title}</span>
        </div>
        <div style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:10px;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:6px;padding:10px 16px;border-bottom:1px solid #1e1e2e;background:#0d0d14;">
            <div style="width:10px;height:10px;border-radius:50%;background:#ff4466;opacity:0.7;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:#ffaa00;opacity:0.7;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:#00ff88;opacity:0.7;"></div>
            <span style="color:#4a4a6a;font-family:monospace;font-size:11px;margin-left:8px;">${language}</span>
          </div>
          <pre style="margin:0;padding:16px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#8888aa;line-height:1.7;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${code}</pre>
        </div>
      </div>`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Code Review Report — ${language}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e2e2f0; font-family: 'DM Sans', sans-serif; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <!-- Print Button -->
  <div class="no-print" style="position:fixed;top:20px;right:20px;z-index:999;">
    <button onclick="window.print()" style="display:flex;align-items:center;gap:8px;background:#00ff88;color:#0a0a0f;border:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">
      ⬇ Save as PDF
    </button>
  </div>

  <div style="max-width:800px;margin:0 auto;padding:40px 32px;">

    <!-- Header -->
    <div style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;padding:28px;margin-bottom:24px;border-left:4px solid #00ff88;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <div style="width:8px;height:8px;border-radius:50%;background:#00ff88;"></div>
        <span style="color:#00ff88;font-family:monospace;font-size:11px;letter-spacing:0.15em;">CODE REVIEW REPORT</span>
      </div>
      <h1 style="font-size:28px;font-weight:700;color:#e2e2f0;margin-bottom:4px;">AI Code <span style="color:#00ff88;">Reviewer</span></h1>
      <p style="color:#4a4a6a;font-family:monospace;font-size:12px;">
        ${language.toUpperCase()} · ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · github.com/Luisin07/ai-code-reviewer
      </p>
    </div>

    <!-- Score Card -->
    <div style="background:#111118;border:1px solid ${color};border-radius:16px;padding:24px;margin-bottom:24px;display:flex;align-items:center;gap:24px;">
      <div style="text-align:center;min-width:80px;">
        <div style="font-size:48px;font-weight:700;color:${color};font-family:monospace;line-height:1;">${result.quality_score}</div>
        <div style="font-size:10px;color:#4a4a6a;letter-spacing:0.1em;margin-top:4px;">QUALITY SCORE</div>
      </div>
      <div style="width:1px;height:60px;background:#1e1e2e;"></div>
      <div>
        <div style="color:${color};font-size:13px;font-weight:700;letter-spacing:0.08em;margin-bottom:6px;">${label.toUpperCase()}</div>
        <div style="color:#8888aa;font-size:13px;line-height:1.6;">${result.summary}</div>
      </div>
    </div>

    <!-- Sections Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      ${renderSection("Bugs Found", result.bugs, "#ff4466", "No bugs detected. Clean!")}
      ${renderSection("Security Issues", result.security_issues, "#ffaa00", "No security issues found.")}
    </div>
    <div style="margin-bottom:24px;">
      ${renderSection("Improvements", result.improvements, "#4488ff", "Code looks optimal.")}
    </div>

    <!-- Code Blocks -->
    <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:40px;">
      ${originalCode ? renderCode("Original Code", originalCode, "#ff4466") : ""}
      ${result.refactored_snippet ? renderCode("Refactored Snippet", result.refactored_snippet, "#00ff88") : ""}
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #1e1e2e;padding-top:20px;">
      <p style="color:#4a4a6a;font-family:monospace;font-size:11px;">
        Generated by AI Code Reviewer · Built with Next.js · FastAPI · Groq
      </p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1e1e2e] bg-[#111118] text-[#8888aa] hover:text-[#00ff88] hover:border-[#00ff88] transition-all text-xs font-mono"
    >
      <Download size={14} />
      Export PDF
    </button>
  );
}
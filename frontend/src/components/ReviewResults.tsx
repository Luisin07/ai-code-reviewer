"use client";

import { ReviewResponse } from "@/lib/api";
import { ScoreRing } from "./ScoreRing";
import { DiffViewer } from "./DiffViewer";
import { ExportButton } from "./ExportButton";
import { Bug, Lightbulb, Shield, ChevronRight } from "lucide-react";

interface Props {
  result: ReviewResponse;
  originalCode: string;
  language: string;
}

function Section({
  icon, title, items, color, emptyMsg,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
  emptyMsg: string;
}) {
  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <h3 className="font-semibold text-[#e2e2f0] text-sm tracking-wide uppercase">{title}</h3>
        <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full bg-[#1e1e2e]" style={{ color }}>
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-[#4a4a6a] text-sm italic">{emptyMsg}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#8888aa] leading-relaxed">
              <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReviewResults({ result, originalCode, language }: Props) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#e2e2f0]">Review Complete</h2>
          <p className="text-sm text-[#8888aa] mt-1">{result.summary}</p>
        </div>
        <div className="flex items-center gap-4">
          <ExportButton result={result} language={language} originalCode={originalCode} />
          <ScoreRing score={result.quality_score} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={<Bug size={16} />} title="Bugs Found" items={result.bugs} color="#ff4466" emptyMsg="No bugs detected. Clean!" />
        <Section icon={<Shield size={16} />} title="Security Issues" items={result.security_issues} color="#ffaa00" emptyMsg="No security issues found." />
        <Section icon={<Lightbulb size={16} />} title="Improvements" items={result.improvements} color="#4488ff" emptyMsg="Code looks optimal." />
        {result.refactored_snippet && (
          <div className="md:col-span-2">
            <DiffViewer
              original={originalCode}
              refactored={result.refactored_snippet}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}
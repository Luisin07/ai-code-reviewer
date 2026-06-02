"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { GitCompare, Code2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface DiffViewerProps {
  original: string;
  refactored: string;
  language: string;
}

export function DiffViewer({ original, refactored, language }: DiffViewerProps) {
  const [view, setView] = useState<"split" | "original" | "refactored">("split");

  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e1e2e] bg-[#0d0d14]">
        <div className="flex items-center gap-2">
          <GitCompare size={14} className="text-[#00ff88]" />
          <span className="text-xs font-mono font-semibold text-[#e2e2f0] uppercase tracking-wide">
            Code Diff
          </span>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-[#1e1e2e]">
          {(["split", "original", "refactored"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-mono transition-all capitalize ${
                view === v
                  ? "bg-[#00ff88] text-[#0a0a0f] font-semibold"
                  : "text-[#8888aa] hover:text-[#e2e2f0] bg-transparent"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Editors */}
      <div className={`grid ${view === "split" ? "grid-cols-2" : "grid-cols-1"}`}>
        {(view === "split" || view === "original") && (
          <div className={view === "split" ? "border-r border-[#1e1e2e]" : ""}>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d14] border-b border-[#1e1e2e]">
              <Code2 size={12} className="text-[#ff4466]" />
              <span className="text-xs font-mono text-[#ff4466]">Original</span>
            </div>
            <MonacoEditor
              height="280px"
              language={language}
              value={original}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: "none",
              }}
            />
          </div>
        )}

        {(view === "split" || view === "refactored") && (
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d14] border-b border-[#1e1e2e]">
              <Code2 size={12} className="text-[#00ff88]" />
              <span className="text-xs font-mono text-[#00ff88]">Refactored</span>
            </div>
            <MonacoEditor
              height="280px"
              language={language}
              value={refactored}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: "none",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
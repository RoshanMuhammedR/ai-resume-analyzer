"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

import { analyzeResume, type AnalyzeResponse } from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// ROOT PAGE — all logic identical to original, only className strings changed
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled =
    loading || resumeText.trim().length < 20 || jobDescription.trim().length < 20;

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await analyzeResume({
        resume_text: resumeText,
        job_description: jobDescription,
      });

      setResult(data);
    } catch {
      setError("Failed to analyze resume. Please check the backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#0b0c0e] text-neutral-200"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[1140px] px-5 pb-16">

        {/* ── Top bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
          <span className="font-mono text-[11px] tracking-widest text-neutral-700">
            SYS:RSMA-01
          </span>
          <span className="font-mono text-[12px] font-semibold tracking-[0.25em] text-emerald-400 uppercase">
            Resume Analyzer
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {loading ? "PROCESSING" : result ? "COMPLETE" : "READY"}
          </span>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="mb-8 mt-9">
          <p className="mb-2 font-mono text-[10.5px] tracking-[0.22em] text-neutral-600 uppercase">
            AI-powered candidate fit analysis
          </p>
          <h1 className="font-mono text-[2.4rem] font-bold leading-[1.08] tracking-tighter text-neutral-100 md:text-[3.2rem]">
            Match your resume with<br />
            any{" "}
            <em className="not-italic font-light text-emerald-400">job description</em>
          </h1>
        </div>

        {/* ── Section label ─────────────────────────────────────────────── */}
        <SectionLabel num="01" text="Input documents" />

        {/* ── Input grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/[0.09] bg-white/[0.09] md:grid-cols-2 mb-px">
          <InputPanel
            title="Resume"
            description="Paste your resume text here."
            icon={<FileText className="h-4 w-4 text-neutral-400" />}
            value={resumeText}
            onChange={setResumeText}
            placeholder={"// paste your resume here\n// plain text preferred\n\ne.g.\n3 yrs backend · Python · FastAPI\nPostgreSQL · Docker · REST APIs..."}
          />
          <InputPanel
            title="Job Description"
            description="Paste the target job description."
            icon={<Target className="h-4 w-4 text-emerald-400" />}
            value={jobDescription}
            onChange={setJobDescription}
            placeholder={"// paste the job posting here\n\ne.g.\nLooking for backend engineer\nPython, FastAPI, Docker, CI/CD..."}
            accent
          />
        </div>

        {/* ── Action row ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-4">
          <p className="font-mono text-[11px] tracking-wide text-neutral-700">
            — min 20 chars in both fields to unlock
          </p>
          <button
            onClick={handleAnalyze}
            disabled={isDisabled}
            className="inline-flex items-center gap-2.5 rounded-[3px] bg-emerald-400 px-6 py-2.5
                       font-mono text-[13px] font-semibold tracking-widest text-[#0b0c0e] uppercase
                       transition-opacity duration-150 hover:opacity-85 active:scale-[0.975]
                       disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Analyze Resume
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* ── Error strip ───────────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 border-l-2 border-red-500 bg-red-500/10 px-4 py-2.5 font-mono text-[12px] text-red-400">
            // ERROR: {error}
          </div>
        )}

        {/* ── Loading bar ───────────────────────────────────────────────── */}
        {loading && (
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-emerald-400 animate-[scan_1.6s_ease-in-out_infinite]" />
            </div>
            <span className="whitespace-nowrap font-mono text-[11px] tracking-widest text-neutral-500">
              PROCESSING...
            </span>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────────── */}
        {result && (
          <section className="animate-[fadeUp_0.3s_ease_both]">
            <SectionLabel num="02" text="Analysis output" />
            <ResultView result={result} />
          </section>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="mt-12 flex justify-between border-t border-white/[0.06] pt-4">
          <span className="font-mono text-[10.5px] tracking-wide text-neutral-700">
            Model: claude-sonnet-4-20250514
          </span>
          <span className="font-mono text-[10.5px] tracking-wide text-neutral-700">
            RSMA // Resume Match Analyzer
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          51%  { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUTPANEL — same props as original, restyled
// ─────────────────────────────────────────────────────────────────────────────

function InputPanel({
  title,
  description,
  icon,
  value,
  onChange,
  placeholder,
  accent,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col bg-[#111316]">
      {/* Pane header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] bg-[#0b0c0e] px-3.5 py-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase
            ${accent
              ? "border-emerald-500/60 text-emerald-400"
              : "border-white/15 text-neutral-400"
            }`}
        >
          {icon}
          {title}
        </span>
        <span className="font-mono text-[11px] text-neutral-700">{description}</span>
        <span className="ml-auto font-mono text-[11px] text-neutral-700">
          {value.trim().length} ch
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="min-h-[240px] flex-1 resize-none bg-[#0d0f11] px-4 py-3.5 font-mono text-[12px]
                   leading-relaxed text-neutral-300 placeholder:text-neutral-700 caret-emerald-400
                   transition-colors duration-150 focus:bg-[#0f1215] focus:outline-none"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTVIEW — same props as original, restyled
// ─────────────────────────────────────────────────────────────────────────────

function ResultView({ result }: { result: AnalyzeResponse }) {
  return (
    <div>
      {/* Score block */}
      <div className="mb-3 flex overflow-hidden rounded-[6px] border border-white/[0.09]">
        <div className="flex min-w-[140px] flex-col justify-center bg-emerald-400/10 px-6 py-5">
          <span className="font-mono text-[4.4rem] font-bold leading-none tracking-tighter text-emerald-400">
            {result.match_score}
          </span>
          <span className="mt-1 font-mono text-[10px] tracking-[0.2em] text-emerald-400/50 uppercase">
            match score
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 bg-[#111316] px-5 py-5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            Candidate fit assessment
          </span>
          <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${result.match_score}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-neutral-500">
            {result.match_score >= 85
              ? "Excellent match — strong alignment across key requirements."
              : result.match_score >= 70
              ? "Good match — minor gaps, straightforward to address."
              : result.match_score >= 50
              ? "Moderate match — notable skill gaps require attention."
              : result.match_score >= 30
              ? "Weak match — significant rework of resume recommended."
              : "Poor match — consider targeting a different role or upskilling first."}
          </span>
        </div>
      </div>

      {/* Three result columns */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/[0.09] bg-white/[0.09] md:grid-cols-3">
        <ResultCard
          title="Matching Skills"
          icon={<CheckCircle2 className="h-4 w-4" />}
          items={result.matching_skills}
          color="emerald"
        />
        <ResultCard
          title="Missing Skills"
          icon={<XCircle className="h-4 w-4" />}
          items={result.missing_skills}
          color="red"
        />
        <ResultCard
          title="Suggestions"
          icon={<Sparkles className="h-4 w-4" />}
          items={result.suggestions}
          color="amber"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTCARD — same props as original + color token, restyled
// ─────────────────────────────────────────────────────────────────────────────

const colorMap = {
  emerald: {
    header: "border-l-[3px] border-l-emerald-400",
    title: "text-emerald-400",
    item: "border-l-emerald-500",
  },
  red: {
    header: "border-l-[3px] border-l-red-500",
    title: "text-red-400",
    item: "border-l-red-500",
  },
  amber: {
    header: "border-l-[3px] border-l-amber-500",
    title: "text-amber-400",
    item: "border-l-amber-500",
  },
} as const;

function ResultCard({
  title,
  icon,
  items,
  color,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];

  return (
    <div className="flex flex-col bg-[#111316]">
      {/* Column header */}
      <div className={`flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 ${c.header}`}>
        <span className={`${c.title}`}>{icon}</span>
        <span className={`font-mono text-[10px] font-bold tracking-[0.18em] uppercase ${c.title}`}>
          {title}
        </span>
        <span className="ml-auto font-mono text-[11px] text-neutral-700">{items.length}</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1 p-2">
        {items.length === 0 ? (
          <p className="px-2 py-1.5 font-mono text-[11px] italic text-neutral-700">
            none identified
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`rounded-[3px] border-l-2 bg-[#0d0f11] px-3 py-2 text-[12px] leading-snug
                          text-neutral-400 transition-colors duration-100 hover:text-neutral-200 ${c.item}`}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONLABEL — small utility component
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2.5">
      <span className="font-mono text-[10px] tracking-[0.22em] text-emerald-400 uppercase">{num}</span>
      <span className="font-mono text-[10px] tracking-[0.22em] text-neutral-700 uppercase">{text}</span>
      <div className="flex-1 border-t border-white/[0.06]" />
    </div>
  );
}

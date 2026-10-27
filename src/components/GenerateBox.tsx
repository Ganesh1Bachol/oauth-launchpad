"use client";

import { useEffect, useRef, useState } from "react";
import type { Guide } from "@/lib/schema";
import { GuideView } from "@/components/GuideView";

const STATUS_MESSAGES = [
  "Looking up the provider's developer docs…",
  "Finding the OAuth app registration flow…",
  "Checking whether approval or review is required…",
  "Estimating active work vs. approval wait…",
  "Assessing scope sensitivity and blockers…",
  "Drawing the agent-vs-human line…",
  "Validating the guide against the schema…",
];

export function GenerateBox() {
  const [app, setApp] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    setStatusIdx(0);
    const t = setInterval(() => {
      setStatusIdx((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, 2500);
    return () => clearInterval(t);
  }, [loading]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!app.trim() || loading) return;
    setLoading(true);
    setError(null);
    setGuide(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app: app.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setGuide(data.guide as Guide);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={generate} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          value={app}
          onChange={(e) => setApp(e.target.value)}
          placeholder="Any app — e.g. Notion, HubSpot, Stripe, Zoom, Linear…"
          className="flex-1 rounded-lg border bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !app.trim()}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition-opacity disabled:opacity-50"
        >
          {loading ? "Investigating…" : "Generate guide"}
        </button>
      </form>

      {loading && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-[var(--muted)]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <span>{STATUS_MESSAGES[statusIdx]}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--brutal)] bg-[var(--brutal-bg)] p-4 text-sm text-[var(--brutal)]">
          {error}
        </div>
      )}

      {guide && (
        <div ref={resultRef} className="mt-6 card overflow-hidden">
          <div className="border-b bg-[var(--background)] px-5 py-2 text-xs font-medium text-[var(--muted)]">
            Live result — generated just now by an agent. Treat confidence tags with extra care for
            unfamiliar apps.
          </div>
          <GuideView guide={guide} />
        </div>
      )}
    </div>
  );
}

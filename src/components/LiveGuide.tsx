"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/**
 * One client component for both entry points:
 *  - Homepage: manual input box (no initialApp).
 *  - /guide/<slug>?app=<name>: autoStart with the shared app name, so the URL is
 *    a shareable link that regenerates the guide on visit.
 */
export function LiveGuide({
  initialApp,
  autoStart = false,
}: {
  initialApp?: string;
  autoStart?: boolean;
}) {
  const [app, setApp] = useState(initialApp ?? "");
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appUsed, setAppUsed] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const generate = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    setLoading(true);
    setError(null);
    setGuide(null);
    setCopied(false);
    setAppUsed(trimmed);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setGuide(data.guide as Guide);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-start for the shareable /guide/<slug> page.
  useEffect(() => {
    if (autoStart && initialApp && !started.current) {
      started.current = true;
      generate(initialApp);
    }
  }, [autoStart, initialApp, generate]);

  // Cycle status messages while loading.
  useEffect(() => {
    if (!loading) return;
    setStatusIdx(0);
    const t = setInterval(
      () => setStatusIdx((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1)),
      2500,
    );
    return () => clearInterval(t);
  }, [loading]);

  function shareLink(): string {
    if (!guide) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/guide/${guide.slug}?app=${encodeURIComponent(appUsed || guide.appName)}`;
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked; the link is still visible to copy manually */
    }
  }

  return (
    <div>
      {!autoStart && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) generate(app);
          }}
          className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
        >
          <input
            value={app}
            onChange={(e) => setApp(e.target.value)}
            placeholder="Any app — e.g. Notion, HubSpot, Stripe, Zoom, Linear…"
            className="flex-1 rounded-lg border bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || app.trim().length < 2}
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition-opacity disabled:opacity-50"
          >
            {loading ? "Investigating…" : "Generate guide"}
          </button>
        </form>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-[var(--muted)]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <span>
            {autoStart && appUsed ? `Investigating ${appUsed}… ` : ""}
            {STATUS_MESSAGES[statusIdx]}
          </span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--brutal)] bg-[var(--brutal-bg)] p-4 text-sm text-[var(--brutal)]">
          {error}
        </div>
      )}

      {guide && (
        <div ref={resultRef} className="mt-6 card overflow-hidden">
          <div className="flex flex-col gap-2 border-b bg-[var(--background)] px-5 py-3 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>Live result — generated just now by an agent. Treat confidence tags with care.</span>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareLink()}
                onFocus={(e) => e.currentTarget.select()}
                className="w-56 rounded border bg-[var(--surface)] px-2 py-1 text-[11px]"
              />
              <button
                onClick={copyShare}
                className="rounded bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-fg)]"
              >
                {copied ? "Copied!" : "Copy share link"}
              </button>
            </div>
          </div>
          <GuideView guide={guide} />
        </div>
      )}
    </div>
  );
}

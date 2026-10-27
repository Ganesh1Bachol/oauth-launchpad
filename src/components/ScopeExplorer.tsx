"use client";

import { useState } from "react";
import type { ScopeProfile, Difficulty } from "@/lib/schema";
import { DifficultyChip } from "@/components/chips";

/**
 * Interactive scope toggle. The whole point: "how hard is <App>?" has no single
 * answer — it depends on the permission tier you need. Pick a tier, watch the
 * difficulty and the two time numbers change.
 */
export function ScopeExplorer({
  profiles,
  baseDifficulty,
}: {
  profiles: ScopeProfile[];
  baseDifficulty: Difficulty;
}) {
  // Default to the profile matching the guide's headline difficulty, else the first.
  const defaultIdx = Math.max(
    0,
    profiles.findIndex((p) => p.difficulty === baseDifficulty),
  );
  const [idx, setIdx] = useState(defaultIdx);
  const active = profiles[idx];

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Pick the scope you actually need
        </div>
        <span className="text-[11px] text-[var(--muted)]">difficulty & time update ↓</span>
      </div>

      {/* Segmented control */}
      <div className="flex flex-wrap gap-1.5">
        {profiles.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIdx(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === idx
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                : "text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Live result */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Difficulty
          </div>
          <div className="mt-1.5">
            <DifficultyChip value={active.difficulty} />
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Your work
          </div>
          <div className="mt-1 text-sm font-bold">{active.activeWork}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Approval wait
          </div>
          <div className="mt-1 text-sm font-bold">{active.approvalWait}</div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed">{active.note}</p>
    </div>
  );
}

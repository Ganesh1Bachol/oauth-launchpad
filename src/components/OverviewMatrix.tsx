"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GuideSummary, Difficulty } from "@/lib/schema";
import { DifficultyChip } from "@/components/chips";

const rank: Record<Difficulty, number> = { easy: 0, moderate: 1, hard: 2, brutal: 3 };
const diffFilters: (Difficulty | "all")[] = ["all", "easy", "moderate", "hard", "brutal"];
type AuthFilter = "all" | "managed" | "byo";

function authLabel(v: GuideSummary["managedAuthAvailable"]) {
  if (v === "yes") return { text: "Managed", cls: "text-[var(--easy)]" };
  if (v === "no") return { text: "BYO only", cls: "text-[var(--brutal)]" };
  return { text: "BYO / unclear", cls: "text-[var(--uncertain)]" };
}

export function OverviewMatrix({ guides }: { guides: GuideSummary[] }) {
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [auth, setAuth] = useState<AuthFilter>("all");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    let r = [...guides];
    if (diff !== "all") r = r.filter((g) => g.difficulty === diff);
    if (auth === "managed") r = r.filter((g) => g.managedAuthAvailable === "yes");
    if (auth === "byo") r = r.filter((g) => g.managedAuthAvailable !== "yes");
    r.sort((a, b) => (asc ? 1 : -1) * (rank[a.difficulty] - rank[b.difficulty]));
    return r;
  }, [guides, diff, auth, asc]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--muted)]">Difficulty:</span>
          {diffFilters.map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`rounded-full border px-2.5 py-0.5 font-semibold capitalize transition-colors ${
                diff === d ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--muted)]">Auth:</span>
          {(["all", "managed", "byo"] as AuthFilter[]).map((a) => (
            <button
              key={a}
              onClick={() => setAuth(a)}
              className={`rounded-full border px-2.5 py-0.5 font-semibold uppercase transition-colors ${
                auth === a ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)]"
              }`}
            >
              {a === "byo" ? "BYO" : a}
            </button>
          ))}
        </div>
      </div>

      {/* Table (scrolls horizontally on small screens) */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-2.5 font-semibold">App</th>
              <th className="cursor-pointer px-4 py-2.5 font-semibold" onClick={() => setAsc((v) => !v)}>
                Difficulty {asc ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2.5 font-semibold">Your work</th>
              <th className="px-4 py-2.5 font-semibold">Approval wait</th>
              <th className="px-4 py-2.5 font-semibold">Auth</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => {
              const a = authLabel(g.managedAuthAvailable);
              return (
                <tr key={g.slug} className="border-b last:border-0 hover:bg-[var(--background)]">
                  <td className="px-4 py-2.5">
                    <Link href={`/guide/${g.slug}`} className="font-semibold hover:text-[var(--accent)]">
                      <span className="mr-1.5">{g.logoEmoji}</span>
                      {g.appName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <DifficultyChip value={g.difficulty} />
                  </td>
                  <td className="px-4 py-2.5 text-[var(--muted)]">{g.activeWork}</td>
                  <td className="px-4 py-2.5 text-[var(--muted)]">{g.approvalWait}</td>
                  <td className={`px-4 py-2.5 font-semibold ${a.cls}`}>{a.text}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--muted)]">
                  No apps match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        <strong>BYO</strong> = bring your own OAuth app. <strong>BYO only</strong> means no managed
        shortcut exists, so you register and get approved yourself — the cases where a guide matters
        most.
      </p>
    </div>
  );
}

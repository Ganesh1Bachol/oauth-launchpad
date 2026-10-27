import type { Confidence, Difficulty, Actor } from "@/lib/schema";

const diffStyle: Record<Difficulty, { color: string; bg: string; label: string }> = {
  easy: { color: "var(--easy)", bg: "var(--easy-bg)", label: "Easy" },
  moderate: { color: "var(--moderate)", bg: "var(--moderate-bg)", label: "Moderate" },
  hard: { color: "var(--hard)", bg: "var(--hard-bg)", label: "Hard" },
  brutal: { color: "var(--brutal)", bg: "var(--brutal-bg)", label: "Brutal" },
};

export function DifficultyChip({ value }: { value: Difficulty }) {
  const s = diffStyle[value];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

const confStyle: Record<Confidence, { color: string; bg: string; label: string; icon: string }> = {
  verified: { color: "var(--verified)", bg: "var(--verified-bg)", label: "Verified", icon: "✓" },
  claimed: { color: "var(--claimed)", bg: "var(--claimed-bg)", label: "Per source", icon: "◐" },
  uncertain: { color: "var(--uncertain)", bg: "var(--uncertain-bg)", label: "Uncertain", icon: "?" },
};

export function ConfidenceChip({ value, title }: { value: Confidence; title?: string }) {
  const s = confStyle[value];
  return (
    <span
      title={title ?? confTitle[value]}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      <span aria-hidden>{s.icon}</span>
      {s.label}
    </span>
  );
}

const confTitle: Record<Confidence, string> = {
  verified: "We confirmed this against the real console/docs in-session, or a cited setup attempt did.",
  claimed: "A provider doc or reputable source states this; we did not independently confirm it.",
  uncertain: "We could not pin this down — treat it as a known unknown and verify before relying on it.",
};

const actorStyle: Record<Actor, { label: string; color: string; bg: string }> = {
  agent: { label: "Agent can do", color: "#6d28d9", bg: "#ede9fe" },
  you: { label: "You must do", color: "#0f766e", bg: "#ccfbf1" },
  both: { label: "Agent preps · you confirm", color: "#9a3412", bg: "#ffedd5" },
};

export function ActorBadge({ value }: { value: Actor }) {
  const s = actorStyle[value];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

const sevStyle = {
  low: { color: "var(--moderate)", bg: "var(--moderate-bg)" },
  medium: { color: "var(--hard)", bg: "var(--hard-bg)" },
  high: { color: "var(--brutal)", bg: "var(--brutal-bg)" },
} as const;

export function SeverityDot({ value }: { value: "low" | "medium" | "high" }) {
  const s = sevStyle[value];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ color: s.color, background: s.bg }}
    >
      {value}
    </span>
  );
}

export function ManagedChip({ value }: { value: "yes" | "no" | "unknown" }) {
  if (value === "yes")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--easy-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--easy)]">
        Managed auth available
      </span>
    );
  if (value === "no")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brutal-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brutal)]">
        Bring your own app
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--uncertain-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--uncertain)]">
      Managed status unknown
    </span>
  );
}

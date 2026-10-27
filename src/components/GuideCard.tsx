import Link from "next/link";
import type { GuideSummary } from "@/lib/schema";
import { DifficultyChip, ManagedChip } from "@/components/chips";

export function GuideCard({ g }: { g: GuideSummary }) {
  return (
    <Link
      href={`/guide/${g.slug}`}
      className="card group flex flex-col p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {g.logoEmoji ?? "🔌"}
        </span>
        <h3 className="font-bold tracking-tight group-hover:text-[var(--accent)]">{g.appName}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <DifficultyChip value={g.difficulty} />
        <ManagedChip value={g.managedAuthAvailable} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">{g.summary}</p>
      <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs">
        <span>
          <span className="text-[var(--muted)]">Work:</span>{" "}
          <span className="font-semibold">{g.activeWork}</span>
        </span>
        <span>
          <span className="text-[var(--muted)]">Wait:</span>{" "}
          <span className="font-semibold">{g.approvalWait.length > 24 ? g.approvalWait.slice(0, 24) + "…" : g.approvalWait}</span>
        </span>
      </div>
    </Link>
  );
}

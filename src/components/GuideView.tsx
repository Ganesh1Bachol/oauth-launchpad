import type { Guide } from "@/lib/schema";
import {
  DifficultyChip,
  ConfidenceChip,
  ActorBadge,
  SeverityDot,
  ManagedChip,
} from "@/components/chips";
import { ScopeExplorer } from "@/components/ScopeExplorer";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function GuideView({ guide }: { guide: Guide }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>
            {guide.logoEmoji ?? "🔌"}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{guide.appName}</h1>
            {guide.appWebsite && (
              <a
                href={guide.appWebsite}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--muted)] underline-offset-2 hover:underline"
              >
                {guide.appWebsite.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DifficultyChip value={guide.difficulty} />
          <ManagedChip value={guide.managedAuthAvailable} />
          <ConfidenceChip value={guide.overallConfidence} title="Overall confidence in this guide" />
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
            {guide.generatedBy === "curated" ? "Curated + source-checked" : "Agent-generated (live)"}
          </span>
        </div>
      </header>

      <p className="mt-5 text-[15px] leading-relaxed">{guide.summary}</p>

      {/* The headline number pair: active work vs approval wait */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Your hands-on work
          </div>
          <div className="mt-1 text-xl font-bold">{guide.time.activeWork}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Waiting on their approval
          </div>
          <div className="mt-1 text-xl font-bold">{guide.time.approvalWait}</div>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
        <ConfidenceChip value={guide.time.evidence.confidence} />
        {guide.time.evidence.note}
        {guide.time.evidence.sourceUrl && (
          <a
            className="underline"
            href={guide.time.evidence.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            source
          </a>
        )}
      </p>

      {guide.scopeProfiles && guide.scopeProfiles.length > 0 && (
        <Section
          title="It depends on your scope — try it"
          subtitle="The same app at different permission tiers. This is why there's no single answer."
        >
          <ScopeExplorer profiles={guide.scopeProfiles} baseDifficulty={guide.difficulty} />
        </Section>
      )}

      {guide.managedAuthNote && (
        <div
          className={`mt-5 rounded-lg border-l-4 p-3 text-sm ${
            guide.managedAuthAvailable === "no"
              ? "border-[var(--brutal)] bg-[var(--brutal-bg)]"
              : "border-[var(--accent)] bg-[var(--surface)]"
          }`}
        >
          <strong>
            {guide.managedAuthAvailable === "no"
              ? "No managed shortcut — this is Launchpad territory:"
              : guide.managedAuthAvailable === "yes"
                ? "Shortcut:"
                : "On managed auth:"}
          </strong>{" "}
          {guide.managedAuthNote}
        </div>
      )}

      {/* Scope sensitivity */}
      <Section
        title="Scope sensitivity"
        subtitle="How much the permissions you request change the difficulty."
      >
        <div className="card p-4">
          <div className="mb-1 text-sm font-semibold">
            Impact:{" "}
            <span
              style={{
                color:
                  guide.scopeSensitivity.level === "high"
                    ? "var(--brutal)"
                    : guide.scopeSensitivity.level === "low"
                      ? "var(--moderate)"
                      : "var(--easy)",
              }}
            >
              {guide.scopeSensitivity.level.toUpperCase()}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{guide.scopeSensitivity.detail}</p>
        </div>
      </Section>

      {/* Agent / You hand-off */}
      <Section
        title="What an agent can do vs. where you take over"
        subtitle="The line between automated prep and human-only actions."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <div className="mb-2 text-sm font-bold text-[#6d28d9]">🤖 An agent can do</div>
            <ul className="space-y-1.5 text-sm">
              {guide.agentCanDo.map((x, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#6d28d9]">›</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <div className="mb-2 text-sm font-bold text-[#0f766e]">🙋 You must do</div>
            <ul className="space-y-1.5 text-sm">
              {guide.youMustDo.map((x, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#0f766e]">›</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Prerequisites */}
      {guide.prerequisites.length > 0 && (
        <Section title="Before you start">
          <ul className="card divide-y p-0 text-sm">
            {guide.prerequisites.map((p, i) => (
              <li key={i} className="px-4 py-2.5">
                {p}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Steps */}
      <Section title="Step by step">
        <ol className="space-y-3">
          {guide.steps.map((s, i) => (
            <li key={i} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--accent-fg)]">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {s.estMinutes ? (
                    <span className="text-xs text-[var(--muted)]">~{s.estMinutes}m</span>
                  ) : null}
                  <ActorBadge value={s.actor} />
                </div>
              </div>
              <p className="mt-2 pl-9 text-sm leading-relaxed text-[var(--foreground)]">
                {s.detail}
              </p>
              {s.evidence && (
                <p className="mt-2 flex items-center gap-2 pl-9 text-xs text-[var(--muted)]">
                  <ConfidenceChip value={s.evidence.confidence} />
                  <span>{s.evidence.note}</span>
                  {s.evidence.sourceUrl && (
                    <a className="underline" href={s.evidence.sourceUrl} target="_blank" rel="noreferrer">
                      source
                    </a>
                  )}
                </p>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* Blockers */}
      {guide.blockers.length > 0 && (
        <Section
          title="Blockers & gotchas"
          subtitle="The things that stop people cold — approval gates, paid audits, hard prerequisites."
        >
          <div className="space-y-3">
            {guide.blockers.map((b, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{b.title}</h3>
                  <SeverityDot value={b.severity} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed">{b.description}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  {b.typicalWait && (
                    <span>
                      <span className="text-[var(--muted)]">Typical wait:</span> {b.typicalWait}
                    </span>
                  )}
                  {b.cost && (
                    <span>
                      <span className="text-[var(--muted)]">Cost:</span> {b.cost}
                    </span>
                  )}
                  {b.avoidableBy && (
                    <span className="text-[var(--easy)]">
                      <span className="text-[var(--muted)]">Avoid by:</span> {b.avoidableBy}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <ConfidenceChip value={b.evidence.confidence} />
                  <span>{b.evidence.note}</span>
                  {b.evidence.sourceUrl && (
                    <a className="underline" href={b.evidence.sourceUrl} target="_blank" rel="noreferrer">
                      source
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Sources */}
      {guide.sources.length > 0 && (
        <Section title="Sources">
          <ul className="space-y-1.5 text-sm">
            {guide.sources.map((s, i) => (
              <li key={i}>
                <a
                  className="text-[var(--accent)] underline-offset-2 hover:underline"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <footer className="mt-10 border-t pt-4 text-xs text-[var(--muted)]">
        <p>
          Generated {guide.generatedBy === "curated" ? "and source-checked" : "live by an agent"} ·{" "}
          {guide.generatedAt}. Evidence tags:{" "}
          <ConfidenceChip value="verified" /> we confirmed it ·{" "}
          <ConfidenceChip value="claimed" /> a source states it ·{" "}
          <ConfidenceChip value="uncertain" /> unverified. Provider processes change — confirm
          timelines against the linked sources before committing.
        </p>
      </footer>
    </article>
  );
}

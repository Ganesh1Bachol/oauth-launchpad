import { getCuratedSummaries } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import { LiveGuide } from "@/components/LiveGuide";

export default function Home() {
  const summaries = getCuratedSummaries();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-[var(--muted)]">
            🚀 Launchpad · OAuth integration planner for agent builders
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight">
            Know what it takes to ship your OAuth integration — before you start.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
            To let your users connect an app, you often have to register your own OAuth app with the
            provider and get it approved. Some take an afternoon; some take weeks and a paid audit.
            Launchpad gives you a clear, shareable guide for each one: how hard it is, how long
            (including the approval wait), what will block you, and which parts an agent can do for
            you.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* The cross-cutting insight */}
        <section className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
            The pattern worth knowing
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed">
            Almost every provider has <strong>two tiers</strong>. Getting <em>your own users</em>{" "}
            connected — a first-party app, an unlisted OAuth flow, a Connected App — is usually fast
            and review-free. The weeks-long, sometimes-paid review only kicks in for{" "}
            <strong>public marketplace listing</strong> or <strong>sensitive data scopes</strong>.
            The fastest way to overestimate the work is to assume the scary headline applies to you.
            Each guide below tells you which tier you&apos;re actually in.
          </p>
        </section>

        {/* Live generation */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Generate a guide for any app</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Not in the library? Type a name or URL and an agent will investigate it live — including
            apps we&apos;ve never seen.
          </p>
          <div className="mt-4">
            <LiveGuide />
          </div>
        </section>

        {/* Library */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">Guide library</h2>
            <span className="text-sm text-[var(--muted)]">
              {summaries.length} curated · source-checked
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            A few real apps chosen for contrast — from trivial to genuinely hard.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((g) => (
              <GuideCard key={g.slug} g={g} />
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t pt-6 text-xs text-[var(--muted)]">
          Launchpad is a take-home prototype. Guides are grounded in provider docs and reputable
          sources, with per-claim confidence tags, but provider processes change — verify against the
          linked sources before committing. No credentials or accounts are used.
        </footer>
      </div>
    </main>
  );
}

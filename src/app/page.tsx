import Link from "next/link";
import { getCuratedSummaries } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import { LiveGuide } from "@/components/LiveGuide";
import { OverviewMatrix } from "@/components/OverviewMatrix";

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

        {/* "Isn't this just Composio?" reframe */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
              Isn&apos;t this already solved by Composio?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed">
              The opposite, actually. Composio&apos;s managed-auth directory <em>removes</em> the work
              for the <strong>~124 toolkits it manages</strong> — nothing to guide there. But for the{" "}
              <strong>~258 &ldquo;bring your own OAuth app&rdquo;</strong> toolkits, it just shows you a
              form with two empty fields (client ID, client secret) and says &ldquo;paste your
              credentials.&rdquo; It doesn&apos;t tell you how to <em>get</em> them, how long approval
              takes, or what will block you. <strong>That blank form is where Launchpad begins</strong>{" "}
              — and the same gap exists in Nango, Paragon, Pipedream and Merge.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">
              Even for managed apps, serious products eventually need their <em>own</em> OAuth app (their
              brand on the consent screen, being the data controller for compliance, higher rate limits,
              scopes the managed app doesn&apos;t cover). Launchpad is the platform-agnostic pre-flight
              briefing for that journey.
            </p>
          </div>
          <div className="card flex flex-col justify-center gap-3 p-5">
            <div>
              <div className="text-3xl font-extrabold text-[var(--easy)]">~124</div>
              <div className="text-xs text-[var(--muted)]">toolkits Composio manages for you — no setup</div>
            </div>
            <div className="border-t pt-3">
              <div className="text-3xl font-extrabold text-[var(--brutal)]">~258</div>
              <div className="text-xs text-[var(--muted)]">
                &ldquo;bring your own OAuth app&rdquo; — a blank form, no guide. <strong>Launchpad&apos;s turf.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* At-a-glance matrix */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">At a glance</h2>
            <Link href="/how-it-works" className="text-sm text-[var(--accent)] hover:underline">
              How it works & methodology →
            </Link>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Every guide, sorted and filterable. Note how many are <strong>BYO only</strong> — the cases
            no platform can do for you.
          </p>
          <div className="mt-4">
            <OverviewMatrix guides={summaries} />
          </div>
        </section>

        {/* Live generation */}
        <section className="mt-12">
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
            Chosen for contrast — from trivial (GitHub) to genuinely hard — and deliberately mixing
            familiar names with BYO-only cases like Plaid and DocuSign that no managed platform covers.
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

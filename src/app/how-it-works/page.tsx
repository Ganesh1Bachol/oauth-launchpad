import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works & methodology — Launchpad",
  description:
    "How Launchpad investigates OAuth setup, the evidence model, and what was verified vs. not.",
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-9 text-lg font-bold tracking-tight">{children}</h2>;
}

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      <nav className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Launchpad
          </Link>
          <span className="text-xs text-[var(--muted)]">Methodology</span>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight">How it works &amp; methodology</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
          Launchpad answers one question for an AI-agent developer: <em>what will it actually take to
          register my own OAuth app with a provider and get it approved, so my users can connect?</em>{" "}
          Here is how the guidance is produced and how much to trust it.
        </p>

        <H>Two ways a guide is made</H>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <div className="text-sm font-bold">Curated + source-checked</div>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
              A small library of apps chosen for contrast. Each was researched against the provider&apos;s
              own docs plus reputable corroboration, written into the schema, and spot-checked. These carry
              the most trust and real source links.
            </p>
          </div>
          <div className="card p-4">
            <div className="text-sm font-bold">Agent-generated (live)</div>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
              For any app you type in, an agent (Claude <code>opus-5</code> + web search) investigates the
              provider&apos;s real setup/approval process in ~1–2 minutes and returns a guide in the exact
              same schema — validated before it renders.
            </p>
          </div>
        </div>

        <H>The schema is the product</H>
        <p className="mt-2 text-sm leading-relaxed">
          Every guide — curated or live — is the same validated shape, built around a few deliberate ideas:
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="card p-3">
            <strong>Active work vs. approval wait, split.</strong> The expensive part is rarely the
            clicking — it&apos;s waiting on a human at the provider. We never blur &ldquo;3 hours of
            work&rdquo; with &ldquo;then 6 weeks of review.&rdquo;
          </li>
          <li className="card p-3">
            <strong>Agent-vs-you, per step.</strong> An agent can research, enumerate minimal scopes, draft
            policies, pre-fill forms, scaffold code. A human must accept legal terms, pay for audits, be the
            verified entity, and submit. Each step says which.
          </li>
          <li className="card p-3">
            <strong>Scope sensitivity (sometimes interactive).</strong> The same app can be easy or brutal
            depending on the permissions requested. Where it matters most (e.g. Google, Plaid, Shopify) you
            can toggle the scope tier and watch difficulty and time change.
          </li>
          <li className="card p-3">
            <strong>Per-claim confidence.</strong> Every load-bearing claim is tagged{" "}
            <span className="font-semibold text-[var(--verified)]">verified</span>,{" "}
            <span className="font-semibold text-[var(--claimed)]">per source</span>, or{" "}
            <span className="font-semibold text-[var(--uncertain)]">uncertain</span> — because provider docs
            go stale and agents can hallucinate.
          </li>
          <li className="card p-3">
            <strong>Managed vs BYO.</strong> First we say whether a managed shortcut exists at all. If it
            does, you may skip everything; if not, the detailed guidance is the whole value.
          </li>
        </ul>

        <H>The evidence model, and how honest it is</H>
        <p className="mt-2 text-sm leading-relaxed">
          <span className="font-semibold text-[var(--verified)]">Verified</span> means we (or the live agent)
          confirmed a fact against a specific source this session.{" "}
          <span className="font-semibold text-[var(--claimed)]">Per source</span> means a provider doc or
          reputable source states it but we didn&apos;t independently confirm it.{" "}
          <span className="font-semibold text-[var(--uncertain)]">Uncertain</span> means we couldn&apos;t pin
          it down — named as a known unknown rather than guessed.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          We tested this honestly. On a live run for <strong>Notion</strong>, the agent tagged
          &ldquo;a workspace owner is required to create a connection&rdquo; as <em>verified</em>, but the
          cited page didn&apos;t actually state it — an over-eager tag. We tightened the agent&apos;s rule
          (a <em>verified</em> tag now requires the specific cited source to state the fact), then re-ran on{" "}
          <strong>HubSpot</strong> and spot-checked its install-cap claim against HubSpot&apos;s own docs —
          confirmed verbatim. The point isn&apos;t that the agent is perfect; it&apos;s that its confidence
          is <em>auditable</em>.
        </p>

        <H>What we did and didn&apos;t do</H>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="card p-3">
            The live agent researches via <strong>web search</strong> over real provider docs — it does not
            log into each provider&apos;s console (that needs the developer&apos;s own accounts). It reads and
            reasons; it doesn&apos;t click through the actual setup.
          </li>
          <li className="card p-3">
            Approval timelines vary widely and change often. Treat every time figure as a planning estimate
            and confirm against the linked sources before committing.
          </li>
          <li className="card p-3">
            No credentials or accounts are used anywhere in the product.
          </li>
        </ul>

        <div className="mt-9 border-t pt-5">
          <Link href="/" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            ← Back to the library
          </Link>
        </div>
      </article>
    </main>
  );
}

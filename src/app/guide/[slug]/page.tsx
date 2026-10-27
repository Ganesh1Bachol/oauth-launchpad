import Link from "next/link";
import { getGuide, curatedGuides } from "@/lib/guides";
import { GuideView } from "@/components/GuideView";
import { LiveGuide } from "@/components/LiveGuide";
import type { Metadata } from "next";

export function generateStaticParams() {
  return curatedGuides.map((g) => ({ slug: g.slug }));
}

function deslug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  const name = guide?.appName ?? deslug(slug);
  return {
    title: `${name} OAuth setup — Launchpad`,
    description: guide?.summary.slice(0, 155),
  };
}

function Shell({ children, note }: { children: React.ReactNode; note: string }) {
  return (
    <main className="min-h-screen">
      <nav className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Launchpad
          </Link>
          <span className="text-xs text-[var(--muted)]">{note}</span>
        </div>
      </nav>
      {children}
    </main>
  );
}

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ app?: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  // Curated slug → render the source-checked guide instantly (static).
  if (guide) {
    return (
      <Shell note="Curated · shareable guide">
        <GuideView guide={guide} />
      </Shell>
    );
  }

  // Unknown slug → a shareable link for a live-generated guide. The app name
  // comes from ?app= (what the generator used) or is recovered from the slug.
  const { app } = await searchParams;
  const appName = (app && app.trim()) || deslug(slug);

  return (
    <Shell note="Live · generated on visit">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight">{appName}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          This app isn&apos;t in the curated library, so an agent is investigating it live.
          Generating a fresh guide takes a minute or two.
        </p>
        <div className="mt-5">
          <LiveGuide initialApp={appName} autoStart />
        </div>
      </div>
    </Shell>
  );
}

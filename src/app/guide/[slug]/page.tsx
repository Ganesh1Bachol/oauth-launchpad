import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, curatedGuides } from "@/lib/guides";
import { GuideView } from "@/components/GuideView";
import type { Metadata } from "next";

export function generateStaticParams() {
  return curatedGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found — Launchpad" };
  return {
    title: `${guide.appName} OAuth setup — Launchpad`,
    description: guide.summary.slice(0, 155),
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="min-h-screen">
      <nav className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Launchpad
          </Link>
          <span className="text-xs text-[var(--muted)]">Shareable guide</span>
        </div>
      </nav>
      <GuideView guide={guide} />
    </main>
  );
}

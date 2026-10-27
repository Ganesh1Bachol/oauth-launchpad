"use client";

import { useState } from "react";

export function CopyBlock({
  content,
  mono = false,
}: {
  content: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable; the text is still selectable below */
    }
  }

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded border bg-[var(--surface)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        className={`overflow-x-auto rounded-lg border bg-[var(--background)] p-3 pr-16 text-[13px] leading-relaxed ${
          mono ? "font-mono" : "whitespace-pre-wrap"
        }`}
      >
        {content}
      </pre>
    </div>
  );
}

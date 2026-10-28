import { NextResponse } from "next/server";
import { generateGuide } from "@/lib/agent";
import type { Guide } from "@/lib/schema";

// The agent runs several web searches, so give the route room (Vercel Pro: up to 300s).
export const maxDuration = 300;

// --- Lightweight, in-memory protections (best-effort per serverless instance) ---
// The ultimate hard cap on spend is the Anthropic account balance itself; these
// just prevent waste (re-billing the same app) and casual abuse of the public,
// unauthenticated endpoint.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // a generated guide is reused for 24h
const PER_IP_MAX = 6; // generations per IP per hour
const PER_IP_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX_PER_DAY = 40; // across all callers on this instance

type CacheEntry = { guide: Guide; ts: number };
const cache = new Map<string, CacheEntry>();
const ipHits = new Map<string, number[]>();
let globalHits: number[] = [];

function keyFor(app: string) {
  return app.trim().toLowerCase();
}

function prune(list: number[], windowMs: number, now: number) {
  return list.filter((t) => now - t < windowMs);
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The live-generation agent needs an ANTHROPIC_API_KEY. The curated guides work without one — add a key to .env.local to enable live generation.",
      },
      { status: 503 },
    );
  }

  let app: unknown;
  try {
    ({ app } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof app !== "string" || app.trim().length < 2) {
    return NextResponse.json({ error: "Please provide an app name or URL." }, { status: 400 });
  }
  if (app.length > 120) {
    return NextResponse.json({ error: "That input is too long." }, { status: 400 });
  }

  // 1) Cache: serve a recent generation for free (also covers shared /guide links).
  const key = keyFor(app);
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.ts < CACHE_TTL_MS) {
    return NextResponse.json({ guide: hit.guide, cached: true });
  }

  // 2) Global daily cap — a hard ceiling so the endpoint can't drain the balance.
  globalHits = prune(globalHits, 24 * 60 * 60 * 1000, now);
  if (globalHits.length >= GLOBAL_MAX_PER_DAY) {
    return NextResponse.json(
      {
        error:
          "Live generation is at capacity for today. The curated guides are all available — please try live generation again later.",
      },
      { status: 429 },
    );
  }

  // 3) Per-IP rate limit.
  const ip = clientIp(req);
  const recent = prune(ipHits.get(ip) ?? [], PER_IP_WINDOW_MS, now);
  if (recent.length >= PER_IP_MAX) {
    return NextResponse.json(
      {
        error: `Rate limit: up to ${PER_IP_MAX} live generations per hour. Browse the curated guides meanwhile, or try again shortly.`,
      },
      { status: 429 },
    );
  }

  try {
    const guide = await generateGuide(app.trim());
    // Record spend-incurring success against both limiters, and cache it.
    recent.push(now);
    ipHits.set(ip, recent);
    globalHits.push(now);
    cache.set(key, { guide, ts: now });
    return NextResponse.json({ guide });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "The agent could not produce a guide.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

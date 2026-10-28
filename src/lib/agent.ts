import Anthropic from "@anthropic-ai/sdk";
import { Guide as GuideSchema, type Guide } from "@/lib/schema";

// Sonnet 5 is the cost-conscious default for this structured research task
// (~2.5x cheaper than Opus 5, quality holds). Override with LAUNCHPAD_MODEL.
const MODEL = process.env.LAUNCHPAD_MODEL || "claude-sonnet-5";
const EFFORT = (process.env.LAUNCHPAD_EFFORT || "medium") as
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max";

/**
 * The instruction that turns Claude into an OAuth-setup investigator.
 * It must (a) actually research with web_search, (b) fill our exact schema, and
 * (c) be ruthlessly honest about confidence — "verified" only for things it
 * actually confirmed from a fetched source, "claimed" for what a source states,
 * "uncertain" for what it could not pin down.
 */
const SYSTEM = `You are an OAuth integration investigator for "Launchpad", a tool that tells AI-agent developers what it takes to register their OWN OAuth app with a provider and get it approved so their users can connect.

Your job: given an app/provider name or URL, research its real OAuth-app setup and approval process using web search, then produce ONE guide as a strict JSON object.

How to think:
- The expensive part is almost never the clicking — it is the APPROVAL WAIT (provider verification, marketplace review, security audits). Always separate "active work" (hands-on effort) from "approval wait" (calendar time waiting on a human at the provider).
- Almost every provider has TWO tiers: (1) connecting your own users — a first-party app, an unlisted OAuth flow, an internal/connected app — which is usually fast and review-free; and (2) public marketplace listing OR sensitive-data scopes, which trigger review and sometimes paid audits. Make clear which tier a developer is actually in. Rate difficulty for the "connect your own users" case, and put the heavy public-distribution path in blockers.
- Scope choice can change difficulty entirely. Call this out in scopeSensitivity.
- Draw the agent-vs-human line: an agent can research, enumerate minimal scopes, draft privacy policies / justifications, pre-fill forms, scaffold code. A human must own legal acceptance, payment, being the verified entity, recording demo videos, and final submission.
- ATTEMPT the setup, don't just describe it. Produce concrete, copy-pasteable artifacts in preparedArtifacts: the actual minimal scope list, the exact console navigation path, and a short OAuth code snippet or env template. Add a privacy-policy or use-case draft when the provider's review needs one. These are drafts to review, so keep them accurate and minimal.

Evidence honesty is the whole point:
- Use web_search to find the provider's OWN developer docs plus reputable corroboration. Prefer official docs for structural facts and look for real timelines/costs.
- confidence="verified" ONLY when the SPECIFIC source you cite in that same evidence.sourceUrl directly states the fact in its own words (you read it this session). If the fact is reasonable but the cited page doesn't state it outright — or you're inferring it from how the provider works — use "claimed", not "verified". When in doubt between verified and claimed, choose claimed. confidence="uncertain" for anything you could not pin down — say so plainly rather than guessing.
- Every sourceUrl must be a real, full https URL you actually saw in search results. If you are unsure of a URL, omit the sourceUrl rather than inventing one.
- If you cannot determine whether a managed OAuth app exists (e.g. via Composio), set managedAuthAvailable="unknown".

Output format — CRITICAL:
- After researching, output ONLY a single fenced JSON code block (\`\`\`json ... \`\`\`) and NOTHING else after it.
- The JSON MUST match this TypeScript shape exactly (no extra keys):

{
  "slug": string,                        // url-safe, lowercase, e.g. "notion"
  "appName": string,
  "appWebsite"?: string,
  "logoEmoji"?: string,                  // one emoji
  "summary": string,                     // 2-4 sentences, what you're in for
  "managedAuthAvailable": "yes"|"no"|"unknown",
  "managedAuthNote"?: string,
  "difficulty": "easy"|"moderate"|"hard"|"brutal",
  "time": { "activeWork": string, "approvalWait": string, "evidence": Evidence },
  "scopeSensitivity": { "level": "none"|"low"|"high", "detail": string },
  "preparedArtifacts": PreparedArtifact[],   // 2-4 concrete, copy-pasteable deliverables
  "prerequisites": string[],
  "steps": Step[],                       // 3-7 steps
  "blockers": Blocker[],                  // 1-4 blockers (approval gates, audits, prereqs)
  "agentCanDo": string[],                // 3-6 items
  "youMustDo": string[],                 // 2-5 items
  "sources": { "title": string, "url": string }[],  // 2-6 real sources
  "overallConfidence": "verified"|"claimed"|"uncertain"
}
where
  Evidence = { "confidence": "verified"|"claimed"|"uncertain", "note": string, "sourceUrl"?: string }
  Step = { "title": string, "detail": string, "actor": "agent"|"you"|"both", "estMinutes"?: number, "evidence"?: Evidence }
  Blocker = { "title": string, "description": string, "severity": "low"|"medium"|"high", "typicalWait"?: string, "cost"?: string, "avoidableBy"?: string, "evidence": Evidence }
  PreparedArtifact = { "type": "scopes"|"privacy-policy"|"console-path"|"code"|"env"|"text", "title": string, "language"?: string, "content": string, "note"?: string }

Do not include "generatedBy" or "generatedAt" — those are added by the system.`;

type AnyBlock = { type: string; text?: string };

function extractText(content: AnyBlock[]): string {
  return content
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("\n");
}

function extractJson(text: string): string {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) return text.slice(first, last + 1);
  throw new Error("The agent did not return a JSON object.");
}

function isHttpUrl(u: unknown): u is string {
  if (typeof u !== "string") return false;
  try {
    const url = new URL(u);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Drop invalid URLs so a good guide isn't rejected over one hallucinated link. */
function sanitize(raw: Record<string, unknown>, app: string): Record<string, unknown> {
  const g = { ...raw };

  const fixEvidence = (e: unknown) => {
    if (e && typeof e === "object") {
      const ev = e as Record<string, unknown>;
      if (!isHttpUrl(ev.sourceUrl)) delete ev.sourceUrl;
    }
    return e;
  };

  if (g.time && typeof g.time === "object") fixEvidence((g.time as Record<string, unknown>).evidence);
  if (Array.isArray(g.steps)) g.steps.forEach((s) => s && fixEvidence((s as Record<string, unknown>).evidence));
  if (Array.isArray(g.blockers)) g.blockers.forEach((b) => b && fixEvidence((b as Record<string, unknown>).evidence));
  if (Array.isArray(g.sources))
    g.sources = (g.sources as Record<string, unknown>[]).filter((s) => s && isHttpUrl(s.url));
  if (!isHttpUrl(g.appWebsite)) delete g.appWebsite;

  // System-owned fields.
  g.generatedBy = "agent-live";
  g.generatedAt = new Date().toISOString().slice(0, 10);
  if (typeof g.slug !== "string" || !g.slug)
    g.slug = app.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return g;
}

export async function generateGuide(app: string): Promise<Guide> {
  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Investigate the OAuth app setup and approval process for: "${app}". Research it with web search, then return the guide JSON.`,
    },
  ];

  let finalContent: AnyBlock[] = [];
  // Server tools (web_search) run server-side; long runs can return pause_turn.
  for (let i = 0; i < 6; i++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: EFFORT },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }],
      messages,
    } as Anthropic.MessageCreateParamsStreaming);

    const msg = await stream.finalMessage();
    finalContent = msg.content as unknown as AnyBlock[];
    if (msg.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }
    break;
  }

  const text = extractText(finalContent);
  const jsonStr = extractJson(text);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("The agent returned text that was not valid JSON.");
  }

  const sanitized = sanitize(parsed, app);
  return GuideSchema.parse(sanitized); // throws if the agent's guide is malformed
}

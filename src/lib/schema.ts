import { z } from "zod";

/**
 * The guide schema is the core IP of Launchpad.
 *
 * A "guide" is a structured, shareable answer to the question a developer asks
 * before shipping an integration: "How hard is it to get my OAuth app for <App>
 * approved and live, how long will it take, what will block me, and which parts
 * can an agent do for me?"
 *
 * Two ideas drive the shape of this schema:
 *
 *  1. The expensive part of OAuth setup is almost never the clicking — it is the
 *     *approval wait* (provider verification, security review). So we split time
 *     into `activeWork` (your hands-on effort) and `approvalWait` (calendar time
 *     spent waiting on a human at the provider). These are wildly different and
 *     developers conflate them at their peril.
 *
 *  2. We make NO claim without attaching a confidence level. Provider docs are
 *     stale and vague; agents can hallucinate. Every load-bearing fact carries an
 *     `Evidence` tag so a reader (and a grader) can see what we verified vs. what
 *     a source merely claims vs. what is genuinely uncertain.
 */

/** How much we trust a given claim. Rendered as a colored chip in the UI. */
export const Confidence = z.enum(["verified", "claimed", "uncertain"]);
export type Confidence = z.infer<typeof Confidence>;

/**
 * Evidence attached to a load-bearing claim.
 * - verified:  we (or a cited setup attempt) confirmed it against the real console/docs.
 * - claimed:   a provider doc or reputable source states it, but we did not confirm.
 * - uncertain: we could not pin it down; treat as a known unknown.
 */
export const Evidence = z.object({
  confidence: Confidence,
  note: z.string(), // what we checked, or what the source says, in plain language
  sourceUrl: z.string().url().optional(),
});
export type Evidence = z.infer<typeof Evidence>;

/** Who performs a step. The agent/you split IS the product insight. */
export const Actor = z.enum([
  "agent", // an agent can fully do this (research, draft text, enumerate scopes)
  "you", // only the human can (accept legal terms, pay, be the verified owner)
  "both", // agent prepares, human reviews/submits
]);
export type Actor = z.infer<typeof Actor>;

export const Step = z.object({
  title: z.string(),
  detail: z.string(),
  actor: Actor,
  estMinutes: z.number().int().positive().optional(),
  evidence: Evidence.optional(),
});
export type Step = z.infer<typeof Step>;

/**
 * A blocker is something that can stop you cold — usually an approval gate, a
 * paid audit, or a hard prerequisite. These are the facts worth the most money.
 */
export const Blocker = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  typicalWait: z.string().optional(), // e.g. "2–6 weeks"
  cost: z.string().optional(), // e.g. "CASA Tier 2 assessment, paid"
  avoidableBy: z.string().optional(), // e.g. "Stay within non-sensitive scopes"
  evidence: Evidence,
});
export type Blocker = z.infer<typeof Blocker>;

export const Difficulty = z.enum(["easy", "moderate", "hard", "brutal"]);
export type Difficulty = z.infer<typeof Difficulty>;

export const Source = z.object({
  title: z.string(),
  url: z.string().url(),
});
export type Source = z.infer<typeof Source>;

export const Guide = z.object({
  slug: z.string(), // url-safe id, e.g. "google-gmail"
  appName: z.string(),
  appWebsite: z.string().optional(),
  logoEmoji: z.string().optional(), // lightweight visual, no asset pipeline needed

  /** One-paragraph "what you're in for" summary. */
  summary: z.string(),

  /**
   * The Composio insight: is there a managed OAuth app you can borrow (so you
   * skip registration/approval entirely), or must you bring your own?
   */
  managedAuthAvailable: z.enum(["yes", "no", "unknown"]),
  managedAuthNote: z.string().optional(),

  difficulty: Difficulty,

  /** Split time estimate — the single most useful number pair in the guide. */
  time: z.object({
    activeWork: z.string(), // hands-on effort, e.g. "~30 min"
    approvalWait: z.string(), // calendar wait on the provider, e.g. "none" / "2–6 weeks"
    evidence: Evidence,
  }),

  /** How much the chosen scopes change the difficulty. Often the whole ballgame. */
  scopeSensitivity: z.object({
    level: z.enum(["none", "low", "high"]),
    detail: z.string(),
  }),

  prerequisites: z.array(z.string()),
  steps: z.array(Step),
  blockers: z.array(Blocker),

  /** Explicit two-column hand-off so the reader knows where they take over. */
  agentCanDo: z.array(z.string()),
  youMustDo: z.array(z.string()),

  sources: z.array(Source),

  /** Rolled-up trust level for the guide as a whole. */
  overallConfidence: Confidence,

  generatedBy: z.enum(["curated", "agent-live"]),
  generatedAt: z.string(), // ISO date
});
export type Guide = z.infer<typeof Guide>;

/** Lightweight shape for the library grid (avoids shipping full guides to the list view). */
export type GuideSummary = Pick<
  Guide,
  | "slug"
  | "appName"
  | "logoEmoji"
  | "summary"
  | "difficulty"
  | "managedAuthAvailable"
  | "overallConfidence"
  | "generatedBy"
> & { activeWork: string; approvalWait: string };

export function toSummary(g: Guide): GuideSummary {
  return {
    slug: g.slug,
    appName: g.appName,
    logoEmoji: g.logoEmoji,
    summary: g.summary,
    difficulty: g.difficulty,
    managedAuthAvailable: g.managedAuthAvailable,
    overallConfidence: g.overallConfidence,
    generatedBy: g.generatedBy,
    activeWork: g.time.activeWork,
    approvalWait: g.time.approvalWait,
  };
}

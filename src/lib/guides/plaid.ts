import type { Guide } from "@/lib/schema";

/**
 * Plaid — the "Composio can't do this for you" guide. There is no managed OAuth
 * shortcut: you must pass Plaid's own compliance review for Production, and the
 * bank-level OAuth connections can take months. Grounded in Plaid docs/support
 * and their MSA; the multi-month bank-OAuth figure is institution-specific and
 * marked accordingly.
 */
export const plaid: Guide = {
  slug: "plaid",
  appName: "Plaid",
  appWebsite: "https://plaid.com",
  logoEmoji: "🏦",
  summary:
    "Plaid is the clearest example of a setup no managed-auth platform can do for you. Building in Sandbox is instant, but to touch real financial data you must request Production access and pass Plaid's own compliance review — company details, use-case justification, questionnaires, and information requests (you must respond within three business days or risk suspension). On top of that, connecting to banks that require OAuth (e.g. Chase) runs on the bank's timeline, which has been reported at roughly 3–4 months. Your 'OAuth app' here is really an approved, compliance-reviewed Plaid account plus per-institution OAuth enablement — there is no borrowing someone else's.",
  managedAuthAvailable: "no",
  managedAuthNote:
    "No agent platform can hand you a managed Plaid app: Plaid's compliance review is tied to YOUR legal entity and use case, and bank OAuth enablement is per-customer. This is bring-your-own by necessity — exactly where a guide earns its keep.",
  difficulty: "hard",
  time: {
    activeWork: "~2–4 hours to integrate; more to complete compliance questionnaires",
    approvalWait: "Production: a few business days to weeks (compliance); bank OAuth institutions: reported up to ~3–4 months",
    evidence: {
      confidence: "claimed",
      note: "Plaid requires passing compliance reviews (automated checks, questionnaires, info requests) for Production; basic approval is often a few business days. OAuth-required institutions can take far longer. Per Plaid docs/support and MSA; we did not run the review.",
      sourceUrl: "https://plaid.com/docs/launch-checklist/",
    },
  },
  scopeSensitivity: {
    level: "high",
    detail:
      "Plaid 'products' (Auth, Transactions, Identity, Investments, Assets, etc.) are the equivalent of scopes, and some products carry additional approval, pricing, or compliance requirements. Separately, whether your target institutions require OAuth dramatically changes the timeline. Request the minimum products and know your institutions' OAuth status before committing to a launch date.",
  },
  scopeProfiles: [
    {
      id: "sandbox",
      label: "Sandbox",
      difficulty: "easy",
      activeWork: "~1–2 hours",
      approvalWait: "none",
      note: "Build and test against Plaid's Sandbox with test institutions and credentials immediately — no approval. Great for prototyping, but it is not real data.",
    },
    {
      id: "production",
      label: "Production (basic)",
      difficulty: "hard",
      activeWork: "~2–4 hours + questionnaires",
      approvalWait: "a few business days to weeks",
      note: "Request Production access with company and use-case details; pass Plaid's compliance review (questionnaires, info requests). Respond within three business days to requests or access can be suspended.",
    },
    {
      id: "bank-oauth",
      label: "OAuth bank institutions",
      difficulty: "brutal",
      activeWork: "~2–4 hours + coordination",
      approvalWait: "institution-specific; reported up to ~3–4 months",
      note: "Some major banks require OAuth and gate connectivity on their own review cadence. Reported waits for large institutions (e.g. Chase) have reached ~3–4 months — plan around it and don't assume the Plaid-side approval is the finish line.",
    },
  ],
  prerequisites: [
    "A Plaid developer account (Sandbox is immediate).",
    "Company/legal entity details and a clear description of your use case.",
    "Readiness to complete compliance questionnaires and respond to info requests within 3 business days.",
    "A data-security posture you can describe (how you store/handle financial data).",
  ],
  steps: [
    {
      title: "Build and validate in Sandbox",
      detail:
        "Integrate Plaid Link and the APIs against Sandbox using test institutions and credentials. No approval needed — prove your flow end to end here first.",
      actor: "agent",
      estMinutes: 90,
      evidence: {
        confidence: "claimed",
        note: "Sandbox is available immediately and is distinct from Production per Plaid support.",
        sourceUrl: "https://support.plaid.com/hc/en-us/articles/16110110883479-How-are-Sandbox-Production-Trial-plan-and-Limited-Production-different",
      },
    },
    {
      title: "Scope the minimum products and check institution OAuth status",
      detail:
        "List exactly which Plaid products you need and confirm whether your target institutions require OAuth. This decision drives both cost and timeline — an agent can research institution OAuth requirements for you.",
      actor: "both",
      estMinutes: 45,
    },
    {
      title: "Request Production access and complete compliance review",
      detail:
        "Submit company details and your use case, then work through Plaid's compliance review — automated verifications, questionnaires, and information requests. Prompt, complete responses keep the clock moving.",
      actor: "you",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Plaid's MSA states clients must pass compliance reviews (automated checks, questionnaires, info requests) and respond within three business days or risk suspension.",
        sourceUrl: "https://plaid.com/docs/launch-checklist/",
      },
    },
    {
      title: "Configure OAuth redirect and per-institution enablement",
      detail:
        "For OAuth institutions, register your redirect URI and complete any institution-specific enablement. Build this early because the bank-side timeline is the long pole.",
      actor: "both",
      estMinutes: 45,
      evidence: {
        confidence: "claimed",
        note: "Plaid documents OAuth institution requirements including redirect URI registration.",
        sourceUrl: "https://plaid.com/docs/link/oauth/",
      },
    },
    {
      title: "Work the launch checklist and go live",
      detail:
        "Complete Plaid's launch-in-production checklist (security, compliance, error handling, webhooks) before enabling real users.",
      actor: "both",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Plaid publishes a Launch in Production checklist covering go-live requirements.",
        sourceUrl: "https://plaid.com/docs/launch-checklist/",
      },
    },
  ],
  blockers: [
    {
      title: "Compliance review gates Production (and has a response SLA on YOU)",
      description:
        "You cannot touch real data until you pass Plaid's compliance review. It can include automated checks, questionnaires, and information requests — and if you don't respond within three business days, Plaid may suspend or revoke access.",
      severity: "high",
      typicalWait: "A few business days to weeks",
      avoidableBy: "Prepare entity details, use-case narrative, and data-handling answers before you apply.",
      evidence: {
        confidence: "claimed",
        note: "Per Plaid's MSA: clients must pass compliance reviews and respond within three business days to requests, or access may be suspended/revoked.",
        sourceUrl: "https://plaid.com/docs/launch-checklist/",
      },
    },
    {
      title: "Bank OAuth enablement runs on the institution's timeline",
      description:
        "For institutions that require OAuth, connectivity depends on the bank's own review cadence. Reported waits for large institutions have reached ~3–4 months — a schedule risk entirely outside your control.",
      severity: "high",
      typicalWait: "Institution-specific; reported up to ~3–4 months for major banks",
      avoidableBy: "Confirm institution OAuth status early; start enablement in parallel with development.",
      evidence: {
        confidence: "uncertain",
        note: "The ~3–4 month figure (e.g. Chase) was reported via Plaid support in 2025 and is institution-specific; we could not confirm a firm published SLA. Treat as a planning risk, not a guarantee.",
        sourceUrl: "https://plaid.com/docs/link/oauth/",
      },
    },
  ],
  agentCanDo: [
    "Research which of your target institutions require OAuth and flag the long-pole ones.",
    "Map your feature set to the minimum Plaid products.",
    "Draft your use-case narrative and compliance-questionnaire answers for review.",
    "Scaffold the Plaid Link flow and token exchange against Sandbox.",
  ],
  youMustDo: [
    "Apply as your legal entity and pass Plaid's compliance review.",
    "Respond to information requests within the 3-business-day window.",
    "Own your financial-data security posture and sign Plaid's agreements.",
  ],
  sources: [
    { title: "Launch in Production checklist — Plaid Docs", url: "https://plaid.com/docs/launch-checklist/" },
    {
      title: "Sandbox vs Production vs Limited Production — Plaid Support",
      url: "https://support.plaid.com/hc/en-us/articles/16110110883479-How-are-Sandbox-Production-Trial-plan-and-Limited-Production-different",
    },
    { title: "OAuth (Link) — Plaid Docs", url: "https://plaid.com/docs/link/oauth/" },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

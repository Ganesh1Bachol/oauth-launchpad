import type { Guide } from "@/lib/schema";

/**
 * Meta / Facebook — a second "brutal", but a different shape from Google's CASA.
 * Here the gate is Business Verification + per-permission App Review (each
 * permission needs its own screencast and justification). Grounded in Meta's
 * permissions docs and 2025–2026 practitioner guides; timelines are "claimed"/
 * "uncertain" because Meta doesn't publish firm SLAs.
 */
export const metaFacebook: Guide = {
  slug: "meta-facebook",
  appName: "Meta / Facebook",
  appWebsite: "https://developers.facebook.com",
  logoEmoji: "📘",
  summary:
    "Meta cleanly illustrates the two-tier pattern — and the second tier is heavy. Every Meta app starts with Standard Access, which only reaches assets your own business controls; you can build and test against your own Pages/accounts immediately. But to act on behalf of your users' Instagram/Facebook assets you need Advanced Access, and that requires both Business Verification AND App Review — submitted per permission, each with a usage description, a screencast of the exact flow, and a privacy policy. Business Verification is a separate process on its own timeline and is a notorious hidden blocker: teams pass App Review, then wait again on verification. Scope your permissions tightly, because each one is reviewed individually.",
  managedAuthAvailable: "unknown",
  managedAuthNote:
    "Even where a managed-auth shortcut exists for prototyping, production apps acting on users' assets need their own Meta app with Advanced Access — which means you own Business Verification and App Review. Treat managed auth as a prototyping aid, not an exit from review.",
  difficulty: "hard",
  time: {
    activeWork: "~3–6 hours (consent screen, per-permission writeups, recording screencasts)",
    approvalWait: "Business Verification (days–weeks) + App Review per permission (days–weeks), often iterative",
    evidence: {
      confidence: "claimed",
      note: "Business Verification runs on its own timeline (days to weeks) and must precede Advanced Access; App Review is per-permission with screencasts. Meta doesn't publish firm SLAs. Per Meta docs and 2025–2026 practitioner guides.",
      sourceUrl: "https://developers.facebook.com/documentation/development/permissions",
    },
  },
  scopeSensitivity: {
    level: "high",
    detail:
      "Permissions ARE the difficulty here. Each permission you request for Advanced Access is reviewed on its own, with its own screencast and justification, and reviewers check the screencast against the exact permission. Asking for more permissions multiplies the review surface and the rejection risk. Request the minimum, and only what your screencast can clearly demonstrate.",
  },
  prerequisites: [
    "A Meta app in the Meta for Developers portal.",
    "A verifiable business entity (legal name, documents) for Business Verification.",
    "A hosted privacy policy and a data deletion mechanism/URL.",
    "The ability to record screencasts demonstrating each requested permission in a working flow.",
  ],
  steps: [
    {
      title: "Build and test with Standard Access first",
      detail:
        "Every app starts with Standard Access, which reaches only assets your business owns/manages. Build and validate your entire flow against your own Pages/accounts before touching review.",
      actor: "both",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Standard Access covers only your own assets; Advanced Access is required to act on assets you don't own/manage.",
        sourceUrl: "https://postgate.studio/blog/meta-advanced-access",
      },
    },
    {
      title: "Complete Business Verification",
      detail:
        "Verify your business entity with Meta. This is a separate, multi-step process required before Advanced Access can be granted, and it runs on its own timeline — start it early.",
      actor: "you",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Business Verification is required for all apps requesting Advanced Access and is a common hidden second wait after App Review.",
        sourceUrl: "https://developers.facebook.com/documentation/development/permissions",
      },
    },
    {
      title: "Configure the app: privacy policy, data deletion, OAuth redirect",
      detail:
        "Set your privacy policy URL, data deletion instructions/callback, app domain, and Facebook Login redirect URIs. Accurate configuration here is checked during review.",
      actor: "both",
      estMinutes: 45,
    },
    {
      title: "Prepare per-permission justifications and screencasts",
      detail:
        "For each permission you need in Advanced Access, write how it's used and record a screencast showing the exact user flow that uses it. This is the most time-consuming and most agent-assistable prep step (scripting, checklists) short of the recording itself.",
      actor: "both",
      estMinutes: 120,
      evidence: {
        confidence: "claimed",
        note: "Advanced Access submissions require, per permission, a usage description, a screencast of the flow, and a privacy policy; some need a data-handling questionnaire.",
        sourceUrl: "https://singhamandeep.com/facebook-page-api-permissions-app-review/",
      },
    },
    {
      title: "Submit for App Review and iterate",
      detail:
        "Submit each permission for review. Expect back-and-forth: reviewers match your screencast to the permission and reject vague or mismatched submissions, restarting that permission's clock.",
      actor: "you",
      estMinutes: 30,
    },
  ],
  blockers: [
    {
      title: "Business Verification — a separate wait before you can even get Advanced Access",
      description:
        "You must verify your business entity before Advanced Access is granted. It's its own multi-step process on its own timeline, and teams routinely clear App Review only to wait again here.",
      severity: "high",
      typicalWait: "Days to weeks (no published SLA)",
      avoidableBy: "Start Business Verification at the very beginning, in parallel with development.",
      evidence: {
        confidence: "claimed",
        note: "Business Verification is required for all Advanced Access and is widely reported as a hidden second blocker.",
        sourceUrl: "https://developers.facebook.com/documentation/development/permissions",
      },
    },
    {
      title: "Per-permission App Review with screencasts",
      description:
        "Each Advanced-Access permission is reviewed individually against a screencast of the real flow. Broad permission requests multiply review effort and rejection risk; mismatches restart that permission.",
      severity: "high",
      typicalWait: "Days to weeks per permission, often iterative",
      avoidableBy: "Request the minimum permissions and demo each one cleanly in its screencast.",
      evidence: {
        confidence: "claimed",
        note: "App Review is required for data you don't own/manage; each permission needs its own screencast and justification.",
        sourceUrl: "https://singhamandeep.com/facebook-page-api-permissions-app-review/",
      },
    },
  ],
  agentCanDo: [
    "Map your feature set to the minimum Advanced-Access permissions and flag high-scrutiny ones.",
    "Draft per-permission usage descriptions and screencast scripts/checklists.",
    "Draft a compliant privacy policy and data-deletion instructions.",
    "Pre-fill app configuration values (domains, redirect URIs, policy URLs).",
  ],
  youMustDo: [
    "Be the verifiable business entity and complete Business Verification.",
    "Record the actual screencasts of your working flows.",
    "Submit each permission and respond to reviewer feedback.",
  ],
  sources: [
    {
      title: "Permissions Reference & Access Levels — Meta for Developers",
      url: "https://developers.facebook.com/documentation/development/permissions",
    },
    {
      title: "Meta Advanced Access explained — Postgate",
      url: "https://postgate.studio/blog/meta-advanced-access",
    },
    {
      title: "Facebook Page API Permissions App Review guide",
      url: "https://singhamandeep.com/facebook-page-api-permissions-app-review/",
    },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

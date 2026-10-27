import type { Guide } from "@/lib/schema";

/**
 * Google / Gmail — the genuinely hard one, and the best example of scope
 * sensitivity deciding everything. Non-sensitive scopes: minutes. Gmail content
 * scopes: restricted → OAuth verification (~weeks) PLUS a CASA security
 * assessment (paid third-party audit, redone annually). Timelines come from
 * Google's own FAQ and multiple 2025–2026 practitioner reports, so they are
 * "claimed"; the scope-tier structure is well established and corroborated.
 */
export const googleGmail: Guide = {
  slug: "google-gmail",
  appName: "Google / Gmail",
  appWebsite: "https://console.cloud.google.com",
  logoEmoji: "📧",
  summary:
    "Google is the integration where your scope choice decides whether this takes an afternoon or a quarter. Non-sensitive sign-in scopes need only a quick brand verification. But the moment you request Gmail content scopes (read/modify mail), you enter 'restricted scope' territory: a full OAuth verification review (Google's own FAQ cites ~6 weeks) AND a CASA security assessment — a paid, third-party audit you must redo every 12 months. Until you're verified, your app is capped (commonly ~100 users) and shows an 'unverified' warning. Plan the scope strategy before you write a line of code.",
  managedAuthAvailable: "yes",
  managedAuthNote:
    "Composio offers managed auth for Gmail, which lets you skip verification/CASA for prototyping. But production apps usually need their own Google app so the consent screen shows YOUR brand and your company is the data controller for compliance — which means you own the verification + CASA burden.",
  difficulty: "hard",
  time: {
    activeWork: "~2–4 hours to configure; much more if CASA remediation is needed",
    approvalWait: "~6 weeks for restricted-scope verification; CASA assessment adds weeks and recurs annually",
    evidence: {
      confidence: "claimed",
      note: "Google's own FAQ puts restricted-scope verification at roughly six weeks; practitioner reports for sensitive scopes cluster around 2–6 weeks, sometimes 7+. CASA must be repeated every 12 months. We did not run a verification in this session.",
      sourceUrl: "https://developer.nylas.com/docs/provider-guides/google/google-verification-security-assessment-guide/",
    },
  },
  scopeSensitivity: {
    level: "high",
    detail:
      "Google classifies every scope as non-sensitive, sensitive, or restricted. Non-sensitive (e.g. email, profile, openid): brand verification only, ~2–3 business days. Sensitive (e.g. Calendar, Contacts): OAuth verification, no CASA. Restricted (Gmail read/modify, broad Drive): OAuth verification PLUS CASA security assessment. Eight Gmail scopes are restricted, including gmail.readonly and gmail.modify. Choosing gmail.readonly over a narrower alternative can be the difference between weeks-plus-an-audit and nothing.",
  },
  prerequisites: [
    "A Google Cloud project with the relevant API (e.g. Gmail API) enabled.",
    "A verified domain you own (via Google Search Console) for authorized domains.",
    "A published privacy policy hosted on that domain.",
    "For restricted scopes: budget and lead time for a CASA assessment by a Google-approved assessor.",
    "A YouTube/hosted demo video showing the OAuth flow and how each scope is used (commonly required for restricted-scope review).",
  ],
  steps: [
    {
      title: "Pick the minimal scope tier — this is the whole ballgame",
      detail:
        "Before anything else, list the exact data you touch and map it to the narrowest scopes. If you can avoid Gmail content scopes (restricted), you avoid CASA entirely. An agent is genuinely useful here: it can map your feature list to the smallest viable scope set and flag which choices cross into 'sensitive' or 'restricted'.",
      actor: "both",
      estMinutes: 30,
      evidence: {
        confidence: "claimed",
        note: "Gmail content scopes are classified restricted and trigger CASA; Calendar/Contacts are sensitive (verification only). Corroborated across Google docs and multiple practitioner guides.",
        sourceUrl: "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification",
      },
    },
    {
      title: "Configure the OAuth consent screen",
      detail:
        "In Google Cloud Console, set up the consent screen: app name, support email, authorized domains, logo, privacy policy and terms URLs, and the scopes. Accurate, honest scope descriptions here directly affect review speed.",
      actor: "both",
      estMinutes: 45,
    },
    {
      title: "Verify domain ownership and publish a privacy policy",
      detail:
        "Verify each authorized domain in Google Search Console and host a privacy policy that explains your use of Google user data (including 'Limited Use' compliance language for restricted scopes).",
      actor: "you",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Domain verification via Search Console and a Limited-Use-compliant privacy policy are standard verification requirements reported across guides.",
        sourceUrl: "https://support.google.com/cloud/answer/9110914",
      },
    },
    {
      title: "Submit for OAuth verification",
      detail:
        "Submit the app for verification with scope justifications and (for restricted scopes) a demo video. Expect a back-and-forth with Google's Trust & Safety team; incomplete submissions restart the clock.",
      actor: "you",
      estMinutes: 60,
      evidence: {
        confidence: "claimed",
        note: "Google's FAQ cites ~6 weeks for restricted verification; community reports of 7+ weeks exist when submissions are incomplete.",
        sourceUrl: "https://support.google.com/cloud/answer/13463817",
      },
    },
    {
      title: "Complete the CASA security assessment (restricted scopes only)",
      detail:
        "Engage a Google-approved CASA assessor. The tier (AL1/AL2, sometimes higher) depends on user count and scopes. This is a paid audit against the OWASP ASVS standard and must be renewed every 12 months. An agent can help you self-scan and prepare evidence, but it cannot BE your assessor or sign off.",
      actor: "both",
      // estMinutes intentionally omitted: this step is dominated by external audit
      // calendar time, not your own keystrokes.
      evidence: {
        confidence: "claimed",
        note: "CASA is Google's required security assessment for apps handling restricted-scope data broadly; tiered AL1–AL2+ by risk; annual renewal. Cost varies by assessor.",
        sourceUrl: "https://developer.nylas.com/docs/provider-guides/google/google-verification-security-assessment-guide/",
      },
    },
  ],
  blockers: [
    {
      title: "Restricted scopes force CASA — a paid, recurring audit",
      description:
        "If you request Gmail content scopes (or broad Drive), you must pass a CASA security assessment through a Google-approved third party, renewed every 12 months. This is the single biggest cost and schedule risk in the whole integration.",
      severity: "high",
      typicalWait: "Weeks on top of verification; depends on assessor availability",
      cost: "Paid third-party assessment; price varies by assessor and tier (AL1/AL2+)",
      avoidableBy:
        "Stay within non-sensitive or sensitive scopes — avoid Gmail content/broad Drive scopes if your product can.",
      evidence: {
        confidence: "claimed",
        note: "Restricted-scope apps that send data to a server require CASA; built on OWASP ASVS, multi-tier, annual renewal. Corroborated across Google docs and 2025–2026 practitioner reports.",
        sourceUrl: "https://developer.nylas.com/docs/provider-guides/google/google-verification-security-assessment-guide/",
      },
    },
    {
      title: "Unverified apps are capped and show a scary warning",
      description:
        "Before verification completes, your app shows an 'unverified app' screen and is subject to a user cap (commonly reported around 100 users) and a grant ceiling. You cannot quietly launch to all users while 'under review'.",
      severity: "high",
      typicalWait: "Until verification completes (~6 weeks for restricted)",
      avoidableBy: "Complete verification before public launch; use test users during development.",
      evidence: {
        confidence: "claimed",
        note: "Unverified Google apps are widely reported to hit a ~100-user cap and display an unverified warning until verification completes.",
        sourceUrl: "https://www.unipile.com/google-oauth-100-user-limit/",
      },
    },
    {
      title: "Adding a scope later means re-review",
      description:
        "Verification is tied to the scopes you declared. Adding a new sensitive/restricted scope after approval requires submitting for re-review, so late scope creep restarts the wait.",
      severity: "medium",
      avoidableBy: "Finalize your scope set before submitting.",
      evidence: {
        confidence: "claimed",
        note: "Adding scopes to an already-verified app requires resubmission; widely reported.",
        sourceUrl: "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification",
      },
    },
  ],
  agentCanDo: [
    "Map your feature list to the narrowest scopes and flag which cross into sensitive/restricted (potentially saving weeks + an audit).",
    "Draft a Limited-Use-compliant privacy policy and scope justifications.",
    "Pre-fill the consent-screen configuration values.",
    "Run a pre-CASA self-assessment against the OWASP ASVS checklist and list likely gaps.",
    "Write a demo-video script that shows each scope's use.",
  ],
  youMustDo: [
    "Own and verify the domain, and be the legal entity Google is verifying.",
    "Record/submit the demo video and respond to Trust & Safety.",
    "Engage and pay a CASA assessor; a human must own the audit and sign-off.",
    "Decide and accept the recurring annual CASA renewal commitment.",
  ],
  sources: [
    {
      title: "OAuth App Verification Help Center — Google",
      url: "https://support.google.com/cloud/answer/9110914",
    },
    {
      title: "Sensitive scope verification — Google for Developers",
      url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification",
    },
    {
      title: "Gmail restricted scopes: verification and CASA — Nylas provider guide",
      url: "https://developer.nylas.com/docs/provider-guides/google/google-verification-security-assessment-guide/",
    },
    {
      title: "Google OAuth 100-user limit explained — Unipile",
      url: "https://www.unipile.com/google-oauth-100-user-limit/",
    },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

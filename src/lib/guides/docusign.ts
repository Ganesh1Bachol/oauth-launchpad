import type { Guide } from "@/lib/schema";

/**
 * DocuSign — the "hidden go-live gate" guide. Everything works in the demo
 * environment immediately, but promoting your integration key to production
 * requires passing DocuSign's Go-Live review. Grounded in DocuSign developer
 * docs/community; the historical 20-API-call rule was streamlined in 2025.
 */
export const docusign: Guide = {
  slug: "docusign",
  appName: "DocuSign",
  appWebsite: "https://developers.docusign.com",
  logoEmoji: "✍️",
  summary:
    "DocuSign lets you build freely in its demo (developer) environment, but there's a gate most newcomers don't see coming: every new API integration must pass a 'Go-Live' review to promote its integration key to production. Historically this required running at least 20 distinct successful API calls in demo before approval; in 2025 DocuSign streamlined the Go-Live experience in Apps & Keys and removed that 20-call requirement. Promotion now ranges from a few minutes up to about three business days, and integrations flagged for review are typically cleared within ~48 hours. The work itself is light; the thing to plan for is simply knowing the gate exists and allowing a little lead time.",
  managedAuthAvailable: "unknown",
  managedAuthNote:
    "Some integration platforms wrap DocuSign auth. Bring your own integration key when you need your own branding, JWT grant for server-to-server, or control over the production app.",
  difficulty: "moderate",
  time: {
    activeWork: "~1–2 hours",
    approvalWait: "Go-Live promotion: minutes up to ~3 business days (flagged reviews ~48h)",
    evidence: {
      confidence: "claimed",
      note: "DocuSign's Go-Live promotes an integration key to production; timing ranges from minutes to ~3 business days, with flagged reviews typically under 48h. Per DocuSign developer docs/community.",
      sourceUrl: "https://support.docusign.com/s/articles/DocuSign-Developer-FAQs-Integration-Keys-and-Go-Live",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "OAuth scopes (e.g. signature, impersonation for JWT) determine what your integration can do, but they don't change the Go-Live gate itself. The bigger architectural choice is Authorization Code grant vs JWT (server-to-server), which affects your consent and key setup.",
  },
  prerequisites: [
    "A DocuSign developer (demo) account and an integration key (client ID).",
    "A redirect URI (Authorization Code) or an RSA keypair (JWT grant).",
    "A privacy policy URL and terms of service URL.",
    "A working integration you can exercise in demo before requesting Go-Live.",
  ],
  steps: [
    {
      title: "Create an integration key and choose your grant type",
      detail:
        "In Apps & Keys, create an integration key (client ID). Decide between Authorization Code grant (user consent, redirect URI) and JWT grant (server-to-server, RSA keypair + one-time consent).",
      actor: "both",
      estMinutes: 30,
    },
    {
      title: "Build and exercise the integration in demo",
      detail:
        "Implement the OAuth flow and your eSignature API calls against the demo environment. Exercise the real flows you intend to ship — a healthy demo history smooths Go-Live.",
      actor: "agent",
      estMinutes: 60,
    },
    {
      title: "Request Go-Live to promote your key to production",
      detail:
        "Submit the integration for Go-Live in Apps & Keys. The streamlined 2025 flow removed the old 20-API-call requirement; promotion is often quick but can take up to ~3 business days.",
      actor: "you",
      estMinutes: 15,
      evidence: {
        confidence: "claimed",
        note: "DocuSign announced a streamlined Go-Live in Apps & Keys that eliminated the 20-call requirement; promotion ranges minutes to ~3 business days.",
        sourceUrl: "https://support.docusign.com/s/articles/DocuSign-Developer-FAQs-Integration-Keys-and-Go-Live",
      },
    },
    {
      title: "Move credentials to production and re-consent",
      detail:
        "After approval, point your integration at the production base URI and re-run OAuth consent in production (demo consent does not carry over).",
      actor: "both",
      estMinutes: 20,
    },
  ],
  blockers: [
    {
      title: "Go-Live review is mandatory to reach production",
      description:
        "You cannot call the production API until your integration key passes Go-Live. It's usually fast, but it is a required gate that surprises teams who assumed demo success meant production readiness.",
      severity: "medium",
      typicalWait: "Minutes to ~3 business days; flagged reviews typically <48h",
      avoidableBy: "Plan a small buffer; exercise your real flows in demo before submitting.",
      evidence: {
        confidence: "claimed",
        note: "Go-Live is required for all new API integrations; it is part of DocuSign's audited trust processes.",
        sourceUrl: "https://support.docusign.com/s/articles/DocuSign-Developer-FAQs-Integration-Keys-and-Go-Live",
      },
    },
    {
      title: "Demo consent and keys don't carry to production",
      description:
        "Consent granted in demo and demo base URIs won't work in production — you must re-consent and repoint after promotion, a common last-mile gotcha.",
      severity: "low",
      avoidableBy: "Script the environment switch (base URI + production consent) ahead of go-live.",
      evidence: {
        confidence: "claimed",
        note: "DocuSign uses separate demo and production environments requiring separate consent; widely documented.",
        sourceUrl: "https://developers.docusign.com/platform/auth/",
      },
    },
  ],
  agentCanDo: [
    "Advise Authorization Code vs JWT grant for your use case.",
    "Scaffold the OAuth flow and eSignature API calls against demo.",
    "Generate a demo exercise plan so your integration has a healthy history pre-Go-Live.",
    "Script the demo→production environment switch (base URI + consent).",
  ],
  youMustDo: [
    "Own the DocuSign account and integration key.",
    "Submit the Go-Live request and complete production consent.",
    "Provide privacy policy and terms URLs.",
  ],
  sources: [
    {
      title: "Developer FAQs: Integration Keys and Go-Live — DocuSign",
      url: "https://support.docusign.com/s/articles/DocuSign-Developer-FAQs-Integration-Keys-and-Go-Live",
    },
    { title: "Authentication overview — DocuSign Developers", url: "https://developers.docusign.com/platform/auth/" },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

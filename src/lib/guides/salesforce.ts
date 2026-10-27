import type { Guide } from "@/lib/schema";

/**
 * Salesforce — the "the scary headline is usually the wrong headline" guide.
 * Common belief: "Salesforce integration takes months and a $999 review."
 * Reality for the agent-builder use case (let your users connect THEIR orgs):
 * you create a Connected App / External Client App, enable OAuth, and users
 * authorize — no AppExchange security review. The brutal $999, 2–4-month review
 * applies only to distributing a packaged app on the AppExchange marketplace.
 * We mark the Connected-App path "claimed" (well established, not run this
 * session) and the AppExchange fees/timelines "claimed" from 2026 guides.
 */
export const salesforce: Guide = {
  slug: "salesforce",
  appName: "Salesforce",
  appWebsite: "https://salesforce.com",
  logoEmoji: "☁️",
  summary:
    "Salesforce has a fearsome reputation — '$999 per attempt, months of security review' — but that reputation describes the WRONG path for most agent builders. If your goal is to let your users connect their own Salesforce org, you create a Connected App (now 'External Client App'), enable the OAuth flow, and users authorize it directly. No AppExchange security review is involved. The brutal security review ($999 per submission for paid apps, roughly 2–4 months end to end) is only required if you want to DISTRIBUTE a packaged app via the AppExchange marketplace. Pick your distribution model deliberately and the difficulty drops from 'brutal' to 'moderate'.",
  managedAuthAvailable: "yes",
  managedAuthNote:
    "Composio lists Salesforce among its managed-auth toolkits. Bring your own Connected App when you need org-specific control, your own branding, or specific OAuth scopes/policies.",
  difficulty: "moderate",
  time: {
    activeWork: "~1–2 hours for a Connected App",
    approvalWait: "none for a Connected App; AppExchange listing is a separate, much longer path (months)",
    evidence: {
      confidence: "claimed",
      note: "A Connected App is usable within/by orgs without an AppExchange security review; the review applies to managed-package distribution on AppExchange. Connected-App creation is standard Salesforce setup. Not executed in this session.",
      sourceUrl: "https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm&type=5",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "OAuth scopes (e.g. api, refresh_token, full) shape what your integration can do and what admins see, but they do not push you into the AppExchange security review. The review trigger is the distribution model (packaged AppExchange listing), not scope breadth.",
  },
  prerequisites: [
    "A Salesforce org you can administer (a free Developer Edition org works for building/testing).",
    "A callback/redirect URL your app controls.",
    "A decision: are you connecting your users' orgs (Connected App) or publishing a package on AppExchange (security review)?",
  ],
  steps: [
    {
      title: "Choose your distribution model — this decides everything",
      detail:
        "Connecting your users' own orgs? → Connected App path, no security review. Publishing a reusable managed package for any Salesforce customer to install from AppExchange? → ISV path with the full security review. Most AI-agent integrations are the former.",
      actor: "both",
      estMinutes: 15,
      evidence: {
        confidence: "claimed",
        note: "The AppExchange security review governs managed-package distribution; it is not required to use a Connected App to authorize users into their orgs.",
        sourceUrl: "https://appnigma.ai/blogs/salesforce-security-review-guide-2026/",
      },
    },
    {
      title: "Create a Connected App (External Client App) with OAuth enabled",
      detail:
        "In Setup, create the app, enable OAuth settings, set the callback URL, and select OAuth scopes (e.g. Manage user data via APIs 'api', Perform requests any time 'refresh_token offline_access'). Save and note that changes can take a few minutes to propagate.",
      actor: "both",
      estMinutes: 30,
      evidence: {
        confidence: "claimed",
        note: "Standard Connected App creation steps per Salesforce Help; the newer 'External Client App' framework is the current recommendation.",
        sourceUrl: "https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm&type=5",
      },
    },
    {
      title: "Capture the consumer key/secret and test the OAuth flow",
      detail:
        "Retrieve the consumer key and secret, store them securely, and run the authorization-code flow against your own dev org to confirm a working connection.",
      actor: "you",
      estMinutes: 30,
    },
    {
      title: "Handle per-org admin policies",
      detail:
        "Target org admins may need to pre-authorize your Connected App (via permission sets/profiles or IP relaxation). Document what an admin must click so your users' admins can approve quickly.",
      actor: "both",
      estMinutes: 20,
    },
  ],
  blockers: [
    {
      title: "AppExchange security review (only for marketplace distribution)",
      description:
        "If — and only if — you package your app and list it on the AppExchange, Salesforce requires a security review: reportedly $999 per submission for paid apps, with an initial pass on the order of 6–9 weeks plus 2–3 weeks per resubmission (plan ~2–4 months end to end). Free apps skip the fee but take the same review.",
      severity: "high",
      typicalWait: "~2–4 months end to end including resubmissions",
      cost: "$999 per submission attempt for paid apps (free apps: no fee, same review)",
      avoidableBy:
        "Use a Connected App to authorize your users' orgs instead of distributing a managed package on AppExchange.",
      evidence: {
        confidence: "claimed",
        note: "2026 practitioner guides report $999 per attempt and multi-week-to-multi-month timelines for the AppExchange security review; false-positive-only resubmissions may incur no extra fee.",
        sourceUrl: "https://appnigma.ai/blogs/salesforce-appexchange-security-review-fee-2026/",
      },
    },
    {
      title: "Edition and API access differences",
      description:
        "Not every Salesforce edition exposes API/OAuth access the same way; some lower editions restrict API access, which can block the OAuth flow for certain customers.",
      severity: "medium",
      evidence: {
        confidence: "uncertain",
        note: "API availability varies by edition and add-ons; we did not verify the current edition matrix in this session. Confirm against Salesforce edition docs for your target customers.",
      },
    },
  ],
  agentCanDo: [
    "Clarify which path you actually need (Connected App vs AppExchange) from your goal.",
    "Enumerate the OAuth scopes for your feature set and explain each.",
    "Draft admin-facing setup instructions your customers' admins can follow.",
    "If you do pursue AppExchange, pre-scan against common security-review failure categories.",
  ],
  youMustDo: [
    "Create the Connected App in your own Salesforce org and hold the consumer secret.",
    "Decide the distribution model (and, if AppExchange, pay and own the security review).",
    "Coordinate with target-org admins on authorization policies.",
  ],
  sources: [
    {
      title: "Create a Connected App — Salesforce Help",
      url: "https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm&type=5",
    },
    {
      title: "Salesforce AppExchange Security Review: 2026 Guide (fees, timeline)",
      url: "https://appnigma.ai/blogs/salesforce-security-review-guide-2026/",
    },
    {
      title: "AppExchange Security Review Fee in 2026: $999 per attempt",
      url: "https://appnigma.ai/blogs/salesforce-appexchange-security-review-fee-2026/",
    },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

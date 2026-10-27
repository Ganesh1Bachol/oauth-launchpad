import type { Guide } from "@/lib/schema";

/**
 * Stripe (Connect OAuth) — moderate, and a good "the recommended path moved" case.
 * Facts are grounded in Stripe's Connect OAuth docs and 2025–2026 reports. We did
 * not run the platform activation flow, so timelines are "claimed"/"uncertain".
 */
export const stripe: Guide = {
  slug: "stripe",
  appName: "Stripe (Connect)",
  appWebsite: "https://docs.stripe.com/connect",
  logoEmoji: "💳",
  summary:
    "Stripe's OAuth is Stripe Connect: your platform gets a client_id, you register redirect URLs, and users connect their Stripe account via a standard OAuth 2.0 code exchange. Test mode works instantly with a test client_id — no review. Going live means completing your platform profile so Stripe can activate it (compliance details about your business), which is usually quick rather than a weeks-long audit. One nuance worth knowing: Stripe now steers new platforms toward Connect Onboarding rather than OAuth, and OAuth connections stay on the v1 API, so confirm OAuth is the right path for your use case before building on it.",
  managedAuthAvailable: "unknown",
  managedAuthNote:
    "Stripe is commonly integrated via API keys rather than a managed OAuth app, so whether a managed OAuth shortcut applies depends on your platform — confirm against your integration provider. This guide covers bringing your own Connect platform.",
  difficulty: "moderate",
  time: {
    activeWork: "~1–2 hours",
    approvalWait: "none in test mode; platform activation for live is typically quick (not a multi-week audit)",
    evidence: {
      confidence: "claimed",
      note: "Stripe provides both test and live client_ids; test works immediately. Live platforms must complete a platform profile to activate. Per Stripe Connect docs; we did not run activation.",
      sourceUrl: "https://docs.stripe.com/connect/oauth-standard-accounts",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "Connect OAuth has coarse scopes (read_only vs read_write) rather than a long granular list, and scope choice does not trigger a separate review tier. The bigger decision is architectural — OAuth vs Connect Onboarding, and Standard vs Express vs Custom accounts.",
  },
  prerequisites: [
    "A Stripe account with Connect enabled (register as a platform).",
    "Redirect URL(s) your app controls, registered in your platform's OAuth settings.",
    "Business/compliance details on hand to complete your platform profile for live mode.",
  ],
  steps: [
    {
      title: "Confirm OAuth is the right Connect path",
      detail:
        "Stripe now recommends Connect Onboarding for most new platforms and keeps OAuth on the v1 API. If you specifically need the OAuth connect flow (e.g. connecting existing Standard accounts), proceed; otherwise evaluate Connect Onboarding first.",
      actor: "both",
      estMinutes: 15,
      evidence: {
        confidence: "claimed",
        note: "Stripe docs note OAuth isn't recommended for new platforms and that OAuth connections remain on v1 as of the Dec 2025 Accounts V2 release.",
        sourceUrl: "https://docs.stripe.com/connect/oauth-standard-accounts",
      },
    },
    {
      title: "Enable OAuth and copy your client_id",
      detail:
        "In your platform's Connect/OAuth settings, enable onboarding via OAuth and copy your client_id. Stripe issues separate test and live client_ids — build against test first.",
      actor: "both",
      estMinutes: 15,
      evidence: {
        confidence: "claimed",
        note: "Stripe generates a client_id per platform (test and live variants) used to start the OAuth flow.",
        sourceUrl: "https://docs.stripe.com/connect/oauth-standard-accounts",
      },
    },
    {
      title: "Register redirect URLs",
      detail:
        "Add every redirect_uri your app will use in the platform settings; Stripe only redirects back to URLs you've pre-registered.",
      actor: "both",
      estMinutes: 10,
    },
    {
      title: "Implement the OAuth code→token exchange",
      detail:
        "Redirect users to Stripe with your client_id, receive the authorization code on your redirect_uri, then POST to Stripe's OAuth token endpoint to get the connected account ID. Test end to end in test mode.",
      actor: "agent",
      estMinutes: 45,
    },
    {
      title: "Complete your platform profile to go live",
      detail:
        "Fill in your platform profile (business details, how you use Connect) so Stripe can activate live mode. This is where a human on your side provides compliance information; it gates live connections.",
      actor: "you",
      estMinutes: 30,
    },
  ],
  blockers: [
    {
      title: "Live activation requires a completed platform profile",
      description:
        "You can't take live connections until your Connect platform profile is complete and activated. It's generally fast, but it's a real gate — and the information is business/compliance data only you can provide.",
      severity: "medium",
      typicalWait: "Usually days or less; varies by account",
      avoidableBy: "Build and demo in test mode; complete the profile before launch.",
      evidence: {
        confidence: "uncertain",
        note: "Activation speed varies and isn't published as a firm SLA; treat as a planning estimate.",
      },
    },
    {
      title: "OAuth is a legacy-leaning path (v1 only)",
      description:
        "Because Stripe steers new platforms to Connect Onboarding and keeps OAuth on v1, building on OAuth may mean missing newer Accounts V2 capabilities. Not a blocker to shipping, but a strategic one.",
      severity: "low",
      avoidableBy: "Use Connect Onboarding if you don't specifically need the OAuth flow.",
      evidence: {
        confidence: "claimed",
        note: "Stripe docs direct OAuth platforms to continue on v1 until OAuth + v2 is supported for their use case.",
        sourceUrl: "https://docs.stripe.com/connect/oauth-standard-accounts",
      },
    },
  ],
  agentCanDo: [
    "Advise OAuth vs Connect Onboarding and Standard/Express/Custom for your use case.",
    "Scaffold the OAuth redirect + token-exchange code against test mode.",
    "Draft the platform profile narrative (how you use Connect).",
    "Enumerate the read_only vs read_write decision and its implications.",
  ],
  youMustDo: [
    "Register your platform and hold the live client_id / secret.",
    "Provide real business/compliance details to activate live mode.",
    "Own the decision to use OAuth (v1) vs Connect Onboarding.",
  ],
  sources: [
    {
      title: "Using OAuth with Standard accounts — Stripe Docs",
      url: "https://docs.stripe.com/connect/oauth-standard-accounts",
    },
    {
      title: "Connect OAuth reference — Stripe Docs",
      url: "https://docs.stripe.com/connect/oauth-reference",
    },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

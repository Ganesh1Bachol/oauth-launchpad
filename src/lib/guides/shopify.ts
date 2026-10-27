import type { Guide } from "@/lib/schema";

/**
 * Shopify — a crisp two-tier example developers hit constantly: a custom app for
 * one store installs instantly; a public App Store app is reviewed by Shopify.
 * Grounded in Shopify dev docs and 2025–2026 practitioner reports.
 */
export const shopify: Guide = {
  slug: "shopify",
  appName: "Shopify",
  appWebsite: "https://shopify.dev",
  logoEmoji: "🛍️",
  summary:
    "Shopify splits cleanly by distribution. A custom app built for a single store (or Plus org) installs directly and skips App Store review entirely — perfect for client-specific or internal work. A public app distributed through the Shopify App Store uses OAuth 2.0 and must pass Shopify's review before it can be listed; developers commonly report 7–14 days per review cycle. If your goal is to let your own/your client's store connect, you're in the fast lane; the review only matters if you want public, discoverable distribution. Note the 2025–2026 platform shifts: public apps must use the GraphQL Admin API, and new apps are created via the Dev/Partner Dashboard.",
  managedAuthAvailable: "unknown",
  managedAuthNote:
    "Integration platforms often cover Shopify via a custom app / Admin API token. Bring your own public app when you need App Store distribution, your own branding, or OAuth across many merchants.",
  difficulty: "moderate",
  time: {
    activeWork: "~1–2 hours for a custom app; more to prepare a public-app listing",
    approvalWait: "none for a custom app; ~7–14 days per review cycle for App Store listing",
    evidence: {
      confidence: "claimed",
      note: "Shopify reviews all public apps before listing (commonly 7–14 days/cycle); custom apps install directly without review. Per Shopify docs and 2025–2026 practitioner guides.",
      sourceUrl: "https://shopify.dev/docs/apps/launch/app-requirements-checklist",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "Access scopes shape what your app can read/write but don't by themselves trigger the App Store review — distribution does. One real exception: accessing protected customer data in a public app requires an additional Shopify approval step, so that specific data class raises the bar.",
  },
  scopeProfiles: [
    {
      id: "custom",
      label: "Custom app (one store)",
      difficulty: "easy",
      activeWork: "~1 hour",
      approvalWait: "none",
      note: "Built for a single store or Plus org. Installs directly via the Dev/Partner Dashboard with no Shopify review. Ideal for internal tools and client-specific builds.",
    },
    {
      id: "public",
      label: "Public App Store app",
      difficulty: "moderate",
      activeWork: "~1–2 days to prepare listing + fixes",
      approvalWait: "~7–14 days per review cycle",
      note: "OAuth 2.0 across many merchants, listed in the App Store after Shopify review against its requirements. Submit 2–3 weeks before launch; expect iteration.",
    },
    {
      id: "protected-data",
      label: "Public + protected customer data",
      difficulty: "hard",
      activeWork: "~2 days + data-protection docs",
      approvalWait: "App Store review + an additional protected-data approval",
      note: "If your public app needs protected customer data, Shopify requires an extra approval covering your data-protection practices on top of the standard review.",
    },
  ],
  prerequisites: [
    "A Shopify Partner account and a development store to test against.",
    "A redirect URL your app controls (for public-app OAuth).",
    "For public apps: compliance with Shopify's app requirements and GraphQL Admin API usage.",
  ],
  steps: [
    {
      title: "Choose custom vs public — this sets your whole path",
      detail:
        "Connecting one store (yours or a client's)? → custom app, no review. Distributing to any merchant via the App Store? → public app with Shopify review. Most single-merchant integrations are custom.",
      actor: "both",
      estMinutes: 15,
      evidence: {
        confidence: "claimed",
        note: "Custom apps are for specific merchants and skip App Store review; public apps are reviewed before listing.",
        sourceUrl: "https://shopify.dev/docs/apps/launch/distribution",
      },
    },
    {
      title: "Create the app in the Dev/Partner Dashboard",
      detail:
        "Create your app, set access scopes, and (for public apps) configure OAuth redirect URLs. As of 2025–2026, new apps are created via the Dev/Partner Dashboard and public apps use the GraphQL Admin API.",
      actor: "both",
      estMinutes: 30,
    },
    {
      title: "Implement auth and test on a development store",
      detail:
        "Custom app: use the Admin API access token. Public app: implement the OAuth 2.0 install flow and token exchange. Validate end to end on a dev store.",
      actor: "agent",
      estMinutes: 60,
    },
    {
      title: "(Public only) Prepare and submit your App Store listing",
      detail:
        "Meet Shopify's app requirements, prepare listing assets, and submit for review. Build in time for one or more review cycles.",
      actor: "you",
      estMinutes: 120,
    },
  ],
  blockers: [
    {
      title: "App Store review for public apps (optional for single-merchant use)",
      description:
        "Public, discoverable distribution requires passing Shopify's review against its app requirements — commonly 7–14 days per cycle, often iterative. Not needed to connect a single store via a custom app.",
      severity: "medium",
      typicalWait: "~7–14 days per review cycle; submit 2–3 weeks ahead",
      avoidableBy: "Use a custom app if you only need to connect specific stores.",
      evidence: {
        confidence: "claimed",
        note: "Shopify reviews all public apps before listing; community reports cluster at 7–14 days per cycle.",
        sourceUrl: "https://shopify.dev/docs/apps/launch/app-requirements-checklist",
      },
    },
    {
      title: "Protected customer data needs extra approval",
      description:
        "Public apps requesting protected customer data must pass an additional Shopify approval covering data-protection practices — a second gate beyond the standard review.",
      severity: "medium",
      avoidableBy: "Avoid protected customer data scopes unless your feature genuinely requires them.",
      evidence: {
        confidence: "claimed",
        note: "Shopify requires a separate protected-customer-data approval for apps accessing that data class.",
        sourceUrl: "https://shopify.dev/docs/apps/launch/protected-customer-data",
      },
    },
  ],
  agentCanDo: [
    "Decide custom vs public from your distribution goal.",
    "Enumerate the minimal access scopes and flag protected-data needs.",
    "Scaffold the OAuth install flow (public) or Admin API usage (custom).",
    "Draft App Store listing copy and a requirements self-check.",
  ],
  youMustDo: [
    "Own the Partner account and hold the app's secret.",
    "Decide your distribution model and submit any App Store listing yourself.",
    "Handle protected-customer-data approval if applicable.",
  ],
  sources: [
    { title: "App distribution — Shopify Dev", url: "https://shopify.dev/docs/apps/launch/distribution" },
    { title: "App requirements checklist — Shopify Dev", url: "https://shopify.dev/docs/apps/launch/app-requirements-checklist" },
    { title: "Protected customer data — Shopify Dev", url: "https://shopify.dev/docs/apps/launch/protected-customer-data" },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

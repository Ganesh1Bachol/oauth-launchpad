import type { Guide } from "@/lib/schema";

/**
 * GitHub — the "easy" end of the spectrum.
 * Grounded in GitHub's own OAuth app docs. The load-bearing fact (no GitHub
 * review is needed for an OAuth app to work for real users) is widely documented
 * and consistent with the docs we read; marked "claimed" because we did not run
 * the end-to-end flow in this session.
 */
export const github: Guide = {
  slug: "github",
  appName: "GitHub",
  appWebsite: "https://github.com",
  logoEmoji: "🐙",
  summary:
    "About as easy as OAuth gets. You register an OAuth app in Developer Settings, paste in a homepage URL and a callback URL, and it works for real users immediately — GitHub does not review or approve OAuth apps before they function. The only review GitHub runs is optional (listing in the GitHub Marketplace), and you do not need it to let users connect.",
  managedAuthAvailable: "yes",
  managedAuthNote:
    "Composio offers managed auth for GitHub, so you can skip registration entirely unless you need your own branding on the consent screen, your own rate-limit budget, or scopes beyond what the managed app offers.",
  difficulty: "easy",
  time: {
    activeWork: "~15 min",
    approvalWait: "none",
    evidence: {
      confidence: "claimed",
      note: "GitHub OAuth apps are usable as soon as they are created; there is no approval gate before an app can authorize real users. Consistent with GitHub's docs, which describe creation but no review step.",
      sourceUrl:
        "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "Broader scopes (e.g. repo, admin:org) mean users see a bigger consent prompt and may hesitate, but GitHub does not impose an extra approval tier or audit for broad scopes the way Google does. Request the narrowest scopes you need, mostly for user trust rather than to avoid review.",
  },
  prerequisites: [
    "A GitHub account (personal or organization).",
    "A homepage URL for your app (can be a simple landing page).",
    "A callback/redirect URL your app controls (e.g. https://yourapp.com/auth/github/callback).",
  ],
  steps: [
    {
      title: "Decide GitHub App vs OAuth App",
      detail:
        "For agent use-cases, a classic OAuth App is simplest. Consider a GitHub App instead if you want fine-grained, per-repository permissions and higher rate limits. This guide covers the OAuth App path.",
      actor: "both",
      estMinutes: 3,
      evidence: {
        confidence: "claimed",
        note: "GitHub documents both app types; GitHub Apps offer finer-grained permissions. This is a design choice, not a hard requirement.",
        sourceUrl:
          "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps",
      },
    },
    {
      title: "Register the OAuth app",
      detail:
        "Go to Settings → Developer settings → OAuth Apps → New OAuth App. Fill in Application name, Homepage URL, and Authorization callback URL (you can add up to 10 callback URLs). Description is optional.",
      actor: "both",
      estMinutes: 5,
      evidence: {
        confidence: "verified",
        note: "Confirmed against GitHub's creating-an-oauth-app doc in this session: required fields are Application name, Homepage URL, and Authorization callback URL; description is optional; up to 10 callback URLs allowed.",
        sourceUrl:
          "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
      },
    },
    {
      title: "Generate and store a client secret",
      detail:
        "After creating the app, generate a client secret. Store the client ID and secret in your backend secret manager. The agent can scaffold the env-var wiring, but a human should be the one to hold the actual secret.",
      actor: "both",
      estMinutes: 3,
    },
    {
      title: "Wire up the OAuth flow and test with your own account",
      detail:
        "Implement the authorization-code redirect and token exchange, then connect your own GitHub account end to end. No GitHub approval is required to do this — it works right away.",
      actor: "you",
      estMinutes: 10,
    },
  ],
  blockers: [
    {
      title: "GitHub Marketplace listing (optional, not needed to connect users)",
      description:
        "If you want your app listed in the GitHub Marketplace, that listing is reviewed against GitHub's requirements. This is entirely optional — your users can connect without it. Do not confuse 'listed in Marketplace' with 'allowed to work'.",
      severity: "low",
      avoidableBy:
        "Skip the Marketplace listing; distribute your OAuth app link directly.",
      evidence: {
        confidence: "claimed",
        note: "GitHub Marketplace listings are reviewed; OAuth apps themselves are not gated on that review. Matches the private-vs-public pattern seen across providers.",
        sourceUrl:
          "https://docs.github.com/en/apps/github-marketplace/listing-an-app-on-github-marketplace/writing-a-listing-description-for-your-app",
      },
    },
    {
      title: "Per-owner OAuth app cap",
      description:
        "A user or organization can own up to 100 OAuth apps. Not a real constraint for a single integration, but worth knowing at scale.",
      severity: "low",
      evidence: {
        confidence: "verified",
        note: "Confirmed in GitHub's creating-an-oauth-app doc: 'A user or organization can own up to 100 OAuth apps.'",
        sourceUrl:
          "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
      },
    },
  ],
  agentCanDo: [
    "Confirm which scopes your feature set actually needs and justify the smallest set.",
    "Draft the homepage URL content and a privacy policy stub if you don't have one.",
    "Scaffold the OAuth redirect + token-exchange code and env-var wiring.",
    "Pre-fill the registration form values for you to paste.",
  ],
  youMustDo: [
    "Create the OAuth app under your own GitHub account/org (you are the owner).",
    "Hold the client secret in your secret manager.",
    "Authorize the app the first time to confirm the flow.",
  ],
  preparedArtifacts: [
    {
      type: "scopes",
      title: "Minimal scopes for a typical agent",
      content:
        "read:user      — basic profile\nuser:email     — the user's email address\n\n# Add ONLY if your features need them:\nrepo           — full control of private repos (broad; users will notice)\npublic_repo    — public repos only (prefer this over `repo` when possible)\nread:org       — read org membership",
      note: "Request the smallest set — scope breadth mostly affects user trust, not GitHub approval.",
    },
    {
      type: "console-path",
      title: "Where to register",
      content: "GitHub → Settings → Developer settings → OAuth Apps → New OAuth App",
    },
    {
      type: "code",
      title: "OAuth code→token exchange",
      language: "ts",
      content:
        'const res = await fetch("https://github.com/login/oauth/access_token", {\n  method: "POST",\n  headers: { Accept: "application/json", "Content-Type": "application/json" },\n  body: JSON.stringify({\n    client_id: process.env.GITHUB_CLIENT_ID,\n    client_secret: process.env.GITHUB_CLIENT_SECRET,\n    code, // from the ?code=... callback\n    redirect_uri: process.env.GITHUB_REDIRECT_URI,\n  }),\n});\nconst { access_token } = await res.json();',
    },
    {
      type: "env",
      title: "Env template",
      content:
        "GITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\nGITHUB_REDIRECT_URI=https://yourapp.com/auth/github/callback",
    },
  ],
  sources: [
    {
      title: "Creating an OAuth app — GitHub Docs",
      url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
    },
    {
      title: "Differences between GitHub Apps and OAuth Apps — GitHub Docs",
      url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps",
    },
  ],
  overallConfidence: "claimed",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

import type { Guide } from "@/lib/schema";

/**
 * Slack — "moderate", and a clean teaching example of the two-tier pattern.
 * The three-tier distribution model (undistributed / unlisted / Marketplace) was
 * read directly from Slack's distribution docs in this session, so those
 * structural facts are marked "verified". Marketplace review timelines are not
 * published, so they are "uncertain".
 */
export const slack: Guide = {
  slug: "slack",
  appName: "Slack",
  appWebsite: "https://slack.com",
  logoEmoji: "💬",
  summary:
    "Getting your own users connected to Slack is fast and requires no Slack review: you create an app, pick scopes, and either install it to your own workspace or distribute it unlisted so any workspace can authorize via OAuth. Review only enters the picture if you want to be listed in the Slack Marketplace — which you do NOT need in order to let users connect. The 'moderate' rating is mostly the up-front scope and OAuth configuration, not an approval wait.",
  managedAuthAvailable: "yes",
  managedAuthNote:
    "Composio provides managed auth for Slack. Bring your own app when you need your own branding, your own scope set, or your app to appear as your product (not Composio) in the install flow.",
  difficulty: "moderate",
  time: {
    activeWork: "~30–45 min",
    approvalWait: "none to connect users; Marketplace listing adds a review (timeline not published)",
    evidence: {
      confidence: "verified",
      note: "Slack's distribution docs (read this session) state you can install to your own workspace immediately and distribute 'unlisted' to any workspace via OAuth with no submission; only Marketplace listing is reviewed.",
      sourceUrl: "https://docs.slack.dev/app-management/distribution",
    },
  },
  scopeSensitivity: {
    level: "low",
    detail:
      "Slack has many granular scopes (bot vs user tokens, channels:read, chat:write, etc.) so getting the scope set right takes thought, and broad scopes can slow a Marketplace review. But for simply letting users connect, scope breadth does not trigger an extra approval tier.",
  },
  prerequisites: [
    "A Slack account and a workspace you can install a test app into.",
    "A redirect URL your app controls for the OAuth callback.",
    "A decision on which scopes (and whether you need a bot token, a user token, or both).",
  ],
  steps: [
    {
      title: "Create a Slack app",
      detail:
        "At api.slack.com/apps, create a new app (from scratch or a manifest). You associate it with a development workspace at creation time.",
      actor: "both",
      estMinutes: 5,
      evidence: {
        confidence: "verified",
        note: "Slack docs: when you create an app you associate it with a workspace and can install it there immediately.",
        sourceUrl: "https://docs.slack.dev/app-management/quickstart-app-settings",
      },
    },
    {
      title: "Configure OAuth scopes and redirect URLs",
      detail:
        "Under OAuth & Permissions, add the bot/user scopes your features need and register your redirect URL(s). This is the step that most rewards an agent enumerating the minimal scope set for you.",
      actor: "both",
      estMinutes: 15,
    },
    {
      title: "Install to your own workspace and test",
      detail:
        "Click 'Install App to Workspace' to get an access token and test the full flow. No Slack review is required for this.",
      actor: "you",
      estMinutes: 10,
      evidence: {
        confidence: "verified",
        note: "Slack docs explicitly allow immediate install to your own workspace with no review.",
        sourceUrl: "https://docs.slack.dev/app-management/distribution",
      },
    },
    {
      title: "Turn on distribution (unlisted) to onboard other workspaces",
      detail:
        "Enable public distribution so any workspace can authorize via the OAuth 'Add to Slack' flow. Slack calls this 'perfect for running a pilot' — still no review required.",
      actor: "you",
      estMinutes: 5,
      evidence: {
        confidence: "verified",
        note: "Slack docs describe 'unlisted distributed' apps that any workspace can install via OAuth without submission.",
        sourceUrl: "https://docs.slack.dev/app-management/distribution",
      },
    },
  ],
  blockers: [
    {
      title: "Slack Marketplace listing requires review (optional)",
      description:
        "Only if you want to appear in the curated Slack Marketplace do you submit for review against Slack's Marketplace guidelines & requirements. This is for commercial, discoverable distribution — not a prerequisite for your users to connect.",
      severity: "medium",
      typicalWait: "Not published by Slack; community reports range widely.",
      avoidableBy:
        "Distribute 'unlisted' and share your 'Add to Slack' link directly.",
      evidence: {
        confidence: "verified",
        note: "Slack docs: Marketplace-listed apps are 'reviewed against our requirements & guidelines'; unlisted distribution needs no submission.",
        sourceUrl: "https://docs.slack.dev/app-management/distribution",
      },
    },
    {
      title: "Workspace admins can restrict app installation",
      description:
        "Even with no Slack review, a target workspace's admins may require admin approval before members can install your app. This is per-workspace policy, outside your control.",
      severity: "low",
      evidence: {
        confidence: "claimed",
        note: "Slack workspaces commonly enforce app-approval policies; this affects install success regardless of your app's status.",
        sourceUrl: "https://slack.com/help/articles/222386767-Manage-app-approval-for-your-workspace",
      },
    },
  ],
  agentCanDo: [
    "Enumerate the minimal bot/user scopes for your feature list and explain each.",
    "Generate an app manifest you can paste to create the app in one shot.",
    "Scaffold the 'Add to Slack' OAuth flow and token storage.",
    "Draft the Marketplace listing copy if you later choose to list.",
  ],
  youMustDo: [
    "Create the app under your own Slack account.",
    "Install it to a workspace you control and confirm the flow.",
    "Decide whether you need a Marketplace listing (and submit it yourself if so).",
  ],
  sources: [
    {
      title: "Distributing Slack apps — Slack docs",
      url: "https://docs.slack.dev/app-management/distribution",
    },
    {
      title: "App settings quickstart — Slack docs",
      url: "https://docs.slack.dev/app-management/quickstart-app-settings",
    },
  ],
  overallConfidence: "verified",
  generatedBy: "curated",
  generatedAt: "2026-10-27",
};

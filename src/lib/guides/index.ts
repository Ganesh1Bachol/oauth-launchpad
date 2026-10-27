import { Guide as GuideSchema, type Guide, toSummary } from "@/lib/schema";
import { github } from "./github";
import { slack } from "./slack";
import { googleGmail } from "./google-gmail";
import { salesforce } from "./salesforce";
import { stripe } from "./stripe";
import { metaFacebook } from "./meta-facebook";
import { plaid } from "./plaid";
import { shopify } from "./shopify";
import { docusign } from "./docusign";

/**
 * All curated guides, validated against the Zod schema at module load.
 * If any curated guide drifts out of shape, this throws at startup rather than
 * rendering something broken — the same schema the live agent must satisfy.
 */
const raw: Guide[] = [
  github,
  slack,
  googleGmail,
  salesforce,
  stripe,
  metaFacebook,
  plaid,
  shopify,
  docusign,
];

export const curatedGuides: Guide[] = raw.map((g) => GuideSchema.parse(g));

export function getGuide(slug: string): Guide | undefined {
  return curatedGuides.find((g) => g.slug === slug);
}

export function getCuratedSummaries() {
  // Order easy → hard for a sensible default library layout.
  const rank: Record<Guide["difficulty"], number> = {
    easy: 0,
    moderate: 1,
    hard: 2,
    brutal: 3,
  };
  return [...curatedGuides]
    .sort((a, b) => rank[a.difficulty] - rank[b.difficulty])
    .map(toSummary);
}

import { NextResponse } from "next/server";
import { generateGuide } from "@/lib/agent";

// The agent runs several web searches, so give the route room (Vercel Pro: up to 300s).
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The live-generation agent needs an ANTHROPIC_API_KEY. The curated guides work without one — add a key to .env.local to enable live generation.",
      },
      { status: 503 },
    );
  }

  let app: unknown;
  try {
    ({ app } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof app !== "string" || app.trim().length < 2) {
    return NextResponse.json(
      { error: "Please provide an app name or URL." },
      { status: 400 },
    );
  }
  if (app.length > 120) {
    return NextResponse.json({ error: "That input is too long." }, { status: 400 });
  }

  try {
    const guide = await generateGuide(app.trim());
    return NextResponse.json({ guide });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "The agent could not produce a guide.";
    // Surface a readable reason; the client shows this to the user.
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/**
 * Housing research agent.
 *
 * Uses Claude with web search + web fetch to find homes for sale that a
 * low-income family in Orange County, CA could realistically buy, then writes
 * them to src/data/listings.json in the app's Listing shape.
 *
 * Run:   npm run research:housing
 * Needs: ANTHROPIC_API_KEY in .env.local (or the environment)
 *
 * Options (env vars):
 *   RESEARCH_AREA       default "Orange County, California"
 *   RESEARCH_MAX_PRICE  default 600000
 *   RESEARCH_LIMIT      default 25 (target number of listings)
 */
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// Load .env.local if present, without adding a dotenv dependency.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const AREA = process.env.RESEARCH_AREA ?? "Orange County, California";
const MAX_PRICE = Number(process.env.RESEARCH_MAX_PRICE ?? 600000);
const LIMIT = Number(process.env.RESEARCH_LIMIT ?? 25);
const OUT_FILE = path.join("src", "data", "listings.json");
const MODEL = "claude-opus-5-5";

const client = new Anthropic();

// ---------- Phase 1: research on the web ----------

const RESEARCH_PROMPT = `You are a housing researcher helping affordable-housing non-profits.

Find up to ${LIMIT} homes currently for sale (or open for application) in ${AREA} that a low-income family could realistically buy, priced at or below $${MAX_PRICE.toLocaleString("en-US")}.

Look in two kinds of places:
1. Affordable-homeownership programs: Habitat for Humanity affiliates, community land trusts, city and county below-market-rate / inclusionary ownership programs, deed-restricted units, and HUD homes. Program homes are often sold by lottery or application; include them with their application status.
2. Low-priced market listings: condos, townhomes, and manufactured homes on public listing pages.

Rules:
- Only include homes you found on a page you actually opened in this research. Never invent addresses, prices, or URLs.
- Prefer sources updated recently. If a page has no date or looks stale, say so in the notes.
- For each home, record: full address (or the program's development name if the exact unit is not public), city, price, bedrooms, monthly HOA if stated, whether it is part of an affordable program (and which one), any income limit or eligibility rule, and the source URL.
- If you cannot find ${LIMIT}, return fewer. Quality over quantity.

Finish with a plain list of every home you found, one per line, with all of the fields above.`;

async function research(): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: RESEARCH_PROMPT },
  ];

  // Server tools can pause a long turn; re-send to let the server continue.
  for (let round = 0; round < 8; round++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "high" },
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 20 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 25 },
      ],
      messages,
    });

    stream.on("streamEvent", (event) => {
      if (
        event.type === "content_block_start" &&
        event.content_block.type === "server_tool_use"
      ) {
        const input = event.content_block.input as { query?: string; url?: string };
        process.stdout.write(
          `  ${event.content_block.name}: ${input.query ?? input.url ?? "..."}\n`,
        );
      }
    });

    const response = await stream.finalMessage();

    if (response.stop_reason === "refusal") {
      throw new Error(`Research was declined: ${response.stop_details?.explanation ?? "no details"}`);
    }
    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }

    return response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
  }
  throw new Error("Research did not finish after 8 rounds");
}

// ---------- Phase 2: turn the notes into structured listings ----------

const ListingSchema = z.object({
  address: z.string().describe("Street address, or development name if the unit is not public"),
  city: z.string(),
  price: z.number().describe("Sale price in USD; 0 if not stated"),
  bedrooms: z.number(),
  monthlyHoa: z.number().describe("Monthly HOA in USD; 0 if none or not stated"),
  affordableProgram: z.boolean(),
  programName: z.string().nullable(),
  eligibility: z.string().nullable().describe("Income limit or other eligibility rule, if stated"),
  status: z.string().nullable().describe("For example: for sale, lottery open, waitlist"),
  url: z.string().describe("Source page URL"),
  notes: z.string().nullable(),
});

const ResultSchema = z.object({ listings: z.array(ListingSchema) });

async function extract(notes: string) {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "low", format: zodOutputFormat(ResultSchema) },
    messages: [
      {
        role: "user",
        content: `Convert these housing research notes into structured listings. Copy values exactly; do not add homes that are not in the notes. Drop any home that has no source URL.\n\n<notes>\n${notes}\n</notes>`,
      },
    ],
  });
  if (!response.parsed_output) throw new Error("Could not parse listings from the research notes");
  return response.parsed_output.listings;
}

// ---------- Main ----------

async function main() {
  console.log(`Researching homes in ${AREA} under $${MAX_PRICE.toLocaleString("en-US")}...`);
  const notes = await research();
  const found = await extract(notes);

  const listings = found.map((l, i) => ({ id: `r${i + 1}`, ...l }));

  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  const previous = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : null;
  const output = {
    researchedAt: new Date().toISOString(),
    area: AREA,
    maxPrice: MAX_PRICE,
    listings,
  };
  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + "\n");
  writeFileSync(path.join("src", "data", "research-notes.md"), notes + "\n");

  console.log(`Saved ${listings.length} listings to ${OUT_FILE}${previous ? " (replaced previous run)" : ""}`);
  console.log("Raw notes saved to src/data/research-notes.md. Check sources before the demo.");
}

main().catch((err) => {
  if (err instanceof Anthropic.AuthenticationError) {
    console.error("Missing or invalid ANTHROPIC_API_KEY. Add it to .env.local.");
  } else if (err instanceof Anthropic.RateLimitError) {
    console.error("Rate limited. Wait a minute and run again.");
  } else {
    console.error(err);
  }
  process.exit(1);
});

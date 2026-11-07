# Clear It: UCI Impact Lab housing hackathon

Our team's project for the **AI Impact Lab on affordable homeownership** at **UC Irvine** (one Saturday).

> Local non-profits in affordable housing for low-income families face many challenges. This Impact Lab puts AI to work on the technical challenges that stand in the way. Teams prototype a scalable, repeatable solution that makes owning a home financially sustainable.

## The problem

In Orange County, a faster path to building housing already exists on paper: ministerial approval. If a project meets the written rules and uses state-approved plans, the city must approve it, with no hearing. In practice almost nobody uses this path. Each of OC's 34 cities has its own forms, fees and checklists, cities often misread state law, and most applications come back incomplete or need several rounds of corrections.

**Our question:** how do we make the fast path easy enough that it becomes the normal path?

## Our idea: Clear It

**TurboTax for ADU permits**, starting with **Newport Beach**. Newport's ADU guidebook says applications typically need 2 to 3 review rounds of 10 to 20 business days each. Clear It aims to move the typical project to **one review cycle**.

The applicant answers step-by-step questions about their lot and project. The app then shows:

- **Forms needed**
- **Departments that must sign off**
- **Fees that apply**
- **Issues likely to trigger a correction letter**, each with a plain-English fix
- **Ready-to-submit status**

Pass/fail comes from written rules based on Newport's ADU submittal checklist and state ADU law (Gov. Code §§ 66310–66342). Every rule cites its source. The AI helps with intake, explanations and reading uploaded documents, but it doesn't make the pass/fail decision. This is not legal advice.

Full context: [`docs/lane-brief.md`](docs/lane-brief.md) (source of truth) and [`docs/project-context.md`](docs/project-context.md) (summary). Implementation specs go in [`.plans/`](.plans/); to write one, run `/jmo-workflow:interview` in Claude Code.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4
- API routes in `src/app/api/*` for the rules checks and AI calls

## Getting started

Requirements: Node.js 20 or later, and npm.

```bash
git clone https://github.com/MotionGuy/UCI_housing_crisis_hackathon.git
cd UCI_housing_crisis_hackathon
npm install
cp .env.example .env.local   # then add your API keys
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Makes a production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Runs the TypeScript compiler without output |

## Project structure

```
src/
  app/
    page.tsx                 Intake + results (placeholder for now)
    layout.tsx               Root layout
    globals.css              Tailwind entry point
    api/
      adu/check/route.ts     POST: ADU answers -> fast-path verdict, checks, documents, fees
      housing/route.ts       GET: homes from the housing research agent (or sample data)
  data/
    listings.json            Homes found by the housing research agent
  lib/
    adu/                     Clear It rules engine (types, Newport data, state law, evaluate)
    types.ts, sample-data.ts Listing types and samples for the housing agent
scripts/
  research-housing.ts        Housing research agent (Claude + web search)
docs/
  lane-brief.md              Original project context (source of truth)
  project-context.md         Shared brief for the team and Claude agents
  clear-it-newport.md        Newport Beach ADU research (state law, city rules, HCD findings, fees)
  forms/newport-beach/       City forms and reference PDFs, with an index
.claude/agents/              Project subagents (project-context, rules-checks, app-builder, pitch-storyline)
.plans/                      Specs written by /jmo-workflow:interview
```

## Housing research agent

`scripts/research-housing.ts` is an AI agent that finds homes for sale in Orange County by itself. It uses Claude (`claude-opus-5-5`) with web search and web fetch to:

1. Search affordable-homeownership programs (Habitat for Humanity, community land trusts, city below-market-rate programs, HUD homes) and low-priced market listings.
2. Open each source page and record address, price, bedrooms, HOA, program, eligibility and status.
3. Save the results to `src/data/listings.json`, and its raw notes to `src/data/research-notes.md`.

`/api/housing` serves these listings automatically. Until the agent has run once, it serves sample data.

**Run it locally** (takes a few minutes; add `ANTHROPIC_API_KEY` to `.env.local` first):

```bash
npm run research:housing
```

Change the search with environment variables: `RESEARCH_AREA`, `RESEARCH_MAX_PRICE` (default 600000) and `RESEARCH_LIMIT` (default 25).

**Run it in the background on GitHub:** the workflow in `.github/workflows/research-housing.yml` runs the agent on GitHub's servers and commits the new listings. It has no schedule; it runs only when someone starts it. First add a repository secret named `ANTHROPIC_API_KEY` (**Settings → Secrets and variables → Actions**), then open **Actions → Housing research agent → Run workflow**.

The agent only records homes from pages it opened, but always check the source links before you show a listing in the demo.

## How we work together

- **One owner per area.** Split the work by workstream (requirements, checks, app, pitch) so that people do not edit the same files.
- **Small PRs, often.** Branch from `main`, open a PR early, and merge after one teammate approves. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Issues are the task board.** Each piece of work is an issue. Assign it to yourself before you start.
- **`main` always runs.** Do not merge a PR that breaks `npm run build`.
- **Secrets stay out of git.** Keep API keys in `.env.local` and add each new variable name to `.env.example`.
- **Demo first.** At about two hours before the end, stop new features and make the demo path work from start to finish.

## Claude Code workflow

The team uses the `jmo-workflow` plugin:

| Skill | Use it to |
| --- | --- |
| `/jmo-workflow:interview` | Write the implementation spec into `.plans/` |
| `/jmo-workflow:better-ui` | Polish surfaces, icons and spacing |
| `/jmo-workflow:animate` | Add motion that has a purpose |
| `/jmo-workflow:ste` | Rewrite unclear docs in Standard Technical English |
| `/jmo-workflow:agentation` | Add a visual feedback toolbar to the Next.js app |

## License

[MIT](LICENSE)

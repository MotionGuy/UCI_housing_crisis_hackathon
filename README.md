# UCI Impact Lab: Affordable Homeownership

Our team's project for the **AI Impact Lab on affordable homeownership** at **UC Irvine** (one Saturday).

> Local non-profits in affordable housing for low-income families face many challenges. This Impact Lab puts AI to work on the technical challenges that stand in the way. Teams prototype a scalable, repeatable solution that makes owning a home financially sustainable.

## The problem

A low-income family that wants to own a home has to solve several problems at the same time:

1. **What homes can we get right now?** Listings change every day, and affordable-housing programs (non-profit builds, down-payment assistance, deed-restricted units) are spread across many sites.
2. **Can we afford it on our current income?** The price is not enough. The family needs the full monthly cost: mortgage, property tax, insurance and HOA, compared with what they earn.
3. **Can a better job close the gap?** If the home is out of reach, a higher-paying job that matches the family's skills can change the answer.
4. **Does daily life still work?** The commute to work and to the children's schools must stay within limits the family sets.

Most tools answer only one of these questions. We treat it as **one multi-level problem**.

## Our idea

An app where a family enters their income, job, skills, household and commute limits. The app then:

- **Finds available homes**, with a focus on affordable and program-eligible listings.
- **Checks affordability** for each home against current income (front-end and back-end debt-to-income ratios).
- **Matches jobs** to the family's skills, ranks the higher-paying ones, and helps them apply.
- **Checks commutes** from each home to the job and to each child's school against the family's limits.
- **Combines the results** into a short list: "This home works today", or "This home works if you get one of these jobs".

The full implementation spec goes in [`.plans/`](.plans/). To write it, run `/jmo-workflow:interview` in Claude Code.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4
- API routes in `src/app/api/*` for the AI, listings, jobs and maps calls

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
    page.tsx                 Home page (family intake + results)
    layout.tsx               Root layout
    globals.css              Tailwind entry point
    api/
      affordability/route.ts POST: affordability for one home
      housing/route.ts       GET: available homes (agent results or sample data)
      jobs/route.ts          GET: job matches for a skill set (stub)
      commute/route.ts       POST: commute times (stub)
  data/
    listings.json            Homes found by the research agent
  lib/
    types.ts                 Shared types (Household, Listing, Job, ...)
    affordability.ts         Mortgage and debt-to-income math
scripts/
  research-housing.ts        Housing research agent (Claude + web search)
docs/
  problem-space.md           Notes, research and non-profit contacts
.plans/                      Specs written by /jmo-workflow:interview
```

Each API route returns stub data, so the frontend can be built at the same time as the backend. Replace each stub with a real data source when it is ready.

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

- **One owner per area.** Split the work by layer (housing, affordability, jobs, commute, UI) so that people do not edit the same files.
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

# UCI Impact Lab: Affordable Homeownership

Our team's project for the **AI Impact Lab on affordable homeownership** at **UC Irvine** (one Saturday).

> Local non-profits in affordable housing for low-income families face many challenges. This Impact Lab puts AI to work on the technical challenges that stand in the way. Teams prototype a scalable, repeatable solution that makes owning a home financially sustainable.

## Our project: Clear it

**TurboTax for ADU permits in Newport Beach.**

California law gives accessory dwelling units (ADUs) a fast path: if an ADU meets the written rules, the city **must** approve the building permit without a hearing. But each of Orange County's 34 cities has its own forms, fees and checklists, and the state regularly tells cities they've read the law wrongly. Homeowners can't tell if they qualify or what to submit, so the fast path stays rare.

Clear it asks a homeowner a few plain questions, then:

1. Checks the ADU against Newport Beach's rules and state law, citing each rule.
2. **Fills out the city's permit forms** (building permit application, and the Coastal Development Permit affidavit when needed) as downloadable PDFs.
3. Lists what's still needed, the fees, the next steps, and the homeowner's rights under state law, including where the city's own pages contradict the law.

Research and sources: [docs/clear-it-newport.md](docs/clear-it-newport.md). Every city form, with what each one is: [docs/forms/newport-beach/](docs/forms/newport-beach/README.md).

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
| `npm run forms:sample` | Fills the city forms with sample data into `sample-forms/` |

## Project structure

```
src/
  app/page.tsx               Home page: the ADU wizard
  components/wizard/
    adu-wizard.tsx           The 7 interview steps
    results.tsx              Verdict, filled-form downloads, checklist, fees, rights
    ui.tsx                   Card, option rows, inputs (dark design)
  lib/adu/
    types.ts                 Interview answers and results
    state-law.ts             California ADU law limits, with citations
    newport-beach.ts         Newport Beach rules, documents, fees, links
    evaluate.ts              Answers in, verdict and checklist out
  lib/forms/
    fill.ts                  Fills the city's PDF forms (pdf-lib), field map included
    types.ts                 Owner, applicant, designer, contractor
  app/api/adu/check/route.ts POST: run the rule check from another client
public/forms/newport-beach/  Blank fillable forms the app fills in
docs/
  clear-it-newport.md        Research: rules, HCD findings, how to submit
  forms/newport-beach/       Every city form, examples, reference PDFs
scripts/
  fill-sample-forms.ts       npm run forms:sample: fills the forms with sample data
  research-housing.ts        Earlier idea: housing research agent (not used by Clear it)
```

The `api/housing`, `api/jobs`, `api/commute` routes and `lib/affordability.ts` are from our earlier idea and aren't used by Clear it. Delete them if nobody needs them.


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

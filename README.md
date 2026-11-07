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
docs/
  lane-brief.md              Original project context (source of truth)
  project-context.md         Shared brief for the team and Claude agents
.claude/agents/              Project subagents (project-context)
.plans/                      Specs written by /jmo-workflow:interview
```

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

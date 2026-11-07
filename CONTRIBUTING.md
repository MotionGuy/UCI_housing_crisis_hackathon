# Contributing

This is a one-day hackathon. These rules exist to keep `main` working and to stop teammates from overwriting each other's work.

## Branches

- `main` is the demo branch. It must always build and run.
- Make a new branch from the latest `main` for each task:

  ```bash
  git checkout main
  git pull
  git checkout -b <type>/<short-description>
  ```

- Branch types:

  | Prefix | Use for |
  | --- | --- |
  | `feat/` | New features (`feat/intake-steps`) |
  | `fix/` | Bug fixes (`fix/setback-check`) |
  | `ui/` | Styling and layout (`ui/results-cards`) |
  | `docs/` | README, specs, notes |
  | `chore/` | Config, dependencies, tooling |

## Commits

- Commit small and often.
- Write the message in the imperative: `Add setback check for detached ADUs`, not `added stuff`.

## Pull requests

1. Push your branch: `git push -u origin <branch>`.
2. Open a PR into `main`: `gh pr create --fill`.
3. Fill in the PR template. Link the issue with `Closes #<number>`.
4. Before you ask for a review, run:

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

5. Get **one approval** from a teammate, then **squash and merge**.
6. Delete the branch after the merge.

Keep PRs small: one feature or fix each. A PR that is open for more than an hour is too big. Split it.

## Merge conflicts

If GitHub reports a conflict:

```bash
git checkout main
git pull
git checkout <your-branch>
git merge main
# fix the conflicts, then
git add .
git commit
git push
```

If you are not sure how to fix a conflict, ask the person who owns that file.

## Issues

- Use the **Feature** or **Bug** template.
- Assign the issue to yourself before you start, so that two people do not do the same work.
- Use labels for the workstream: `requirements`, `checks`, `app`, `pitch`.

## Secrets and data

- Never commit API keys. Put them in `.env.local`, which git ignores.
- When you add a new environment variable, add its name (no value) to `.env.example`.
- Do not commit real applicant data (names, addresses, plans). Use made-up sample applications.

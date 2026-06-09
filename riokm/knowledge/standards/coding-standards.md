---
created: 2026-06-07
updated: 2026-06-07
validated: 2026-06-07
content_type: coding_standards
project: connect4
system: connect-x
purpose: "Define the mandatory coding standards agents must follow when changing the Connect X repository."
status: current
source: "Migrated from .cursor/rules/global.mdc on 2026-06-07."
applies_to:
  - "**/*"
semantic_tags:
  - coding_standards
  - agent_rules
  - javascript
  - guardrails
---

# Connect4 Coding Standards

These are the **mandatory** rules for any change to the `connect4` (Connect X)
repository. They apply to all files and override stylistic preference. They were
migrated from `.cursor/rules/global.mdc` so that riokm is the single source of
truth for how agents work in this repo.

## Language Requirements

- Always use **JavaScript** for code in this repo, regardless of the task. Do not
  introduce TypeScript, transpilers, or other languages.

## Preserve Existing Functionality

- When changing code, ensure **no existing functionality is lost**, unless the
  user explicitly asked for it to be removed.
- Preserve existing game logic and gameplay behavior.

## Best Practices

- Maintain clean, readable code that matches the surrounding style.
- Test changes before committing.

## Verification

This repo has **no automated test, lint, or build step** (`package.json` defines
only `dev` and `start`). "Test changes before committing" therefore means manual
verification:

1. Run `pnpm dev` (or `pnpm start`) to serve on port `8000`. The script kills any
   process already on `8000`, so it is safe to re-run.
2. Open `http://localhost:8000/` in a browser.
3. Watch the browser console for errors and exercise the feature you changed.

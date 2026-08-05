---
content_type: article
article:
  lifecycle:
    status: current
    created: 2026-06-07
    updated: 2026-06-07
    validated: 2026-06-07
project: connect4
system: connect-x
purpose: Define the mandatory coding standards agents must follow when changing the Connect X repository.
source: Migrated from .cursor/rules/global.mdc on 2026-06-07.
applies_to:
- '**/*'
semantic_tags:
- coding_standards
- agent_rules
- javascript
- guardrails
riokm:
  generated_purpose: Explains mandatory coding and verification rules for changes to the connect4 Connect X repository.
  generated_keywords:
  - connect4
  - connect-x
  - javascript
  - preserve-existing-functionality
  - game-logic
  - manual-verification
  - pnpm-dev
  - port-8000
  - browser-console
  generated_summary: The article defines repository-wide coding standards for connect4, requiring JavaScript only and preservation of existing game behavior unless removal is explicitly requested. It notes there is no automated test, lint, or build step, so verification requires running pnpm dev or start on port 8000, opening the app, checking the browser console, and manually exercising the changed feature.
  generated_at: 2026-06-13T18:45:29-04:00
  generated_hash: a310f0595f2f837e
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

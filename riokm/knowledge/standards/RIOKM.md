---
generated: true
generated_date: 2026-09-04
generated_at: 2026-09-04T23:49:09.837258-04:00
generator: tools/riokm
---

# Standards Knowledge

This directory contains project standards for the Connect4 codebase, especially
constraints around using JavaScript and preserving existing gameplay behavior. Search
here before making code changes to understand repository-wide implementation rules and
the expected manual verification workflow, including running the app on port 8000 and
checking behavior in the browser.

## Articles

- [Connect4 Coding Standards](coding-standards.md):
  Purpose: Explains mandatory coding and verification rules for changes to the connect4
  Connect X repository.
  Summary: The article defines repository-wide coding standards for connect4,
  requiring JavaScript only and preservation of existing game behavior unless removal
  is explicitly requested. It notes there is no automated test, lint, or build step,
  so verification requires running pnpm dev or start on port 8000, opening the app,
  checking the browser console, and manually exercising the changed feature.
  Keywords: `connect4`, `connect-x`, `javascript`, `preserve-existing-functionality`,
  `game-logic`, `manual-verification`, `pnpm-dev`, `port-8000`, `browser-console`

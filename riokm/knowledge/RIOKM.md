---
generated: true
generated_date: 2026-09-09
generated_at: 2026-09-09T03:49:13.492773-04:00
generator: tools/riokm
---

# RioKM Knowledge

This knowledge space documents the Connect X / Connect4 project — a static Three.js
browser game whose entire runtime (board logic, minimax AI, themes, audio, persistence,
UI wiring) lives inline in a single `DOMContentLoaded` closure in `script.js`, with
`js/game-logic.js` and `js/audio.js` present but never imported. It combines project
context, reference notes on the actual code structure (including locating functions
by line number and avoiding the dead module files), and coding standards covering
JavaScript-only constraints, behavior preservation, and the manual verification workflow
of serving the app on port 8000 and testing in the browser. Search here when developing,
navigating, or reviewing the Connect4 codebase, or before making changes that must
follow its repository rules and verification process.

## Subdirectories

- [Decisions](decisions/RIOKM.md): This directory contains knowledge articles related
  to decisions.
- [Projects](projects/RIOKM.md): This area currently centers on the Connect X / Connect4
  project: a static Three.js browser game whose gameplay, UI wiring, audio, AI, themes,
  and persistence are concentrated in `script.js`. Search here when working on the
  game’s runtime behavior, frontend assets, minimax AI, audio/theme systems, local dev
  flow, or documentation alignment around the project’s architecture.
- [Reference](reference/RIOKM.md): Reference material on the Connect4 codebase's
  actual runtime structure, centered on the fact that the live application lives
  entirely inside a single `DOMContentLoaded` closure in `script.js` rather than in
  modular files. Board logic, the minimax AI, themes, audio, and persistence are all
  reimplemented inline there, while `js/game-logic.js` and `js/audio.js` exist but are
  never imported. Search here when navigating or modifying Connect4 application code —
  especially to locate functions (by line number, since nothing is exported top-level)
  or to avoid mistakenly editing the unused module files.
- [Specifications](specifications/RIOKM.md): This directory contains knowledge articles
  related to specifications.
- [Standards](standards/RIOKM.md): This directory contains project standards for the
  Connect4 codebase, especially constraints around using JavaScript and preserving
  existing gameplay behavior. Search here before making code changes to understand
  repository-wide implementation rules and the expected manual verification workflow,
  including running the app on port 8000 and checking behavior in the browser.

## Use This Directory For

- Durable knowledge articles committed with this RioKM knowledge space.
- Directory-level RIOKM.md indexes for agent navigation.

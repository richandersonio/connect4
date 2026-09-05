---
generated: true
generated_date: 2026-09-04
generated_at: 2026-09-04T23:49:09.837258-04:00
generator: tools/riokm
knowledge_space: connect4
---

# RIOKM Index

This index holds the RioKM knowledge space for the Connect X / Connect4 project, a
static Three.js browser game whose full runtime — board logic, minimax AI, themes,
audio, persistence, and UI wiring — lives inline in a single DOMContentLoaded closure
in `script.js`, while `js/game-logic.js` and `js/audio.js` exist but are never imported.
It gathers project context, code-navigation reference notes (function locations by
line number, warnings about the dead module files), and coding standards enforcing
JavaScript-only constraints, behavior preservation, and manual verification by
serving the app on port 8000 and testing in the browser. Search here when developing,
navigating, or reviewing the Connect4 codebase, or before making changes that must
comply with its repository rules and verification workflow.

## Directory Indexes

- [RioKM](riokm/knowledge/RIOKM.md): This knowledge space documents the Connect
  X / Connect4 project — a static Three.js browser game whose entire runtime (board
  logic, minimax AI, themes, audio, persistence, UI wiring) lives inline in a single
  `DOMContentLoaded` closure in `script.js`, with `js/game-logic.js` and `js/audio.js`
  present but never imported. It combines project context, reference notes on the actual
  code structure (including locating functions by line number and avoiding the dead
  module files), and coding standards covering JavaScript-only constraints, behavior
  preservation, and the manual verification workflow of serving the app on port 8000
  and testing in the browser. Search here when developing, navigating, or reviewing the
  Connect4 codebase, or before making changes that must follow its repository rules and
  verification process.

## Navigating

Indexes are generated into committed `RIOKM.md` files and mirrored under `.riokm/`
for cache freshness checks. Do not edit generated indexes by hand; run `riokm index rebuild`
after changing durable articles under `riokm/knowledge/`.

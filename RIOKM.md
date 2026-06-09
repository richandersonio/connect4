---
knowledge_space: connect4
---

# Connect4

Connect4 is a small browser game repo for **Connect X**, a Three.js-based
Connect Four implementation with a 3D board, selectable space-themed
backgrounds, local music controls, player-vs-player mode, and player-vs-AI
mode.

## Knowledge Areas

- [Project Overview](riokm/knowledge/projects/connect4.md): what the app is,
  how it is structured, and what agents should know before changing it.
- [Coding Standards](riokm/knowledge/standards/coding-standards.md): mandatory
  rules for changing this repo — JavaScript only, preserve existing
  functionality, and how to verify changes.
- [script.js Navigation Map](riokm/knowledge/reference/script-js-map.md):
  function-by-function line index for the ~3,800-line `script.js`, plus which
  `js/` modules are live vs. orphaned.

## Workflows

- Run the app locally with `pnpm start` or `pnpm dev`, which serves the static
  browser app on port `8000`.
- Open `index.html` through the local HTTP server rather than directly from the
  filesystem so ES modules and Three.js imports work consistently.

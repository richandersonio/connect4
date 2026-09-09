---
generated: true
generated_date: 2026-09-09
generated_at: 2026-09-09T03:52:33.284156-04:00
generator: tools/riokm
---

# Projects Knowledge

This area currently centers on the Connect X / Connect4 project: a static Three.js
browser game whose gameplay, UI wiring, audio, AI, themes, and persistence are
concentrated in `script.js`. Search here when working on the game’s runtime behavior,
frontend assets, minimax AI, audio/theme systems, local dev flow, or documentation
alignment around the project’s architecture.

## Articles

- [Connect4](connect4.md):
  Purpose: Explains the Connect X static browser game architecture, live files, AI
  logic, persisted state, and editing guidance.
  Summary: Connect X is a static Three.js Connect Four game served from `index.html`,
  `styles.css`, and a largely self-contained `script.js`. The live gameplay, UI wiring,
  audio behavior, themes, minimax AI, and persistence all live inline in `script.js`,
  while `js/game-logic.js` and `js/audio.js` are orphaned modules. Agents should keep
  the pinned Three.js versions in sync, use the script navigation map, test via `pnpm
  start`, and preserve README/profile alignment when architecture changes.
  Keywords: `connect-x`, `static-browser-game`, `three-js`, `script-js`, `minimax`,
  `alpha-beta-pruning`, `localstorage`, `orphaned-modules`, `jsdelivr-import-map`,
  `pnpm-start`

## Use This Directory For

- Repo identity and purpose summaries.
- GitHub URL, visibility, default branch, and local checkout path.
- Key technology stacks and important paths.
- Common build, test, and development commands.

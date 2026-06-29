---
generated: true
generated_date: 2026-06-13
generated_at: 2026-06-13T18:46:04.606932-04:00
generator: tools/riokm
---

# RioKM Knowledge

RioKM Knowledge captures working guidance for the Connect X / Connect4 browser game,
with emphasis on its monolithic `script.js` runtime, Three.js frontend behavior, AI/
minimax logic, audio, themes, persistence, and local verification workflow. Agents
should search here before changing or diagnosing the game so they can understand where
behavior actually lives, which helper files are unused or secondary, and what standards
preserve existing gameplay while testing via the local browser flow.

## Subdirectories

- [Projects](projects/RIOKM.md): This area currently centers on the Connect X / Connect4
  project: a static Three.js browser game whose gameplay, UI wiring, audio, AI, themes,
  and persistence are concentrated in `script.js`. Search here when working on the
  game’s runtime behavior, frontend assets, minimax AI, audio/theme systems, local dev
  flow, or documentation alignment around the project’s architecture.
- [Reference](reference/RIOKM.md): This directory orients agents to the live Connect4
  codebase structure, especially the fact that the working application behavior is
  concentrated inside `script.js` rather than exported modules. Search here when you
  need to locate or reason about board logic, AI/minimax, themes, audio, persistence, or
  navigation through the monolithic `DOMContentLoaded` implementation, and when deciding
  whether helper files like `js/game-logic.js` or `js/audio.js` are actually used by
  the app.
- [Standards](standards/RIOKM.md): This directory contains project standards for the
  Connect4 codebase, especially constraints around using JavaScript and preserving
  existing gameplay behavior. Search here before making code changes to understand
  repository-wide implementation rules and the expected manual verification workflow,
  including running the app on port 8000 and checking behavior in the browser.

## Use This Directory For

- Durable knowledge articles committed with this RioKM knowledge space.
- Directory-level RIOKM.md indexes for agent navigation.

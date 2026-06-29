---
generated: true
generated_date: 2026-06-13
generated_at: 2026-06-13T18:46:04.606932-04:00
generator: tools/riokm
knowledge_space: connect4
---

# RIOKM Index

RIOKM Index is the top-level entry point for knowledge about the Connect X / Connect4
browser game and its implementation reality. Search here when an agent needs orientation
before modifying gameplay, Three.js rendering, AI/minimax behavior, audio, themes,
persistence, or verification workflows, especially to understand that the active runtime
is concentrated in `script.js` and that local browser testing is expected.

## Directory Indexes

- [RioKM](riokm/knowledge/RIOKM.md): RioKM Knowledge captures working guidance for
  the Connect X / Connect4 browser game, with emphasis on its monolithic `script.js`
  runtime, Three.js frontend behavior, AI/minimax logic, audio, themes, persistence, and
  local verification workflow. Agents should search here before changing or diagnosing
  the game so they can understand where behavior actually lives, which helper files are
  unused or secondary, and what standards preserve existing gameplay while testing via
  the local browser flow.

## Navigating

Indexes are generated into committed `RIOKM.md` files and mirrored under `.riokm/`
for cache freshness checks. Do not edit generated indexes by hand; run `riokm index rebuild`
after changing durable articles under `riokm/knowledge/`.

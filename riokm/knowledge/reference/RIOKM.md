---
generated: true
generated_date: 2026-08-05
generated_at: 2026-08-05T19:41:04.187052-04:00
generator: tools/riokm
---

# Reference Knowledge

Reference material on the Connect4 codebase's actual runtime structure, centered on the
fact that the live application lives entirely inside a single `DOMContentLoaded` closure
in `script.js` rather than in modular files. Board logic, the minimax AI, themes,
audio, and persistence are all reimplemented inline there, while `js/game-logic.js` and
`js/audio.js` exist but are never imported. Search here when navigating or modifying
Connect4 application code — especially to locate functions (by line number, since
nothing is exported top-level) or to avoid mistakenly editing the unused module files.

## Articles

- [`script.js` Navigation Map](script-js-map.md):
  Purpose: Maps live Connect4 `script.js` functions and warns that core logic is inline
  while `js/` modules are dead code.
  Summary: Explains that the live Connect4 application is implemented inside one
  `DOMContentLoaded` closure in `script.js`, so functions are not top-level exports
  and should be found by line number. It highlights that `js/game-logic.js` and `js/
  audio.js` are not imported, with board logic, AI/minimax, themes, audio, and
  persistence reimplemented inline in `script.js`.
  Keywords: `script-js`, `navigation-map`, `domcontentloaded`, `inline-ai-minimax`,
  `dead-code`, `game-logic-js`, `audio-js`, `localstorage`, `three-js`, `connect4-theme`

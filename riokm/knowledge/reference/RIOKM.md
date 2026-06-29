---
generated: true
generated_date: 2026-06-13
generated_at: 2026-06-13T18:46:04.606932-04:00
generator: tools/riokm
---

# Reference Knowledge

This directory orients agents to the live Connect4 codebase structure, especially the
fact that the working application behavior is concentrated inside `script.js` rather
than exported modules. Search here when you need to locate or reason about board
logic, AI/minimax, themes, audio, persistence, or navigation through the monolithic
`DOMContentLoaded` implementation, and when deciding whether helper files like `js/game-
logic.js` or `js/audio.js` are actually used by the app.

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

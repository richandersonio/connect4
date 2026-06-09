---
created: 2026-06-07
updated: 2026-06-07
validated: 2026-06-07
content_type: project_profile
project: connect4
system: connect-x
purpose: "Provide the durable project profile and operating context for the Connect X browser game."
status: current
semantic_tags:
  - project_profile
  - browser_game
  - three_js
  - ai_gameplay
---

# Connect4

`connect4` is the repository for **Connect X**, a static browser game that
implements Connect Four with a 3D board, space-themed visuals, optional music,
and player-vs-player or player-vs-AI modes.

## App Purpose

The app is a playable web version of Connect Four. Players drop pieces into a
7-column by 6-row board and win by connecting four pieces horizontally,
vertically, or diagonally. The game can be played by two local players or by one
player against an AI opponent.

## Runtime Shape

- The app is served as static HTML, CSS, and JavaScript.
- `package.json` defines `pnpm dev` and `pnpm start`. Both first kill whatever is
  bound to port `8000` (`lsof -ti:8000 | xargs kill -9`) and then run
  `python3 -m http.server 8000`, so re-running them is safe/idempotent.
- The browser entry point is `index.html`.
- The active application module is `script.js`, which is largely self-contained.
- Three.js is **pinned in two places that must stay in sync**: the `three`
  dependency in `package.json` (`^0.181.0`) and the jsDelivr import map in
  `index.html` (`three@0.181.0`). The running app loads Three from the CDN import
  map, not from `node_modules`. Upgrading Three means changing both.

## Main Capabilities

- 3D Connect Four board rendered with Three.js.
- Orbit-style camera controls for rotation, zoom, and pan.
- Player-vs-player and player-vs-AI game modes.
- AI difficulty settings: easy, medium, and hard.
- Hard AI uses minimax with alpha-beta pruning.
- Theme/background choices include deep space, nebula, galaxy, aurora, retro
  grid, and matrix styles.
- Music selection uses Dr Future tracks from public S3 URLs.
- Drop and win sound effects are generated from embedded audio data.

## Key Files

- `index.html`: document structure, game controls, import map, audio elements,
  and `script.js` module loading.
- `styles.css`: app layout and visual styling.
- `script.js`: **the live application.** Three.js scene setup, board rendering,
  UI wiring, themes, animation, AND all gameplay — board state, win/draw
  detection, valid moves, AI difficulty logic, minimax, and board evaluation are
  all implemented **inline here**. See the
  [script.js Navigation Map](../reference/script-js-map.md) to locate functions
  (the file is ~3,800 lines with everything nested in one closure).
- `js/config.js`: shared constants. **Only `MUSIC_TRACKS` is actually imported**
  (by `script.js`). Its other exports — `GAME_CONFIG`, `STAR_LAYERS`,
  `BACKGROUNDS`, `QUOTES` — are not imported by the live app.

### Dead / unused modules (do not edit expecting a visible effect)

- `js/game-logic.js` (`GameLogic` class) and `js/audio.js` (`AudioManager` class)
  are **not imported anywhere**. The live game logic and audio are reimplemented
  inline in `script.js`. Editing these classes changes nothing the user sees.
  Treat them as legacy/orphaned until they are deleted or rewired.

## Persisted State

`script.js` persists UI and game state to `localStorage`; these survive a page
reload, so functions that touch them have durable side effects. Keys:
`connect4Theme`, `connect4PlayerNames`, `connect4MusicTrack`,
`connect4CameraState`, `connect4InstructionsClosed`.

## Agent Notes

- Follow the [Coding Standards](../standards/coding-standards.md) for any code
  change: JavaScript only, never drop existing functionality without an explicit
  request, and verify manually (no automated tests exist).
- Treat the repo as a static browser game, not a framework app.
- To find code in `script.js`, use the
  [script.js Navigation Map](../reference/script-js-map.md) rather than grepping
  — its functions are closure-scoped and not greppable as top-level symbols.
- The live gameplay/AI is inline in `script.js`; `js/game-logic.js` and
  `js/audio.js` are orphaned. Edit the inline code, not the classes.
- Prefer testing through `pnpm start` and `http://localhost:8000/`.
- Keep `README.md` and this profile aligned when the game architecture changes.
  (The README was refreshed on 2026-06-07 to match the current `script.js`-based
  code; the old `game.js` description is gone.)

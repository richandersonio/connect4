---
article:
  lifecycle:
    created: 2026-06-07
    updated: 2026-06-07
    validated: 2026-06-07
    status: current
content_type: null
project: connect4
system: connect-x
purpose: Navigation map of script.js so agents can jump to the right code without reading the whole 3,800-line file.
semantic_tags:
  - code_map
  - navigation
  - script_js
  - three_js
riokm:
  generated_purpose: Maps live Connect4 `script.js` functions and warns that core logic is inline while `js/` modules are dead code.
  generated_keywords:
    - script-js
    - navigation-map
    - domcontentloaded
    - inline-ai-minimax
    - dead-code
    - game-logic-js
    - audio-js
    - localstorage
    - three-js
    - connect4-theme
  generated_summary: Explains that the live Connect4 application is implemented inside one `DOMContentLoaded` closure in `script.js`, so functions are not top-level exports and should be found by line number. It highlights that `js/game-logic.js` and `js/audio.js` are not imported, with board logic, AI/minimax, themes, audio, and persistence reimplemented inline in `script.js`.
  generated_at: 2026-06-13T18:45:19-04:00
  generated_hash: e2603adc06cddee0
---

# `script.js` Navigation Map

`script.js` is the **live application** and is ~3,800 lines. Every function below
is nested inside a single `document.addEventListener("DOMContentLoaded", ...)`
closure (line 5), so the functions are **not exported and not greppable as
top-level symbols** — use these line numbers to navigate.

> Line numbers are accurate as of `validated` above. If the file has changed
> since, re-derive with `grep -nE '^\s*(async )?function ' script.js`.

## What is actually wired up

`script.js` imports only:

- `MUSIC_TRACKS` from `./js/config.js`
- `THREE` and `OrbitControls` from the CDN import map

**It does not import `js/game-logic.js` or `js/audio.js`.** Those modules
(`GameLogic`, `AudioManager`) and the other `config.js` exports (`GAME_CONFIG`,
`STAR_LAYERS`, `BACKGROUNDS`, `QUOTES`) are **not imported anywhere** — they are
effectively dead code. The board state, win/draw logic, AI/minimax, themes,
quotes, and audio are all **reimplemented inline in `script.js`**. Edit the
inline versions below; editing the `js/` classes changes nothing the user sees.

## Lifecycle / bootstrap

- `DOMContentLoaded` callback — line 5 (wraps everything)
- `init()` — 3346 (top-level UI + control wiring)
- `initThreeJS()` — 519 (scene, renderer, camera, OrbitControls, input listeners)
- `initGame()` — 2241 (game/board state reset)
- `animate(time)` — 444 (render loop; drives each theme's `update(time)`)

## Player names

- `loadPlayerNames()` — 312
- `savePlayerNames()` — 326
- `updatePlayerLabels()` — 2438
- `setupPlayerNameClickHandlers()` — 2448

## Camera persistence

- `saveCameraState()` — 463
- `loadCameraState()` — 483

## Backgrounds / themes

- `createStars()` — 646
- `createMatrixRain()` — 837
- `createRetroGrid()` — 1021 (`snapToGrid()` helper — 1063)
- `createNebulaClouds()` — 1373 / `createNebulaTexture()` — 1400
- `createAuroraEffect()` — 1454
- `createGalaxySpiral()` — 1517
- `applyUITheme(theme)` — 1587
- `changeBackground(backgroundType)` — 1729
- `updateBoardAndPiecesTheme()` — 1797
- `checkStarsVisibility()` — 1838

## Scrolling quote text

- `createScrollingText()` — 1851 (`createText(quote)` — 1870)

## Board & pieces

- `createBoard()` — 2031
- `createPiece(player, col, row)` — 2069
- `getLowestEmptyRow(col)` — 2429
- `dropPieceAnimation(piece, targetY, callback)` — 2302 (`update()` — 2307)
- `dropPiece(col)` — 2340

## Input handling

- `onMouseMove(event)` — 2096
- `onMouseClick()` — 2135
- `onWindowResize()` — 2152
- `onTouchStart/Move/End(event)` — 2175 / 2181 / 2187
- `handleTouch(touch)` — 2202

## Turn / status display

- `makeAIMove()` — 2412
- `updateCurrentPlayerDisplay()` — 2496
- `updateFullscreenGameInfo()` — 2517
- `updateGameStatus(text, color)` — 2979

## Win / draw detection (inline — the live copy)

- `checkWin(col, row)` — 2526
- `checkDraw()` — 2564

## AI (inline — the live copy; `js/game-logic.js` is NOT used)

- `getAIMove()` — 2569
- `getEasyAIMove()` — 2582
- `getMediumAIMove()` — 2589
- `getHardAIMove()` — 2619 (minimax path)
- `findWinningMove(player)` — 2632
- `getValidMoves()` — 2648
- `findBestMove(depth)` — 2658
- `minimax(depth, alpha, beta, isMaximizing)` — 2682
- `evaluateBoard()` — 2729 / `evaluateWindow(window)` — 2788

## Win effects

- `explodePieces()` — 2801
- `createExplosionParticles()` — 2825 / `updateExplosion()` — 2919
- `showVictoryMessage(winner)` — 2935
- `createRestartOverlay()` — 2964

## Modals / misc

- `sayHello(name)` — 3014
- `showInputModal(message, defaultValue)` — 3060
- `showInfoModal(message)` — 3247

## Fullscreen

- `toggleFullscreen()` — 3481
- `enterFullscreen()` — 3489 / `exitFullscreen()` — 3508
- `handleFullscreenChange()` — 3524
- `updateFullscreenRenderer(isFullscreen)` — 3552

## Music

- `changeTrack(trackIndex)` — 3615 (`attemptPlay()` — 3657)

## Persisted state (localStorage)

`script.js` reads/writes these keys; changes survive a page reload:

- `connect4Theme` — selected background/theme
- `connect4PlayerNames` — player name strings
- `connect4MusicTrack` — selected music track index
- `connect4CameraState` — camera position + OrbitControls target
- `connect4InstructionsClosed` — whether the instructions panel was dismissed

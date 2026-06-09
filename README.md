# Connect X

**[Play the game online](https://connectxgame.vercel.app/)**

A 3D implementation of the classic Connect Four game built with Three.js, HTML, CSS, and JavaScript. Features a rotatable 3D board, space-themed backgrounds, music, and player-vs-AI play.

## Features

- 3D board rendered with Three.js, with orbit camera controls (rotate, zoom, pan)
- Player-vs-player and player-vs-AI modes
- AI difficulty levels: easy, medium, and hard (hard uses minimax with alpha-beta pruning)
- Selectable space themes: deep space, nebula, galaxy, aurora, retro grid, and matrix
- Music selection and generated drop/win sound effects
- Win detection (horizontal, vertical, and diagonal) and draw detection
- Persists theme, player names, music, camera position, and UI preferences via localStorage

## Running Locally

This is a static app that uses ES modules and a Three.js import map, so it must be served over HTTP (not opened directly from the filesystem):

1. Run `pnpm dev` (or `pnpm start`) — both serve the app on port `8000`
2. Open `http://localhost:8000/` in your browser

## How to Play

1. Players take turns clicking a column to drop their disc
2. The first player to connect four discs in a row (horizontally, vertically, or diagonally) wins
3. If the board fills up without a winner, the game is a draw

## 🎵 Soundtrack 🎵

Get ready to groove with awesome retro tunes by [Dr Future](https://soundcloud.com/dr-future)!
Drop those discs to the beat! 🎮 🎶

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Music Credits

Music by [Dr Future](https://soundcloud.com/dr-future)

## Project Structure

- `index.html` - Document structure, controls, Three.js import map, and module loading
- `styles.css` - Game styling and layout
- `script.js` - The live application: Three.js scene, board rendering, UI, themes, animation, and all gameplay/AI logic (implemented inline)
- `js/config.js` - Shared constants; `MUSIC_TRACKS` is consumed by `script.js`

> Note: `js/game-logic.js` and `js/audio.js` exist but are not currently wired into the app (`script.js` reimplements that logic inline).

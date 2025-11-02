// Game Configuration and Constants
export const GAME_CONFIG = {
  // Board dimensions
  ROWS: 6,
  COLS: 7,
  
  // Player constants
  EMPTY: 0,
  RED: 1,
  YELLOW: 2,
  
  // Animation
  ANIMATION_DURATION: 1000, // ms
  AI_DELAY_MIN: 500,
  AI_DELAY_MAX: 1500,
  
  // 3D rendering constants
  BOARD_COLOR: 0x2c3e50,
  RED_COLOR: 0xe74c3c,
  YELLOW_COLOR: 0xf1c40f,
  CELL_SIZE: 1,
  PIECE_RADIUS: 0.4,
  BOARD_THICKNESS: 0.2,
  SPACE_COLOR: 0x000000,
  GUIDE_GREEN: 0x00ff00,
  
  // Camera settings
  CAMERA_FOV: 45,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_POSITION: { x: 0, y: 10, z: 15 },
  
  // Controls
  MIN_DISTANCE: 7.5,
  MAX_DISTANCE: 22.5,
  MAX_POLAR_ANGLE: Math.PI / 2,
};

// Star layer configurations
export const STAR_LAYERS = [
  {
    count: 1500,
    size: 1.2,
    color: 0xffffff,
    speed: 0.0003,
    twinkleSpeed: 0.008,
  },
  {
    count: 1000,
    size: 0.8,
    color: 0xccccff,
    speed: 0.0004,
    twinkleSpeed: 0.01,
  },
  {
    count: 500,
    size: 1.5,
    color: 0xffffee,
    speed: 0.00035,
    twinkleSpeed: 0.006,
  },
];

// Background themes
export const BACKGROUNDS = {
  space: {
    name: "Deep Space",
    color: 0x000000,
    starLayers: STAR_LAYERS,
    fogColor: null,
    fogDensity: 0,
    boardColor: 0x2c3e50,
    redPieceColor: 0xe74c3c,
    yellowPieceColor: 0xf1c40f,
    holeColor: 0x000000,
  },
  nebula: {
    name: "Cosmic Nebula",
    color: 0x0a0a2a,
    starLayers: [
      {
        count: 1000,
        size: 1.2,
        color: 0xffffff,
        speed: 0.0003,
        twinkleSpeed: 0.008,
      },
      {
        count: 800,
        size: 0.8,
        color: 0xaaccff,
        speed: 0.0004,
        twinkleSpeed: 0.01,
      },
    ],
    fogColor: 0x5500aa,
    fogDensity: 0.01,
    boardColor: 0x3a1155,
    redPieceColor: 0xff5577,
    yellowPieceColor: 0xaaddff,
    holeColor: 0x000022,
  },
  galaxy: {
    name: "Spiral Galaxy",
    color: 0x050510,
    starLayers: [
      {
        count: 2000,
        size: 1.0,
        color: 0xffffcc,
        speed: 0.0005,
        twinkleSpeed: 0.01,
      },
      {
        count: 1000,
        size: 0.7,
        color: 0xffddaa,
        speed: 0.0003,
        twinkleSpeed: 0.008,
      },
    ],
    fogColor: 0x221133,
    fogDensity: 0.008,
    boardColor: 0x554477, // Lighter purple for better visibility
    redPieceColor: 0xff9966,
    yellowPieceColor: 0xffffaa,
    holeColor: 0x000011,
  },
  aurora: {
    name: "Space Aurora",
    color: 0x001122,
    starLayers: [
      {
        count: 1200,
        size: 1.0,
        color: 0xaaffee,
        speed: 0.0004,
        twinkleSpeed: 0.009,
      },
      {
        count: 800,
        size: 0.6,
        color: 0x88ffaa,
        speed: 0.0005,
        twinkleSpeed: 0.01,
      },
    ],
    fogColor: 0x003344,
    fogDensity: 0.015,
    boardColor: 0x004455,
    redPieceColor: 0xff5566,
    yellowPieceColor: 0x88ffaa,
    holeColor: 0x001122,
  },
  retro: {
    name: "Retro Grid",
    color: 0x000022,
    starLayers: [
      {
        count: 800,
        size: 1.0,
        color: 0xff00ff,
        speed: 0.0004,
        twinkleSpeed: 0.01,
      },
      {
        count: 600,
        size: 0.7,
        color: 0x00ffff,
        speed: 0.0005,
        twinkleSpeed: 0.012,
      },
    ],
    fogColor: 0x330066,
    fogDensity: 0.02,
    boardColor: 0x330066,
    redPieceColor: 0xff00ff,
    yellowPieceColor: 0x00ffff,
    holeColor: 0x000033,
  },
  matrix: {
    name: "Digital Matrix",
    color: 0x000000,
    starLayers: [
      {
        count: 500,
        size: 0.8,
        color: 0x00ff00,
        speed: 0.0003,
        twinkleSpeed: 0.01,
      },
    ],
    fogColor: 0x003300,
    fogDensity: 0.01,
    boardColor: 0x003300,
    redPieceColor: 0xff3333,
    yellowPieceColor: 0x00ff00,
    holeColor: 0x000000,
  },
};

// Game quotes for scrolling text
export const QUOTES = [
  "Click on a column to drop your disc",
  "Connect 4 discs in a row to win",
  "You can connect horizontally, vertically, or diagonally",
  "Player 1 always goes first, then Player 2",
  "Use left-click and drag to rotate the board",
  "Use the scroll wheel to zoom in and out",
  "Right-click and drag to pan the view",
  "Play against a friend or challenge the AI",
  "Choose different AI difficulty levels",
  "Click Reset Game to start over",
];

// Music tracks
export const MUSIC_TRACKS = [
  "https://s3.amazonaws.com/richanderson00.public/music/drfuture/Dr Future - Lightforce (FTL Edit).mp3",
  "https://s3.amazonaws.com/richanderson00.public/music/drfuture/Dr Future - International Karate (Part I).mp3",
  "https://s3.amazonaws.com/richanderson00.public/music/drfuture/DrFuture_-_Speedball.mp3",
  "https://s3.amazonaws.com/richanderson00.public/music/drfuture/DrFuture_-_Xenon_Ready_Player_1.mp3",
  "https://s3.amazonaws.com/richanderson00.public/music/drfuture/shades.mp3",
];

import { MUSIC_TRACKS } from './js/config.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.addEventListener("DOMContentLoaded", () => {
  // Game constants
  const ROWS = 6;
  const COLS = 7;
  const EMPTY = 0;
  const RED = 1;
  const YELLOW = 2;
  const ANIMATION_DURATION = 1000; // ms

  // 3D constants
  const BOARD_COLOR = 0x2c3e50;
  const RED_COLOR = 0xe74c3c;
  const YELLOW_COLOR = 0xf1c40f;
  const CELL_SIZE = 1;
  const PIECE_RADIUS = 0.4;
  const BOARD_THICKNESS = 0.2;
  const SPACE_COLOR = 0x000000;
  const GUIDE_GREEN = 0x00ff00;
  const STAR_COUNT = 3000;
  const STAR_LAYERS = [
    {
      count: 1500,
      size: 1.2,
      color: 0xffffff,
      speed: 0.0003,
      twinkleSpeed: 0.008,
    }, // Bright white stars
    {
      count: 1000,
      size: 0.8,
      color: 0xccccff,
      speed: 0.0004,
      twinkleSpeed: 0.01,
    }, // Slightly blue-tinted white stars
    {
      count: 500,
      size: 1.5,
      color: 0xffffee,
      speed: 0.00035,
      twinkleSpeed: 0.006,
    }, // Slightly warm white stars
  ];
  const FLOATING_OBJECTS = [];

  // Background options
  const BACKGROUNDS = {
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
      // UI Theme
      uiTheme: {
        primary: "#00ff00",
        secondary: "#00cc00",
        background: "#121212",
        surface: "rgba(30, 30, 30, 0.7)",
        text: "#e0e0e0",
        accent: "#00ff00",
        border: "#00ff00",
        glow: "rgba(0, 255, 0, 0.3)"
      }
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
      // UI Theme
      uiTheme: {
        primary: "#aaccff",
        secondary: "#ff5577",
        background: "#0a0a2a",
        surface: "rgba(58, 17, 85, 0.8)",
        text: "#e0e0e0",
        accent: "#5500aa",
        border: "#aaccff",
        glow: "rgba(170, 204, 255, 0.4)"
      }
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
      // UI Theme
      uiTheme: {
        primary: "#ffffaa",
        secondary: "#ff9966",
        background: "#050510",
        surface: "rgba(34, 17, 51, 0.8)",
        text: "#ffddaa",
        accent: "#221133",
        border: "#ffffaa",
        glow: "rgba(255, 255, 170, 0.4)"
      }
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
      // UI Theme
      uiTheme: {
        primary: "#88ffaa",
        secondary: "#aaffee",
        background: "#001122",
        surface: "rgba(0, 68, 85, 0.8)",
        text: "#e0e0e0",
        accent: "#003344",
        border: "#88ffaa",
        glow: "rgba(136, 255, 170, 0.4)"
      }
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
      // UI Theme
      uiTheme: {
        primary: "#00ffff",
        secondary: "#ff00ff",
        background: "#000022",
        surface: "rgba(51, 0, 102, 0.8)",
        text: "#e0e0e0",
        accent: "#330066",
        border: "#00ffff",
        glow: "rgba(0, 255, 255, 0.4)"
      }
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
      // UI Theme
      uiTheme: {
        primary: "#00ff00",
        secondary: "#00cc00",
        background: "#000000",
        surface: "rgba(0, 51, 0, 0.8)",
        text: "#00ff00",
        accent: "#003300",
        border: "#00ff00",
        glow: "rgba(0, 255, 0, 0.5)"
      }
    },
  };

  // Current background
  let currentBackground = "space";
  let backgroundObjects = [];

  // Theme colors (will be updated based on background)
  let themeBoardColor = BACKGROUNDS[currentBackground].boardColor;
  let themeRedPieceColor = BACKGROUNDS[currentBackground].redPieceColor;
  let themeYellowPieceColor = BACKGROUNDS[currentBackground].yellowPieceColor;
  let themeHoleColor = BACKGROUNDS[currentBackground].holeColor;

  // AI constants
  const AI_DELAY_MIN = 500; // Minimum delay before AI makes a move (ms)
  const AI_DELAY_MAX = 1500; // Maximum delay before AI makes a move (ms)
  const AI_THINKING_CLASS = "thinking"; // CSS class for AI thinking indicator

  // Add new constants for 3D effects
  const BOARD_TILT_MAX = 10; // Maximum tilt angle in degrees
  const PIECE_SHADOW_BLUR = 15; // Shadow blur for pieces
  const PIECE_3D_HEIGHT = 20; // Height of piece elevation in pixels

  // Add after the 3D constants
  const QUOTES = [
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

  const C64_COLORS = {
    DARK_BLUE: 0x000000,
    MID_BLUE: 0x001100,
    LIGHT_BLUE: 0x00ff00,
    TEXT_BRIGHT: 0xffffff,
    TEXT_SHADOW: 0x00aa00,
  };

  // Game state
  let board = [];
  let currentPlayer = RED;
  let gameOver = false;
  let animationInProgress = false;
  let isAIMode = true;
  let aiDifficulty = "medium";
  let isAITurn = false;
  
  // Player names
  let playerNames = {
    player1: "Player 1",
    player2: "Player 2"
  };

  // Load player names from localStorage
  function loadPlayerNames() {
    const savedNames = localStorage.getItem('connect4PlayerNames');
    if (savedNames) {
      try {
        const parsed = JSON.parse(savedNames);
        if (parsed.player1) playerNames.player1 = parsed.player1;
        if (parsed.player2) playerNames.player2 = parsed.player2;
      } catch (e) {
        console.error('Error loading player names from localStorage:', e);
      }
    }
  }

  // Save player names to localStorage
  function savePlayerNames() {
    try {
      localStorage.setItem('connect4PlayerNames', JSON.stringify(playerNames));
    } catch (e) {
      console.error('Error saving player names to localStorage:', e);
    }
  }

  // Load names on initialization
  loadPlayerNames();

  // Three.js variables
  let scene, camera, renderer, controls;
  let boardMesh,
    pieces = [];
  let raycaster, mouse;
  let hoveredColumn = -1;
  let hoverPiece;

  // Sound effects
  const dropSound = new Audio();
  dropSound.src =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD//////////////////8AAAAxMQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgf///////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABSAJAJAQgAAgAAAAbBsy+zGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

  const winSound = new Audio();
  winSound.src =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAADpAAICAgICAgICAgQEBAQEBAQEBAYGBgYGBgYGBggICAgICAgICgsLCwsLCwsLDQ0NDQ0NDQ0NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

  // DOM elements
  const gameBoard = document.getElementById("game-board");
  const currentPlayerDisplay = document.getElementById("current-player");
  const gameStatus = document.getElementById("game-status");
  const resetButton = document.getElementById("reset-button");
  const gameModeSelect = document.getElementById("game-mode");
  const aiDifficultySelect = document.getElementById("ai-difficulty");
  const difficultyContainer = document.getElementById("difficulty-container");

  // Add after the other DOM elements
  const fullscreenButton = document.getElementById("fullscreen-button");
  const container = document.querySelector(".container");

  // Add these variables at the top with other global variables
  let isExploding = false;
  let restartOverlay;

  // Music control variables
  let currentTrack = 0;
  // Import music tracks from config.js
  const musicTracks = MUSIC_TRACKS;

  // Consolidate all styles into one style element near the top
  const gameStyles = document.createElement("style");
  gameStyles.textContent = `
      @keyframes landingBounce {
          0% { transform: translateZ(10px) scale(1.1); }
          50% { transform: translateZ(5px) scale(0.95); }
          100% { transform: translateZ(0) scale(1); }
      }

      @keyframes victoryFlash {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
      }

      #victory-message {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.8);
          padding: 30px 60px;
          border-radius: 15px;
          font-size: 48px;
          text-align: center;
          z-index: 1000;
          font-family: Arial, sans-serif;
          white-space: nowrap;
          animation: victoryFlash 0.8s ease-in-out infinite;
          border: 3px solid;
          text-shadow: 0 0 20px currentColor;
          pointer-events: none;
      }

      #restart-overlay {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: 999;
          cursor: pointer;
      }

      .fullscreen-mode #restart-overlay {
          position: fixed;
      }

      #canvas-container {
          position: relative;
          width: 100%;
          height: 600px;  /* Set explicit height */
          background: #000;
          margin: 20px 0;
      }

      .fullscreen-mode #canvas-container {
          width: 100vw;
          height: 100vh;
      }
  `;
  document.head.appendChild(gameStyles);

  // Animation loop
  function animate(time) {
    requestAnimationFrame(animate);

    // Check stars visibility after 3 seconds
    if (time > 3000 && time < 3100) {
      checkStarsVisibility();
    }

    // Update floating objects
    FLOATING_OBJECTS.forEach((obj) => {
      if (obj.update) obj.update(time);
    });

    updateExplosion();
    controls.update();
    renderer.render(scene, camera);
  }

  // Initialize Three.js scene
  function initThreeJS() {
    // Ensure canvas container exists
    const container = document.getElementById("canvas-container");
    if (!container) {
      console.error("Canvas container not found!");
      return;
    }

    // Clear any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUNDS[currentBackground].color);

    // Set fog if specified in the background settings
    const bgSettings = BACKGROUNDS[currentBackground];
    if (bgSettings.fogColor) {
      scene.fog = new THREE.FogExp2(bgSettings.fogColor, bgSettings.fogDensity);
    }

    // Update theme colors
    themeBoardColor = bgSettings.boardColor;
    themeRedPieceColor = bgSettings.redPieceColor;
    themeYellowPieceColor = bgSettings.yellowPieceColor;
    themeHoleColor = bgSettings.holeColor;

    // Camera setup with explicit dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);

    // Renderer setup with explicit dimensions
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.75; // Reduced from 7.5 to 3.75 (2x closer)
    controls.maxDistance = 45; // Increased from 22.5 to 45 (2x further)
    controls.maxPolarAngle = Math.PI / 2;

    // Enhanced lighting for space theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add point lights for dramatic effect
    const greenLight = new THREE.PointLight(GUIDE_GREEN, 0.5, 20);
    greenLight.position.set(-5, 5, 5);
    scene.add(greenLight);

    const blueLight = new THREE.PointLight(0x4444ff, 0.5, 20);
    blueLight.position.set(5, -5, 5);
    scene.add(blueLight);

    // Raycaster setup
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create hover piece
    const hoverGeometry = new THREE.SphereGeometry(PIECE_RADIUS, 32, 32);
    const hoverMaterial = new THREE.MeshPhongMaterial({
      color: themeRedPieceColor,
      transparent: true,
      opacity: 0.5,
    });
    hoverPiece = new THREE.Mesh(hoverGeometry, hoverMaterial);
    scene.add(hoverPiece);
    hoverPiece.visible = false;

    // Create board and game elements
    createBoard();

    // Create decorative elements
    createStars();
    createScrollingText();

    // Create restart overlay
    createRestartOverlay();

    // Event listeners
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onMouseClick);
    renderer.domElement.addEventListener("touchstart", onTouchStart);
    renderer.domElement.addEventListener("touchmove", onTouchMove);
    renderer.domElement.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onWindowResize);

    // Initial resize to set correct aspect ratio
    onWindowResize();
  }

  function createStars() {
    // Create a canvas texture for the stars
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    // Draw a more subtle star shape
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.1)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    // Create texture from canvas
    const starTexture = new THREE.CanvasTexture(canvas);

    // Define a consistent direction for all stars - as if the board is moving forward
    // This creates the effect of the board being a spaceship traveling through space
    // Using a direction that's mostly along the z-axis (coming toward the viewer) with slight drift
    const shipDirection = new THREE.Vector3(0.1, -0.05, 1).normalize();

    // Get the star layers from the current background
    const bgSettings = BACKGROUNDS[currentBackground];
    const starLayers = bgSettings.starLayers;

    starLayers.forEach((layer) => {
      // Create geometry for this layer
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        size: layer.size,
        map: starTexture,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: layer.color,
      });

      const positions = [];
      const velocities = []; // Store velocity for each star
      const colors = [];
      const baseColor = new THREE.Color(layer.color);
      const twinkleSpeeds = []; // Store individual twinkle speeds for each star
      const originalBrightness = []; // Store original brightness for twinkling

      for (let i = 0; i < layer.count; i++) {
        // Position stars in a deeper space range - make sure they're visible from camera
        const x = (Math.random() - 0.5) * 120;
        const y = (Math.random() - 0.5) * 120;
        const z = (Math.random() - 0.5) * 120 - 50; // Position some in front of camera
        positions.push(x, y, z);

        // Calculate distance-based velocity for parallax effect
        // Stars further away move slower (higher z value = further away)
        const distance = Math.sqrt(x * x + y * y + z * z);
        const speedFactor = 1 - Math.min(0.9, Math.max(0.1, distance / 150)); // Normalize to 0.1-0.9 range

        // Small random variation to speed but not direction
        const speedVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 variation in speed

        // All stars move in the same direction (opposite to ship direction) but at different speeds
        const baseSpeed = layer.speed * 30 * speedVariation; // Amplify the base speed
        velocities.push(
          -shipDirection.x * baseSpeed * speedFactor,
          -shipDirection.y * baseSpeed * speedFactor,
          -shipDirection.z * baseSpeed * speedFactor
        );

        // Store original brightness for each star - more subtle
        const brightness = Math.random() * 0.4 + 0.3; // Between 0.3 and 0.7
        originalBrightness.push(brightness);

        // Vary the star colors slightly but keep them bright
        const color = baseColor.clone();
        color.multiplyScalar(brightness);
        colors.push(color.r, color.g, color.b);

        // Assign random twinkle speed to each star
        twinkleSpeeds.push(
          Math.random() * layer.twinkleSpeed + layer.twinkleSpeed * 0.5
        );
      }

      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      starGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      // Store additional data as custom attributes
      starGeometry.userData = {
        twinkleSpeeds,
        originalBrightness,
        baseColor: baseColor,
        velocities: velocities,
        bounds: 150, // Boundary for star movement
        shipDirection: shipDirection,
      };

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      backgroundObjects.push(stars);

      // Log to confirm stars are added
      console.log(
        `Added star layer with ${layer.count} stars of size ${layer.size}`
      );

      // Add to floating objects with custom update function
      FLOATING_OBJECTS.push({
        mesh: stars,
        update: (time) => {
          // Get position array for updating
          const positions = stars.geometry.attributes.position.array;
          const colors = stars.geometry.attributes.color.array;
          const twinkleSpeeds = stars.geometry.userData.twinkleSpeeds;
          const originalBrightness = stars.geometry.userData.originalBrightness;
          const baseColor = stars.geometry.userData.baseColor;
          const velocities = stars.geometry.userData.velocities;
          const bounds = stars.geometry.userData.bounds;

          // Update each star position for realistic movement
          for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
            // Update position based on velocity (parallax effect)
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // If star goes out of bounds, reset it to the opposite side
            // For a more realistic effect, stars that go behind the camera (negative z)
            // should reappear far ahead (positive z)
            if (positions[i + 2] < -bounds) {
              // Star has gone behind the camera, reset to far ahead
              positions[i] = (Math.random() - 0.5) * 120; // Random x
              positions[i + 1] = (Math.random() - 0.5) * 120; // Random y
              positions[i + 2] = bounds; // Far ahead in z
            }

            // For stars that go out of bounds in x or y, or too far in positive z
            else if (
              Math.abs(positions[i]) > bounds ||
              Math.abs(positions[i + 1]) > bounds ||
              positions[i + 2] > bounds * 1.5
            ) {
              // Reset position to maintain the star field
              positions[i] = (Math.random() - 0.5) * 120;
              positions[i + 1] = (Math.random() - 0.5) * 120;
              positions[i + 2] = -bounds + Math.random() * 50; // Somewhere behind the camera
            }

            // Apply twinkling effect
            const twinkleSpeed = twinkleSpeeds[j];
            const brightness = originalBrightness[j];
            const twinkle = Math.sin(time * twinkleSpeed + j) * 0.3 + 0.7; // Less dramatic twinkling

            // Apply the twinkle effect to the color
            const finalBrightness = brightness * twinkle;
            colors[i] = baseColor.r * finalBrightness;
            colors[i + 1] = baseColor.g * finalBrightness;
            colors[i + 2] = baseColor.b * finalBrightness;
          }

          // Mark attributes as needing update
          stars.geometry.attributes.position.needsUpdate = true;
          stars.geometry.attributes.color.needsUpdate = true;
        },
      });
    });

    // Add special background effects based on the current background
    if (currentBackground === "retro") {
      createRetroGrid();
    } else if (currentBackground === "nebula") {
      createNebulaClouds();
    } else if (currentBackground === "aurora") {
      createAuroraEffect();
    } else if (currentBackground === "galaxy") {
      createGalaxySpiral();
    } else if (currentBackground === "matrix") {
      createMatrixRain();
    }
  }

  // Create Matrix digital rain effect
  function createMatrixRain() {
    const matrixChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const columnCount = 30;
    const charCount = 25;
    const matrixColor = 0x00ff00;
    const matrixBrightColor = 0x88ff88;

    // Create a group to hold all matrix elements
    const matrixGroup = new THREE.Group();
    scene.add(matrixGroup);
    backgroundObjects.push(matrixGroup);

    // Create columns of falling characters
    for (let col = 0; col < columnCount; col++) {
      // Create a canvas for this column
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      // Fill with black
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      ctx.font = "bold 32px monospace";

      // Create a column of characters
      const chars = [];
      const speeds = [];
      const headPosition = Math.floor(Math.random() * charCount);

      for (let i = 0; i < charCount; i++) {
        // Random character
        chars.push(
          matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        );
        // Random speed
        speeds.push(0.1 + Math.random() * 0.3);
      }

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);

      // Create a plane for this column
      const planeGeometry = new THREE.PlaneGeometry(2, 20);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);

      // Position randomly in 3D space
      const distance = 30 + Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      plane.position.x = Math.cos(angle) * distance;
      plane.position.z = Math.sin(angle) * distance;
      plane.position.y = Math.random() * 40 - 20;

      // Rotate to face center
      plane.lookAt(0, 0, 0);

      matrixGroup.add(plane);

      // Add to floating objects with custom update
      FLOATING_OBJECTS.push({
        mesh: plane,
        update: (time) => {
          // Update the canvas with new characters
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw characters
          for (let i = 0; i < charCount; i++) {
            // Calculate position with movement
            const yPos = (((time * speeds[i] * 0.05) % charCount) + i) * 40;

            // Determine if this is the head character (brightest)
            const isHead = i === Math.floor((time * 0.1) % charCount);

            // Set color based on position - head is brightest, then fades
            if (isHead) {
              ctx.fillStyle = "#ffffff"; // White for head
            } else {
              // Calculate brightness based on distance from head
              const distFromHead = Math.min(
                Math.abs(i - Math.floor((time * 0.1) % charCount)),
                Math.abs(i - Math.floor((time * 0.1) % charCount) + charCount),
                Math.abs(i - Math.floor((time * 0.1) % charCount) - charCount)
              );

              const brightness = Math.max(0, 1 - distFromHead / 5);
              const green = Math.floor(50 + brightness * 205);
              ctx.fillStyle = `rgb(0, ${green}, 0)`;
            }

            // Randomly change characters occasionally
            if (Math.random() < 0.05) {
              chars[i] = matrixChars.charAt(
                Math.floor(Math.random() * matrixChars.length)
              );
            }

            // Draw the character
            ctx.fillText(chars[i], 16, yPos);
          }

          // Update the texture
          texture.needsUpdate = true;
        },
      });
    }

    // Add some floating matrix symbols for additional effect
    const symbolCount = 100;
    const symbolGeometry = new THREE.BufferGeometry();
    const symbolMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: matrixColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const positions = [];
    const speeds = [];

    for (let i = 0; i < symbolCount; i++) {
      // Random position in a sphere
      const radius = 20 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      // Random fall speed
      speeds.push(0.05 + Math.random() * 0.15);
    }

    symbolGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const symbols = new THREE.Points(symbolGeometry, symbolMaterial);
    matrixGroup.add(symbols);

    // Add animation for symbols
    FLOATING_OBJECTS.push({
      mesh: symbols,
      update: (time) => {
        const positions = symbols.geometry.attributes.position.array;

        for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
          // Move downward (y-axis)
          positions[i + 1] -= speeds[j];

          // Reset if too far down
          if (positions[i + 1] < -50) {
            positions[i + 1] = 50;
            // Randomize x and z slightly when resetting
            positions[i] += (Math.random() - 0.5) * 5;
            positions[i + 2] += (Math.random() - 0.5) * 5;
          }
        }

        symbols.geometry.attributes.position.needsUpdate = true;

        // Slowly rotate the entire matrix group
        matrixGroup.rotation.y = time * 0.00005;
      },
    });
  }

  // Create a Tron-style grid with light cycles and trails
  function createRetroGrid() {
    const gridSize = 200;
    const gridDivisions = 40;
    const gridColor = 0x00ffff;
    const gridY = -30;
    const gridSpacing = gridSize / gridDivisions; // Distance between grid lines
    
    // Create main Tron-style grid floor
    const gridMaterial = new THREE.LineBasicMaterial({
      color: gridColor,
      transparent: true,
      opacity: 0.6,
    });

    const grid = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      gridColor,
      gridColor
    );
    grid.material = gridMaterial;
    grid.position.y = gridY;
    grid.position.z = -50;
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);
    backgroundObjects.push(grid);
    
    // Light cycle trails storage
    const lightCycles = [];
    const trailGroup = new THREE.Group();
    scene.add(trailGroup);
    backgroundObjects.push(trailGroup);
    
    // Create multiple light cycles with different colors and paths
    const cycleColors = [
      { color: 0x00ffff, trailColor: 0x00ffff }, // Cyan
      { color: 0xff00ff, trailColor: 0xff00ff }, // Magenta
      { color: 0x00ff00, trailColor: 0x00ff00 }, // Green
      { color: 0xffff00, trailColor: 0xffff00 }, // Yellow
    ];
    
    // Helper function to snap to grid
    function snapToGrid(value) {
      return Math.round(value / gridSpacing) * gridSpacing;
    }
    
    // Create light cycles
    for (let i = 0; i < 4; i++) {
      const cycleConfig = cycleColors[i % cycleColors.length];
      
      // Create light cycle (small glowing box)
      const cycleGeometry = new THREE.BoxGeometry(0.5, 0.5, 1.5);
      const cycleMaterial = new THREE.MeshBasicMaterial({
        color: cycleConfig.color,
        transparent: true,
        opacity: 0.9,
        emissive: cycleConfig.color,
        emissiveIntensity: 1.5,
      });
      const cycle = new THREE.Mesh(cycleGeometry, cycleMaterial);
      
      // Snap initial position to grid
      const startX = snapToGrid((Math.random() - 0.5) * 150);
      const startZ = snapToGrid((Math.random() - 0.5) * 150);
      cycle.position.set(startX, gridY + 0.3, startZ);
      
      // Random direction (0 = right, 1 = up, 2 = left, 3 = down)
      const direction = Math.floor(Math.random() * 4);
      let directionX = 0;
      let directionZ = 0;
      switch (direction) {
        case 0: directionX = 1; break;  // Right
        case 1: directionZ = 1; break; // Forward
        case 2: directionX = -1; break; // Left
        case 3: directionZ = -1; break; // Back
      }
      
      // Trail segments - store grid positions
      const trailSegments = [];
      const maxTrailLength = 50;
      const occupiedGridCells = new Set(); // Track occupied grid cells
      
      // Add initial position to occupied cells
      occupiedGridCells.add(`${snapToGrid(startX)},${snapToGrid(startZ)}`);
      
      scene.add(cycle);
      backgroundObjects.push(cycle);
      
      lightCycles.push({
        cycle: cycle,
        directionX: directionX,
        directionZ: directionZ,
        gridX: startX,
        gridZ: startZ,
        moveSpeed: gridSpacing / 200, // Move one grid cell every 200ms
        trailSegments: trailSegments,
        maxTrailLength: maxTrailLength,
        trailColor: cycleConfig.trailColor,
        timeSinceLastMove: 0,
        turnTimer: 3000 + Math.random() * 7000, // Random turn intervals
        gridSize: gridSize / 2,
        occupiedGridCells: occupiedGridCells,
        gridSpacing: gridSpacing,
      });
    }
    
    // Animate grid and light cycles
    const gridAnimationObj = {
      mesh: grid,
      lightCycles: lightCycles,
      trailGroup: trailGroup,
      gridY: gridY,
      gridSpacing: gridSpacing,
      lastUpdateTime: 0,
      snapToGrid: function(value) {
        return Math.round(value / this.gridSpacing) * this.gridSpacing;
      },
      update: function(time) {
        // Calculate delta time
        const dt = this.lastUpdateTime === 0 ? 16 : Math.min(time - this.lastUpdateTime, 100);
        this.lastUpdateTime = time;
        
        // Animate grid pulsing
        const pulse = Math.sin(time * 0.0005) * 0.15;
        this.mesh.material.opacity = 0.5 + pulse;
        
        // Update each light cycle
        this.lightCycles.forEach((cycleData, index) => {
          const cycle = cycleData.cycle;
          
          // Move cycle along grid - discrete movement
          cycleData.timeSinceLastMove += dt;
          
          // Check if it's time to move to next grid cell
          if (cycleData.timeSinceLastMove >= 200) { // Move every 200ms
            cycleData.timeSinceLastMove = 0;
            
            // Calculate next grid position
            const nextGridX = cycleData.gridX + (cycleData.directionX * cycleData.gridSpacing);
            const nextGridZ = cycleData.gridZ + (cycleData.directionZ * cycleData.gridSpacing);
            const nextGridKey = `${nextGridX},${nextGridZ}`;
            
            // Check boundaries
            const absX = Math.abs(nextGridX);
            const absZ = Math.abs(nextGridZ);
            let hitBoundary = false;
            
            if (absX > cycleData.gridSize) {
              hitBoundary = true;
            }
            if (absZ > cycleData.gridSize) {
              hitBoundary = true;
            }
            
            // Check for collision with any trail (occupied cell) - including own trail
            let hitTrail = false;
            this.lightCycles.forEach((otherCycle) => {
              if (otherCycle.occupiedGridCells.has(nextGridKey)) {
                hitTrail = true;
              }
            });
            
            // If hitting boundary or trail, turn
            cycleData.turnTimer -= dt;
            if (hitBoundary || hitTrail || cycleData.turnTimer <= 0) {
              // Try to turn - choose a valid direction
              const choices = [
                { x: 1, z: 0 },
                { x: -1, z: 0 },
                { x: 0, z: 1 },
                { x: 0, z: -1 },
              ];
              
              // Shuffle choices for randomness
              for (let i = choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [choices[i], choices[j]] = [choices[j], choices[i]];
              }
              
              // Try each direction until we find a valid one
              let foundValidDirection = false;
              for (const dir of choices) {
                const testX = cycleData.gridX + (dir.x * cycleData.gridSpacing);
                const testZ = cycleData.gridZ + (dir.z * cycleData.gridSpacing);
                const testKey = `${testX},${testZ}`;
                const testAbsX = Math.abs(testX);
                const testAbsZ = Math.abs(testZ);
                
                // Check if direction is valid (not out of bounds, not occupied)
                if (testAbsX <= cycleData.gridSize && testAbsZ <= cycleData.gridSize) {
                  let cellOccupied = false;
                  this.lightCycles.forEach((otherCycle) => {
                    if (otherCycle.occupiedGridCells.has(testKey)) {
                      cellOccupied = true;
                    }
                  });
                  
                  if (!cellOccupied) {
                    cycleData.directionX = dir.x;
                    cycleData.directionZ = dir.z;
                    foundValidDirection = true;
                    break;
                  }
                }
              }
              
              // If no valid direction found, reverse
              if (!foundValidDirection) {
                cycleData.directionX *= -1;
                cycleData.directionZ *= -1;
              }
              
              cycleData.turnTimer = 2000 + Math.random() * 5000;
            } else {
              // Move to next grid cell
              cycleData.gridX = nextGridX;
              cycleData.gridZ = nextGridZ;
              
              // Add current position to occupied cells
              cycleData.occupiedGridCells.add(`${cycleData.gridX},${cycleData.gridZ}`);
              
              // Update visual position
              cycle.position.x = cycleData.gridX;
              cycle.position.z = cycleData.gridZ;
              
              // Rotate cycle to face direction
              if (cycleData.directionX !== 0) {
                cycle.rotation.y = cycleData.directionX > 0 ? 0 : Math.PI;
              } else {
                cycle.rotation.y = cycleData.directionZ > 0 ? Math.PI / 2 : -Math.PI / 2;
              }
              
              // Create trail segment at grid intersection
              const trailGeometry = new THREE.BoxGeometry(
                cycleData.directionX !== 0 ? cycleData.gridSpacing * 0.9 : cycleData.gridSpacing * 0.4,
                0.15,
                cycleData.directionZ !== 0 ? cycleData.gridSpacing * 0.9 : cycleData.gridSpacing * 0.4
              );
              const trailMaterial = new THREE.MeshBasicMaterial({
                color: cycleData.trailColor,
                transparent: true,
                opacity: 0.9,
                emissive: cycleData.trailColor,
                emissiveIntensity: 1.2,
              });
              const trailSegment = new THREE.Mesh(trailGeometry, trailMaterial);
              trailSegment.position.set(
                cycleData.gridX,
                this.gridY + 0.1,
                cycleData.gridZ
              );
              
              // Align trail with direction
              if (cycleData.directionX !== 0) {
                trailSegment.rotation.y = Math.PI / 2;
              }
              
              this.trailGroup.add(trailSegment);
              cycleData.trailSegments.push({
                mesh: trailSegment,
                age: 0,
                maxAge: 8000, // Trail lasts 8 seconds
                gridKey: `${cycleData.gridX},${cycleData.gridZ}`,
              });
              
              // Limit trail length and clean up old occupied cells
              if (cycleData.trailSegments.length > cycleData.maxTrailLength) {
                const oldSegment = cycleData.trailSegments.shift();
                cycleData.occupiedGridCells.delete(oldSegment.gridKey);
                this.trailGroup.remove(oldSegment.mesh);
                oldSegment.mesh.geometry.dispose();
                oldSegment.mesh.material.dispose();
              }
            }
          } else {
            // Smooth interpolation between grid cells for visual smoothness
            const progress = cycleData.timeSinceLastMove / 200;
            const nextGridX = cycleData.gridX + (cycleData.directionX * cycleData.gridSpacing);
            const nextGridZ = cycleData.gridZ + (cycleData.directionZ * cycleData.gridSpacing);
            
            cycle.position.x = cycleData.gridX + (nextGridX - cycleData.gridX) * progress;
            cycle.position.z = cycleData.gridZ + (nextGridZ - cycleData.gridZ) * progress;
          }
          
          // Update and fade trail segments (iterate backwards to safely remove items)
          for (let trailIndex = cycleData.trailSegments.length - 1; trailIndex >= 0; trailIndex--) {
            const trail = cycleData.trailSegments[trailIndex];
            trail.age += dt;
            const lifePercent = trail.age / trail.maxAge;
            
            if (lifePercent >= 1) {
              // Remove old trail and free up grid cell
              cycleData.occupiedGridCells.delete(trail.gridKey);
              this.trailGroup.remove(trail.mesh);
              trail.mesh.geometry.dispose();
              trail.mesh.material.dispose();
              cycleData.trailSegments.splice(trailIndex, 1);
            } else {
              // Fade trail
              trail.mesh.material.opacity = 0.9 * (1 - lifePercent);
              trail.mesh.material.emissiveIntensity = 1.2 * (1 - lifePercent);
            }
          }
        });
      },
    };
    FLOATING_OBJECTS.push(gridAnimationObj);
    
    // Add ambient grid glow particles
    const particleCount = 30;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * gridSize;
      positions[i3 + 1] = gridY + 0.5 + Math.random() * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * gridSize;
      
      const color = new THREE.Color(cycleColors[i % cycleColors.length].color);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    backgroundObjects.push(particles);
    
    FLOATING_OBJECTS.push({
      mesh: particles,
      update: (time) => {
        particles.rotation.y = time * 0.00005;
        const pulse = Math.sin(time * 0.0008) * 0.2;
        particlesMaterial.opacity = 0.5 + pulse;
      },
    });
  }

  // Create nebula cloud effect
  function createNebulaClouds() {
    const nebulaTexture = createNebulaTexture();

    // Create a large sphere for the nebula background
    const nebulaGeometry = new THREE.SphereGeometry(100, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.5,
    });

    const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaMesh);
    backgroundObjects.push(nebulaMesh);

    // Add slow rotation animation
    FLOATING_OBJECTS.push({
      mesh: nebulaMesh,
      update: (time) => {
        nebulaMesh.rotation.x = time * 0.0001;
        nebulaMesh.rotation.y = time * 0.00015;
      },
    });
  }

  // Create a procedural nebula texture
  function createNebulaTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // Fill with dark background
    ctx.fillStyle = "#0a0a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create nebula clouds
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 50 + Math.random() * 200;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

      // Random color for the nebula cloud
      const hue = Math.random() * 60 + 240; // Blue to purple range
      const saturation = 70 + Math.random() * 30;
      const lightness = 20 + Math.random() * 40;

      gradient.addColorStop(
        0,
        `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`
      );
      gradient.addColorStop(
        0.5,
        `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.3)`
      );
      gradient.addColorStop(1, "rgba(10, 10, 42, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Add some bright spots
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 1 + Math.random() * 3;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Create aurora effect
  function createAuroraEffect() {
    // Create a series of wavy planes for the aurora effect
    const auroraCount = 5;
    const auroraWidth = 80;
    const auroraHeight = 40;

    for (let i = 0; i < auroraCount; i++) {
      const auroraGeometry = new THREE.PlaneGeometry(
        auroraWidth,
        auroraHeight,
        32,
        8
      );

      // Create a gradient color for the aurora
      const hue = 120 + Math.random() * 60; // Green to cyan range
      const color = new THREE.Color(`hsl(${hue}, 100%, 70%)`);

      const auroraMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });

      const auroraMesh = new THREE.Mesh(auroraGeometry, auroraMaterial);

      // Position the aurora planes in a semi-circle around the scene
      const angle = (i / auroraCount) * Math.PI;
      const distance = 70;
      auroraMesh.position.x = Math.cos(angle) * distance;
      auroraMesh.position.z = Math.sin(angle) * distance;
      auroraMesh.position.y = 10 + Math.random() * 20;

      // Rotate to face center
      auroraMesh.lookAt(0, 0, 0);

      scene.add(auroraMesh);
      backgroundObjects.push(auroraMesh);

      // Add wave animation
      FLOATING_OBJECTS.push({
        mesh: auroraMesh,
        update: (time) => {
          // Create wave effect by modifying vertices
          const positions = auroraMesh.geometry.attributes.position.array;
          for (let j = 0; j < positions.length; j += 3) {
            const x = positions[j];
            const originalY = j % 6 === 0 ? j / 6 : Math.floor(j / 6);
            positions[j + 1] =
              Math.sin(time * 0.001 + x * 0.1 + i) * 2 + originalY * 0.2;
          }
          auroraMesh.geometry.attributes.position.needsUpdate = true;

          // Slowly change opacity for shimmer effect
          auroraMesh.material.opacity = 0.2 + Math.sin(time * 0.0005 + i) * 0.1;
        },
      });
    }
  }

  // Create spiral galaxy effect
  function createGalaxySpiral() {
    const particleCount = 5000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.5,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const positions = [];
    const colors = [];
    const spiralArms = 3;
    const spiralTightness = 0.3;

    for (let i = 0; i < particleCount; i++) {
      // Calculate spiral position
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60;
      const armOffset = (i % spiralArms) * ((Math.PI * 2) / spiralArms);
      const spiralAngle = angle + armOffset + radius * spiralTightness;

      const x = Math.cos(spiralAngle) * radius;
      const z = Math.sin(spiralAngle) * radius;

      // Add some height variation but keep it relatively flat
      const y = (Math.random() - 0.5) * 10 * (radius / 60);

      positions.push(x, y, z);

      // Color gradient from center to edge
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const normalizedDistance = Math.min(1, distanceFromCenter / 60);

      // Center is more yellow/white, edges more blue
      const r = 1 - normalizedDistance * 0.5;
      const g = 1 - normalizedDistance * 0.7;
      const b = 0.7 + normalizedDistance * 0.3;

      colors.push(r, g, b);
    }

    galaxyGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    galaxyGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyParticles.position.z = -80; // Position behind the game board
    scene.add(galaxyParticles);
    backgroundObjects.push(galaxyParticles);

    // Add rotation animation
    FLOATING_OBJECTS.push({
      mesh: galaxyParticles,
      update: (time) => {
        galaxyParticles.rotation.y = time * 0.00005;
        galaxyParticles.rotation.x = Math.sin(time * 0.0001) * 0.1;
      },
    });
  }

  /**
   * Apply UI theme based on background
   */
  function applyUITheme(theme) {
    const root = document.documentElement;
    
    // Set CSS custom properties for theming
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-background", theme.background);
    root.style.setProperty("--theme-surface", theme.surface);
    root.style.setProperty("--theme-text", theme.text);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-border", theme.border);
    root.style.setProperty("--theme-glow", theme.glow);
    
    // Update body background
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
    
    // Update container styling
    const container = document.querySelector(".container");
    if (container) {
      container.style.backgroundColor = theme.surface;
      container.style.borderColor = theme.border;
      container.style.boxShadow = `0 0 20px ${theme.glow}, 0 0 40px rgba(0, 0, 0, 0.5)`;
    }
    
    // Update headings
    const h1 = document.querySelector("h1");
    if (h1) {
      h1.style.color = theme.primary;
      h1.style.textShadow = `0 0 3px ${theme.primary}, 0 0 7px ${theme.primary}, 0 2px 0 #000`;
    }
    
    // Update buttons
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
      if (button.id !== "reset-button" && button.id !== "fullscreen-button") {
        button.style.borderColor = theme.border;
        button.style.color = theme.primary;
        button.style.boxShadow = `0 0 10px ${theme.glow}`;
      }
    });
    
    // Update selects
    const selects = document.querySelectorAll("select");
    selects.forEach(select => {
      select.style.borderColor = theme.border;
      select.style.color = theme.primary;
      select.style.backgroundColor = theme.surface;
      select.style.boxShadow = `0 0 5px ${theme.glow}`;
    });
    
    // Update labels
    const labels = document.querySelectorAll("label");
    labels.forEach(label => {
      label.style.color = theme.primary;
    });
    
    // Update game info sections
    const gameInfo = document.querySelector(".game-info");
    if (gameInfo) {
      gameInfo.style.color = theme.primary;
      gameInfo.style.textShadow = `0 0 5px ${theme.glow}`;
    }
    
    // Update instructions
    const instructions = document.querySelector(".instructions");
    if (instructions) {
      instructions.style.backgroundColor = theme.surface;
      instructions.style.borderColor = theme.border;
      instructions.style.boxShadow = `0 2px 10px rgba(0, 0, 0, 0.3), 0 0 5px ${theme.glow}`;
    }
    
    const instructionsH2 = document.querySelector(".instructions h2");
    if (instructionsH2) {
      instructionsH2.style.color = theme.primary;
      instructionsH2.style.textShadow = `0 0 5px ${theme.glow}`;
    }
    
    // Update game options
    const gameOptions = document.querySelector(".game-options");
    if (gameOptions) {
      gameOptions.style.backgroundColor = theme.surface;
      gameOptions.style.borderColor = theme.border;
      gameOptions.style.boxShadow = `0 2px 10px rgba(0, 0, 0, 0.3), 0 0 5px ${theme.glow}`;
    }
    
    // Update player indicators
    const playerIndicator = document.querySelector(".player-indicator");
    if (playerIndicator) {
      playerIndicator.style.backgroundColor = theme.surface;
      playerIndicator.style.borderColor = theme.border;
      playerIndicator.style.boxShadow = `0 0 20px rgba(0, 0, 0, 0.4), 0 0 5px ${theme.glow}`;
    }
    
    // Update canvas container
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.borderColor = theme.border;
      canvasContainer.style.boxShadow = `0 0 20px ${theme.glow}, 0 0 40px rgba(0, 0, 0, 0.5)`;
    }
    
    // Update reset button
    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
      resetButton.style.backgroundColor = theme.surface;
      resetButton.style.borderColor = theme.border;
      resetButton.style.color = theme.primary;
      resetButton.style.boxShadow = `0 0 10px ${theme.glow}`;
      resetButton.style.border = `1px solid ${theme.border}`;
      resetButton.style.borderRadius = "5px";
    }
    
    // Update fullscreen button
    const fullscreenButton = document.getElementById("fullscreen-button");
    if (fullscreenButton) {
      fullscreenButton.style.backgroundColor = theme.surface;
      fullscreenButton.style.borderColor = theme.border;
      fullscreenButton.style.color = theme.primary;
      fullscreenButton.style.boxShadow = `0 0 10px ${theme.glow}`;
      fullscreenButton.style.border = `1px solid ${theme.border}`;
    }
    
    // Update music controls
    const musicSelect = document.getElementById("music-track-select");
    if (musicSelect) {
      musicSelect.style.borderColor = theme.border;
      musicSelect.style.color = theme.primary;
      musicSelect.style.backgroundColor = theme.surface;
      musicSelect.style.boxShadow = `0 0 5px ${theme.glow}`;
    }
    
    // Update Connect 4 message
    const connectFourMessage = document.getElementById("connect-four-message");
    if (connectFourMessage) {
      connectFourMessage.style.backgroundColor = theme.surface;
      connectFourMessage.style.borderColor = theme.border;
      connectFourMessage.style.color = theme.text;
      connectFourMessage.style.boxShadow = `0 2px 10px rgba(0, 0, 0, 0.3), 0 0 5px ${theme.glow}`;
    }
  }

  // Function to change the background
  function changeBackground(backgroundType) {
    if (!BACKGROUNDS[backgroundType]) {
      console.error(`Background type "${backgroundType}" not found`);
      return;
    }

    // Save the current background type
    currentBackground = backgroundType;

    // Update scene background color
    const bgSettings = BACKGROUNDS[backgroundType];
    scene.background = new THREE.Color(bgSettings.color);

    // Update theme colors
    themeBoardColor = bgSettings.boardColor;
    themeRedPieceColor = bgSettings.redPieceColor;
    themeYellowPieceColor = bgSettings.yellowPieceColor;
    themeHoleColor = bgSettings.holeColor;

    // Apply UI theme
    if (bgSettings.uiTheme) {
      applyUITheme(bgSettings.uiTheme);
    }

    // Update CSS variables for player indicators
    document.documentElement.style.setProperty(
      "--theme-red-piece-color",
      "#" + themeRedPieceColor.toString(16).padStart(6, "0")
    );
    document.documentElement.style.setProperty(
      "--theme-yellow-piece-color",
      "#" + themeYellowPieceColor.toString(16).padStart(6, "0")
    );

    // Remove existing background objects
    backgroundObjects.forEach((obj) => {
      scene.remove(obj);
      // Also remove from FLOATING_OBJECTS if present
      const index = FLOATING_OBJECTS.findIndex((item) => item.mesh === obj);
      if (index !== -1) {
        FLOATING_OBJECTS.splice(index, 1);
      }
    });
    backgroundObjects = [];

    // Set fog based on background settings
    if (bgSettings.fogColor) {
      scene.fog = new THREE.FogExp2(bgSettings.fogColor, bgSettings.fogDensity);
    } else {
      scene.fog = null;
    }

    // Create new stars and background elements
    createStars();

    // Update the board and pieces to match the new theme
    updateBoardAndPiecesTheme();

    // Force a re-render
    renderer.render(scene, camera);

    console.log(`Changed background to: ${bgSettings.name}`);
  }

  // Function to update the board and pieces to match the current theme
  function updateBoardAndPiecesTheme() {
    // Update board color
    if (boardMesh) {
      boardMesh.material.color.setHex(themeBoardColor);
      boardMesh.material.needsUpdate = true;
    }

    // Update hole colors
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.geometry instanceof THREE.CylinderGeometry &&
        object.geometry.parameters.radiusTop === PIECE_RADIUS
      ) {
        object.material.color.setHex(themeHoleColor);
        object.material.needsUpdate = true;
      }
    });

    // Update piece colors
    pieces.forEach((piece) => {
      const isRed =
        board[Math.floor(piece.position.x / CELL_SIZE + (COLS - 1) / 2)][
          Math.floor(piece.position.y / CELL_SIZE + (ROWS - 1) / 2)
        ] === RED;
      piece.material.color.setHex(
        isRed ? themeRedPieceColor : themeYellowPieceColor
      );
      piece.material.needsUpdate = true;
    });

    // Update hover piece color
    if (hoverPiece) {
      hoverPiece.material.color.setHex(
        currentPlayer === RED ? themeRedPieceColor : themeYellowPieceColor
      );
      hoverPiece.material.needsUpdate = true;
    }
  }

  // Add this function to check if stars are visible
  function checkStarsVisibility() {
    let starsFound = 0;
    scene.traverse((object) => {
      if (object instanceof THREE.Points) {
        starsFound++;
        console.log(
          `Found star object: ${object.geometry.attributes.position.count} points, visible: ${object.visible}`
        );
      }
    });
    console.log(`Total star objects found: ${starsFound}`);
  }

  function createScrollingText() {
    const textGroup = new THREE.Group();
    const scrollWidth = 20; // Reduced from 40 to 20 to start closer to the visible area
    const charHeight = 1.5;

    // Animation variables
    let currentQuoteIndex = 0;
    let currentText = null;
    let scrollPosition = scrollWidth;
    const SCROLL_SPEED = -0.015;
    const PAUSE_DURATION = 3000;
    const WAVE_SPEED = 0.005;
    const WAVE_AMPLITUDE = 0.2;
    const FADE_DURATION = 1000; // Duration of fade out in milliseconds
    let lastPauseTime = 0;
    let isPaused = false;
    let isFading = false;
    let fadeStartTime = 0;

    function createText(quote) {
      const textMesh = new THREE.Group();
      const letters = quote.split("");

      // Create a single texture for the entire text to ensure proper spacing
      const canvas = document.createElement("canvas");
      // Make canvas wide enough for the text
      canvas.width = 2048; // Much wider canvas to accommodate the text
      canvas.height = 256;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text settings
      const fontSize = 120;
      ctx.font = `bold ${fontSize}px "Arial", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw outer glow for lighting effect
      ctx.shadowColor = "#00ff00";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Measure the total text width
      const textMetrics = ctx.measureText(quote);
      const textWidth = textMetrics.width;

      // Draw the entire text as one unit
      // Draw shadow
      ctx.fillStyle = "rgba(0, 51, 0, 0.7)";
      ctx.fillText(quote, canvas.width / 2 + 3, canvas.height / 2 + 3);

      // Reset shadow for main text
      ctx.shadowBlur = 15;

      // Draw text with gradient for better lighting effect
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height / 2 - fontSize / 2,
        0,
        canvas.height / 2 + fontSize / 2
      );
      gradient.addColorStop(0, "#00ff00"); // Bright green at top
      gradient.addColorStop(0.4, "#aaffaa"); // Light green
      gradient.addColorStop(0.5, "#ffffff"); // White highlight in middle
      gradient.addColorStop(0.6, "#aaffaa"); // Light green
      gradient.addColorStop(1, "#00ff00"); // Bright green at bottom

      ctx.fillStyle = gradient;
      ctx.fillText(quote, canvas.width / 2, canvas.height / 2);

      // Create a single texture for the entire text
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 1.0,
        depthTest: false,
        depthWrite: false,
      });

      // Create a single plane for the entire text
      // Scale the plane to maintain the aspect ratio of the text
      const aspectRatio = textWidth / fontSize;
      const planeWidth = charHeight * aspectRatio * 1.2; // Slightly wider to ensure all text fits
      const planeHeight = charHeight * 1.2;

      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const textPlane = new THREE.Mesh(geometry, material);

      textMesh.add(textPlane);
      return textMesh;
    }

    // Create initial text
    currentText = createText(QUOTES[currentQuoteIndex]);
    textGroup.add(currentText);

    // Position the text group in 3D space - adjusted to be more visible
    textGroup.position.set(0, -4, 2); // Changed from (0, -5, 0) to be more visible
    textGroup.rotation.x = -Math.PI * 0.15; // Slightly increased angle for better visibility
    textGroup.renderOrder = 1000;
    textGroup.visible = false; // Disabled - no longer showing text in scene

    scene.add(textGroup);

    // Add to floating objects for animation
    FLOATING_OBJECTS.push({
      mesh: textGroup,
      update: (time) => {
        // Ensure visibility
        textGroup.visible = false; // Disabled - no longer showing text in scene

        if (isPaused) {
          if (Date.now() - lastPauseTime > PAUSE_DURATION) {
            // Start fading out
            if (!isFading) {
              isFading = true;
              fadeStartTime = Date.now();
            }

            // Calculate fade progress
            const fadeProgress = (Date.now() - fadeStartTime) / FADE_DURATION;

            if (fadeProgress < 1) {
              // Apply fade out
              if (currentText && currentText.children[0]) {
                currentText.children[0].material.opacity = 1 - fadeProgress;
              }
            } else {
              // Reset for next quote
              isPaused = false;
              isFading = false;
              scrollPosition = scrollWidth;

              // Clean up old text
              if (currentText) {
                currentText.children.forEach((mesh) => {
                  mesh.geometry.dispose();
                  mesh.material.dispose();
                  if (mesh.material.map) mesh.material.map.dispose();
                });
                textGroup.remove(currentText);
              }

              // Create new text
              currentQuoteIndex = (currentQuoteIndex + 1) % QUOTES.length;
              currentText = createText(QUOTES[currentQuoteIndex]);
              textGroup.add(currentText);
            }
          }
          return;
        }

        scrollPosition += SCROLL_SPEED;
        if (currentText) {
          currentText.position.x = scrollPosition;

          // Apply a gentle wave to the entire text plane
          currentText.position.y = Math.sin(time * WAVE_SPEED) * WAVE_AMPLITUDE;
        }

        if (scrollPosition < -scrollWidth) {
          isPaused = true;
          lastPauseTime = Date.now();
        }
      },
    });

    console.log("Created scrolling text with", QUOTES.length, "quotes");
    return textGroup;
  }

  // Create game board
  function createBoard() {
    // Create board geometry
    const boardGeometry = new THREE.BoxGeometry(
      COLS * CELL_SIZE,
      ROWS * CELL_SIZE,
      BOARD_THICKNESS
    );
    const boardMaterial = new THREE.MeshPhongMaterial({
      color: themeBoardColor,
    });
    boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardMesh.receiveShadow = true;
    scene.add(boardMesh);

    // Create holes in the board
    const holeGeometry = new THREE.CylinderGeometry(
      PIECE_RADIUS,
      PIECE_RADIUS,
      BOARD_THICKNESS + 0.2,
      32
    );
    const holeMaterial = new THREE.MeshPhongMaterial({ color: themeHoleColor });

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.x = (col - (COLS - 1) / 2) * CELL_SIZE;
        hole.position.y = (row - (ROWS - 1) / 2) * CELL_SIZE;
        hole.rotation.x = Math.PI / 2;
        scene.add(hole);
      }
    }

    // Center the board
    boardMesh.position.z = -BOARD_THICKNESS / 2;
  }

  // Create a game piece
  function createPiece(player, col, row) {
    const geometry = new THREE.SphereGeometry(PIECE_RADIUS, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: player === RED ? themeRedPieceColor : themeYellowPieceColor,
      shininess: 100,
    });
    const piece = new THREE.Mesh(geometry, material);

    // Position the piece
    piece.position.x = (col - (COLS - 1) / 2) * CELL_SIZE;
    piece.position.y = (row - (ROWS - 1) / 2) * CELL_SIZE;
    piece.position.z = PIECE_RADIUS;

    piece.castShadow = true;
    piece.receiveShadow = true;

    scene.add(piece);
    pieces.push(piece);

    // Add velocity properties for explosion animation
    piece.velocity = new THREE.Vector3(0, 0, 0);
    piece.rotationVelocity = new THREE.Vector3(0, 0, 0);

    return piece;
  }

  // Handle mouse movement
  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update hover piece
    if (!gameOver && !animationInProgress && !isAITurn) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(boardMesh);

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        const col = Math.floor(
          (intersectPoint.x + (COLS * CELL_SIZE) / 2) / CELL_SIZE
        );

        if (col >= 0 && col < COLS) {
          hoveredColumn = col;
          const row = getLowestEmptyRow(col);

          if (row !== -1) {
            hoverPiece.position.x = (col - (COLS - 1) / 2) * CELL_SIZE;
            hoverPiece.position.y = (ROWS - 1 - (ROWS - 1) / 2) * CELL_SIZE;
            hoverPiece.position.z = PIECE_RADIUS;
            hoverPiece.material.color.setHex(
              currentPlayer === RED ? themeRedPieceColor : themeYellowPieceColor
            );
            hoverPiece.visible = true;
            return;
          }
        }
      }
    }

    hoverPiece.visible = false;
    hoveredColumn = -1;
  }

  // Handle mouse click
  function onMouseClick() {
    if (gameOver && isExploding) {
      initGame();
      return;
    }

    if (
      !gameOver &&
      !animationInProgress &&
      !isAITurn &&
      hoveredColumn !== -1
    ) {
      dropPiece(hoveredColumn);
    }
  }

  // Handle window resize
  function onWindowResize() {
    const container = document.getElementById("canvas-container");
    if (document.fullscreenElement) {
      camera.aspect = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    camera.updateProjectionMatrix();

    // Ensure stars remain visible after resize
    scene.traverse((object) => {
      if (object instanceof THREE.Points) {
        object.visible = true;
      }
    });

    // Force a re-render
    renderer.render(scene, camera);
  }

  // Handle touch start
  function onTouchStart(event) {
    event.preventDefault(); // Prevent scrolling
    handleTouch(event.touches[0]);
  }

  // Handle touch move
  function onTouchMove(event) {
    event.preventDefault(); // Prevent scrolling
    handleTouch(event.touches[0]);
  }

  // Handle touch end
  function onTouchEnd(event) {
    event.preventDefault();
    if (
      !gameOver &&
      !animationInProgress &&
      !isAITurn &&
      hoveredColumn !== -1
    ) {
      dropPiece(hoveredColumn);
    } else if (gameOver && isExploding) {
      initGame();
    }
  }

  // Common touch handling logic
  function handleTouch(touch) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    // Update hover piece
    if (!gameOver && !animationInProgress && !isAITurn) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(boardMesh);

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        const col = Math.floor(
          (intersectPoint.x + (COLS * CELL_SIZE) / 2) / CELL_SIZE
        );

        if (col >= 0 && col < COLS) {
          hoveredColumn = col;
          const row = getLowestEmptyRow(col);

          if (row !== -1) {
            hoverPiece.position.x = (col - (COLS - 1) / 2) * CELL_SIZE;
            hoverPiece.position.y = (ROWS - 1 - (ROWS - 1) / 2) * CELL_SIZE;
            hoverPiece.position.z = PIECE_RADIUS;
            hoverPiece.material.color.setHex(
              currentPlayer === RED ? themeRedPieceColor : themeYellowPieceColor
            );
            hoverPiece.visible = true;
            return;
          }
        }
      }
    }

    hoverPiece.visible = false;
    hoveredColumn = -1;
  }

  // Initialize game
  function initGame() {
    // Clear existing board and pieces
    if (boardMesh) scene.remove(boardMesh);
    pieces.forEach((piece) => scene.remove(piece));
    pieces = [];

    // Initialize the board array
    board = Array(COLS)
      .fill()
      .map(() => Array(ROWS).fill(EMPTY));

    // Create new board
    createBoard();

    // Reset game state
    currentPlayer = RED; // Always start with Red
    gameOver = false;
    animationInProgress = false;
    isAITurn = false;
    isExploding = false;

    // Clear messages and overlays
    const gameStatus = document.getElementById("game-status");
    gameStatus.textContent = "";
    gameStatus.style.fontSize = "";
    gameStatus.style.color = "";

    const messageOverlay = document.getElementById("fullscreen-message");
    if (messageOverlay) {
      messageOverlay.style.display = "none";
    }

    const victoryMessage = document.getElementById("victory-message");
    if (victoryMessage) {
      victoryMessage.style.display = "none";
    }

    // Reset restart overlay and cursor
    document.getElementById("canvas-container").classList.remove("game-over");
    document.getElementById("canvas-container").classList.remove("thinking");
    if (restartOverlay) {
      restartOverlay.style.display = "none";
    }

    // Reset hover piece
    if (hoverPiece) {
      hoverPiece.visible = false;
    }

    // Update display
    updateCurrentPlayerDisplay();

    // If it's AI mode and Yellow's turn, make AI move
    if (isAIMode && currentPlayer === YELLOW) {
      setTimeout(() => {
        makeAIMove();
      }, 500); // Add a small delay for better UX
    }
  }

  // Drop piece animation
  function dropPieceAnimation(piece, targetY, callback) {
    const startY = piece.position.y;
    const distance = targetY - startY;
    const startTime = Date.now();

    function update() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Easing function for bounce effect
      const easeOutBounce = (x) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
      };

      piece.position.y = startY + distance * easeOutBounce(progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (callback) callback();
      }
    }

    update();
  }

  // Drop piece logic
  function dropPiece(col) {
    const row = getLowestEmptyRow(col);
    if (row === -1 || gameOver) return;

    animationInProgress = true;
    board[col][row] = currentPlayer;

    // Hide hover piece immediately when dropping
    if (hoverPiece) {
      hoverPiece.visible = false;
    }

    // Create piece well above the board to ensure smooth drop animation
    const startRow = ROWS + 2; // Start higher above the board
    const piece = createPiece(currentPlayer, col, startRow);
    const targetY = (row - (ROWS - 1) / 2) * CELL_SIZE;
    
    // Ensure piece starts at the correct high position (in case of any timing issues)
    const startY = (startRow - (ROWS - 1) / 2) * CELL_SIZE;
    piece.position.y = startY;

    dropPieceAnimation(piece, targetY, () => {
      animationInProgress = false;
      dropSound.play();

      if (checkWin(col, row)) {
        const winner = currentPlayer === RED ? "Red" : "Yellow";
        gameOver = true;
        winSound.play();

        // Show victory message after piece lands
        showVictoryMessage(winner);

        // Schedule explosion
        setTimeout(() => {
          explodePieces();
          document
            .getElementById("canvas-container")
            .classList.add("game-over");
          if (restartOverlay) {
            restartOverlay.style.display = "block";
          }
        }, 3000);

        return;
      }

      if (checkDraw()) {
        updateGameStatus("Game ended in a draw!");
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === RED ? YELLOW : RED;
      updateCurrentPlayerDisplay();

      // Update hover piece color for the new player
      if (hoverPiece) {
        hoverPiece.material.color.setHex(
          currentPlayer === RED ? themeRedPieceColor : themeYellowPieceColor
        );
        hoverPiece.material.needsUpdate = true;
      }

      // Handle AI turn
      if (isAIMode && currentPlayer === YELLOW && !gameOver) {
        makeAIMove();
      }
    });
  }

  // Add a new function to handle AI moves
  function makeAIMove() {
    isAITurn = true;
    document.getElementById("canvas-container").classList.add("thinking");

    setTimeout(() => {
      const aiMove = getAIMove();
      document.getElementById("canvas-container").classList.remove("thinking");

      if (aiMove !== -1) {
        dropPiece(aiMove);
      }

      isAITurn = false;
    }, Math.random() * 1000 + 500);
  }

  // Get lowest empty row in a column
  function getLowestEmptyRow(col) {
    for (let row = 0; row < ROWS; row++) {
      if (board[col][row] === EMPTY) {
        return row;
      }
    }
    return -1;
  }

  function updatePlayerLabels() {
    const player1Label = document.querySelector(".player1 .player-label");
    const player2Label = document.querySelector(".player2 .player-label");
    
    player1Label.textContent = playerNames.player1 + (isAIMode ? " (You)" : "");
    const suffix = isAIMode ? " (AI)" : "";
    player2Label.textContent = playerNames.player2 + suffix;
  }

  // Setup click handlers for player name changes
  function setupPlayerNameClickHandlers() {
    const player1Label = document.querySelector(".player1 .player-label");
    const newPlayer1Label = player1Label.cloneNode(true);
    player1Label.parentNode.replaceChild(newPlayer1Label, player1Label);
    
    newPlayer1Label.style.cursor = "pointer";
    newPlayer1Label.style.textDecoration = "underline";
    newPlayer1Label.style.textDecorationStyle = "dotted";
    newPlayer1Label.title = "Click to change your name";
    
    newPlayer1Label.addEventListener("click", async () => {
      const newName = await showInputModal(
        "Enter your name:",
        playerNames.player1.replace(" (You)", "")
      );
      if (newName && newName.trim()) {
        playerNames.player1 = newName.trim();
        savePlayerNames();
        updatePlayerLabels();
        setupPlayerNameClickHandlers();
      }
    });

    const player2Label = document.querySelector(".player2 .player-label");
    const newPlayer2Label = player2Label.cloneNode(true);
    player2Label.parentNode.replaceChild(newPlayer2Label, player2Label);
    
    newPlayer2Label.style.cursor = "pointer";
    newPlayer2Label.style.textDecoration = "underline";
    newPlayer2Label.style.textDecorationStyle = "dotted";
    newPlayer2Label.title = "Click to change Player 2's name";
    
    newPlayer2Label.addEventListener("click", async () => {
      const currentName = playerNames.player2.replace(" (AI)", "");
      const newName = await showInputModal(
        "Enter Player 2's name:",
        currentName
      );
      if (newName && newName.trim()) {
        playerNames.player2 = newName.trim();
        savePlayerNames();
        updatePlayerLabels();
        setupPlayerNameClickHandlers();
      }
    });
  }

  // Update current player display
  function updateCurrentPlayerDisplay() {
    const player1Element = document.querySelector(".player1");
    const player2Element = document.querySelector(".player2");

    // Remove active class from both players
    player1Element.classList.remove("current-player", "current-player-you");
    player2Element.classList.remove("current-player", "current-player-ai");

    // Add active class to current player
    if (currentPlayer === RED) {
      player1Element.classList.add("current-player", "current-player-you");
    } else {
      player2Element.classList.add("current-player", "current-player-ai");
    }

    // Update fullscreen game info
    if (document.fullscreenElement) {
      updateFullscreenGameInfo();
    }
  }

  function updateFullscreenGameInfo() {
    const gameStatus = document.getElementById("game-status").textContent;
    const currentPlayerText =
      currentPlayer === RED ? `${playerNames.player1}'s Turn` : `${playerNames.player2}'s Turn`;
    const infoText = gameStatus || currentPlayerText;
    container.setAttribute("data-game-info", infoText);
  }

  // Check for win
  function checkWin(col, row) {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal up-right
      [1, -1], // diagonal up-left
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // Check both directions
      for (const multiplier of [1, -1]) {
        let c = col + dx * multiplier;
        let r = row + dy * multiplier;

        while (
          c >= 0 &&
          c < COLS &&
          r >= 0 &&
          r < ROWS &&
          board[c][r] === currentPlayer
        ) {
          count++;
          c += dx * multiplier;
          r += dy * multiplier;
        }
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  // Check for draw
  function checkDraw() {
    return board.every((column) => column.every((cell) => cell !== EMPTY));
  }

  // Get AI move based on difficulty
  function getAIMove() {
    switch (aiDifficulty) {
      case "easy":
        return getEasyAIMove();
      case "medium":
        return getMediumAIMove();
      case "hard":
        return getHardAIMove();
      default:
        return getMediumAIMove();
    }
  }

  function getEasyAIMove() {
    // Easy AI: Random valid move
    const validMoves = getValidMoves();
    if (validMoves.length === 0) return -1;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  function getMediumAIMove() {
    // Check if AI can win in one move
    const winningMove = findWinningMove(YELLOW);
    if (winningMove !== -1) return winningMove;

    // Check if player can win in one move and block it
    const blockingMove = findWinningMove(RED);
    if (blockingMove !== -1) return blockingMove;

    // Get valid moves
    const validMoves = getValidMoves();
    if (validMoves.length === 0) return -1;

    // Prefer center columns
    const weightedMoves = validMoves.map((col) => ({
      col,
      weight: 4 - Math.abs(col - 3), // Higher weight for center columns
    }));

    // Sort by weight (descending)
    weightedMoves.sort((a, b) => b.weight - a.weight);

    // 70% chance to pick the best move, 30% chance to pick randomly
    if (Math.random() < 0.7) {
      return weightedMoves[0].col;
    } else {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }

  function getHardAIMove() {
    // Check if AI can win in one move
    const winningMove = findWinningMove(YELLOW);
    if (winningMove !== -1) return winningMove;

    // Check if player can win in one move and block it
    const blockingMove = findWinningMove(RED);
    if (blockingMove !== -1) return blockingMove;

    // Use minimax with depth 4 for hard difficulty
    return findBestMove(4);
  }

  function findWinningMove(player) {
    for (let col = 0; col < COLS; col++) {
      const row = getLowestEmptyRow(col);
      if (row === -1) continue;

      // Try the move
      board[col][row] = player;
      const isWinning = checkWin(col, row);
      // Undo the move
      board[col][row] = EMPTY;

      if (isWinning) return col;
    }
    return -1;
  }

  function getValidMoves() {
    const moves = [];
    for (let col = 0; col < COLS; col++) {
      if (getLowestEmptyRow(col) !== -1) {
        moves.push(col);
      }
    }
    return moves;
  }

  function findBestMove(depth) {
    const validMoves = getValidMoves();
    if (validMoves.length === 0) return -1;

    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const col of validMoves) {
      const row = getLowestEmptyRow(col);
      if (row === -1) continue;

      board[col][row] = YELLOW;
      const score = minimax(depth - 1, -Infinity, Infinity, false);
      board[col][row] = EMPTY;

      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }

    return bestMove;
  }

  function minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard();

    const validMoves = getValidMoves();
    if (validMoves.length === 0) return 0;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const col of validMoves) {
        const row = getLowestEmptyRow(col);
        if (row === -1) continue;

        board[col][row] = YELLOW;
        if (checkWin(col, row)) {
          board[col][row] = EMPTY;
          return 1000 + depth;
        }
        const score = minimax(depth - 1, alpha, beta, false);
        board[col][row] = EMPTY;

        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const col of validMoves) {
        const row = getLowestEmptyRow(col);
        if (row === -1) continue;

        board[col][row] = RED;
        if (checkWin(col, row)) {
          board[col][row] = EMPTY;
          return -1000 - depth;
        }
        const score = minimax(depth - 1, alpha, beta, true);
        board[col][row] = EMPTY;

        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  }

  function evaluateBoard() {
    let score = 0;

    // Evaluate horizontal windows
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        score += evaluateWindow([
          board[col][row],
          board[col + 1][row],
          board[col + 2][row],
          board[col + 3][row],
        ]);
      }
    }

    // Evaluate vertical windows
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        score += evaluateWindow([
          board[col][row],
          board[col][row + 1],
          board[col][row + 2],
          board[col][row + 3],
        ]);
      }
    }

    // Evaluate diagonal windows (positive slope)
    for (let col = 0; col <= COLS - 4; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        score += evaluateWindow([
          board[col][row],
          board[col + 1][row + 1],
          board[col + 2][row + 2],
          board[col + 3][row + 3],
        ]);
      }
    }

    // Evaluate diagonal windows (negative slope)
    for (let col = 0; col <= COLS - 4; col++) {
      for (let row = 3; row < ROWS; row++) {
        score += evaluateWindow([
          board[col][row],
          board[col + 1][row - 1],
          board[col + 2][row - 2],
          board[col + 3][row - 3],
        ]);
      }
    }

    // Prefer center column
    for (let row = 0; row < ROWS; row++) {
      if (board[3][row] === YELLOW) score += 3;
    }

    return score;
  }

  function evaluateWindow(window) {
    const yellowCount = window.filter((cell) => cell === YELLOW).length;
    const redCount = window.filter((cell) => cell === RED).length;
    const emptyCount = window.filter((cell) => cell === EMPTY).length;

    if (yellowCount === 4) return 100;
    if (yellowCount === 3 && emptyCount === 1) return 5;
    if (yellowCount === 2 && emptyCount === 2) return 2;
    if (redCount === 3 && emptyCount === 1) return -4;
    return 0;
  }

  // Add these functions before the init() function
  function explodePieces() {
    if (isExploding) return;

    isExploding = true;
    winSound.play();

    // Create particle effects with theme colors
    createExplosionParticles();

    pieces.forEach((piece) => {
      piece.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.4,
        (Math.random() - 0.5) * 0.3
      );
      piece.rotationVelocity = new THREE.Vector3(
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1
      );
    });
  }

  // Add a new function to create explosion particles with theme colors
  function createExplosionParticles() {
    // Create particle system for explosion effect
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Convert theme colors to THREE.Color objects
    const redColor = new THREE.Color(themeRedPieceColor);
    const yellowColor = new THREE.Color(themeYellowPieceColor);
    const boardColor = new THREE.Color(themeBoardColor);

    // Create particles with random positions and colors
    for (let i = 0; i < particleCount; i++) {
      // Random position in a sphere
      const radius = 5 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random color from theme colors
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.4) {
        color = redColor;
      } else if (colorChoice < 0.8) {
        color = yellowColor;
      } else {
        color = boardColor;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add to floating objects with custom update
    FLOATING_OBJECTS.push({
      mesh: particleSystem,
      creationTime: Date.now(),
      update: (time) => {
        const age = Date.now() - particleSystem.userData.creationTime;

        // Expand and fade particles
        const positions = particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
          // Move outward
          positions[i] *= 1.01;
          positions[i + 1] *= 1.01;
          positions[i + 2] *= 1.01;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Fade out over time
        particleSystem.material.opacity = Math.max(0, 0.8 - age / 3000);

        // Remove when fully faded
        if (particleSystem.material.opacity <= 0) {
          scene.remove(particleSystem);
          const index = FLOATING_OBJECTS.findIndex(
            (obj) => obj.mesh === particleSystem
          );
          if (index !== -1) {
            FLOATING_OBJECTS.splice(index, 1);
          }
        }
      },
    });

    // Store creation time for age calculation
    particleSystem.userData.creationTime = Date.now();
  }

  function updateExplosion() {
    if (!isExploding) return;

    pieces.forEach((piece) => {
      // Update position
      piece.position.add(piece.velocity);
      piece.velocity.y -= 0.015; // Reduced gravity for smoother animation

      // Update rotation
      piece.rotation.x += piece.rotationVelocity.x;
      piece.rotation.y += piece.rotationVelocity.y;
      piece.rotation.z += piece.rotationVelocity.z;
    });
  }

  // Add new function to handle victory message
  function showVictoryMessage(winner) {
    // Create or get victory message element
    let victoryMessage = document.getElementById("victory-message");
    if (!victoryMessage) {
      victoryMessage = document.createElement("div");
      victoryMessage.id = "victory-message";
      document.getElementById("canvas-container").appendChild(victoryMessage);
    }

    // Convert color name to player name
    const playerWinner = winner === "Red" ? playerNames.player1 : playerNames.player2;

    // Set message style based on winner
    const color =
      winner === "Red"
        ? "#" + themeRedPieceColor.toString(16).padStart(6, "0")
        : "#" + themeYellowPieceColor.toString(16).padStart(6, "0");
    victoryMessage.style.color = color;
    victoryMessage.style.borderColor = color;
    victoryMessage.textContent = `${playerWinner} Wins!`;
    victoryMessage.style.display = "block";

    // Hide victory message before explosion
    setTimeout(() => {
      victoryMessage.style.display = "none";
    }, 3000);
  }

  // Update the initialization code to create the restart overlay
  function createRestartOverlay() {
    restartOverlay = document.createElement("div");
    restartOverlay.id = "restart-overlay";
    document.getElementById("canvas-container").appendChild(restartOverlay);

    // Add click handler for restart overlay
    restartOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      if (gameOver && isExploding) {
        initGame();
      }
    });
  }

  // Update the game status display to also update fullscreen info
  function updateGameStatus(text, color) {
    const gameStatus = document.getElementById("game-status");

    // Convert color names in text to player names
    let displayText = text;
    if (text.includes("Red Wins")) {
      displayText = `${playerNames.player1} Wins!`;
    } else if (text.includes("Yellow Wins")) {
      displayText = `${playerNames.player2} Wins!`;
    }

    gameStatus.textContent = displayText;

    // Use theme color if no specific color is provided
    if (!color) {
      // Determine if this is a win message
      if (text.includes("Wins")) {
        const isRed = text.includes("Red");
        color = isRed
          ? "#" + themeRedPieceColor.toString(16).padStart(6, "0")
          : "#" + themeYellowPieceColor.toString(16).padStart(6, "0");
      } else {
        // Default color
        color = "#" + themeBoardColor.toString(16).padStart(6, "0");
      }
    }

    gameStatus.style.color = color;

    if (document.fullscreenElement) {
      updateFullscreenGameInfo();
    }
  }

  // Add after the other functions but before the init() function
  function sayHello(name = "Player") {
    const message = `Hello, ${name}! Welcome to Connect 4 in Space!`;

    // Create a temporary message element
    const helloMessage = document.createElement("div");
    helloMessage.style.position = "fixed";
    helloMessage.style.top = "50%";
    helloMessage.style.left = "50%";
    helloMessage.style.transform = "translate(-50%, -50%)";
    helloMessage.style.background = "rgba(0, 0, 0, 0.8)";
    helloMessage.style.color = "#00ff00"; // C64 green color
    helloMessage.style.padding = "20px 40px";
    helloMessage.style.borderRadius = "10px";
    helloMessage.style.fontSize = "24px";
    helloMessage.style.fontFamily = "Arial, sans-serif";
    helloMessage.style.zIndex = "2000";
    helloMessage.style.textAlign = "center";
    helloMessage.style.border = "2px solid #00ff00";
    helloMessage.style.boxShadow = "0 0 20px #00ff00";
    helloMessage.textContent = message;

    document.body.appendChild(helloMessage);

    // Log to console as well
    console.log(message);

    // Remove the message after 3 seconds
    setTimeout(() => {
      helloMessage.style.opacity = "0";
      helloMessage.style.transition = "opacity 1s";
      setTimeout(() => {
        if (helloMessage && helloMessage.parentNode) {
          helloMessage.parentNode.removeChild(helloMessage);
        }
      }, 1000);
    }, 3000);

    return message;
  }

  /**
   * Show a modal dialog to get user input (replaces prompt)
   * @param {string} message - The message to display
   * @param {string} defaultValue - Default input value
   * @returns {Promise<string|null>} - Returns the input value or null if cancelled
   */
  function showInputModal(message, defaultValue = "") {
    return new Promise((resolve) => {
      // Get current theme
      const currentTheme = BACKGROUNDS[currentBackground]?.uiTheme || BACKGROUNDS.space.uiTheme;
      
      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = `rgba(0, 0, 0, 0.7)`;
      overlay.style.zIndex = "3000";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";

      // Create modal container
      const modal = document.createElement("div");
      modal.style.background = currentTheme.surface;
      modal.style.border = `2px solid ${currentTheme.border}`;
      modal.style.borderRadius = "10px";
      modal.style.padding = "30px";
      modal.style.minWidth = "400px";
      modal.style.maxWidth = "90%";
      modal.style.boxShadow = `0 0 30px ${currentTheme.glow}`;
      modal.style.fontFamily = "Arial, sans-serif";
      modal.style.color = currentTheme.text;

      // Create message label
      const label = document.createElement("label");
      label.textContent = message;
      label.style.display = "block";
      label.style.marginBottom = "15px";
      label.style.fontSize = "18px";
      label.style.fontWeight = "bold";
      label.style.color = currentTheme.primary;
      label.style.textShadow = `0 0 5px ${currentTheme.glow}`;

      // Create input field
      const input = document.createElement("input");
      input.type = "text";
      input.value = defaultValue;
      input.style.width = "100%";
      input.style.padding = "10px";
      input.style.marginBottom = "20px";
      input.style.background = currentTheme.background;
      input.style.border = `1px solid ${currentTheme.border}`;
      input.style.borderRadius = "5px";
      input.style.color = currentTheme.primary;
      input.style.fontSize = "16px";
      input.style.fontFamily = "Arial, sans-serif";
      input.style.outline = "none";
      input.style.boxSizing = "border-box";

      // Add focus styles
      input.addEventListener("focus", () => {
        input.style.borderColor = currentTheme.secondary;
        input.style.boxShadow = `0 0 10px ${currentTheme.glow}`;
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = currentTheme.border;
        input.style.boxShadow = "none";
      });

      // Create button container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "10px";
      buttonContainer.style.justifyContent = "flex-end";

      // Create submit button
      const submitButton = document.createElement("button");
      submitButton.textContent = "OK";
      submitButton.style.padding = "10px 20px";
      submitButton.style.background = currentTheme.surface;
      submitButton.style.border = `1px solid ${currentTheme.border}`;
      submitButton.style.borderRadius = "5px";
      submitButton.style.color = currentTheme.primary;
      submitButton.style.fontSize = "16px";
      submitButton.style.fontFamily = "Arial, sans-serif";
      submitButton.style.cursor = "pointer";
      submitButton.style.transition = "all 0.2s";
      submitButton.style.boxShadow = `0 0 5px ${currentTheme.glow}`;

      // Button hover effects
      submitButton.addEventListener("mouseenter", () => {
        submitButton.style.background = currentTheme.accent;
        submitButton.style.boxShadow = `0 0 15px ${currentTheme.glow}`;
        submitButton.style.transform = "translateY(-2px)";
      });
      submitButton.addEventListener("mouseleave", () => {
        submitButton.style.background = currentTheme.surface;
        submitButton.style.boxShadow = `0 0 5px ${currentTheme.glow}`;
        submitButton.style.transform = "translateY(0)";
      });

      // Create cancel button
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style.padding = "10px 20px";
      cancelButton.style.background = currentTheme.surface;
      cancelButton.style.border = `1px solid ${currentTheme.border}`;
      cancelButton.style.borderRadius = "5px";
      cancelButton.style.color = currentTheme.text;
      cancelButton.style.fontSize = "16px";
      cancelButton.style.fontFamily = "Arial, sans-serif";
      cancelButton.style.cursor = "pointer";
      cancelButton.style.transition = "all 0.2s";
      cancelButton.style.opacity = "0.7";

      cancelButton.addEventListener("mouseenter", () => {
        cancelButton.style.background = currentTheme.background;
        cancelButton.style.boxShadow = `0 0 10px ${currentTheme.glow}`;
        cancelButton.style.opacity = "1";
      });
      cancelButton.addEventListener("mouseleave", () => {
        cancelButton.style.background = currentTheme.surface;
        cancelButton.style.boxShadow = "none";
        cancelButton.style.opacity = "0.7";
      });

      // Assemble modal
      modal.appendChild(label);
      modal.appendChild(input);
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(submitButton);
      modal.appendChild(buttonContainer);
      overlay.appendChild(modal);

      // Append overlay to document body
      document.body.appendChild(overlay);

      // Focus input
      input.focus();
      input.select();

      // Cleanup function to remove overlay
      const cleanup = () => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      // Submit handler
      const handleSubmit = () => {
        const value = input.value.trim() || defaultValue;
        cleanup();
        resolve(value);
      };

      // Cancel handler
      const handleCancel = () => {
        cleanup();
        resolve(null);
      };

      // Event listeners
      submitButton.addEventListener("click", handleSubmit);
      cancelButton.addEventListener("click", handleCancel);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          handleCancel();
        }
      });

      // Keyboard handlers
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          handleCancel();
        }
      };

      input.addEventListener("keydown", handleKeyDown);
      overlay.addEventListener("keydown", handleKeyDown);
    });
  }

  /**
   * Show an info modal dialog (read-only, no input)
   * @param {string} message - The message to display
   */
  function showInfoModal(message) {
    // Get current theme
    const currentTheme = BACKGROUNDS[currentBackground]?.uiTheme || BACKGROUNDS.space.uiTheme;
    
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = `rgba(0, 0, 0, 0.7)`;
    overlay.style.zIndex = "3000";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // Create modal container
    const modal = document.createElement("div");
    modal.style.background = currentTheme.surface;
    modal.style.border = `2px solid ${currentTheme.border}`;
    modal.style.borderRadius = "10px";
    modal.style.padding = "30px";
    modal.style.minWidth = "400px";
    modal.style.maxWidth = "90%";
    modal.style.boxShadow = `0 0 30px ${currentTheme.glow}`;
    modal.style.fontFamily = "Arial, sans-serif";
    modal.style.color = currentTheme.text;
    modal.style.textAlign = "center";

    // Create message text
    const messageText = document.createElement("p");
    messageText.textContent = message;
    messageText.style.fontSize = "18px";
    messageText.style.fontWeight = "bold";
    messageText.style.color = currentTheme.primary;
    messageText.style.textShadow = `0 0 5px ${currentTheme.glow}`;
    messageText.style.margin = "0 0 20px 0";

    // Create OK button
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.padding = "10px 30px";
    okButton.style.background = currentTheme.surface;
    okButton.style.border = `1px solid ${currentTheme.border}`;
    okButton.style.borderRadius = "5px";
    okButton.style.color = currentTheme.primary;
    okButton.style.fontSize = "16px";
    okButton.style.fontFamily = "Arial, sans-serif";
    okButton.style.cursor = "pointer";
    okButton.style.transition = "all 0.2s";
    okButton.style.boxShadow = `0 0 5px ${currentTheme.glow}`;

    // Button hover effects
    okButton.addEventListener("mouseenter", () => {
      okButton.style.background = currentTheme.accent;
      okButton.style.boxShadow = `0 0 15px ${currentTheme.glow}`;
      okButton.style.transform = "translateY(-2px)";
    });
    okButton.addEventListener("mouseleave", () => {
      okButton.style.background = currentTheme.surface;
      okButton.style.boxShadow = `0 0 5px ${currentTheme.glow}`;
      okButton.style.transform = "translateY(0)";
    });

    // Assemble modal
    modal.appendChild(messageText);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Cleanup function
    const cleanup = () => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    // Event listeners
    okButton.addEventListener("click", cleanup);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        cleanup();
      }
    });

    // Keyboard handler
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        cleanup();
      }
    };

    overlay.addEventListener("keydown", handleKeyDown);
    okButton.focus();
  }

  // Wait for all required elements to be available
  function init() {
    const requiredElements = [
      "canvas-container",
      "game-board",
      "game-status",
      "reset-button",
      "game-mode",
      "ai-difficulty",
      "difficulty-container",
      "fullscreen-button",
    ];

    const missingElements = requiredElements.filter(
      (id) => !document.getElementById(id)
    );

    if (missingElements.length > 0) {
      console.error("Missing required elements:", missingElements);
      return;
    }

    // Set initial theme colors for player indicators
    document.documentElement.style.setProperty(
      "--theme-red-piece-color",
      "#" + themeRedPieceColor.toString(16).padStart(6, "0")
    );
    document.documentElement.style.setProperty(
      "--theme-yellow-piece-color",
      "#" + themeYellowPieceColor.toString(16).padStart(6, "0")
    );

    // Apply initial UI theme
    const initialBgSettings = BACKGROUNDS[currentBackground];
    if (initialBgSettings.uiTheme) {
      applyUITheme(initialBgSettings.uiTheme);
    }

    // Initialize player labels
    updatePlayerLabels();

    // Setup click handlers for player name changes
    setupPlayerNameClickHandlers();

    // Add click handler for title to show info modal
    const h1 = document.querySelector("h1");
    h1.style.cursor = "pointer";
    h1.title = "Click for info";
    h1.addEventListener("click", () => {
      showInfoModal("Vibe coded Connect X");
    });

    // Initialize Three.js and the game
    initThreeJS();
    initGame();
    animate(0);

    // Event listeners
    document.getElementById("reset-button").addEventListener("click", initGame);

    // Set initial game mode to AI
    document.getElementById("game-mode").value = "ai";
    document.getElementById("difficulty-container").style.display = "flex";

    document.getElementById("game-mode").addEventListener("change", (e) => {
      isAIMode = e.target.value === "ai";
      document.getElementById("difficulty-container").style.display = isAIMode
        ? "flex"
        : "none";

      // Update player indicator labels
      updatePlayerLabels();

      initGame();
    });

    document.getElementById("ai-difficulty").addEventListener("change", (e) => {
      aiDifficulty = e.target.value;
      initGame();
    });

    // Add background selection event listener
    document
      .getElementById("background-select")
      .addEventListener("change", (e) => {
        const selectedBackground = e.target.value;
        changeBackground(selectedBackground);
      });

    // Add 3D perspective effect
    const gameBoardContainer = document.querySelector(".game-board-container");

    document.addEventListener("mousemove", (e) => {
      if (gameBoard && !gameOver && gameBoardContainer) {
        const rect = gameBoard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle based on mouse position relative to center
        const angleX =
          ((e.clientY - centerY) / (window.innerHeight / 2)) * BOARD_TILT_MAX;
        const angleY =
          ((e.clientX - centerX) / (window.innerWidth / 2)) * -BOARD_TILT_MAX;

        // Apply the 3D transform
        gameBoardContainer.style.transform = [
          "perspective(1000px)",
          "rotateX(" + angleX + "deg)",
          "rotateY(" + angleY + "deg)",
        ].join(" ");
      }
    });

    // Add keyframe animation for piece landing
    const style = document.createElement("style");
    style.textContent = [
      "@keyframes landingBounce {",
      "  0% { transform: translateZ(10px) scale(1.1); }",
      "  50% { transform: translateZ(5px) scale(0.95); }",
      "  100% { transform: translateZ(0) scale(1); }",
      "}",
    ].join("\n");
    document.head.appendChild(style);

    // Add after the other event listeners
    fullscreenButton.addEventListener("click", toggleFullscreen);

    // Add fullscreen functions
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        enterFullscreen();
      } else {
        exitFullscreen();
      }
    }

    function enterFullscreen() {
      container.classList.add("fullscreen-mode");
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      fullscreenButton.querySelector(".fullscreen-text").textContent =
        "Exit Fullscreen";

      // Update game info immediately when entering fullscreen
      updateFullscreenGameInfo();

      // Adjust renderer and camera for fullscreen
      updateFullscreenRenderer(true);
    }

    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    // Handle fullscreen change events
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        container.classList.remove("fullscreen-mode");
        fullscreenButton.querySelector(".fullscreen-text").textContent =
          "Fullscreen";

        // Reset renderer and camera
        updateFullscreenRenderer(false);
      } else {
        container.classList.add("fullscreen-mode");
        fullscreenButton.querySelector(".fullscreen-text").textContent =
          "Exit Fullscreen";

        // Update renderer and camera
        updateFullscreenRenderer(true);
      }

      // Ensure the restart overlay covers the entire screen
      if (restartOverlay) {
        restartOverlay.style.width = document.fullscreenElement
          ? "100vw"
          : "100%";
        restartOverlay.style.height = document.fullscreenElement
          ? "100vh"
          : "100%";
      }
    }

    function updateFullscreenRenderer(isFullscreen) {
      const container = document.getElementById("canvas-container");
      if (isFullscreen) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
      } else {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
      }
      camera.updateProjectionMatrix();

      // Force a re-render to ensure stars are visible
      renderer.clear();

      // Log the state of stars after fullscreen change
      setTimeout(() => {
        console.log("Checking stars after fullscreen change:");
        checkStarsVisibility();

        // Force stars to be visible
        scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.visible = true;
            console.log("Ensuring star visibility:", object.visible);
          }
        });

        // Force a re-render
        renderer.render(scene, camera);
      }, 100);
    }

    // Set up music
    const musicTrackSelect = document.getElementById("music-track-select");
    const backgroundMusic = document.getElementById("background-music");
    const musicDebug = document.getElementById("music-debug");
    let isMusicPlaying = false;

    // Add event listeners for audio element to debug loading issues
    backgroundMusic.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      console.error("Current src:", backgroundMusic.currentSrc);

      // Show the music debug message (check if element exists)
      if (musicDebug) {
        musicDebug.style.display = "block";
        musicDebug.innerHTML = `
          <strong>Music files not found</strong><br>
          Unable to load music files from:<br>
          ${musicTracks.map(track => `- ${track}`).join('<br>')}
        `;
      }
    });

    backgroundMusic.addEventListener("loadeddata", () => {
      console.log("Audio loaded successfully:", backgroundMusic.currentSrc);
      // Hide the debug message if music loaded successfully
      if (musicDebug) {
        musicDebug.style.display = "none";
      }
    });

    // Function to change and play track
    function changeTrack(trackIndex) {
      console.log("changeTrack called with index:", trackIndex);
      console.log("musicTracks array:", musicTracks);
      console.log("musicTracks.length:", musicTracks.length);
      
      // If the default "Pick a tune" option is selected, do nothing
      if (trackIndex < 0) {
        console.log("Track index is negative, returning");
        return;
      }

      if (trackIndex >= 0 && trackIndex < musicTracks.length) {
        currentTrack = trackIndex;
        musicTrackSelect.value = trackIndex.toString();

        console.log("Changed to track:", musicTracks[currentTrack]);
        console.log("Setting backgroundMusic.src to:", musicTracks[currentTrack]);

        // Always play the music when a track is selected
        try {
          // Ensure audio is not muted and has volume
          backgroundMusic.muted = false;
          backgroundMusic.volume = 0.7;
          console.log("Audio element state - muted:", backgroundMusic.muted, "volume:", backgroundMusic.volume);
          
          // Set the source to the selected track (encode URL to handle spaces and special chars)
          backgroundMusic.src = encodeURI(musicTracks[currentTrack]);
          console.log("Calling backgroundMusic.load()");
          
          // Create a timeout to handle cases where canplaythrough never fires
          let playTimeout = setTimeout(() => {
            console.log("Timeout reached, attempting to play anyway");
            attemptPlay();
          }, 5000); // 5 second timeout
          
          // Function to attempt playback
          function attemptPlay() {
            clearTimeout(playTimeout); // Clear timeout if we're playing
            console.log("Attempting to play audio");
            
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log("Track changed and playing successfully");
                  isMusicPlaying = true;
                  if (musicDebug) {
                    musicDebug.style.display = "none"; // Hide debug message on success
                  }
                })
                .catch((error) => {
                  console.error("Track change playback failed:", error);
                  isMusicPlaying = false;

                  // Show a more specific error message about browser restrictions
                  if (musicDebug) {
                    musicDebug.style.display = "block";
                    musicDebug.innerHTML = `
                      <strong>Browser blocked autoplay</strong><br>
                      Due to browser restrictions, music can only play after a user interaction.<br>
                      Please try selecting a track again to play music.
                    `;
                  }
                });
            }
          }
          
          // Wait for the audio to be ready before playing
          backgroundMusic.addEventListener('canplaythrough', function playWhenReady() {
            console.log("Audio can play through");
            attemptPlay();
          }, { once: true });
          
          backgroundMusic.load();
        } catch (e) {
          console.error("Error changing track:", e);
          if (musicDebug) {
            musicDebug.style.display = "block";
          }
        }
      } else {
        console.error("Track index out of bounds:", trackIndex, "musicTracks.length:", musicTracks.length);
      }
    }

    // Add event listener for music track selection - automatically plays the selected track
    musicTrackSelect.addEventListener("change", (e) => {
      const trackIndex = parseInt(e.target.value);
      console.log("Music track selected:", trackIndex);
      changeTrack(trackIndex);
    });

    // Keyboard shortcuts for changing tracks (1-5) - automatically plays the selected track
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (key >= "1" && key <= "5") {
        const trackIndex = parseInt(key) - 1;
        changeTrack(trackIndex);
      }
    });

    // Add a message to help users understand how to play music
    const instructionsDiv = document.querySelector(".instructions");
    const musicInstructions = document.createElement("p");
    musicInstructions.innerHTML =
      "<strong>Music:</strong> Select a track from the dropdown menu to play music. You can also use keys 1-5 to quickly switch between tracks.";
    instructionsDiv.appendChild(musicInstructions);

    // Add click handler for instructions close button
    const instructionsCloseButton = document.querySelector(".instructions-close");
    const closeInstructions = () => {
      if (instructionsDiv.classList.contains("fading") || instructionsDiv.classList.contains("hidden")) {
        return; // Already closing or closed
      }
      instructionsDiv.classList.add("fading");
      
      // Wait for animation to complete before hiding
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            instructionsDiv.classList.add("hidden");
            instructionsDiv.classList.remove("fading");
          }, 650); // Total animation time: 0.5s opacity + 0.6s collapse + 0.05s delay = ~650ms
        });
      });
    };
    
    instructionsCloseButton.addEventListener("click", closeInstructions);

    // Auto-hide instructions after 15 seconds
    setTimeout(() => {
      if (!instructionsDiv.classList.contains("hidden") && !instructionsDiv.classList.contains("fading")) {
        closeInstructions();
      }
    }, 15000);

    // Add hello button to the UI
    const controlsContainer = document.querySelector(".controls");
    if (controlsContainer) {
      const helloButton = document.createElement("button");
      helloButton.id = "hello-button";
      helloButton.className = "control-button";
      helloButton.textContent = "Say Hello";
      helloButton.addEventListener("click", async () => {
        const playerName = await showInputModal("What's your name?", "Player");
        sayHello(playerName || "Player");
      });
      controlsContainer.appendChild(helloButton);
    }
  }

  // Call init function
  init();
});

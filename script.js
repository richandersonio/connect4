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
    "Red always goes first, then Yellow",
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
  // Use the remote music links
  const musicTracks = [
    "https://www.richanderson.io/c64demo/Dr Future - Lightforce (FTL Edit).mp3",
    "https://www.richanderson.io/c64demo/Dr Future - International Karate (Part I).mp3",
    "https://www.richanderson.io/c64demo/DrFuture_-_Speedball.mp3",
    "https://www.richanderson.io/c64demo/DrFuture_-_Xenon_Ready_Player_1.mp3",
    "https://www.richanderson.io/c64demo/shades.mp3",
  ];

  // Remove fallback tracks since we're always using online tracks
  // const fallbackTracks = [...];

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
    scene.background = new THREE.Color(SPACE_COLOR);

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
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 7.5; // Reduced from 10 to 7.5 (25% closer)
    controls.maxDistance = 22.5; // Reduced from 30 to 22.5 (25% closer)
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
      color: RED_COLOR,
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

    STAR_LAYERS.forEach((layer) => {
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
    let lastPauseTime = 0;
    let isPaused = false;

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
    textGroup.visible = true;

    scene.add(textGroup);

    // Add to floating objects for animation
    FLOATING_OBJECTS.push({
      mesh: textGroup,
      update: (time) => {
        // Ensure visibility
        textGroup.visible = true;

        if (isPaused) {
          if (Date.now() - lastPauseTime > PAUSE_DURATION) {
            isPaused = false;
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
    const boardMaterial = new THREE.MeshPhongMaterial({ color: BOARD_COLOR });
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
    const holeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

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
      color: player === RED ? RED_COLOR : YELLOW_COLOR,
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
              currentPlayer === RED ? RED_COLOR : YELLOW_COLOR
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

    const piece = createPiece(currentPlayer, col, ROWS + 1);
    const targetY = (row - (ROWS - 1) / 2) * CELL_SIZE;

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

  // Update current player display
  function updateCurrentPlayerDisplay() {
    const display = document.getElementById("current-player");
    display.textContent = currentPlayer === RED ? "Red" : "Yellow";
    display.style.color = currentPlayer === RED ? "#e74c3c" : "#f1c40f";

    // Update fullscreen game info
    if (document.fullscreenElement) {
      updateFullscreenGameInfo();
    }
  }

  function updateFullscreenGameInfo() {
    const gameStatus = document.getElementById("game-status").textContent;
    const currentPlayerText =
      currentPlayer === RED ? "Red's Turn" : "Yellow's Turn";
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

    // Set message style based on winner
    const color = winner === "Red" ? "#e74c3c" : "#f1c40f";
    victoryMessage.style.color = color;
    victoryMessage.style.borderColor = color;
    victoryMessage.textContent = `${winner} Wins!`;
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
    gameStatus.textContent = text;
    gameStatus.style.color = color || "#333";

    if (document.fullscreenElement) {
      updateFullscreenGameInfo();
    }
  }

  // Wait for all required elements to be available
  function init() {
    const requiredElements = [
      "canvas-container",
      "game-board",
      "current-player",
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
      initGame();
    });

    document.getElementById("ai-difficulty").addEventListener("change", (e) => {
      aiDifficulty = e.target.value;
      initGame();
    });

    // Add 3D perspective effect
    const gameBoardContainer = document.querySelector(".game-board-container");

    document.addEventListener("mousemove", (e) => {
      if (gameBoard && !gameOver) {
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

      // Show the music debug message
      musicDebug.style.display = "block";
      musicDebug.innerHTML = `
        <strong>Music files not found</strong><br>
        Unable to load music files from:<br>
        - https://www.richanderson.io/c64demo/Dr Future - Lightforce (FTL Edit).mp3<br>
        - https://www.richanderson.io/c64demo/Dr Future - International Karate (Part I).mp3<br>
        - https://www.richanderson.io/c64demo/DrFuture_-_Speedball.mp3<br>
        - https://www.richanderson.io/c64demo/DrFuture_-_Xenon_Ready_Player_1.mp3<br>
        - https://www.richanderson.io/c64demo/shades.mp3
      `;
    });

    backgroundMusic.addEventListener("loadeddata", () => {
      console.log("Audio loaded successfully:", backgroundMusic.currentSrc);
      // Hide the debug message if music loaded successfully
      musicDebug.style.display = "none";
    });

    // Function to change and play track
    function changeTrack(trackIndex) {
      // If the default "Pick a tune" option is selected, do nothing
      if (trackIndex < 0) {
        return;
      }

      if (trackIndex >= 0 && trackIndex < musicTracks.length) {
        currentTrack = trackIndex;
        musicTrackSelect.value = trackIndex.toString();

        console.log("Changed to track:", musicTracks[currentTrack]);

        // Always play the music when a track is selected
        try {
          // Set the source to the selected track
          backgroundMusic.src = musicTracks[currentTrack];
          backgroundMusic.load();

          // Play the music
          const playPromise = backgroundMusic.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Track changed and playing successfully");
                isMusicPlaying = true;
                musicDebug.style.display = "none"; // Hide debug message on success
              })
              .catch((error) => {
                console.error("Track change playback failed:", error);
                isMusicPlaying = false;

                // Show a more specific error message about browser restrictions
                musicDebug.style.display = "block";
                musicDebug.innerHTML = `
                  <strong>Browser blocked autoplay</strong><br>
                  Due to browser restrictions, music can only play after a user interaction.<br>
                  Please try selecting a track again to play music.
                `;
              });
          }
        } catch (e) {
          console.error("Error changing track:", e);
          musicDebug.style.display = "block";
        }
      }
    }

    // Add event listener for music track selection - automatically plays the selected track
    musicTrackSelect.addEventListener("change", (e) => {
      const trackIndex = parseInt(e.target.value);
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
  }

  // Call init function
  init();
});

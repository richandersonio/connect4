// Game Logic Module - Board state, win detection, and AI
import { GAME_CONFIG } from './config.js';

const { ROWS, COLS, EMPTY, RED, YELLOW } = GAME_CONFIG;

/**
 * Game state management
 */
export class GameLogic {
  constructor() {
    this.board = [];
    this.currentPlayer = RED;
    this.gameOver = false;
    this.isAIMode = true;
    this.aiDifficulty = 'medium';
    this.initBoard();
  }

  /**
   * Initialize the game board
   */
  initBoard() {
    this.board = Array(COLS)
      .fill()
      .map(() => Array(ROWS).fill(EMPTY));
    this.currentPlayer = RED;
    this.gameOver = false;
  }

  /**
   * Get the lowest empty row in a column
   */
  getLowestEmptyRow(col) {
    for (let row = 0; row < ROWS; row++) {
      if (this.board[col][row] === EMPTY) {
        return row;
      }
    }
    return -1;
  }

  /**
   * Place a piece in the specified column
   */
  placePiece(col) {
    const row = this.getLowestEmptyRow(col);
    if (row === -1 || this.gameOver) return -1;
    
    this.board[col][row] = this.currentPlayer;
    return row;
  }

  /**
   * Check if the current player has won
   */
  checkWin(col, row) {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal up-right
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
          this.board[c][r] === this.currentPlayer
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

  /**
   * Check if the game is a draw
   */
  checkDraw() {
    return this.board.every((column) => column.every((cell) => cell !== EMPTY));
  }

  /**
   * Switch to the next player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === RED ? YELLOW : RED;
  }

  /**
   * Get valid moves (columns that aren't full)
   */
  getValidMoves() {
    const moves = [];
    for (let col = 0; col < COLS; col++) {
      if (this.getLowestEmptyRow(col) !== -1) {
        moves.push(col);
      }
    }
    return moves;
  }

  /**
   * Get AI move based on difficulty
   */
  getAIMove() {
    switch (this.aiDifficulty) {
      case 'easy':
        return this.getEasyAIMove();
      case 'medium':
        return this.getMediumAIMove();
      case 'hard':
        return this.getHardAIMove();
      default:
        return this.getMediumAIMove();
    }
  }

  /**
   * Easy AI: Random valid move
   */
  getEasyAIMove() {
    const validMoves = this.getValidMoves();
    if (validMoves.length === 0) return -1;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  /**
   * Medium AI: Block player wins and prefer center
   */
  getMediumAIMove() {
    // Check if AI can win in one move
    const winningMove = this.findWinningMove(YELLOW);
    if (winningMove !== -1) return winningMove;

    // Check if player can win in one move and block it
    const blockingMove = this.findWinningMove(RED);
    if (blockingMove !== -1) return blockingMove;

    // Get valid moves
    const validMoves = this.getValidMoves();
    if (validMoves.length === 0) return -1;

    // Prefer center columns
    const weightedMoves = validMoves.map((col) => ({
      col,
      weight: 4 - Math.abs(col - 3),
    }));

    weightedMoves.sort((a, b) => b.weight - a.weight);

    // 70% chance to pick the best move, 30% chance to pick randomly
    if (Math.random() < 0.7) {
      return weightedMoves[0].col;
    } else {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }

  /**
   * Hard AI: Use minimax algorithm
   */
  getHardAIMove() {
    // Check if AI can win in one move
    const winningMove = this.findWinningMove(YELLOW);
    if (winningMove !== -1) return winningMove;

    // Check if player can win in one move and block it
    const blockingMove = this.findWinningMove(RED);
    if (blockingMove !== -1) return blockingMove;

    // Use minimax with depth 4
    return this.findBestMove(4);
  }

  /**
   * Find a winning move for the specified player
   */
  findWinningMove(player) {
    for (let col = 0; col < COLS; col++) {
      const row = this.getLowestEmptyRow(col);
      if (row === -1) continue;

      // Try the move
      this.board[col][row] = player;
      const isWinning = this.checkWin(col, row);
      // Undo the move
      this.board[col][row] = EMPTY;

      if (isWinning) return col;
    }
    return -1;
  }

  /**
   * Find the best move using minimax algorithm
   */
  findBestMove(depth) {
    const validMoves = this.getValidMoves();
    if (validMoves.length === 0) return -1;

    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const col of validMoves) {
      const row = this.getLowestEmptyRow(col);
      if (row === -1) continue;

      this.board[col][row] = YELLOW;
      const score = this.minimax(depth - 1, -Infinity, Infinity, false);
      this.board[col][row] = EMPTY;

      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }

    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) return this.evaluateBoard();

    const validMoves = this.getValidMoves();
    if (validMoves.length === 0) return 0;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const col of validMoves) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) continue;

        this.board[col][row] = YELLOW;
        if (this.checkWin(col, row)) {
          this.board[col][row] = EMPTY;
          return 1000 + depth;
        }
        const score = this.minimax(depth - 1, alpha, beta, false);
        this.board[col][row] = EMPTY;

        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const col of validMoves) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) continue;

        this.board[col][row] = RED;
        if (this.checkWin(col, row)) {
          this.board[col][row] = EMPTY;
          return -1000 - depth;
        }
        const score = this.minimax(depth - 1, alpha, beta, true);
        this.board[col][row] = EMPTY;

        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  }

  /**
   * Evaluate the board position
   */
  evaluateBoard() {
    let score = 0;

    // Evaluate horizontal windows
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        score += this.evaluateWindow([
          this.board[col][row],
          this.board[col + 1][row],
          this.board[col + 2][row],
          this.board[col + 3][row],
        ]);
      }
    }

    // Evaluate vertical windows
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        score += this.evaluateWindow([
          this.board[col][row],
          this.board[col][row + 1],
          this.board[col][row + 2],
          this.board[col][row + 3],
        ]);
      }
    }

    // Evaluate diagonal windows (positive slope)
    for (let col = 0; col <= COLS - 4; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        score += this.evaluateWindow([
          this.board[col][row],
          this.board[col + 1][row + 1],
          this.board[col + 2][row + 2],
          this.board[col + 3][row + 3],
        ]);
      }
    }

    // Evaluate diagonal windows (negative slope)
    for (let col = 0; col <= COLS - 4; col++) {
      for (let row = 3; row < ROWS; row++) {
        score += this.evaluateWindow([
          this.board[col][row],
          this.board[col + 1][row - 1],
          this.board[col + 2][row - 2],
          this.board[col + 3][row - 3],
        ]);
      }
    }

    // Prefer center column
    for (let row = 0; row < ROWS; row++) {
      if (this.board[3][row] === YELLOW) score += 3;
    }

    return score;
  }

  /**
   * Evaluate a window of 4 cells
   */
  evaluateWindow(window) {
    const yellowCount = window.filter((cell) => cell === YELLOW).length;
    const redCount = window.filter((cell) => cell === RED).length;
    const emptyCount = window.filter((cell) => cell === EMPTY).length;

    if (yellowCount === 4) return 100;
    if (yellowCount === 3 && emptyCount === 1) return 5;
    if (yellowCount === 2 && emptyCount === 2) return 2;
    if (redCount === 3 && emptyCount === 1) return -4;
    return 0;
  }
}

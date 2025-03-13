class Game {
  constructor() {
    this.board = Array(6)
      .fill()
      .map(() => Array(7).fill(null));
    this.currentPlayer = "red";
    this.gameOver = false;
    this.winner = null;
    this.setupEventListeners();
    this.updateStatus();
  }

  setupEventListeners() {
    document.querySelectorAll(".column").forEach((column, columnIndex) => {
      column.addEventListener("click", () => {
        if (this.gameOver) return;

        const rowIndex = this.findAvailableRow(columnIndex);
        if (rowIndex !== -1) {
          this.makeMove(rowIndex, columnIndex);
        }
      });
    });

    document.getElementById("reset-button").addEventListener("click", () => {
      this.resetGame();
    });
  }

  findAvailableRow(columnIndex) {
    for (let rowIndex = 5; rowIndex >= 0; rowIndex--) {
      if (!this.board[rowIndex][columnIndex]) {
        return rowIndex;
      }
    }
    return -1; // Column is full
  }

  makeMove(rowIndex, columnIndex) {
    this.board[rowIndex][columnIndex] = this.currentPlayer;

    const cell = document.querySelector(
      `.cell[data-row="${rowIndex}"][data-col="${columnIndex}"]`
    );
    const disc = document.createElement("div");
    disc.classList.add("disc", this.currentPlayer);
    cell.appendChild(disc);

    if (this.checkWin(rowIndex, columnIndex)) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
      this.updateStatus();
      return;
    }

    if (this.checkDraw()) {
      this.gameOver = true;
      this.updateStatus();
      return;
    }

    this.currentPlayer = this.currentPlayer === "red" ? "yellow" : "red";
    this.updateStatus();
  }

  checkWin(rowIndex, columnIndex) {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    const player = this.board[rowIndex][columnIndex];

    for (const [dx, dy] of directions) {
      let count = 1;

      // Check in positive direction
      for (let i = 1; i <= 3; i++) {
        const newRow = rowIndex + i * dx;
        const newCol = columnIndex + i * dy;

        if (
          newRow < 0 ||
          newRow >= 6 ||
          newCol < 0 ||
          newCol >= 7 ||
          this.board[newRow][newCol] !== player
        ) {
          break;
        }

        count++;
      }

      // Check in negative direction
      for (let i = 1; i <= 3; i++) {
        const newRow = rowIndex - i * dx;
        const newCol = columnIndex - i * dy;

        if (
          newRow < 0 ||
          newRow >= 6 ||
          newCol < 0 ||
          newCol >= 7 ||
          this.board[newRow][newCol] !== player
        ) {
          break;
        }

        count++;
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  checkDraw() {
    return this.board[0].every((cell) => cell !== null);
  }

  updateStatus() {
    const statusElement = document.getElementById("status");

    if (this.gameOver) {
      if (this.winner) {
        statusElement.textContent = `${
          this.winner.charAt(0).toUpperCase() + this.winner.slice(1)
        } wins!`;
      } else {
        statusElement.textContent = "It's a draw!";
      }
    } else {
      statusElement.textContent = `${
        this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)
      }'s turn`;
    }
  }

  resetGame() {
    // Clear the board data
    this.board = Array(6)
      .fill()
      .map(() => Array(7).fill(null));
    this.currentPlayer = "red";
    this.gameOver = false;
    this.winner = null;

    // Clear the visual board
    document.querySelectorAll(".disc").forEach((disc) => {
      disc.remove();
    });

    this.updateStatus();
  }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new Game();
});

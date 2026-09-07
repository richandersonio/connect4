import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Exercise the live inline functions without initializing WebGL or browser audio.
const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
function extract(name) {
  const start = source.indexOf(`  function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }', start) + '\n  }'.length;
  return source.slice(start, end);
}
function context(names, globals = {}) {
  const scope = vm.createContext({ ...globals });
  vm.runInContext(names.map(extract).join('\n'), scope);
  return scope;
}

test('AI detects either player’s winning move and restores the board', () => {
  const board = Array.from({ length: 7 }, () => Array(6).fill(0));
  const scope = context(['getLowestEmptyRow', 'checkWin', 'findWinningMove'], {
    COLS: 7, ROWS: 6, EMPTY: 0, RED: 1, YELLOW: 2, currentPlayer: 2, board,
  });
  for (const player of [1, 2]) {
    board.forEach(column => column.fill(0));
    board[0].splice(0, 3, player, player, player);
    const before = JSON.stringify(board);
    assert.equal(scope.findWinningMove(player), 0);
    assert.equal(JSON.stringify(board), before);
    board[0][3] = player;
    assert.equal(scope.checkWin(0, 3, player), true);
  }
});

test('reset invalidates pending AI and victory actions but permits new actions', () => {
  const pending = [];
  let drops = 0;
  const scope = context(['scheduleGameAction', 'makeAIMove'], {
    gameGeneration: 0, isAITurn: false,
    setTimeout: fn => pending.push(fn),
    document: { getElementById: () => ({ classList: { add() {}, remove() {} } }) },
    getAIMove: () => 3, dropPiece: () => drops++,
  });
  scope.makeAIMove();
  let explosions = 0;
  scope.scheduleGameAction(() => explosions++, 3000);
  scope.gameGeneration++;
  pending.splice(0).forEach(fn => fn());
  assert.equal(drops, 0);
  assert.equal(explosions, 0);
  scope.makeAIMove();
  pending.splice(0).forEach(fn => fn());
  assert.equal(drops, 1);
});

test('reset stops an in-flight drop before its completion callback', () => {
  let now = 0;
  const frames = [];
  let completed = false;
  const scope = context(['dropPieceAnimation'], {
    gameGeneration: 0, ANIMATION_DURATION: 1000,
    Date: { now: () => now }, requestAnimationFrame: fn => frames.push(fn),
  });
  const piece = { position: { y: 10 } };
  scope.dropPieceAnimation(piece, 0, () => completed = true);
  scope.gameGeneration++;
  now = 1000;
  frames.splice(0).forEach(fn => fn());
  assert.equal(completed, false);
  assert.equal(piece.position.y, 10);
});

test('board cleanup removes every mesh and disposes shared resources once', () => {
  const resources = [];
  function resource() {
    const item = { disposed: 0, dispose() { this.disposed++; } };
    resources.push(item);
    return item;
  }
  const holeGeometry = resource(), holeMaterial = resource();
  const holes = Array.from({ length: 42 }, () => ({ geometry: holeGeometry, material: holeMaterial }));
  const mesh = () => ({ geometry: resource(), material: resource() });
  const boardMesh = mesh(), pieces = [mesh(), mesh()];
  const live = new Set([boardMesh, ...holes, ...pieces]);
  const scope = context(['clearBoardResources'], {
    boardMesh, boardHoles: holes, pieces, scene: { remove: mesh => live.delete(mesh) },
  });
  scope.clearBoardResources();
  assert.equal(live.size, 0);
  resources.forEach(item => assert.equal(item.disposed, 1));
  assert.equal(scope.boardHoles.length, 0);
  assert.equal(scope.pieces.length, 0);
  scope.clearBoardResources();
  resources.forEach(item => assert.equal(item.disposed, 1));
});

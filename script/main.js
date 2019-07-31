
let keys = {};
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d'); 
canvas.width = 850;
canvas.height = 650;
document.getElementById('game-board').insertBefore(canvas, null);

// Define Parâmetros de jogo;
let walls = { x: (canvas.width / 50), y: (canvas.height / 50) };
let columns = { x: parseInt(((walls.x - 2) / 2)), y: parseInt((walls.y / 2) - 1) }; 
let board = createBoard(walls);
const block = 'block';
let bomberman = new Bomberman(ctx);

document.getElementById('start-game').addEventListener('click', () => { 
  board = createBoard(walls);
  clearInterval(bomberman.interval);
  bomberman = new Bomberman(ctx);
});

function updateGameArea() {
  bomberman.updateGame();
  bomberman.move('', keys);
}

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  keys[e.code] = true;
  bomberman.bomb(e, keys);
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function createBoard(walls) {
  let board = [];
  let lineBoard = [];
  let lineColumn = true;
  let blockColumn = false;
  const block = 'block';
  for (let y = 0; y < walls.y; y += 1) {
    for (let x = 0; x < walls.x; x += 1) {
      if ((y === 0 || y === (walls.y - 1)) || (x === 0 || x === (walls.x - 1))) {
        lineBoard[x] = block;
      } else if (lineColumn) {
        if (blockColumn) {
          lineBoard[x] = block;
        } else {
          lineBoard[x] = undefined;
        }
        blockColumn = !blockColumn;
      } else {
        lineBoard[x] = undefined;
      }
    }
    board.push(lineBoard);
    lineBoard = [];
    lineColumn = !lineColumn;
    blockColumn = false;
  }
  return board;
}

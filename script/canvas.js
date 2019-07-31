
let acrescimo = 5;

class Bomberman {
  constructor(ctx) {
    this.ctx = ctx;
    this.bombs = [];
    this.blocks = [];
    this.explosions = [];
    this.enemies = [];
    this.obstacles = [];
    this.deleteObstacles = [];
    this.player = [];
    this.numberEnemies = 0;
    this.numberBlocks = 0;
    this.createComponents();  
    this.interval = setInterval(updateGameArea, 20);    
    this.deleted = [];
  }

  createComponents() {
    this.defineLevel();
    this.fillBackground();
    this.createWalls();
    this.createColumns();
    this.createPlayer();
    this.createObstacles();
    this.createEnemies();
  }

  updateGame() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.fillBackground();
    this.start();
    this.updateBombs();
    this.updateExplosion();
    this.updatePositions();
    this.updateObstacles();
    this.validateColision();
    this.validateWin();
  }

  defineLevel() {
    const easy = document.getElementById('easy');
    const normal = document.getElementById('normal');
    const hard = document.getElementById('hard');
    if (easy.checked) {
      this.numberBlocks = 10;
      this.numberEnemies = 1;
    }
    if (normal.checked) {
      this.numberBlocks = 40;
      this.numberEnemies = 5;
    }
    if (hard.checked) {
      this.numberBlocks = 70;
      this.numberEnemies = 15;
    }
  }

  validateWin() {
    if (this.enemies.length === 0) {
      const img = new Image();
      img.src = 'images/win-png.png';
      img.onload = () => {  
        this.ctx.drawImage(img, 25, 100, 800, 400); 
      };
      clearInterval(this.interval);
    }
  }

  validateColision() {
    const crashed = this.enemies.some((obstacle) => {
      return this.player[0].crashWith(obstacle);
    });

    if (crashed) { 
      const img = new Image();
      img.src = 'images/game over.png';
      img.onload = () => {  
        this.ctx.drawImage(img, 25, 100, 800, 400);      
      };
      clearInterval(this.interval); 
    }
  }

  updateObstacles() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      if (!this.obstacles[i].deleted) {
        this.obstacles[i].printObstacles(this.ctx);
      } else {
        this.obstacles.splice(i, 1);
        i -= 1;
      }
    }
  }

  updateExplosion() {
    for (let i = 0; i < this.explosions.length; i += 1) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 20;
      this.ctx.strokeStyle = '#FF6347';

      // for (let j = 0; j < this.obstacles.length; j += 1) {
      //   let result = false;
      //   result = this.explosions[i].crashWith(this.obstacles[i]);
      //   if (result) {
      //     this.obstacles.splice(i, 1);
      //   }
      // }
      // console.log(this.explosions[i].limitRight);
      // console.log(this.explosions[i]);
      this.explosions[i].limitRight = this.defineLimits2(this.explosions[i], 'limitRight', 1, this.blocks, 'B', true, 'y', 'x', 'width', false);
      this.explosions[i].limitRight = this.defineLimits2(this.explosions[i], 'limitRight', 1, this.obstacles, 'O', true, 'y', 'x', 'width', false);
      this.explosions[i].limitRight = this.defineLimits2(this.explosions[i], 'limitRight', 1, this.player, 'P', true, 'y', 'x', 'width', true);
      this.explosions[i].limitRight = this.defineLimits2(this.explosions[i], 'limitRight', 1, this.enemies, 'E', true, 'y', 'x', 'width', true);
      printLine(this.explosions[i], 1, 'limitRight', true, this.ctx);

      this.explosions[i].limitLeft = this.defineLimits2(this.explosions[i], 'limitLeft', -1, this.blocks, 'B', false, 'y', 'x', 'width', false);
      this.explosions[i].limitLeft = this.defineLimits2(this.explosions[i], 'limitLeft', -1, this.obstacles, 'O', false, 'y', 'x', 'width', false);
      this.explosions[i].limitLeft = this.defineLimits2(this.explosions[i], 'limitLeft', -1, this.player, 'P', false, 'y', 'x', 'width', true);
      this.explosions[i].limitLeft = this.defineLimits2(this.explosions[i], 'limitLeft', -1, this.enemies, 'E', false, 'y', 'x', 'width', true);
      printLine(this.explosions[i], -1, 'limitLeft', true, this.ctx);

      this.explosions[i].limitUp = this.defineLimits2(this.explosions[i], 'limitUp', -1, this.blocks, 'B', false, 'x', 'y', 'height', false);     
      this.explosions[i].limitUp = this.defineLimits2(this.explosions[i], 'limitUp', -1, this.obstacles, 'O', false, 'x', 'y', 'height', false);      
      this.explosions[i].limitUp = this.defineLimits2(this.explosions[i], 'limitUp', -1, this.player, 'P', false, 'x', 'y', 'height', true);      
      this.explosions[i].limitUp = this.defineLimits2(this.explosions[i], 'limitUp', -1, this.enemies, 'E', false, 'x', 'y', 'height', true);      
      printLine(this.explosions[i], -1, 'limitUp', false, this.ctx);

      this.explosions[i].limitDown = this.defineLimits2(this.explosions[i], 'limitDown', 1, this.blocks, 'B', true, 'x', 'y', 'height', false);    
      this.explosions[i].limitDown = this.defineLimits2(this.explosions[i], 'limitDown', 1, this.obstacles, 'O', true, 'x', 'y', 'height', false);     
      this.explosions[i].limitDown = this.defineLimits2(this.explosions[i], 'limitDown', 1, this.player, 'P', true, 'x', 'y', 'height', true);     
      this.explosions[i].limitDown = this.defineLimits2(this.explosions[i], 'limitDown', 1, this.enemies, 'E', true, 'x', 'y', 'height', true);     
      printLine(this.explosions[i], 1, 'limitDown', false, this.ctx);


      this.ctx.closePath();
      if (this.explosions[i].linePlus < 125) {
        this.explosions[i].linePlus += 10;
      } else if (this.explosions[i].frames < 20) {
        this.explosions[i].frames += 1;
      } else {
        this.explosions.splice(i, 1);
        i -= 1;
      }
    }
  }

  updateBombs() {
    const img = new Image();
    img.src = 'images/bomba.png';
    for (let i = 0; i < this.bombs.length; i += 1) {
      if (this.bombs[i].frames < 300) {
        this.bombs[i].frames += 1;
        this.bombs[i].updateImage(img, this.ctx);
      } else {
        this.explosions.push(new Component(50, 50, '', (this.bombs[i].x + 25), (this.bombs[i].y + 25)));
        this.bombs.splice(i, 1);
        i -= 1;
      }
    }
  }

  move(e, keys) {
    let tecla = true;
    // while (tecla) {
    //   tecla = false;
    if (keys.ArrowRight) {
      this.player[0].move(39, this.blocks, this.obstacles, this.bombs);
      tecla = true;
    }
    if (keys.ArrowLeft) {
      this.player[0].move(37, this.blocks, this.obstacles, this.bombs);
      tecla = true;
    }
    if (keys.ArrowUp) {
      this.player[0].move(38, this.blocks, this.obstacles, this.bombs);
      tecla = true;
    }     
    if (keys.ArrowDown) {
      this.player[0].move(40, this.blocks, this.obstacles, this.bombs);
      tecla = true;
    }
    // }
  }

  bomb(e, keys){
    if (e.keyCode === 32) {
      this.player[0].move(32, this.blocks, this.obstacles, this.bombs);
    }
  }

  updatePositions() {
    let update;

    if (!this.player[0].deleted) {
      this.player[0].updatePosition(this.ctx);
    } else { 
      const img = new Image();
      img.src = 'images/game over.png';
      img.onload = () => {  
        this.ctx.drawImage(img, 25, 100, 800, 400);      
      }
      clearInterval(this.interval); 
    }

    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].deleted === true) {
        this.enemies.splice(i, 1);
        i -= 1;
      }
    }
    for (let i = 0; i < this.enemies.length; i += 1) {
      update = false;
      this.enemies[i].frames += 1;

      if (this.enemies[i].firstInteraction) {
        update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
        if (!update) {
          if (this.enemies[i].direction === 39) {
            this.enemies[i].direction = 40;
            update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
            if (!update) {
              this.enemies[i].direction = 39;
              this.enemies[i].speed *= -1;
            }
          } else {
            this.enemies[i].direction = 39;
            update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
            if (!update) {
              this.enemies[i].direction = 40;
              this.enemies[i].speed *= -1;
            }            
          }
        }
        this.enemies[i].firstInteraction = false;        
      }

      if ((this.enemies[i].frames % 100) === 0) {
        if (this.enemies[i].direction === 39) {
          this.enemies[i].direction = 40;
          update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
          if (!update) {
            this.enemies[i].direction = 39;
            this.enemies[i].frames -= 1;
          } 
        } else {          
          this.enemies[i].direction = 39;
          update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
          if (!update) {
            this.enemies[i].direction = 40;
            this.enemies[i].frames -= 1;            
          }          
        }
      }

      if (!update) {
        update = this.enemies[i].move(this.enemies[i].direction, this.blocks, this.obstacles, this.bombs);
      }
      if (!update) {
        this.enemies[i].speed *= -1;
      } 
      this.enemies[i].updatePosition(this.ctx);
    }
  }

  start() {
    this.drawBlocks();
  }

  drawBlocks() {
    this.blocks.forEach((block) => {
      block.update(this.ctx);
    });
  }

  fillBackground() {
    this.ctx.fillStyle = 'green';    
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);    
  }

  createEnemies() {
    let countEnemies = this.numberEnemies;
    let line = 0;
    let col = 0;
    let direction = 40;
    while (countEnemies > 0) {
      line = Math.floor(Math.random() * board.length);
      col = Math.floor(Math.random() * board[0].length);
      if (board[line][col] === undefined) {
        if (direction === 39) {
          direction = 40;
        } else {
          direction = 39;
        }
        this.enemies.push(new Component(40, 40, "red", col * 50 + 25, line * 50 + 25, 20, 0, (Math.PI * 2), 2, direction, true));    
        board[line][col] = 'enemie';
        countEnemies -= 1;        
      }
    }
  }

  printObjects() {
    let canvasX = 0;
    let canvasY = 0;

    for (let y = 0; y < board.length; y += 1) {
      for (let x = 0; x < board[y].length; x += 1) {

        switch (board[y][x]) {
          case block:
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(canvasX, canvasY, 50, 50);
            this.ctx.fillStyle = 'grey';    
            this.ctx.fillRect(canvasX, canvasY, 50 - 1, 50 - 1);   
            break;
          default:
        }
        canvasX += 50;
      }
      canvasX = 0;
      canvasY += 50;
    }
  }

  createPlayer() {
    this.player.push(new Component(40, 40, "orange", 75, 75, 20, 0, (Math.PI * 2), 5));
    this.ctx.beginPath();
    this.ctx.arc(75, 75, 20, 0, Math.PI * 2);
    this.ctx.fillStyle = "orange";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
    this.ctx.closePath();
  }

  createWalls() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < walls.x; i += 1) {
      this.blocks.push(new Component(50, 50, "#D3D3D3", x, y));
      this.blocks.push(new Component(50, 50, "#D3D3D3", x, canvas.height - 50));      
      x += 50;      
    }

    x = 0;
    y = 0;
    for (let i = 0; i < walls.y; i += 1) {
      y += 50;
      this.blocks.push(new Component(50, 50, "#D3D3D3", x, y));
      this.blocks.push(new Component(50, 50, "#D3D3D3", canvas.width - 50, y));           
    }
  }

  createColumns() {
    let x = 0;
    let y = 0;

    for (let j = 0; j < columns.x; j += 1) {
      x += 100;
      y = 0;
      for (let i = 0; i < columns.y; i += 1) {
        y += 100;
        this.blocks.push(new Component(50, 50, "#D3D3D3", x, y));
        this.blocks.push(new Component(50, 50, "#D3D3D3", canvas.width - 50, y));           
      }
    }
  }

  createObstacles() {    
    board[1][2] = 'space';
    board[2][1] = 'space';
    board[1][1] = 'player';
    let countObstacles = this.numberBlocks;
    let line = 0;
    let col = 0;
    while (countObstacles > 0) {
      line = Math.floor(Math.random() * board.length);
      col = Math.floor(Math.random() * board[0].length);
      if (board[line][col] === undefined) {
        this.obstacles.push(new Component(50, 50, '#D3D3D3', col * 50, line * 50));     
        board[line][col] = 'obstacle';
        countObstacles -= 1;
      }
    }
  }

  defineLimits2(explosion, limit, plus, obstacle, type, increases, position, crash, measure, live) {
    let newLimit = explosion[limit];
    if (explosion[limit] === 0) {

      let calc = 0;
      const linePlus = explosion.linePlus * plus;
      let obstacleAux = JSON.parse(JSON.stringify(obstacle));
      if (live) {
        for (let i = 0; i < obstacleAux.length; i += 1) {
          obstacleAux[i].x -= 25;
          obstacleAux[i].y -= 25;
          obstacleAux[i].width = 50;
          obstacleAux[i].height = 50;
        }
      }
      calc = explosion[crash] + linePlus;
      if (calc < 0) {
        calc = 0;
      }
      for (let j = 0; j < obstacleAux.length; j += 1) {
        if ((explosion[position] > obstacleAux[j][position] && explosion[position] < (obstacleAux[j][position] + obstacleAux[j][measure]) &&
        calc <= (obstacleAux[j][crash] + obstacleAux[j][measure]) && calc >= obstacleAux[j][crash] )) {   
          if (!live) {
            if (increases) {
              newLimit = obstacleAux[j][crash];
            } else {
              newLimit = (obstacleAux[j][crash] + obstacleAux[j][measure]);
            }
          } else {
            newLimit = explosion[limit];
          }
          switch (type) {
            case 'O':
              this.obstacles[j].deleted = true;
              break;
            case 'P':
              this.player[j].deleted = true;
              break;
            case 'E':
              this.enemies[j].deleted = true;
              break;
            default:
          }
          break;
        }
      }
    }
    return newLimit;
  }
}
function printLine(explosion, plus, newLimit, side, ctx) {
  const linePlus = explosion.linePlus * plus;
  if (!side) {
    if (explosion[newLimit] === 0) {
      ctx.moveTo(explosion.x, explosion.y);
      ctx.lineTo((explosion.x), (explosion.y + linePlus));
      ctx.stroke();
    } else {
      ctx.moveTo(explosion.x, explosion.y);
      ctx.lineTo((explosion.x), explosion[newLimit]);
      ctx.stroke();
    }
  } else if (explosion[newLimit] === 0) {
    ctx.moveTo(explosion.x, explosion.y);
    ctx.lineTo((explosion.x + linePlus), (explosion.y));
    ctx.stroke();
  } else {
    ctx.moveTo(explosion.x, explosion.y);
    ctx.lineTo((explosion[newLimit]), (explosion.y));
    ctx.stroke();
  }
}

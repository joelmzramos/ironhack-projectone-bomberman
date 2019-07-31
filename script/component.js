function bombCordinates(value) {
  if ((parseInt(value / 25) % 2) === 0) {
    return ((parseInt(value / 25) + 1) * 25) - 25;
  }
  return (parseInt(value / 25) * 25) - 25;
}

class Component {
  constructor(width, height, color, x, y, radius, start, end, speed, direction, enemie) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.start = start;
    this.end = end;
    this.frames = 0;
    this.linePlus = 0;
    this.limitUp = 0;
    this.limitDown = 0;
    this.limitRight = 0;
    this.limitLeft = 0;
    this.deleted = false;
    this.direction = direction;
    this.firstInteraction = true;
    this.enemie = enemie;
  }

  printObstacles(ctx) {
    const linesDivision = this.height / 3;

    ctx.fillStyle = this.color;    
    ctx.fillRect(this.x, this.y, this.width, this.height); 
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + linesDivision);
    ctx.lineTo(this.x + this.width, this.y + linesDivision);

    ctx.moveTo(this.x, this.y + (linesDivision * 2));
    ctx.lineTo(this.x + this.width, this.y + (linesDivision * 2));

    ctx.moveTo(this.x + linesDivision, this.y + linesDivision);
    ctx.lineTo(this.x + linesDivision, this.y + (linesDivision * 2));

    ctx.moveTo(this.x + (linesDivision * 2), this.y + (linesDivision * 2));
    ctx.lineTo(this.x + (linesDivision * 2), this.y + this.height);

    ctx.moveTo(this.x, this.y + 1);
    ctx.lineTo(this.x + this.width, this.y + 1);  

    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y + 1);
    ctx.lineTo(this.x + this.width, this.y + 1);  
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x + this.width - 1, this.y);
    ctx.lineTo(this.x + this.width - 1, this.y + linesDivision);  
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 6;
    ctx.beginPath();
    // ctx.moveTo(this.x, this.y + 2);
    // ctx.lineTo(this.x + 3, this.y + 2);
    // ctx.stroke();
    ctx.closePath();
  }

  updatePosition(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, this.start, this.end);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

  }

  update(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;    
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);    
  }

  updateImage(img, ctx) {
    // img.onload = () => {      
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
      this.frames += 1;
    // };
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  };  

  left() {
    return this.x;
  }
  right() {
    return (this.x) + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return (this.y) + this.height;
  }

  crashWith(obstacle) {
    return !(
      (this.bottom() - 5) < obstacle.top() ||
      (this.top() + 5) > obstacle.bottom() ||
      (this.right() - 5) < obstacle.left() ||
      (this.left() + 5) > obstacle.right()
    );
  }  

  move(keyCode, blocks, obstacles, bombs) {
    let x = this.x;
    let y = this.y;
    let bottom = 0;
    let top = 0;
    let right = 0;
    let left = 0;
    let update = true;

    switch (keyCode) {
      case (37):
        x -= this.speed;
        break;
      case (38):
        y -= this.speed;
        break;
      case (39):
        x += this.speed;
        break;
      case (40):
        y += this.speed;
        break;
      case (32):
        if (bombs.length < 4) {    
          bombs.push(new Component(50, 50, '', bombCordinates(x), bombCordinates(y)));
        }
        break;
      default:
    }
    bottom = y + 25;
    top = y - 25;
    left = x - 25;
    right = x + 25;
    for (let i = 0; i < blocks.length; i += 1) {
      if (((bottom > blocks[i].top() && bottom < blocks[i].bottom() || 
              top > blocks[i].top() && top < blocks[i].bottom()) ||
          (bottom === blocks[i].bottom() && top === blocks[i].top() )) &&

          ((right > blocks[i].left() && right < blocks[i].right() || 
          left > blocks[i].left() && left < blocks[i].right() ) ||
          (right === blocks[i].right() && left === blocks[i].left() ))) {
        update = false;
      }
    }
    if (update && this.enemie) {
      for (let i = 0; i < bombs.length; i += 1) {
        if (((bottom > bombs[i].top() && bottom < bombs[i].bottom() || 
                top > bombs[i].top() && top < bombs[i].bottom()) ||
            (bottom === bombs[i].bottom() && top === bombs[i].top() )) &&

            ((right > bombs[i].left() && right < bombs[i].right() || 
            left > bombs[i].left() && left < bombs[i].right() ) ||
            (right === bombs[i].right() && left === bombs[i].left() ))) {
          update = false;
        }
      }   
    }
    if (update) {
      for (let i = 0; i < obstacles.length; i += 1) {
        if (((bottom > obstacles[i].top() && bottom < obstacles[i].bottom() || 
                top > obstacles[i].top() && top < obstacles[i].bottom()) ||
            (bottom === obstacles[i].bottom() && top === obstacles[i].top() )) &&

            ((right > obstacles[i].left() && right < obstacles[i].right() || 
            left > obstacles[i].left() && left < obstacles[i].right() ) ||
            (right === obstacles[i].right() && left === obstacles[i].left() ))) {
          update = false;
        }
      }
    }
    if (update) {
      this.x = x;
      this.y = y;
    }
    return update;
  }  
}
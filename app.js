const canvas = document.getElementById("canvas");
const G_WIDTH = 500;
const Snake_Color = "white";
const UNIT = 20; // diện tích 1 ô
const ctx = canvas.getContext("2d");
const bg_Color = "black";
const LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWM = 40;
const GAME_DELAY = 100;

canvas.width = canvas.height = G_WIDTH;

ctx.fillStyle = bg_Color;
ctx.fillRect(0, 0, G_WIDTH, G_WIDTH);

// Tọa độ
class Vector2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let currentDirection = new Vector2d(-1, 0);

class Snake {
  constructor() {
    // tọa độ đầu Snake
    this.body = [
      new Vector2d(UNIT * 6, UNIT * 3),
      new Vector2d(UNIT * 7, UNIT * 3),
      new Vector2d(UNIT * 8, UNIT * 3),
    ];
    this.speed = new Vector2d(-1, 0);
    this.head = this.body[0];
  }
  // Mô tả Snake
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.body[0].x, this.body[0].y, UNIT, UNIT);
    ctx.fillStyle = Snake_Color;
    for (let i = 1; i < this.body.length; i++) {
      ctx.fillRect(this.body[i].x, this.body[i].y, UNIT, UNIT);
    }
  }
  clear() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.body[0].x, this.body[0].y, UNIT, UNIT);
    ctx.fillStyle = bg_Color;
    for (let i = 1; i < this.body.length; i++) {
      ctx.fillRect(this.body[i].x, this.body[i].y, UNIT, UNIT);
    }
  }
  handleBound() {
    if (this.head.x < 0) {
      this.head.x = G_WIDTH - UNIT;
    }
    if (this.head.x > G_WIDTH - UNIT) {
      this.head.x = 0;
    }
    if (this.head.y < 0) {
      this.head.y = G_WIDTH - UNIT;
    }
    if (this.head.y > G_WIDTH - UNIT) {
      this.head.y = 0;
    }
  }
  // hàm di chuyển
  move() {
    this.clear();
    for (let i = this.body.length - 1; i >= 1; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    this.body[0].x += this.speed.x * UNIT;
    this.body[0].y += this.speed.y * UNIT;
    this.handleBound();
    this.draw();
  }
  checkEat(food) {
    const head = this.body[0];
    return food.x === head.x && food.y === head.y;
  }
  grow() {
    this.draw();
    //tăng thêm 1 chiều dài cho rắn
    let snakeLength = this.body.length;
    let mountX = this.body[snakeLength - 1].x - this.body[snakeLength - 2].x;
    let mountY = this.body[snakeLength - 1].y - this.body[snakeLength - 2].y;

    let newPart = new Vector2d(
      this.body[snakeLength - 1].x + mountX,
      this.body[snakeLength - 1].y + mountY
    );
    this.body.push(newPart);
    this.clear();
  }
}
class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, UNIT, UNIT);
  }
  clear() {
    ctx.fillStyle = bg_Color;
    ctx.fillRect(this.x, this.y, UNIT, UNIT);
  }
  getRandom() {
    //40 80 != 23 44
    // 0 -game_size
    //random
    let randomNumber = Math.floor(Math.random() * G_WIDTH);
    randomNumber -= randomNumber % UNIT;
    return randomNumber;
  }
  spawn() {
    this.clear();
    this.x = this.getRandom();
    this.y = this.getRandom();
    this.draw();
  }
}
let player = new Snake();
player.draw();
let food = new Food();
food.spawn();
setInterval(() => {
  player.move();
  if ((player.checkEat(food))) {
    player.grow();
    food.spawn();
  }
}, GAME_DELAY);

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case LEFT:
      if (currentDirection.x === 1) break;
      player.speed = new Vector2d(-1, 0);
      currentDirection = new Vector2d(-1, 0);
      break;
    case RIGHT:
      if (currentDirection.x === -1) break;
      player.speed = new Vector2d(1, 0);
      currentDirection = new Vector2d(1, 0);
      break;
    case UP:
      if (currentDirection.y === 1) break;
      player.speed = new Vector2d(0, -1);
      currentDirection = new Vector2d(0, -1);
      break;
    case DOWM:
      if (currentDirection.y === -1) break;
      player.speed = new Vector2d(0, 1);
      currentDirection = new Vector2d(0, 1);
      break;
    default:
      break;
  }
};
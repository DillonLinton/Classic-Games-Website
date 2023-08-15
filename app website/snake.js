const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let velocityX = 0;
let velocityY = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("currentScore").textContent = score;
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } else {
    snake.pop();
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  ctx.strokeStyle = "black";
  ctx.strokeRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver = true;
      break;
    }
  }
}

function update() {
  if (gameOver) {
    // Game over logic
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").textContent = highScore;
    }

    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    document.getElementById("currentScore").textContent = score;
    gameOver = false;
  }

  clearCanvas();
  moveSnake();
  drawFood();
  drawSnake();
  checkCollision();
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const goingUp = velocityY === -1;
  const goingDown = velocityY === 1;
  const goingLeft = velocityX === -1;
  const goingRight = velocityX === 1;

  if (keyPressed === 37 && !goingRight) {
    velocityX = -1;
    velocityY = 0;
  }

  if (keyPressed === 38 && !goingDown) {
    velocityX = 0;
    velocityY = -1;
  }

  if (keyPressed === 39 && !goingLeft) {
    velocityX = 1;
    velocityY = 0;
  }

  if (keyPressed === 40 && !goingUp) {
    velocityX = 0;
    velocityY = 1;
  }
}

function startGame() {
  drawSnake();
  document.addEventListener("keydown", changeDirection);
  setInterval(update, 100);
}

function goToHome() {
  window.location.href = "index.html";
}

// Initialize the game and set initial scores
document.getElementById("highScore").textContent = highScore;
document.getElementById("currentScore").textContent = score;
startGame();

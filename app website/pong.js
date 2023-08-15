const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Define the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4,
    color: "WHITE",
    acceleration: 1.05
};

// Define the paddles
const userPaddle = {
    x: 0,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    color: "WHITE",
    dy: 4,
    score: 0
};

const computerPaddle = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    color: "WHITE",
    dy: 3.5,  // Increased speed for harder AI
    score: 0
};

let gameRunning = false;

// Draw functions
function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawScore() {
    ctx.fillStyle = "WHITE";
    ctx.font = "24px Arial";
    ctx.fillText(userPaddle.score, canvas.width / 4, 50);
    ctx.fillText(computerPaddle.score, 3 * canvas.width / 4, 50);
}

// Update the game's position
function update() {
    if (!gameRunning) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if ((ball.x - ball.radius < userPaddle.x + userPaddle.width && ball.y + ball.radius > userPaddle.y && ball.y - ball.radius < userPaddle.y + userPaddle.height) ||
        (ball.x + ball.radius > computerPaddle.x && ball.y + ball.radius > computerPaddle.y && ball.y - ball.radius < computerPaddle.y + computerPaddle.height)) {
        ball.dx = -ball.dx * ball.acceleration;  // Accelerate the ball after every hit
    }

    // Ball out of bounds
    if (ball.x + ball.radius > canvas.width) {
        // User wins a point
        userPaddle.score++;
        checkGameOver();
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        // Computer wins a point
        computerPaddle.score++;
        checkGameOver();
        resetBall();
    }

    // Move the computer paddle
    if (ball.dx > 0) {
        if (computerPaddle.y + (computerPaddle.height / 2) < ball.y) {
            computerPaddle.y += computerPaddle.dy;
        } else {
            computerPaddle.y -= computerPaddle.dy;
        }
    }

    render();
}

function checkGameOver() {
    if (userPaddle.score === 7 || computerPaddle.score === 7) {
        gameRunning = false;
        alert(userPaddle.score === 7 ? "You won!" : "Computer won!");
        document.location.reload();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx / ball.acceleration;
}

// Render the game
function render() {
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, computerPaddle.color);
    drawScore();
}

canvas.addEventListener("mousemove", (event) => {
    let rect = canvas.getBoundingClientRect();
    userPaddle.y = event.clientY - rect.top - userPaddle.height / 2;
});

document.getElementById("startButton").addEventListener("click", () => {
    gameRunning = true;
    update();
});

// Call the update function every 20ms
setInterval(update, 20);

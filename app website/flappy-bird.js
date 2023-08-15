let canvas = document.getElementById("flappyBirdCanvas");
let ctx = canvas.getContext("2d");

let bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    size: 20,
    dy: 2
};

let pipes = [];
let pipeSpacing = 150;
let pipeWidth = 50;
let pipeGap = 200;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

function update() {
    bird.y += bird.dy;
    
    if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
        resetGame();
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (bird.x + bird.size > pipe.x && bird.x - bird.size < pipe.x + pipeWidth) {
            if (bird.y - bird.size < pipe.top || bird.y + bird.size > pipe.top + pipeGap) {
                resetGame();
            }
        }
    });

    if (pipes[0] && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x === canvas.width / 2) {
        let pipeTop = Math.random() * (canvas.height - pipeGap);
        pipes.push({ x: canvas.width, top: pipeTop });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
    requestAnimationFrame(update);
}

function resetGame() {
    bird.y = canvas.height / 2;
    pipes = [];
}

canvas.addEventListener("click", () => {
    bird.dy = -5;
    setTimeout(() => { bird.dy = 2; }, 300);
});

update();
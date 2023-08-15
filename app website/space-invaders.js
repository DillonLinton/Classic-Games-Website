let canvas = document.getElementById("spaceInvadersCanvas");
let ctx = canvas.getContext("2d");

let spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    dx: 0,
    lives: 3
};

let bullets = [];
let alienBullets = [];
let aliens = [];
let alienRowCount = 5;
let alienColumnCount = 3;
let alienWidth = 40;
let alienHeight = 30;
let alienPadding = 50;
let alienOffsetTop = 50;
let alienOffsetLeft = 30;
let alienDx = 2;

let blocks = [
    { x: 50, y: canvas.height - 100, width: 70, height: 20, health: 3 },
    { x: 150, y: canvas.height - 100, width: 70, height: 20, health: 3 },
    { x: 250, y: canvas.height - 100, width: 70, height: 20, health: 3 },
    { x: 350, y: canvas.height - 100, width: 70, height: 20, health: 3 },
    { x: 450, y: canvas.height - 100, width: 70, height: 20, health: 3 }
];

for (let c = 0; c < alienColumnCount; c++) {
    aliens[c] = [];
    for (let r = 0; r < alienRowCount; r++) {
        aliens[c][r] = { x: 0, y: 0, status: 1 };
    }
}
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("click", shootBullet);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        spaceship.dx = 5;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        spaceship.dx = -5;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "Left" || e.key == "ArrowLeft") {
        spaceship.dx = 0;
    }
}

function shootBullet() {
    bullets.push({ x: spaceship.x + spaceship.width / 2, y: spaceship.y, dy: -5 });
}

let playerSprite = new Image();
playerSprite.src = "/mnt/data/player_sprite.png";

function drawSpaceship() {
    ctx.drawImage(playerSprite, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawAliens() {
    for (let c = 0; c < alienColumnCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            if (aliens[c][r].status == 1) {
                let alienX = (r * (alienWidth + alienPadding)) + alienOffsetLeft;
                let alienY = (c * (alienHeight + alienPadding)) + alienOffsetTop;
                aliens[c][r].x = alienX;
                aliens[c][r].y = alienY;
                let enemySprite = new Image();
                enemySprite.src = "/mnt/data/enemy_sprite.png";
                ctx.drawImage(enemySprite, alienX, alienY, alienWidth, alienHeight);
            }
        }
    }
}
function drawBullets() {
    let projectileSprite = new Image();
    projectileSprite.src = "/mnt/data/projectile_sprite.png";
    bullets.forEach(bullet => {
        ctx.drawImage(projectileSprite, bullet.x, bullet.y, 5, 15);
    });
}

function drawBlocks() {
    blocks.forEach(block => {
        if (block.health > 0) {
            ctx.fillStyle = block.health == 3 ? "#0F0" : block.health == 2 ? "#FF0" : "#F00";
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    });
}

function update() {
    spaceship.x += spaceship.dx;

    if (spaceship.x < 0) {
        spaceship.x = 0;
    } else if (spaceship.x + spaceship.width > canvas.width) {
        spaceship.x = canvas.width - spaceship.width;
    }

    bullets.forEach(bullet => {
        bullet.y += bullet.dy;
    });

    bullets = bullets.filter(bullet => bullet.y > 0);

    alienBullets.forEach(bullet => {
        bullet.y -= bullet.dy;
    });

    alienBullets = alienBullets.filter(bullet => bullet.y < canvas.height);

    for (let c = 0; c < alienColumnCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            let alien = aliens[c][r];
            if (alien.status == 1) {
                alien.x += alienDx;
                if (alien.x < 0 || alien.x + alienWidth > canvas.width) {
                    alienDx = -alienDx;
                    for (let c = 0; c < alienColumnCount; c++) {
                        for (let r = 0; r < alienRowCount; r++) {
                            aliens[c][r].y += alienHeight;
                            if (aliens[c][r].y + alienHeight > spaceship.y) {
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }
    }
    bullets.forEach(bullet => {
        blocks.forEach(block => {
            if (block.health > 0 && bullet.x > block.x && bullet.x < block.x + block.width && bullet.y > block.y && bullet.y < block.y + block.height) {
                bullet.dy *= -1;
                block.health -= 1;
            }
        });
    });

    bullets.forEach(bullet => {
        for (let c = 0; c < alienColumnCount; c++) {
            for (let r = 0; r < alienRowCount; r++) {
                let alien = aliens[c][r];
                if (alien.status == 1 && bullet.x > alien.x && bullet.x < alien.x + alienWidth && bullet.y > alien.y && bullet.y < alien.y + alienHeight) {
                    bullet.dy *= -1;
                    alien.status = 0;
                    alienBullets.push({ x: alien.x + alien.width / 2, y: alien.y + alien.height, dy: 5 });
                }
            }
        }
    });

    alienBullets.forEach(bullet => {
        if (bullet.x > spaceship.x && bullet.x < spaceship.x + spaceship.width && bullet.y > spaceship.y && bullet.y < spaceship.y + spaceship.height) {
            spaceship.lives -= 1;
            if (spaceship.lives <= 0) {
                document.getElementById("gameOverScreen").style.display = "block";
            }
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawAliens();
    drawBullets();
    drawBlocks();
    requestAnimationFrame(update);
}

update();
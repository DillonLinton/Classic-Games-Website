const canvas = document.getElementById("asteroidsCanvas");
const ctx = canvas.getContext("2d");

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 0,
    dy: 0,
    rotation: 0,
    thrust: 0.05,
    thrusting: false,
    rotateSpeed: 0.1,
    radius: 15,
    bullets: [],
    bulletSpeed: 5,
    lives: 3,
    invulnerable: false,
    invulnerabilityTime: 0,
    blinkRate: 10,
    blinkCount: 0
};

let asteroids = [];
const ASTEROID_COUNT = 5;
const ASTEROID_SPEED = 1;
const MIN_ASTEROIDS = 3;
const INVULNERABILITY_DURATION = 120;
let score = 0;

function createAsteroid(x, y, size) {
    return {
        x: x || (Math.random() < 0.5 ? 0 : canvas.width),
        y: y || (Math.random() < 0.5 ? 0 : canvas.height),
        dx: ASTEROID_SPEED * (Math.random() - 0.5),
        dy: ASTEROID_SPEED * (Math.random() - 0.5),
        size: size || 3,
        radius: size ? size * 10 : 30
    };
}

for (let i = 0; i < ASTEROID_COUNT; i++) {
    asteroids.push(createAsteroid());
}

function spawnNewAsteroids() {
    let largeAsteroidsCount = asteroids.filter(a => a.size === 3).length;
    while (largeAsteroidsCount < MIN_ASTEROIDS) {
        asteroids.push(createAsteroid());
        largeAsteroidsCount++;
    }
}

function drawHexagon(x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos((Math.PI / 3) * i), y + size * Math.sin((Math.PI / 3) * i));
    }
    ctx.closePath();
    ctx.fillStyle = "#6E6E6E";  // Greyish moon color
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function respawnShip() {
    ship.x = canvas.width / 2;
    ship.y = canvas.height / 2;
    ship.dx = 0;
    ship.dy = 0;
    ship.invulnerable = true;
    ship.invulnerabilityTime = INVULNERABILITY_DURATION;
}

function restartGame() {
    ship.lives = 3;
    ship.x = canvas.width / 2;
    ship.y = canvas.height / 2;
    ship.dx = 0;
    ship.dy = 0;
    asteroids = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
        asteroids.push(createAsteroid());
    }
    score = 0;
    document.getElementById("gameOverScreen").style.display = "none";
}

function goHome() {
    window.location.href = "index.html";  // This will redirect to the homepage you provided
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ship.invulnerable && ship.invulnerabilityTime > 0) {
        ship.blinkCount++;
        if (ship.blinkCount > ship.blinkRate) {
            ship.blinkCount = 0;
        }
        ship.invulnerabilityTime--;
    } else {
        ship.invulnerable = false;
    }

    // Draw & update ship only if not blinking during invulnerability
    if (!ship.invulnerable || (ship.blinkCount < ship.blinkRate / 2)) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.rotation);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -15);
        ctx.lineTo(15, 0);
        ctx.lineTo(-10, 15);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    if (ship.thrusting) {
        ship.dx += ship.thrust * Math.cos(ship.rotation);
        ship.dy += ship.thrust * Math.sin(ship.rotation);
    }

    ship.x += ship.dx;
    ship.y += ship.dy;

    // Wrap ship around screen
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;

    // Draw & update bullets
    for (let i = ship.bullets.length - 1; i >= 0; i--) {
        const bullet = ship.bullets[i];
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            ship.bullets.splice(i, 1);
        }
    }

    // Draw & update asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        drawHexagon(asteroid.x, asteroid.y, asteroid.radius);

        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;

        // Check collision with bullets
        for (let j = ship.bullets.length - 1; j >= 0; j--) {
            const bullet = ship.bullets[j];
            const dist = Math.sqrt((bullet.x - asteroid.x) ** 2 + (bullet.y - asteroid.y) ** 2);
            if (dist < asteroid.radius) {
                if (asteroid.size === 3) {
                    asteroids.push(createAsteroid(asteroid.x, asteroid.y, 2));
                    asteroids.push(createAsteroid(asteroid.x, asteroid.y, 2));
                    score += 20;
                } else if (asteroid.size === 2) {
                    asteroids.push(createAsteroid(asteroid.x, asteroid.y, 1));
                    asteroids.push(createAsteroid(asteroid.x, asteroid.y, 1));
                    asteroids.push(createAsteroid(asteroid.x, asteroid.y, 1));
                    score += 50;
                } else {
                    score += 100;
                }

                asteroids.splice(i, 1);
                ship.bullets.splice(j, 1);
                break;
            }
        }

        // Check collision with ship
        const dist = Math.sqrt((ship.x - asteroid.x) ** 2 + (ship.y - asteroid.y) ** 2);
        if (!ship.invulnerable && dist < asteroid.radius + ship.radius) {
            ship.lives--;
            if (ship.lives <= 0) {
                document.getElementById("gameOverScreen").style.display = "block";
            } else {
                respawnShip();
            }
        }
    }

    // Draw score and lives
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Lives: " + ship.lives, canvas.width - 90, 20);

    // Check after updating everything, if we need to spawn new asteroids
    spawnNewAsteroids();

    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", function (e) {
    const dx = e.clientX - canvas.offsetLeft - ship.x;
    const dy = e.clientY - canvas.offsetTop - ship.y;
    ship.rotation = Math.atan2(dy, dx);
});

canvas.addEventListener("click", function () {
    ship.bullets.push({
        x: ship.x + ship.bulletSpeed * Math.cos(ship.rotation),
        y: ship.y + ship.bulletSpeed * Math.sin(ship.rotation),
        dx: 5 * Math.cos(ship.rotation),
        dy: 5 * Math.sin(ship.rotation)
    });
});

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        ship.thrusting = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code === "Space") {
        ship.thrusting = false;
    }
});

update();
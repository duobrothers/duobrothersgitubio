const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

let bullets = [];
let aliens = [];
let alienSpeed = 1;
let alienFrequency = 100;
let alienCounter = 0;

function drawSpaceship() {
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function moveSpaceship() {
    spaceship.x += spaceship.dx;
    spaceship.y += spaceship.dy;

    // Prevent spaceship from moving out of canvas
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.x + spaceship.width > canvas.width) spaceship.x = canvas.width - spaceship.width;
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Remove bullet if it goes off-screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function createAlien() {
    aliens.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: alienSpeed
    });
}

function drawAliens() {
    aliens.forEach((alien, index) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        alien.y += alien.speed;

        // Remove alien if it goes off-screen
        if (alien.y > canvas.height) {
            aliens.splice(index, 1);
        }
    });
}

function shoot() {
    bullets.push({
        x: spaceship.x + spaceship.width / 2 - 2.5,
        y: spaceship.y,
        width: 5,
        height: 10,
        speed: 7
    });
}

function checkCollision() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach((alien, aIndex) => {
            if (
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.height + bullet.y > alien.y
            ) {
                // Remove alien and bullet on collision
                aliens.splice(aIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpaceship();
    moveSpaceship();
    drawBullets();
    drawAliens();
    checkCollision();

    if (alienCounter % alienFrequency === 0) {
        createAlien();
    }
    alienCounter++;

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        spaceship.dx = spaceship.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        spaceship.dx = -spaceship.speed;
    } else if (e.key === ' ') {
        shoot();
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'd' ||
        e.key === 'a'
    ) {
        spaceship.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();

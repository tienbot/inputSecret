const fireAnimation = document.getElementById('fireAnimation');
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

const ANIMATION_DURATION = 4000;
const FADE_OUT_START = 3500; 

let animationId = null;
let animationStartTime = null;
let isReversePhase = false;
let isFadeOutPhase = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 5;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fireWidth = Math.ceil(canvas.width / 10);
const fireHeight = Math.ceil(canvas.height / 4); 
let firePixels = [];
let fireColors = [
    {r: 7, g: 7, b: 7, a: 0},
    {r: 31, g: 7, b: 7, a: 0.2},
    {r: 47, g: 15, b: 7, a: 0.4},
    {r: 71, g: 15, b: 7, a: 0.6},
    {r: 87, g: 23, b: 7, a: 0.8},
    {r: 103, g: 31, b: 7, a: 1},
    {r: 119, g: 31, b: 7, a: 1},
    {r: 143, g: 39, b: 7, a: 1},
    {r: 159, g: 47, b: 7, a: 1},
    {r: 175, g: 63, b: 7, a: 1},
    {r: 191, g: 71, b: 7, a: 1},
    {r: 199, g: 71, b: 7, a: 1},
    {r: 223, g: 79, b: 7, a: 1},
    {r: 223, g: 87, b: 7, a: 1},
    {r: 223, g: 87, b: 7, a: 1},
    {r: 255, g: 95, b: 7, a: 1}
];

function initFire() {
    firePixels = [];
    for (let y = 0; y < fireHeight; y++) {
        firePixels[y] = [];
        for (let x = 0; x < fireWidth; x++) {
            firePixels[y][x] = (y === fireHeight - 1) ? fireColors.length - 1 : 0;
        }
    }
}

initFire();

function spreadFire() {
    for (let y = 0; y < fireHeight - 1; y++) {
        for (let x = 0; x < fireWidth; x++) {
            const rand = Math.floor(Math.random() * 3);
            const dstX = Math.min(Math.max(x - rand + 1, 0), fireWidth - 1);
            let decay = (rand & 1);
            if (y < fireHeight / 3) {
                decay += Math.floor(Math.random() * 2);
            }
            firePixels[y][dstX] = Math.max(firePixels[y + 1][x] - decay, 0);
        }
    }
}

function spreadFireReverse() {
    for (let y = fireHeight - 1; y > 0; y--) {
        for (let x = 0; x < fireWidth; x++) {
            const rand = Math.floor(Math.random() * 4);
            const dstX = Math.min(Math.max(x - rand + 1, 0), fireWidth - 1);
            let decay = Math.floor(Math.random() * 3) + 1;
            if (y > fireHeight / 2) {
                decay += Math.floor(Math.random() * 3);
            }
            firePixels[y][dstX] = Math.max(firePixels[y - 1][x] - decay, 0);
        }
    }
    for (let y = fireHeight - 1; y > fireHeight - 3; y--) {
        for (let x = 0; x < fireWidth; x++) {
            firePixels[y][x] = Math.max(firePixels[y][x] - 2, 0);
        }
    }
}

function fadeOutFire() {
    for (let y = 0; y < fireHeight; y++) {
        for (let x = 0; x < fireWidth; x++) {
            firePixels[y][x] = Math.max(firePixels[y][x] - 3, 0);
        }
    }
}

function renderFire() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pixelWidth = canvas.width / fireWidth;
    const pixelHeight = canvas.height / fireHeight;
    for (let y = 0; y < fireHeight; y++) {
        for (let x = 0; x < fireWidth; x++) {
            const colorIndex = firePixels[y][x];
            const color = fireColors[colorIndex];
            let alpha = color.a;
            if (y < fireHeight / 4) {
                alpha = color.a * (y / (fireHeight / 4));
            }
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
        }
    }
}

function animateFire(timestamp) {
    if (!animationStartTime) {
        animationStartTime = timestamp;
    }
    
    const elapsed = timestamp - animationStartTime;
    const halfDuration = ANIMATION_DURATION / 2;
    
    if (elapsed < halfDuration && !isReversePhase) {
        spreadFire();
    } 
    else if (elapsed >= halfDuration && elapsed < FADE_OUT_START) {
        if (!isReversePhase) {
            isReversePhase = true;
        }
        spreadFireReverse();
    }
    else if (elapsed >= FADE_OUT_START && elapsed < ANIMATION_DURATION) {
        if (!isFadeOutPhase) {
            isFadeOutPhase = true;
            fireAnimation.classList.remove('active');
        }
        fadeOutFire();
    }
    else if (elapsed >= ANIMATION_DURATION) {
        cancelAnimationFrame(animationId);
        animationId = null;
        animationStartTime = null;
        isReversePhase = false;
        isFadeOutPhase = false;
        return;
    }
    
    renderFire();
    animationId = requestAnimationFrame(animateFire);
}

// Основная функция для вызова анимации огня
function hellFire() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    animationStartTime = null;
    isReversePhase = false;
    isFadeOutPhase = false;
    
    initFire();
    fireAnimation.classList.add('active');
    animationId = requestAnimationFrame(animateFire);
}

// Делаем функцию доступной глобально
window.hellFire = hellFire;
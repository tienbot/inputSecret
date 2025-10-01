// Конфигурация конфетти
const CONFETTI_CONFIG = {
    particleCount: 300,
    spread: 300,
    startVelocity: 30,
    decay: 0.9,
    gravity: 0.5,
    drift: 0,
    ticks: 200,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff66cc'],
    shapes: ['circle', 'square'],
    scalar: 1
};

class ConfettiEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const shape = CONFETTI_CONFIG.shapes[Math.floor(Math.random() * CONFETTI_CONFIG.shapes.length)];
        const color = CONFETTI_CONFIG.colors[Math.floor(Math.random() * CONFETTI_CONFIG.colors.length)];
        
        return {
            x,
            y,
            velocityX: (Math.random() - 0.5) * CONFETTI_CONFIG.startVelocity,
            velocityY: (Math.random() * -CONFETTI_CONFIG.startVelocity) - 5,
            gravity: CONFETTI_CONFIG.gravity,
            decay: CONFETTI_CONFIG.decay,
            color,
            shape,
            size: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: CONFETTI_CONFIG.ticks
        };
    }

    launch(x, y) {
        for (let i = 0; i < CONFETTI_CONFIG.particleCount; i++) {
            const particleX = x + (Math.random() - 0.5) * CONFETTI_CONFIG.spread;
            const particleY = y + (Math.random() - 0.5) * CONFETTI_CONFIG.spread;
            this.particles.push(this.createParticle(particleX, particleY));
        }
        
        if (!this.isRunning) {
            this.animate();
        }
    }

    // Множественный запуск конфетти
    makeSomeMagic() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.launch(x, y);
            }, i * 300);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.velocityY += p.gravity;
            p.velocityX *= p.decay;
            p.velocityY *= p.decay;
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;
            p.life--;
            if (p.life <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = Math.min(1, p.life / 50);
            if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }
            this.ctx.restore();
        });
    }

    animate() {
        this.isRunning = true;
        const loop = () => {
            this.updateParticles();
            this.drawParticles();
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(loop);
            } else {
                this.isRunning = false;
                this.animationId = null;
            }
        };
        loop();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('confettiCanvas');
    const confetti = new ConfettiEffect(canvas);

    // Глобальная функция для консоли
    window.makeSomeMagic = () => confetti.makeSomeMagic();
});

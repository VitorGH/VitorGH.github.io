// ============================================================
// Particle Network — Canvas interativo com partículas
// Demonstra: Canvas API, OOP, requestAnimationFrame, eventos
// ============================================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = this.getParticleCount();
        this.connectionDistance = 120;
        this.animationId = null;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    getParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.min(Math.floor(area / 8000), 120);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particleCount = this.getParticleCount();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const opacity = 1 - dist / this.connectionDistance;
                    this.ctx.strokeStyle = `rgba(0, 180, 216, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const particle of this.particles) {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        }

        this.drawConnections();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseSpeedX = (Math.random() - 0.5) * 0.8;
        this.baseSpeedY = (Math.random() - 0.5) * 0.8;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
    }

    update(mouse) {
        // Interação com o mouse — partículas se afastam suavemente
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.speedX += Math.cos(angle) * force * 0.6;
                this.speedY += Math.sin(angle) * force * 0.6;
            }
        }

        // Desaceleração gradual de volta à velocidade base (easing)
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around nas bordas
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 180, 216, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================================
// Typewriter Effect — Efeito de digitação no headline
// Demonstra: async/await, Promises, manipulação de DOM, closures
// ============================================================
class TypeWriter {
    constructor(element, phrases, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
        this.element = element;
        this.phrases = phrases;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.currentIndex = 0;
        this.isRunning = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async type(text) {
        for (let i = 0; i <= text.length; i++) {
            this.element.textContent = text.slice(0, i);
            await this.sleep(this.typingSpeed + Math.random() * 40);
        }
    }

    async delete(text) {
        for (let i = text.length; i >= 0; i--) {
            this.element.textContent = text.slice(0, i);
            await this.sleep(this.deletingSpeed);
        }
    }

    async start() {
        this.isRunning = true;
        while (this.isRunning) {
            const phrase = this.phrases[this.currentIndex];
            await this.type(phrase);
            await this.sleep(this.pauseDuration);
            await this.delete(phrase);
            await this.sleep(300);
            this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
        }
    }
}

// ============================================================
// Saudação dinâmica baseada na hora do dia
// Demonstra: Date API, lógica condicional, template literals
// ============================================================
function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return { text: 'Bom dia', icon: '☀️' };
    if (hour >= 12 && hour < 18) return { text: 'Boa tarde', icon: '🌤️' };
    return { text: 'Boa noite', icon: '🌙' };
}

function applyGreeting() {
    const greetingEl = document.querySelector('.greeting');
    if (!greetingEl) return;

    const { text, icon } = getGreeting();
    greetingEl.textContent = `${icon} ${text}! Seja bem-vindo(a).`;
}

// ============================================================
// Scroll Reveal — Intersection Observer API
// Demonstra: Intersection Observer, dataset, forEach
// ============================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, Number(delay));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
}

// ============================================================
// Tilt Effect — Efeito 3D no card ao mover o mouse
// Demonstra: getBoundingClientRect, transforms 3D, eventos
// ============================================================
function initTiltEffect() {
    const card = document.querySelector('.card');
    if (!card) return;

    // Respeita preferência de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease-out';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
    });
}

// ============================================================
// Inicialização — DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Canvas de partículas interativas
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        new ParticleNetwork(canvas);
    }

    // Saudação dinâmica
    applyGreeting();

    // Efeito de digitação no headline
    const headlineEl = document.querySelector('.headline');
    if (headlineEl) {
        const typewriter = new TypeWriter(headlineEl, [
            'Desenvolvedor de Software',
            'Apaixonado por Tecnologia',
            'Sempre Aprendendo',
        ]);
        typewriter.start();
    }

    // Scroll reveal nos links
    initScrollReveal();

    // Efeito 3D no card
    initTiltEffect();
});

/* ===========================
   SHANMUKHI PORTFOLIO - JS
=========================== */

// ===========================
// CURSOR
// ===========================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .glass-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        cursorFollower.style.transform = 'translate(-50%,-50%) scale(0.5)';
        cursorFollower.style.borderColor = 'rgba(168,85,247,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorFollower.style.borderColor = 'rgba(168,85,247,0.5)';
    });
});

// ===========================
// PARTICLE CANVAS BACKGROUND
// ===========================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        const colors = ['168,85,247', '6,182,212', '249,115,22', '236,72,153', '34,197,94'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Connect nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(168,85,247,${0.06 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===========================
// 3D GLASS SCULPTURE CANVAS
// ===========================
const sc = document.getElementById('sculptureCanvas');
const sctx = sc.getContext('2d');
let scrollY = 0;
let scRotX = 0, scRotY = 0;
let scMouseX = 0, scMouseY = 0;
let scW = 0, scH = 0;
let time = 0;

function resizeSculpture() {
    const hero3d = document.getElementById('hero3d');
    if (!hero3d) return;
    scW = hero3d.offsetWidth;
    scH = hero3d.offsetHeight;
    sc.width = scW;
    sc.height = scH;
}
resizeSculpture();
window.addEventListener('resize', resizeSculpture);

document.addEventListener('mousemove', (e) => {
    const rect = sc.getBoundingClientRect();
    scMouseX = ((e.clientX - rect.left) / scW - 0.5) * 2;
    scMouseY = ((e.clientY - rect.top) / scH - 0.5) * 2;
});

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// 3D to 2D projection helpers
function project(x, y, z, cx, cy, fov) {
    const scale = fov / (fov + z);
    return { x: cx + x * scale, y: cy + y * scale, scale };
}

function rotatePoint(x, y, z, rx, ry) {
    // Rotate around Y
    let nx = x * Math.cos(ry) - z * Math.sin(ry);
    let nz = x * Math.sin(ry) + z * Math.cos(ry);
    // Rotate around X
    let ny = y * Math.cos(rx) - nz * Math.sin(rx);
    let nnz = y * Math.sin(rx) + nz * Math.cos(rx);
    return { x: nx, y: ny, z: nnz };
}

function drawGlassSphere(cx, cy, radius, rx, ry, color1, color2, alpha) {
    // Draw multiple glass rings
    const segments = 16;
    for (let i = 0; i < segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        const x = Math.cos(t) * radius;
        const z = Math.sin(t) * radius;
        const r = rotatePoint(x, 0, z, rx, ry);
        const p = project(r.x, r.y, r.z + 300, cx, cy, 400);
        const r2 = rotatePoint(x, 0, z, rx + 0.5, ry);
        const p2 = project(r2.x, r2.y, r2.z + 300, cx, cy, 400);
        sctx.beginPath();
        sctx.moveTo(p.x, p.y);
        sctx.lineTo(p2.x, p2.y);
        sctx.strokeStyle = color1;
        sctx.lineWidth = 1;
        sctx.stroke();
    }
}

function drawOctahedron(cx, cy, size, rx, ry, color, alpha) {
    const verts = [
        [0, -size, 0],
        [size, 0, 0],
        [0, 0, size],
        [-size, 0, 0],
        [0, 0, -size],
        [0, size, 0],
    ];
    const faces = [
        [0,1,2],[0,2,3],[0,3,4],[0,4,1],
        [5,2,1],[5,3,2],[5,4,3],[5,1,4]
    ];
    const projected = verts.map(v => {
        const r = rotatePoint(v[0], v[1], v[2], rx, ry);
        return project(r.x, r.y, r.z + 300, cx, cy, 400);
    });
    const faceDepths = faces.map((face, i) => {
        const avgZ = face.reduce((s, vi) => s + projected[vi].x, 0) / 3;
        return { i, avgZ, face };
    });
    faceDepths.sort((a, b) => b.avgZ - a.avgZ);

    faceDepths.forEach(({ face }) => {
        const pts = face.map(vi => projected[vi]);
        sctx.beginPath();
        sctx.moveTo(pts[0].x, pts[0].y);
        pts.forEach(p => sctx.lineTo(p.x, p.y));
        sctx.closePath();

        const grad = sctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
        grad.addColorStop(0, color.replace('A', String(alpha * 0.15)));
        grad.addColorStop(1, color.replace('A', String(alpha * 0.05)));
        sctx.fillStyle = grad;
        sctx.fill();
        sctx.strokeStyle = color.replace('A', String(alpha * 0.5));
        sctx.lineWidth = 1;
        sctx.stroke();
    });
}

function drawTorus(cx, cy, R, r, rx, ry, color, segments) {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
        const u = (i / segments) * Math.PI * 2;
        for (let j = 0; j <= segments / 2; j++) {
            const v = (j / (segments / 2)) * Math.PI * 2;
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = r * Math.sin(v);
            const z = (R + r * Math.cos(v)) * Math.sin(u);
            const rot = rotatePoint(x, y, z, rx, ry);
            pts.push(project(rot.x, rot.y, rot.z + 300, cx, cy, 400));
        }
    }
    // Draw lines
    sctx.strokeStyle = color;
    sctx.lineWidth = 0.8;
    for (let i = 0; i < segments; i++) {
        const half = segments / 2 + 1;
        sctx.beginPath();
        for (let j = 0; j <= segments / 2; j++) {
            const idx = i * half + j;
            if (idx < pts.length) {
                j === 0 ? sctx.moveTo(pts[idx].x, pts[idx].y) : sctx.lineTo(pts[idx].x, pts[idx].y);
            }
        }
        sctx.stroke();
    }
}

function animateSculpture() {
    time += 0.012;
    sctx.clearRect(0, 0, scW, scH);

    const cx = scW / 2;
    const cy = scH / 2;
    const scrollInfluence = (scrollY / window.innerHeight) * 1.5;
    const targetRX = scMouseY * 0.6 + Math.sin(time * 0.5) * 0.4 + scrollInfluence * 0.5;
    const targetRY = scMouseX * 0.6 + time * 0.3;

    scRotX += (targetRX - scRotX) * 0.05;
    scRotY += (targetRY - scRotY) * 0.05;

    const pulse = Math.sin(time * 1.5) * 0.1 + 1;

    // Outer torus ring
    drawTorus(cx, cy, 140 * pulse, 20, scRotX, scRotY, 'rgba(168,85,247,0.25)', 32);

    // Second torus at different angle
    drawTorus(cx, cy, 100, 14, scRotX + 1.0, scRotY + 0.8, 'rgba(6,182,212,0.3)', 24);

    // Third torus
    drawTorus(cx, cy, 75, 10, scRotX + 0.5, scRotY - 1.2, 'rgba(249,115,22,0.2)', 20);

    // Main octahedron
    drawOctahedron(cx, cy, 70 * pulse, scRotX, scRotY, 'rgba(168,85,247,A)', 0.9);

    // Inner octahedron (rotated)
    drawOctahedron(cx, cy, 45, scRotX + Math.PI / 4, scRotY + Math.PI / 4, 'rgba(6,182,212,A)', 0.7);

    // Glowing center sphere effect
    const grd = sctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
    grd.addColorStop(0, 'rgba(168,85,247,0.4)');
    grd.addColorStop(0.5, 'rgba(6,182,212,0.15)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.beginPath();
    sctx.arc(cx, cy, 45, 0, Math.PI * 2);
    sctx.fillStyle = grd;
    sctx.fill();

    // Orbiting dots
    for (let i = 0; i < 8; i++) {
        const angle = time * 1.5 + (i / 8) * Math.PI * 2;
        const orbitR = 120 + Math.sin(time + i) * 20;
        const ox = Math.cos(angle) * orbitR;
        const oz = Math.sin(angle) * orbitR;
        const oy = Math.sin(time * 0.8 + i) * 30;
        const r = rotatePoint(ox, oy, oz, scRotX, scRotY);
        const p = project(r.x, r.y, r.z + 300, cx, cy, 400);
        const dotSize = p.scale * 4;
        const opacity = (p.scale + 0.3) * 0.8;
        const colors = ['168,85,247', '6,182,212', '249,115,22', '236,72,153', '34,197,94', '168,85,247', '6,182,212', '249,115,22'];
        sctx.beginPath();
        sctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        sctx.fillStyle = `rgba(${colors[i]},${opacity})`;
        sctx.fill();

        // Dot glow
        const dGrd = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dotSize * 3);
        dGrd.addColorStop(0, `rgba(${colors[i]},0.3)`);
        dGrd.addColorStop(1, `rgba(${colors[i]},0)`);
        sctx.beginPath();
        sctx.arc(p.x, p.y, dotSize * 3, 0, Math.PI * 2);
        sctx.fillStyle = dGrd;
        sctx.fill();
    }

    requestAnimationFrame(animateSculpture);
}
animateSculpture();

// ===========================
// TYPEWRITER EFFECT
// ===========================
const phrases = [
    'Data Science Student',
    'Cloud Enthusiast',
    'AI/ML Explorer',
    'Creative Designer',
    'AWS Builder Lead',
    'Problem Solver'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWrite() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
        typeEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            isDeleting = true;
            setTimeout(typeWrite, 1800);
            return;
        }
    } else {
        typeEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }
    setTimeout(typeWrite, isDeleting ? 60 : 90);
}
typeWrite();

// ===========================
// NAVIGATION
// ===========================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Navbar scroll
    if (y > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Back to top
    if (y > 400) backToTop.classList.add('show');
    else backToTop.classList.remove('show');

    // Active nav link
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (y >= top && y < bottom) {
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Hamburger / Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for all anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            const offset = target.offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ===========================
// SCROLL REVEAL
// ===========================
function addReveal() {
    const revealEls = [
        '.skill-category', '.achievement-card', '.project-card',
        '.blog-card', '.connect-card', '.timeline-card',
        '.about-grid', '.community-banner', '.contact-form-wrap',
        '.tech-stack', '.blog-cta', '.hero-badge'
    ];
    revealEls.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.classList.add('reveal');
        });
    });
}
addReveal();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, entry.target.dataset.delay || 0);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Stagger delays for grid children
document.querySelectorAll('.skills-grid, .achievements-grid, .projects-grid, .blog-grid, .connect-cards').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 100}ms`;
    });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===========================
// SKILL BAR ANIMATION
// ===========================
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                const w = bar.dataset.width;
                bar.style.width = w + '%';
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

// ===========================
// COUNTER ANIMATION
// ===========================
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                const target = parseInt(el.dataset.target);
                let count = 0;
                const increment = target / 50;
                const interval = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        el.textContent = target;
                        clearInterval(interval);
                    } else {
                        el.textContent = Math.floor(count);
                    }
                }, 30);
            });
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ===========================
// 3D TILT EFFECT ON CARDS
// ===========================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -12;
        const rotY = ((x - cx) / cx) * 12;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease';

        // Dynamic shine
        const shine = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06) 0%, transparent 60%)`;
        card.style.backgroundImage = shine;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.4s ease';
        card.style.backgroundImage = '';
    });
});

// ===========================
// ABOUT CARD 3D MOUSE PARALLAX
// ===========================
const aboutCard = document.getElementById('aboutCard');
if (aboutCard) {
    const aboutSection = document.getElementById('about');
    aboutSection.addEventListener('mousemove', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        aboutCard.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });
    aboutSection.addEventListener('mouseleave', () => {
        aboutCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ===========================
// CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ===========================
// HOLOGRAPHIC GRADIENT MOUSE EFFECT
// ===========================
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
});

// ===========================
// SECTION BACKGROUND GLOW
// ===========================
const glowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.background = '';
        }
    });
}, { threshold: 0.1 });

// ===========================
// PAGE LOAD ANIMATION
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ===========================
// CHIP HOVER INTERACTIVE
// ===========================
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('mouseenter', () => {
        chip.style.borderColor = 'rgba(168,85,247,0.5)';
        chip.style.color = 'var(--text-primary)';
        chip.style.background = 'rgba(168,85,247,0.1)';
        chip.style.transform += ' scale(1.1)';
    });
    chip.addEventListener('mouseleave', () => {
        chip.style.borderColor = '';
        chip.style.color = '';
        chip.style.background = '';
    });
});

// ===========================
// NAV LINK GLOW ON HOVER
// ===========================
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.textShadow = '0 0 20px rgba(168,85,247,0.5)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.textShadow = '';
    });
});

// ===========================
// PILL RIPPLE EFFECT
// ===========================
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.6s linear;
            background: rgba(168,85,247,0.3);
            width: 100px; height: 100px;
            left: ${e.offsetX - 50}px;
            top: ${e.offsetY - 50}px;
            pointer-events: none;
        `;
        pill.style.position = 'relative';
        pill.style.overflow = 'hidden';
        pill.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===========================
// ACHIEVEMENT CARD PARTICLES
// ===========================
document.querySelectorAll('.achievement-card.featured').forEach(card => {
    card.addEventListener('mouseenter', () => {
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.style.cssText = `
                position: absolute;
                width: 4px; height: 4px;
                background: rgba(168,85,247,0.8);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                animation: sparkle 1s ease forwards;
                z-index: 10;
            `;
            card.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
    });
});

// Sparkle keyframes
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-40px) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(sparkleStyle);

console.log('%c✨ Shanmukhi Portfolio', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cData Science | AI | Cloud | Design', 'color: #06b6d4; font-size: 14px;');

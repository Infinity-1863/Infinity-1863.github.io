// Particles Animation
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${240 + Math.random() * 60}, 70%, 60%)`
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Friction
            particle.vx *= 0.999;
            particle.vy *= 0.999;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.particles.forEach((particle, i) => {
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.2;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color.replace('60%)', `60%, ${particle.opacity})`);
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color.replace('60%)', `60%, ${particle.opacity * 0.3})`));
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    new ParticleSystem();
    
    // Mark body as loaded for animations
    document.body.classList.add('loaded');
    
    // Navbar scroll effect with performance optimization
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            showNotification('Message sent! We will contact you soon.', 'success');
            contactForm.reset();
        });
    }
    
    // Enhanced Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to improve performance
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for reveal animation
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Initialize magnetic button effects
    initMagneticButtons();
    
    // Initialize tilt effects for cards
    initTiltCards();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Enhanced typewriter effect
    initTypewriterEffect();
    
    // Initialize parallax effects
    initParallaxEffects();
});

// Magnetic button interaction
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Tilt effect for cards
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Enhanced typewriter effect
function initTypewriterEffect() {
    const subtitle = document.querySelector('.typewriter');
    if (subtitle) {
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.width = '100%';
        }, 1000);
    }
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Subtle parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform += ` translateY(${rate * speed}px)`;
        });
    });
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Roboto', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add enhanced notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0;
        }
        to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from { 
            transform: translateX(0) scale(1); 
            opacity: 1;
        }
        to { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

// Easter egg - Konami code
let konamiCode = '';
const targetCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';

document.addEventListener('keydown', function(e) {
    konamiCode += e.code;
    if (konamiCode.length > targetCode.length) {
        konamiCode = konamiCode.slice(-targetCode.length);
    }
    
    if (konamiCode === targetCode) {
        showNotification('🎉 Secret code activated! Welcome to Infinitum Realm!', 'success');
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Add enhanced rainbow animation
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg) saturate(1); }
                50% { filter: hue-rotate(180deg) saturate(1.5); }
                100% { filter: hue-rotate(360deg) saturate(1); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        // Add sparkle effect
        createSparkleEffect();
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = '';
    }
});

// Sparkle effect for easter egg
function createSparkleEffect() {
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: sparkle 1s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 1000);
    }
    
    // Add sparkle animation
    if (!document.querySelector('#sparkle-styles')) {
        const sparkleStyles = document.createElement('style');
        sparkleStyles.id = 'sparkle-styles';
        sparkleStyles.textContent = `
            @keyframes sparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(sparkleStyles);
    }
}

// Performance monitoring
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`🚀 Infinitum Realm loaded in ${loadTime}ms`);
    }
}

// Initialize performance logging
window.addEventListener('load', logPerformance);
});

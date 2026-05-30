/* ===================================================
   UNDERFLOW CREATIVES — JavaScript Engine
   =================================================== */

// ---- Loading Screen ----
const loadingMessages = [
  "Convincing visitors not to leave...",
  "Generating more customers for you...",
  "Making competitors very nervous...",
  "Brewing premium digital experiences...",
  "Optimizing your future revenue...",
  "Loading pure awesomeness...",
];

let msgIndex = 0;
const loadingMsg = document.getElementById('loading-message');
const loadingProgress = document.getElementById('loading-progress');

function cycleLoadingMessage() {
  if (loadingMsg) {
    loadingMsg.style.opacity = 0;
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      loadingMsg.textContent = loadingMessages[msgIndex];
      loadingMsg.style.opacity = 1;
      loadingMsg.style.transition = 'opacity 0.3s';
    }, 300);
  }
}

let progressVal = 0;
const progressInterval = setInterval(() => {
  progressVal = Math.min(progressVal + Math.random() * 15, 95);
  if (loadingProgress) loadingProgress.style.width = progressVal + '%';
}, 150);

const msgInterval = setInterval(cycleLoadingMessage, 900);

window.addEventListener('load', () => {
  clearInterval(msgInterval);
  clearInterval(progressInterval);
  if (loadingProgress) loadingProgress.style.width = '100%';
  setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 600);
    // Trigger hero animations
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      if (isInViewport(el)) el.classList.add('visible');
    });
    initCounters();
  }, 400);
});

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interaction states
document.querySelectorAll('a, button, .magnetic-btn, .portfolio-tab, .faq-question, input[type="range"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    if (follower) { follower.style.width = '60px'; follower.style.height = '60px'; follower.style.border = '1.5px solid rgba(99,102,241,0.7)'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    if (follower) { follower.style.width = '36px'; follower.style.height = '36px'; follower.style.border = '1.5px solid rgba(99,102,241,0.5)'; }
  });
});

// ---- Magnetic Button Effect ----
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ---- Navbar ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ---- Hero Canvas Particles ----
const canvas = document.getElementById('hero-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let heroMouseX = 0, heroMouseY = 0;

if (canvas && ctx) {
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '99, 102, 241' : '6, 182, 212';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Mouse interaction
      const dx = heroMouseX - this.x;
      const dy = heroMouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= (dx / dist) * 0.8;
        this.y -= (dy / dist) * 0.8;
      }
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 140;
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Connection lines
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
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 100)})`;
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

  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left;
    heroMouseY = e.clientY - rect.top;
  });
}

// ---- Hero Text Rotation ----
const rotatingTexts = [
  'websites',
  'digital assets',
  'lead machines',
  'booking engines',
  'growth tools',
  'sales funnels',
];
let textIndex = 0;
const rotatingEl = document.getElementById('rotating-text');

function rotateText() {
  if (!rotatingEl) return;
  rotatingEl.style.opacity = '0';
  rotatingEl.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    textIndex = (textIndex + 1) % rotatingTexts.length;
    rotatingEl.textContent = rotatingTexts[textIndex];
    rotatingEl.style.opacity = '1';
    rotatingEl.style.transform = 'translateY(0)';
    rotatingEl.style.transition = 'opacity 0.4s, transform 0.4s';
  }, 300);
}
setInterval(rotateText, 2200);

// ---- Scroll Reveal ----
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
}

function onScroll() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    if (isInViewport(el)) el.classList.add('visible');
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Counter Animations ----
function initCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ---- Comparison Slider ----
const wrapper = document.getElementById('comparison-wrapper');
const handle = document.getElementById('comparison-handle');
const beforeEl = document.querySelector('.comparison-before');
const afterEl = document.querySelector('.comparison-after');

if (wrapper && handle && beforeEl && afterEl) {
  let isDragging = false;

  function setPosition(pos) {
    const rect = wrapper.getBoundingClientRect();
    let pct = (pos - rect.left) / rect.width;
    pct = Math.max(0.15, Math.min(0.85, pct));
    beforeEl.style.width = (pct * 100) + '%';
    afterEl.style.width = ((1 - pct) * 100) + '%';
    handle.style.left = (pct * 100) + '%';
  }

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
  window.addEventListener('mouseup', () => isDragging = false);

  handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
  window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
}

// ---- ROI Calculator ----
const roiVisitors = document.getElementById('roi-visitors');
const roiValue = document.getElementById('roi-value');
const roiCurrent = document.getElementById('roi-current');
const roiVisitorsVal = document.getElementById('roi-visitors-val');
const roiValueVal = document.getElementById('roi-value-val');
const roiCurrentVal = document.getElementById('roi-current-val');
const roiCurrentRev = document.getElementById('roi-current-rev');
const roiNewRev = document.getElementById('roi-new-rev');
const roiGain = document.getElementById('roi-gain');

function formatINR(n) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + ',000';
  return '₹' + n;
}

function updateROI() {
  if (!roiVisitors) return;
  const visitors = parseInt(roiVisitors.value);
  const value = parseInt(roiValue.value);
  const rate = parseFloat(roiCurrent.value);

  if (roiVisitorsVal) roiVisitorsVal.textContent = visitors.toLocaleString('en-IN');
  if (roiValueVal) roiValueVal.textContent = value.toLocaleString('en-IN');
  if (roiCurrentVal) roiCurrentVal.textContent = rate.toFixed(1);

  const currentRev = Math.round(visitors * (rate / 100) * value);
  const newRev = Math.round(currentRev * 4.2);
  const gain = newRev - currentRev;

  if (roiCurrentRev) roiCurrentRev.textContent = formatINR(currentRev);
  if (roiNewRev) roiNewRev.textContent = formatINR(newRev);
  if (roiGain) roiGain.textContent = formatINR(gain);
}

if (roiVisitors) roiVisitors.addEventListener('input', updateROI);
if (roiValue) roiValue.addEventListener('input', updateROI);
if (roiCurrent) roiCurrent.addEventListener('input', updateROI);
updateROI();

// ---- Portfolio Tabs ----
document.querySelectorAll('.portfolio-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.portfolio-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ---- Testimonial Carousel ----
const track = document.getElementById('testimonial-track');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('tc-dots');
const prevBtn = document.getElementById('tc-prev');
const nextBtn = document.getElementById('tc-next');

let currentSlide = 0;
let slidesPerView = 3;

function updateSlidesPerView() {
  if (window.innerWidth < 600) slidesPerView = 1;
  else if (window.innerWidth < 900) slidesPerView = 2;
  else slidesPerView = 3;
}
updateSlidesPerView();
window.addEventListener('resize', () => { updateSlidesPerView(); updateCarousel(); });

const totalSlides = cards.length;

function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  for (let i = 0; i <= maxSlide; i++) {
    const dot = document.createElement('div');
    dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  if (!track) return;
  const cardWidth = 100 / slidesPerView;
  cards.forEach(card => { card.style.minWidth = `calc(${cardWidth}% - ${(16 * (slidesPerView - 1)) / slidesPerView}px)`; });
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  currentSlide = Math.min(currentSlide, maxSlide);
  const offset = currentSlide * (100 / slidesPerView + 24 / (track.offsetWidth / slidesPerView));
  track.style.transform = `translateX(-${currentSlide * (100 / slidesPerView)}%)`;
  createDots();
  document.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function goToSlide(i) {
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  currentSlide = Math.max(0, Math.min(i, maxSlide));
  const cardWidth = track ? (track.offsetWidth / slidesPerView) + 24 : 0;
  if (track) track.style.transform = `translateX(-${currentSlide * (cardWidth)}px)`;
  document.querySelectorAll('.tc-dot').forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

updateCarousel();

// Auto-advance
setInterval(() => {
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
}, 5000);

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Urgency Timer ----
function setCountdown() {
  // Set target to end of current month
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);

  function update() {
    const diff = target - new Date();
    if (diff <= 0) { clearInterval(timerInterval); return; }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const d = document.getElementById('timer-days');
    const h = document.getElementById('timer-hours');
    const m = document.getElementById('timer-mins');
    const s = document.getElementById('timer-secs');
    if (d) d.textContent = pad(days);
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(mins);
    if (s) s.textContent = pad(secs);
  }
  update();
  const timerInterval = setInterval(update, 1000);
}
setCountdown();

// ---- Contact Form ----
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    // Simulate submission
    setTimeout(() => {
      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');
    }, 1200);
  });
}

// ---- 3D Card Tilt ----
document.querySelectorAll('.service-card, .fail-card, .industry-card, .timeline-content').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -6;
    const rotateY = (x - centerX) / centerX * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ---- Smooth Scroll for Nav ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Easter Egg (Konami Code) ----
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      const egg = document.getElementById('easter-egg');
      if (egg) egg.style.display = 'block';
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// Double-click on logo for easter egg too
document.getElementById('nav-logo')?.addEventListener('dblclick', () => {
  const egg = document.getElementById('easter-egg');
  if (egg) egg.style.display = egg.style.display === 'block' ? 'none' : 'block';
});

// ---- Floating CTA Show on Scroll ----
const floatingCta = document.getElementById('floating-cta');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    if (floatingCta) floatingCta.style.opacity = '1';
  } else {
    if (floatingCta) floatingCta.style.opacity = '0';
  }
}, { passive: true });
if (floatingCta) floatingCta.style.opacity = '0';
if (floatingCta) floatingCta.style.transition = 'opacity 0.4s';

// ---- Service Card Hover Glow ----
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.querySelector('.service-glow').style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.12) 0%, transparent 70%)`;
  });
});

// ---- Intersection Observer for better performance ----
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters when stats are visible
      if (entry.target.classList.contains('hero-stats')) {
        initCounters();
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// ---- Page Title Easter Egg ----
let originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = "Come back! 👀 We miss you...";
  } else {
    document.title = originalTitle;
  }
});

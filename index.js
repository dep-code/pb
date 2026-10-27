/* ═══════════════════════════════════════════════════════════
   FIX.JS  —  Premium Aesthetic Personal Branding
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Lucide icons init ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

/* ══════════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot    = document.getElementById('cursor-dot');
  const ringSm = document.getElementById('cursor-ring-sm');
  const ringMd = document.getElementById('cursor-ring-md');
  const ringLg = document.getElementById('cursor-ring-lg');

  let mx = -100, my = -100;
  let smX = -100, smY = -100;
  let mdX = -100, mdY = -100;
  let lgX = -100, lgY = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    smX += (mx - smX) * 0.35; smY += (my - smY) * 0.35;
    ringSm.style.left = smX + 'px'; ringSm.style.top = smY + 'px';

    mdX += (mx - mdX) * 0.18; mdY += (my - mdY) * 0.18;
    ringMd.style.left = mdX + 'px'; ringMd.style.top = mdY + 'px';

    lgX += (mx - lgX) * 0.08; lgY += (my - lgY) * 0.08;
    ringLg.style.left = lgX + 'px'; ringLg.style.top = lgY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', () => {
    ringSm.style.width = '12px'; ringSm.style.height = '12px';
    ringMd.style.width = '28px'; ringMd.style.height = '28px';
  });
  document.addEventListener('mouseup', () => {
    ringSm.style.width = '18px'; ringSm.style.height = '18px';
    ringMd.style.width = '36px'; ringMd.style.height = '36px';
  });
})();

/* ══════════════════════════════════════════════════════════════
   2. INTRO LOADING
══════════════════════════════════════════════════════════════ */
(function initIntro() {
  const fill = document.getElementById('loader-fill');
  const pct  = document.getElementById('loader-pct');
  let done   = false;

  fill.style.width = '0%';
  pct.textContent  = '0%';

  const duration  = 4500;
  const startTime = Date.now();

  function tick() {
    if (done) return;
    const elapsed  = Date.now() - startTime;
    const raw      = Math.min(elapsed / duration, 1);
    const eased    = raw < 0.7
      ? raw * 1.2
      : 0.84 + (raw - 0.7) * (0.16 / 0.3);
    const progress = Math.min(eased * 100, 100);

    fill.style.width = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';

    if (progress >= 100) {
      fill.style.width = '100%';
      pct.textContent  = '100%';
      done = true;
      setTimeout(startCharIntro, 500);
      return;
    }
    requestAnimationFrame(tick);
  }

  setTimeout(() => requestAnimationFrame(tick), 300);
})();

/* ══════════════════════════════════════════════════════════════
   3. CHARACTER INTRO ANIMATION
══════════════════════════════════════════════════════════════ */
function startCharIntro() {
  const wrap   = document.getElementById('char-intro-wrap');
  const char   = document.getElementById('char-intro');
  const canvas = document.getElementById('rope-canvas-intro');
  wrap.style.display = 'block';

  const ctx = canvas.getContext('2d');
  canvas.width  = 6;
  canvas.height = window.innerHeight + 400;

  let charY   = -300;
  let ropeLen = 0;
  const midY  = window.innerHeight * 0.38;
  let phase   = 'down';

  function drawRope(len) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (len <= 0) return;
    const grad = ctx.createLinearGradient(0, 0, 0, len);
    grad.addColorStop(0, 'rgba(212,175,122,1)');
    grad.addColorStop(0.6, 'rgba(212,175,122,0.6)');
    grad.addColorStop(1, 'rgba(212,175,122,0.1)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(3, 0);
    const t = Date.now() / 800;
    for (let y = 0; y <= len; y += 3) {
      const x = 3 + Math.sin(y * 0.04 + t) * 1.2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function frame() {
    if (phase === 'down') {
      const speed = 10 + (midY - Math.max(charY, -300)) * 0.04;
      ropeLen = Math.min(ropeLen + speed, midY + 160);
      charY   = Math.min(charY + speed, midY);
      char.style.top = charY + 'px';
      drawRope(ropeLen);
      if (charY >= midY) {
        phase = 'pause';
        setTimeout(() => { phase = 'fall'; startPagePull(); }, 700);
      }
    } else if (phase === 'fall') {
      const speed = 14 + (charY - midY) * 0.06;
      charY   += speed;
      ropeLen += speed;
      char.style.top = charY + 'px';
      drawRope(ropeLen);
      if (charY > window.innerHeight + 320) {
        wrap.style.display = 'none';
        return;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════
   4. PAGE PULL TRANSITION
══════════════════════════════════════════════════════════════ */
function startPagePull() {
  const sheet = document.getElementById('page-pull-sheet');
  const intro = document.getElementById('intro-screen');

  gsap.set(sheet, { y: '-100%', opacity: 1 });
  gsap.to(sheet, {
    y: '0%', duration: 0.9, ease: 'power3.inOut',
    onComplete: () => {
      intro.style.display = 'none';
      document.getElementById('char-intro-wrap').style.display = 'none';
      document.getElementById('main-site').classList.remove('hidden');
      lucide.createIcons();
      initMainSite();
      gsap.to(sheet, { y: '100%', duration: 1.0, ease: 'power3.out', delay: 0.05 });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   4b. LANGUAGE SWITCHER
══════════════════════════════════════════════════════════════ */
function initLangSwitcher() {
  const buttons = document.querySelectorAll('.lang-btn');
  if (!buttons.length) return;
  function applyLang(lang) {
    const active = (lang === 'en') ? 'en' : 'id';
    buttons.forEach(b => b.classList.toggle('active', b.dataset.lang === active));
    document.querySelectorAll('[data-id]').forEach(el => {
      const val = (active === 'en') ? el.dataset.en : el.dataset.id;
      if (typeof val === 'string') el.innerHTML = val;
    });
    const cvBtn = document.querySelector('.cv-btn');
    const cvImg  = document.getElementById('cv-img-el');
    const cvPdf  = document.getElementById('cv-pdf-el');
    if (active === 'en') {
      if (cvBtn) { cvBtn.setAttribute('href', 'cvv.png'); cvBtn.setAttribute('download', 'CV_Devira_Meireditha_EN.png'); }
      if (cvImg) { cvImg.src = 'cvv.png'; cvImg.style.display = 'block'; }
      if (cvPdf) cvPdf.style.display = 'none';
      document.documentElement.lang = 'en';
    } else {
      if (cvBtn) { cvBtn.setAttribute('href', 'cv indo.png'); cvBtn.setAttribute('download', 'CV_Devira_Meireditha.png'); }
      if (cvImg) { cvImg.src = 'cv indo.png'; cvImg.style.display = 'block'; }
      if (cvPdf) cvPdf.style.display = 'none';
      document.documentElement.lang = 'id';
    }
    try { localStorage.setItem('lang', active); } catch (e) {}
  }
  let saved = 'id';
  try { saved = localStorage.getItem('lang') || 'id'; } catch (e) {}
  buttons.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(saved);
}

/* ══════════════════════════════════════════════════════════════
   5. MAIN SITE INIT
══════════════════════════════════════════════════════════════ */
function initMainSite() {
  initLampRope();
  initLampToggle();
  initSidebar();
  initNicknameCycle();
  initHomeParticles();
  initHomePixelCanvas();
  initHomeNightCanvas();
  initScrollReveal();
  initSkillBars();
  initMemoriesTimeline();
  initModals();
  initDaySky();
  initPortfolioControls();
  initLangSwitcher();
  setTimeout(initGSAPAnimations, 200);
}

/* ══════════════════════════════════════════════════════════════
   6. LAMP ROPE
══════════════════════════════════════════════════════════════ */
function initLampRope() {
  const canvas    = document.getElementById('lamp-rope-canvas');
  const lampWrap  = document.getElementById('lamp-wrap');
  const container = canvas ? canvas.parentElement : null;
  if (!canvas || !container) return;
  const ctx = canvas.getContext('2d');

  function reposition() {
    canvas.width  = 10;
    canvas.height = 110;
    const rect = lampWrap.getBoundingClientRect();
    container.style.left = (rect.left + rect.width / 2 - 5) + 'px';
  }
  reposition();
  window.addEventListener('resize', reposition);

  function draw() {
    ctx.clearRect(0, 0, 10, 110);
    const grad = ctx.createLinearGradient(0, 0, 0, 110);
    grad.addColorStop(0,   'rgba(212,175,122,1)');
    grad.addColorStop(0.6, 'rgba(212,175,122,0.7)');
    grad.addColorStop(1,   'rgba(212,175,122,0.2)');
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(5, 0);
    const t = Date.now() / 1000;
    for (let y = 0; y <= 110; y += 3) {
      const x = 5 + Math.sin(y * 0.12 + t * 0.8) * 1.2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   7. LAMP TOGGLE
══════════════════════════════════════════════════════════════ */
function initLampToggle() {
  const lampWrap = document.getElementById('lamp-wrap');
  const lampBody = document.getElementById('lamp-body');
  const html     = document.documentElement;
  if (!lampWrap || lampWrap.dataset.toggleReady === 'true') return;
  lampWrap.dataset.toggleReady = 'true';

  let isDark    = html.getAttribute('data-theme') === 'dark';
  let animating = false;

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    const lightWrap = document.getElementById('bg-light-wrap');
    const darkWrap  = document.getElementById('bg-dark-wrap');
    if (lightWrap) lightWrap.style.display = dark ? 'none'  : 'block';
    if (darkWrap)  darkWrap.style.display  = dark ? 'block' : 'none';
    window._bgStarsRunning = dark;
    const moon = document.getElementById('home-moon-wrap');
    if (moon) moon.classList.toggle('hidden', !dark);
    // Delay heavy sky init sampai setelah animasi CML selesai (~2 detik)
    if (dark) {
      setTimeout(() => { showNightSky(); hideDaySky(); }, 1800);
    } else {
      setTimeout(() => { showDaySky(); hideNightSky(); }, 1800);
    }
  }

  // init
  applyTheme(isDark);

  lampWrap.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    startLampCharAnimation(() => {
      isDark = !isDark;
      applyTheme(isDark);
      animating = false;
    });
    gsap.to(lampBody, {
      rotation: 22, duration: 0.2, ease: 'power3.out',
      onComplete: () => gsap.to(lampBody, { rotation: 0, duration: 2.0, ease: 'elastic.out(1,0.3)' })
    });
  });
}

function startLampCharAnimation(onModeChange) {
  const wrap   = document.getElementById('char-lamp-wrap');
  const char   = document.getElementById('char-lamp');
  const canvas = document.getElementById('rope-canvas-lamp');
  if (!wrap || !char || !canvas) return;
  wrap.style.display = 'block';

  const ctx = canvas.getContext('2d');
  canvas.width  = 4;
  canvas.height = window.innerHeight;

  let charY        = -260;
  let ropeLen      = 0;
  const targetY    = window.innerHeight * 0.3;
  let phase        = 'down';
  let pullProgress = 0;
  let modeChanged  = false;

  function drawRope(len) {
    ctx.clearRect(0, 0, 4, canvas.height);
    if (len <= 0) return;
    const grad = ctx.createLinearGradient(0, 0, 0, len);
    grad.addColorStop(0, 'rgba(212,175,122,0.9)');
    grad.addColorStop(1, 'rgba(212,175,122,0.3)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(2, len); ctx.stroke();
  }

  function frame() {
    if (phase === 'down') {
      ropeLen = Math.min(ropeLen + 16, targetY + 130);
      charY   = Math.min(charY   + 16, targetY);
      char.style.top = charY + 'px';
      drawRope(ropeLen);
      if (charY >= targetY) {
        phase = 'pause';
        setTimeout(() => { phase = 'pull'; }, 400);
      }
    } else if (phase === 'pull') {
      pullProgress += 0.03;
      const sway = Math.sin(pullProgress * Math.PI * 5) * 10 * (1 - pullProgress);
      char.style.transform = `translateX(-50%) rotate(${sway}deg)`;
      if (!modeChanged && pullProgress > 0.4) {
        modeChanged = true;
        onModeChange();
      }
      if (pullProgress >= 1) { phase = 'up'; }
    } else if (phase === 'up') {
      charY   -= 20;
      ropeLen -= 20;
      char.style.top = charY + 'px';
      drawRope(Math.max(ropeLen, 0));
      if (charY < -300) { wrap.style.display = 'none'; return; }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════
   8. NIGHT / DAY SKY
══════════════════════════════════════════════════════════════ */
function showNightSky() {
  const sky = document.getElementById('night-sky');
  if (!sky) return;
  if (window.gsap) gsap.killTweensOf(sky);
  sky.classList.remove('hidden');
  sky.style.opacity = '1';
  initStars();
  initNightParticles();
}
function hideNightSky() {
  const sky = document.getElementById('night-sky');
  if (!sky) return;
  if (window.gsap) gsap.killTweensOf(sky);
  sky.style.opacity = '0';
  sky.classList.add('hidden');
}
function showDaySky() {
  const sky = document.getElementById('day-sky');
  if (!sky || document.documentElement.getAttribute('data-theme') === 'dark') return;
  if (window.gsap) gsap.killTweensOf(sky);
  sky.classList.remove('hidden');
  sky.style.opacity = '1';
}
function hideDaySky() {
  const sky = document.getElementById('day-sky');
  if (!sky) return;
  if (window.gsap) gsap.killTweensOf(sky);
  sky.style.opacity = '0';
  sky.classList.add('hidden');
}
function initDaySky() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') hideDaySky();
  else showDaySky();
}

function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = Array.from({ length: 280 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    stars.forEach(s => {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed * 10 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,220,${a})`;
      ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,255,200,0.8)';
      ctx.fill();
    });
    if (!document.getElementById('night-sky').classList.contains('hidden')) {
      requestAnimationFrame(draw);
    }
  }
  draw();
}

function initNightParticles() {
  const container = document.getElementById('night-particles');
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;border-radius:50%;background:rgba(255,220,180,${0.3+Math.random()*0.5});left:${Math.random()*100}%;top:${Math.random()*80}%;box-shadow:0 0 6px rgba(255,200,100,0.6);animation:nightFloat ${4+Math.random()*6}s ease-in-out infinite;animation-delay:${-Math.random()*6}s;`;
    container.appendChild(p);
  }
  if (!document.getElementById('nightFloatStyle')) {
    const style = document.createElement('style');
    style.id = 'nightFloatStyle';
    style.textContent = `@keyframes nightFloat{0%,100%{transform:translateY(0) scale(1);opacity:0.6;}50%{transform:translateY(-20px) scale(1.2);opacity:1;}}`;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════════════════════
   9. SIDEBAR
══════════════════════════════════════════════════════════════ */
function initSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const close   = document.getElementById('sidebar-close');

  function open() { sidebar.classList.add('open'); overlay.classList.add('active'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

  toggle.addEventListener('click', open);
  close.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
}

/* ══════════════════════════════════════════════════════════════
   10. NICKNAME CYCLE
══════════════════════════════════════════════════════════════ */
function initNicknameCycle() {
  const names = ['Devira','Depira','Devi','Depi','Dev','Dep','De','Vira','Vir','Vi','Luis','Luwis','Deplupiss','Lupis Legit','Lupis','Pis','Imut','Mut'];
  const el = document.getElementById('home-nickname');
  if (!el) return;
  let idx = 0;

  function next() {
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % names.length;
      el.textContent = names[idx];
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
      setTimeout(() => el.classList.remove('fade-in'), 400);
    }, 400);
  }
  setInterval(next, 2200);
}

/* ══════════════════════════════════════════════════════════════
   11. HOME PARTICLES
══════════════════════════════════════════════════════════════ */
function initHomeParticles() {
  const container = document.getElementById('home-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    const size = 2 + Math.random() * 4;
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(242,196,206,${0.3+Math.random()*0.4});left:${Math.random()*100}%;top:${Math.random()*100}%;box-shadow:0 0 ${size*3}px rgba(242,196,206,0.5);animation:homeParticle ${5+Math.random()*8}s ease-in-out infinite;animation-delay:${-Math.random()*8}s;`;
    container.appendChild(p);
  }
  if (!document.getElementById('homeParticleStyle')) {
    const style = document.createElement('style');
    style.id = 'homeParticleStyle';
    style.textContent = `@keyframes homeParticle{0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:0.5;}33%{transform:translateY(-30px) translateX(15px) scale(1.3);opacity:0.9;}66%{transform:translateY(-15px) translateX(-10px) scale(0.8);opacity:0.6;}}`;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════════════════════
   11b. HOME PIXEL CANVAS
══════════════════════════════════════════════════════════════ */
function initHomePixelCanvas() {
  const canvas = document.getElementById('home-pixel-canvas');
  if (!canvas) return;

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');
  const pixels = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    size: Math.floor(Math.random() * 3) + 1,
    phase: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 1.5,
    color: Math.random() > 0.5 ? 'rgba(255,220,180,' : 'rgba(200,220,255,',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    pixels.forEach(p => {
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * p.speed + p.phase));
      ctx.fillStyle = p.color + alpha + ')';
      ctx.shadowBlur  = p.size * 4;
      ctx.shadowColor = p.color + '0.9)';
      ctx.fillRect(p.x * canvas.width, p.y * canvas.height, p.size, p.size);
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   11c. HOME NIGHT CANVAS
══════════════════════════════════════════════════════════════ */
function initHomeNightCanvas() {
  const canvas = document.getElementById('home-night-canvas');
  if (!canvas) return;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
    canvas.height = Math.round((parent ? parent.offsetWidth : window.innerWidth) * 0.6);
  }
  resize();
  window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');

  const pixels = Array.from({ length: 80 }, () => ({
    x: 0.05 + Math.random() * 0.9, y: Math.random() * 0.88,
    size: Math.floor(Math.random() * 2) + 1,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.4,
    swayAmp: 0.6 + Math.random() * 1.8,
    swayFreq: 0.25 + Math.random() * 0.6,
    warm: Math.random() > 0.5,
  }));

  const drifters = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random() * 0.88,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.9,
    dx: (Math.random() - 0.5) * 0.00012,
    dy: (Math.random() - 0.5) * 0.00006,
    warm: Math.random() > 0.4,
  }));

  const fireflies = Array.from({ length: 18 }, (_, i) => ({
    x: (i % 6) / 6 + Math.random() * 0.16,
    y: Math.floor(i / 6) / 3 + Math.random() * 0.30,
    phase: Math.random() * Math.PI * 2,
    phaseDrift: Math.random() * Math.PI * 2,
    speed: 0.8 + Math.random() * 1.2,
    driftSpeed: 0.3 + Math.random() * 0.5,
    r: 1.5 + Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.00025,
    dy: (Math.random() - 0.5) * 0.00015,
  }));

  function drawMoon(w, h) {
    const mx = w * 0.14;
    const my = h * 0.21;
    const r  = Math.max(28, Math.min(w, h) * 0.065);

    ctx.save();

    const grd = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 3.2);
    grd.addColorStop(0, 'rgba(255,240,120,0.35)');
    grd.addColorStop(0.5, 'rgba(245,208,96,0.15)');
    grd.addColorStop(1, 'rgba(245,208,96,0)');
    ctx.beginPath();
    ctx.arc(mx, my, r * 3.2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    const moonGrd = ctx.createRadialGradient(mx - r*0.3, my - r*0.3, r*0.1, mx, my, r);
    moonGrd.addColorStop(0, '#fffde0');
    moonGrd.addColorStop(0.4, '#f5d060');
    moonGrd.addColorStop(1, '#d4a020');
    ctx.fillStyle = moonGrd;
    ctx.shadowBlur = r * 1.2;
    ctx.shadowColor = 'rgba(255,230,80,0.85)';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(mx + r * 0.50, my - r * 0.04, r * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.arc(mx, my, r, 0.6, 2.2);
    ctx.strokeStyle = 'rgba(255,250,200,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    [[mx + r*2.0, my - r*1.0, 1.6, 0.9],
     [mx + r*2.7, my + r*0.6, 1.1, 0.8],
     [mx - r*0.3, my - r*1.8, 1.3, 0.85],
     [mx + r*1.5, my + r*1.7, 0.9, 0.75],
     [mx - r*1.2, my + r*0.8, 1.0, 0.7]].forEach(([sx, sy, sr, a]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,245,180,${a})`;
      ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,230,120,0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    const w = canvas.width, h = canvas.height;

    drifters.forEach(s => {
      s.x += s.dx; s.y += s.dy;
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      if (s.y < 0) s.y = 0.88; if (s.y > 0.88) s.y = 0;
      const a = 0.2 + 0.8 * Math.abs(Math.sin(t * s.speed * 1.8 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm ? `rgba(255,230,180,${a})` : `rgba(200,220,255,${a})`;
      ctx.shadowBlur = s.r * 5;
      ctx.shadowColor = s.warm ? `rgba(255,220,150,${a})` : `rgba(180,210,255,${a})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    pixels.forEach(p => {
      const a = 0.15 + 0.85 * Math.abs(Math.sin(t * p.speed * 2.2 + p.phase));
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      const px = p.x * w + sway;
      const py = p.y * h;
      const glow = p.size * (4 + 3 * Math.abs(Math.sin(t * p.speed + p.phase)));
      ctx.shadowBlur = glow;
      ctx.shadowColor = p.warm ? `rgba(255,220,150,${a})` : `rgba(180,210,255,${a})`;
      ctx.fillStyle = p.warm ? `rgba(255,240,190,${a})` : `rgba(215,230,255,${a})`;
      ctx.fillRect(px, py, p.size, p.size);
      ctx.shadowBlur = 0;
    });

    // Draw fireflies
    fireflies.forEach(f => {
      f.x += f.dx; f.y += f.dy;
      if (f.x < 0) f.x = 1; if (f.x > 1) f.x = 0;
      if (f.y < 0) f.y = 1; if (f.y > 1) f.y = 0;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * f.speed + f.phase));
      const glow = f.r * (6 + 4 * Math.abs(Math.sin(t * f.driftSpeed + f.phaseDrift)));
      ctx.beginPath();
      ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,220,80,${alpha})`;
      ctx.shadowBlur = glow;
      ctx.shadowColor = `rgba(160,220,60,${alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // drawMoon removed
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   12. SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(getComputedStyle(e.target).getPropertyValue('--delay') || '0') * 1000;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   13. SKILL BARS
══════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill, .skill-fill');
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = e.target.getAttribute('data-pct');
        setTimeout(() => { e.target.style.width = pct + '%'; }, 300);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

/* ══════════════════════════════════════════════════════════════
   14. MEMORIES TIMELINE
══════════════════════════════════════════════════════════════ */
function initMemoriesTimeline() {
  const container = document.getElementById('memories-timeline');
  if (!container) return;

  const photos = [
    { src: '1.jpg' }, { src: '2.jpg' }, { src: '8.jpg' }, { src: '9.jpg' },
    { src: '11.jpg' }, { src: '20.jpg' }, { src: '49.jpg' }, { src: '116.jpg' },
    { src: '130.jpg' }, { src: '132.jpg' }, { src: '138.jpg' }, { src: '140.jpg' },
    { src: '145.jpg' }, { src: '146.jpg' }, { src: '152.jpg' }, { src: '157.jpg' },
    { src: '158.jpg' }, { src: '161.jpg' }, { src: '163.jpg' }, { src: '167.jpg' },
    { src: '3me.jpg' }, { src: '3aku.jpg' }, { src: '4aku.jpg' },
    { src: '10me.jpg' }, { src: '16me.jpg' },
  ];

  photos.forEach(p => {
    const item = document.createElement('div');
    item.className = 'memory-item';
    item.innerHTML = `<img src="${p.src}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'" />`;
    container.appendChild(item);
  });
}

/* ══════════════════════════════════════════════════════════════
   15. MODALS
══════════════════════════════════════════════════════════════ */
function initModals() {
  document.getElementById('btn-findme').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
    document.getElementById('findme-modal').classList.remove('hidden');
  });
  document.getElementById('findme-close').addEventListener('click', () => {
    document.getElementById('findme-modal').classList.add('hidden');
  });
  document.querySelector('#findme-modal .modal-backdrop').addEventListener('click', () => {
    document.getElementById('findme-modal').classList.add('hidden');
  });
}

/* ══════════════════════════════════════════════════════════════
   15b. PORTFOLIO CONTROLS (filter + view toggle)
══════════════════════════════════════════════════════════════ */
function initPortfolioControls() {
  // Filter
  const filterBtns = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'semua' || card.dataset.category === filter) {
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
      // If 3D mode active, reset carousel after filter
      if (grid && grid.classList.contains('view-3d')) {
        carouselIndex = 0;
        applyCarousel();
      }
    });
  });

  // --- 3D CAROUSEL ---
  const carouselNav = document.getElementById('carousel-nav');
  const carouselDots = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let carouselIndex = 0;
  let carouselCards = [];

  function getVisibleCards() {
    return Array.from(document.querySelectorAll('.portfolio-card:not(.hidden-filter)'));
  }

  function buildDots(count) {
    carouselDots.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'carousel-dot' + (i === carouselIndex ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      carouselDots.appendChild(d);
    }
  }

  function updateDots() {
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
  }

  function applyCarousel() {
    carouselCards = getVisibleCards();
    const total = carouselCards.length;
    buildDots(total);
    carouselCards.forEach((card, i) => {
      const offset = i - carouselIndex;
      const absOffset = Math.abs(offset);
      if (absOffset > 3) {
        card.dataset.pos = 'hidden';
      } else {
        card.dataset.pos = String(offset);
      }
      card.onclick = () => {
        if (offset !== 0) goTo(i);
      };
    });
  }

  function goTo(index) {
    carouselIndex = Math.max(0, Math.min(index, carouselCards.length - 1));
    applyCarousel();
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(carouselIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(carouselIndex + 1));

  // Drag/swipe support — real-time cursor drag
  let dragStart = null;
  let isDragging = false;
  let wheelCooldown = false;
  const grid = document.querySelector('.portfolio-grid');
  if (grid) {
    // Mouse drag — hanya aktif saat mode 3D
    grid.addEventListener('mousedown', e => {
      if (!grid.classList.contains('view-3d')) return;
      dragStart = e.clientX;
      isDragging = false;
      grid.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (dragStart === null) return;
      if (Math.abs(dragStart - e.clientX) > 8) isDragging = true;
    });
    document.addEventListener('mouseup', e => {
      if (dragStart === null) return;
      const diff = dragStart - e.clientX;
      if (grid.classList.contains('view-3d')) grid.style.cursor = 'grab';
      if (isDragging && Math.abs(diff) > 40) {
        diff > 0 ? goTo(carouselIndex + 1) : goTo(carouselIndex - 1);
      }
      dragStart = null;
      isDragging = false;
    });

    // Trackpad 2 jari / mouse wheel — laptop
    grid.addEventListener('wheel', e => {
      if (!grid.classList.contains('view-3d')) return;
      e.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 600);
      e.deltaX !== 0
        ? (e.deltaX > 0 ? goTo(carouselIndex + 1) : goTo(carouselIndex - 1))
        : (e.deltaY > 0 ? goTo(carouselIndex + 1) : goTo(carouselIndex - 1));
    }, { passive: false });

    // Touch swipe 1 jari — HP/tablet
    grid.addEventListener('touchstart', e => {
      if (!grid.classList.contains('view-3d')) return;
      dragStart = e.touches[0].clientX;
      isDragging = false;
    }, {passive: true});
    grid.addEventListener('touchmove', e => {
      if (dragStart === null) return;
      if (Math.abs(dragStart - e.touches[0].clientX) > 8) isDragging = true;
    }, {passive: true});
    grid.addEventListener('touchend', e => {
      if (dragStart === null) return;
      const diff = dragStart - e.changedTouches[0].clientX;
      if (isDragging && Math.abs(diff) > 40) {
        diff > 0 ? goTo(carouselIndex + 1) : goTo(carouselIndex - 1);
      }
      dragStart = null;
      isDragging = false;
    }, {passive: true});
  }

  // Toggle 3D/flat
  document.getElementById('view-flat').addEventListener('click', function() {
    if (grid) grid.classList.remove('view-3d');
    this.classList.add('active');
    document.getElementById('view-3d').classList.remove('active');
    if (carouselNav) carouselNav.classList.add('hidden');
    document.querySelectorAll('.portfolio-card').forEach(c => delete c.dataset.pos);
  });

  document.getElementById('view-3d').addEventListener('click', function() {
    if (grid) grid.classList.add('view-3d');
    this.classList.add('active');
    document.getElementById('view-flat').classList.remove('active');
    if (carouselNav) carouselNav.classList.remove('hidden');
    carouselIndex = 0;
    applyCarousel();
    if (window.lucide) lucide.createIcons();
  });

  // Re-render the new lucide icons (layout-grid, box, award)
  if (window.lucide) lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════
   16. SMOOTH SCROLL NAV
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════════════
   17. GSAP SCROLL ANIMATIONS
══════════════════════════════════════════════════════════════ */
function initGSAPAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.home-bg-real-img', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
  });

  gsap.to('.about-bg-img', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════════════════════════
   DYNAMIC BACKGROUND — Stars Canvas
══════════════════════════════════════════════════════════════ */
(function initBgStars() {
  const canvas = document.getElementById('bg-stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const STAR_COUNT = 130;
  const stars = [];
  const COLORS = ['#ffffff', '#ffb8d8', '#d0d0e0', '#ffe0f0', '#e8e8ff'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min, max) { return min + Math.random() * (max - min); }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x:          rand(0, canvas.width),
      y:          rand(0, canvas.height),
      baseRadius: rand(0.5, 2.5),
      radius:     rand(0.5, 2.5),
      color:      COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity:    rand(0.2, 1.0),
      twinkleDur: rand(1500, 4000),
      twinkleOffset: rand(0, Math.PI * 2),
      pulseDelta:  rand(-0.3, 0.3),
    });
  }

  window._bgStarsRunning = false;

  function updateBgThemeStars() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    window._bgStarsRunning = isDark;
  }
  updateBgThemeStars();

  function drawStars(timestamp) {
    requestAnimationFrame(drawStars);
    if (!window._bgStarsRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = timestamp;
    stars.forEach(s => {
      const phase   = (t / s.twinkleDur * Math.PI * 2) + s.twinkleOffset;
      s.opacity     = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(phase));
      s.radius      = s.baseRadius + s.pulseDelta * Math.sin(phase * 1.3);
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.3, s.radius), 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(drawStars);

  /* Re-seed star positions on resize */
  window.addEventListener('resize', () => {
    stars.forEach(s => {
      s.x = rand(0, canvas.width);
      s.y = rand(0, canvas.height);
    });
  });
})();
const PX = 4;
const C = {
  body: '#8e979e',
  dark: '#5f676d',
  belly: '#eef1f2',
  ink: '#1c1f22',
  white: '#ffffff',
  pink: '#ff9d9d',
};

const canvas = document.getElementById('sealion');
const ctx = canvas.getContext('2d');
const wrap = document.getElementById('sealion-wrap');
const speech = document.getElementById('speech');
const scoreEl = document.getElementById('score');
const worldEl = document.getElementById('world');

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PX, y * PX, w * PX, h * PX);
}

function drawSeaLion(frame, barking) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bob = frame === 1 ? 1 : 0;
  const dark = document.body.classList.contains('dark');
  const eyesClosed = state.sleeping || state.blink;

  if (dark && !state.sleeping) {
    const ly = (1 + bob) * PX + 2;
    const flicker = 0.2 + Math.random() * 0.06;
    const beam = ctx.createLinearGradient(108, 0, canvas.width, 0);
    beam.addColorStop(0, `rgba(255, 232, 120, ${flicker + 0.15})`);
    beam.addColorStop(1, 'rgba(255, 232, 120, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(108, ly);
    ctx.lineTo(canvas.width, ly - 20);
    ctx.lineTo(canvas.width, ly + 52);
    ctx.closePath();
    ctx.fill();
  }

  if (frame === 0) {
    px(1, 12 + bob, 3, 1, C.dark);
    px(0, 13 + bob, 4, 1, C.body);
    px(2, 14 + bob, 3, 1, C.dark);
  } else {
    px(1, 11 + bob, 3, 1, C.dark);
    px(0, 12 + bob, 4, 1, C.body);
    px(2, 13 + bob, 3, 1, C.dark);
  }

  px(20, 6 + bob, 6, 1, C.body);
  px(18, 7 + bob, 8, 1, C.body);
  px(15, 8 + bob, 11, 1, C.body);
  px(12, 9 + bob, 14, 1, C.body);
  px(9, 10 + bob, 17, 1, C.body);
  px(7, 11 + bob, 19, 1, C.body);
  px(5, 12 + bob, 21, 1, C.body);
  px(4, 13 + bob, 21, 1, C.body);
  px(3, 14 + bob, 19, 1, C.dark);

  px(21, 7 + bob, 4, 1, C.belly);
  px(21, 8 + bob, 4, 1, C.belly);
  px(21, 9 + bob, 5, 1, C.belly);
  px(20, 10 + bob, 5, 1, C.belly);
  px(20, 11 + bob, 5, 1, C.belly);
  px(20, 12 + bob, 5, 1, C.belly);
  px(21, 13 + bob, 4, 1, C.belly);

  px(20, 0 + bob, 5, 1, C.body);
  px(19, 1 + bob, 7, 1, C.body);
  px(19, 2 + bob, 8, 1, C.body);
  px(19, 3 + bob, 8, 1, C.body);
  px(20, 4 + bob, 7, 1, C.body);
  px(21, 5 + bob, 6, 1, C.body);

  px(24, 2 + bob, 3, 2, C.dark);
  px(26, 2 + bob, 1, 1, C.ink);
  px(25, 4 + bob, 2, 1, C.dark);

  px(22, 2 + bob, 1, 1, eyesClosed ? C.dark : C.ink);

  px(27, 2 + bob, 1, 1, C.white);
  px(27, 4 + bob, 1, 1, C.white);

  if (barking) {
    px(25, 4 + bob, 2, 2, C.ink);
    px(25, 5 + bob, 1, 1, C.pink);
  }

  if (dark) {
    px(21, 0 + bob, 1, 2, '#3a3a4a');
    px(23, 0 + bob, 3, 2, '#4d4d60');
    px(26, 0 + bob, 1, 2, state.sleeping ? '#6b6242' : '#ffe878');
    if (!state.sleeping) px(26, 0 + bob, 1, 1, '#fff6c8');
  }

  if (frame === 0) {
    px(19, 14 + bob, 4, 1, C.dark);
    px(20, 15 + bob, 3, 1, C.dark);
  } else {
    px(18, 14 + bob, 4, 1, C.dark);
    px(19, 15 + bob, 3, 1, C.dark);
  }
}

const state = {
  x: 60,
  dir: 1,
  speed: 0.55,
  frame: 0,
  barking: false,
  paused: false,
  sleeping: false,
  blink: false,
  target: null,
  score: 0,
};

const PHRASES = [
  'ARF!',
  "HI! I'M REGGIE",
  'CLEAR ALL 5 LEVELS!',
  'FISH = POINTS! ARF!',
  "MARC'S MY BEST FRIEND",
  'TRY THE KONAMI CODE...',
  'LANGCHAIN? YUM',
];

let speechTimer = null;
function say(text, ms = 2200) {
  speech.textContent = text;
  speech.classList.remove('hidden');
  clearTimeout(speechTimer);
  if (ms !== Infinity) speechTimer = setTimeout(() => speech.classList.add('hidden'), ms);
}

function bark() {
  state.barking = true;
  say(Math.random() < 0.5 ? 'ARF! ARF!' : PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  setTimeout(() => { state.barking = false; }, 450);
}

function hop() {
  wrap.classList.remove('hop');
  void wrap.offsetWidth;
  wrap.classList.add('hop');
}

wrap.addEventListener('click', () => {
  if (state.sleeping) return;
  bark();
  hop();
  addScore(1, wrap.offsetLeft + 60, window.innerHeight - 130, '+1');
});

function addScore(points, x, y, label) {
  state.score += points;
  scoreEl.textContent = String(state.score).padStart(3, '0');
  sparkleAt(x, y, label);
  if (state.score >= 50 && state.score - points < 50) say('50 FISH! HIRE MARC!', 3000);
}

function sparkleAt(x, y, label) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = label;
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

function maxX() { return Math.max(160, window.innerWidth - 260); }

function schedulePause() {
  setTimeout(() => {
    if (!state.target && !state.sleeping) {
      state.paused = true;
      if (Math.random() < 0.45) say(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      setTimeout(() => { state.paused = false; }, 1500 + Math.random() * 2500);
    }
    schedulePause();
  }, 5000 + Math.random() * 7000);
}
schedulePause();

let lastActive = Date.now();
function wake() {
  lastActive = Date.now();
  if (state.sleeping) {
    state.sleeping = false;
    state.paused = false;
    say("ARF?! I'M UP!", 2000);
  }
}
['pointerdown', 'keydown', 'scroll', 'mousemove'].forEach((ev) =>
  window.addEventListener(ev, wake, { passive: true })
);

setInterval(() => {
  if (!state.sleeping && Date.now() - lastActive > 15000) {
    state.sleeping = true;
    state.paused = true;
    say('Z z z . . .', Infinity);
  }
}, 1000);

setInterval(() => {
  if (!state.sleeping) {
    state.blink = true;
    setTimeout(() => { state.blink = false; }, 160);
  }
}, 3600);

let lastStep = 0;
function dropFootprint() {
  const f = document.createElement('div');
  f.className = 'footprint';
  f.style.left = (state.x + (state.dir === 1 ? 50 : 178)) + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1500);
}

let frameTimer = 0;
let last = performance.now();
function loop(now) {
  const dt = now - last;
  last = now;

  if ((!state.paused || state.target !== null) && !state.sleeping) {
    const speed = state.target !== null ? state.speed * 3 : state.speed;
    state.x += state.dir * speed * (dt / 8);

    if (state.target !== null) {
      if ((state.dir === 1 && state.x >= state.target) || (state.dir === -1 && state.x <= state.target)) {
        state.target = null;
        state.barking = true;
        setTimeout(() => { state.barking = false; }, 450);
        hop();
        say('NOM NOM!');
      }
    }

    if (state.x >= maxX()) { state.x = maxX(); state.dir = -1; }
    if (state.x <= 16) { state.x = 16; state.dir = 1; }

    if (Date.now() - lastStep > 340) {
      lastStep = Date.now();
      dropFootprint();
    }

    frameTimer += dt;
    if (frameTimer > 180) {
      frameTimer = 0;
      state.frame = state.frame === 0 ? 1 : 0;
    }
  }

  wrap.style.left = state.x + 'px';
  wrap.classList.toggle('flip', state.dir === -1);
  drawSeaLion(state.frame, state.barking);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

const FISH_SVG = `<svg viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <rect x="4" y="3" width="9" height="6" fill="#4aa8c9"/>
  <rect x="6" y="2" width="5" height="8" fill="#4aa8c9"/>
  <rect x="2" y="4" width="2" height="4" fill="#2e86ab"/>
  <rect x="0" y="2" width="2" height="3" fill="#2e86ab"/>
  <rect x="0" y="7" width="2" height="3" fill="#2e86ab"/>
  <rect x="13" y="4" width="2" height="4" fill="#4aa8c9"/>
  <rect x="11" y="4" width="1" height="1" fill="#1b1b2f"/>
  <rect x="6" y="9" width="3" height="1" fill="#2e86ab"/>
</svg>`;

function splashAt(x) {
  const s = document.createElement('div');
  s.className = 'splash';
  s.style.left = x + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 600);
}

function spawnFish() {
  if (document.querySelectorAll('.fish').length < 2) {
    const fish = document.createElement('div');
    fish.className = 'fish';
    fish.innerHTML = FISH_SVG;
    const startX = 60 + Math.random() * Math.max(120, window.innerWidth - 220);
    const d = startX > window.innerWidth - 280 ? -1 : 1;
    let x = startX;
    let y = 70;
    let vx = (45 + Math.random() * 55) * d;
    let vy = 235 + Math.random() * 70;
    const g = 430;
    let lastT = performance.now();
    let alive = true;

    fish.style.transform = `translate(${x}px, ${-y}px)`;
    splashAt(startX);

    function fly(now) {
      if (!alive) return;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      x += vx * dt;
      y += vy * dt;
      vy -= g * dt;
      if (y <= 62 && vy < 0) {
        alive = false;
        splashAt(x);
        fish.remove();
        return;
      }
      const a = Math.atan2(-vy, Math.abs(vx));
      fish.style.transform = `translate(${x}px, ${-y}px) scaleX(${d}) rotate(${a}rad)`;
      requestAnimationFrame(fly);
    }

    fish.addEventListener('click', () => {
      alive = false;
      addScore(10, x, window.innerHeight - y - 30, '+10');
      fish.remove();
      state.target = Math.min(maxX(), Math.max(16, x - 60));
      state.dir = state.target >= state.x ? 1 : -1;
      state.paused = false;
    });

    document.body.appendChild(fish);
    requestAnimationFrame(fly);
  }
  setTimeout(spawnFish, 4000 + Math.random() * 4000);
}
setTimeout(spawnFish, 3000);

const FACTS = [
  'FUN FACT: CTO JUST 1 YEAR AFTER GRADUATING!',
  'FUN FACT: HIS BOTS RENT CARS AND SELL VITAMINS!',
  'FUN FACT: GEMINI CERTIFIED EDUCATOR!',
  'FUN FACT: BUILT A QA FRAMEWORK FOR AI AGENTS!',
  'FUN FACT: RED-TEAMS AI FOR BREAKFAST!',
  'FUN FACT: SCRUM MASTER OF THE TEAM!',
  'FUN FACT: PAYMONGO + XENDIT PAYMENTS PRO!',
];

let factIndex = 0;
let lastFact = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastFact > 10000 && !state.sleeping) {
    lastFact = now;
    say(FACTS[factIndex++ % FACTS.length], 3400);
  }
}, { passive: true });

const CRAB_SVG = `<svg viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <rect x="5" y="0" width="1" height="2" fill="#c93f38"/>
  <rect x="10" y="0" width="1" height="2" fill="#c93f38"/>
  <rect x="3" y="2" width="10" height="5" fill="#e2554d"/>
  <rect x="0" y="1" width="3" height="3" fill="#c93f38"/>
  <rect x="13" y="1" width="3" height="3" fill="#c93f38"/>
  <rect x="4" y="2" width="2" height="2" fill="#ffffff"/>
  <rect x="5" y="3" width="1" height="1" fill="#1c1f22"/>
  <rect x="9" y="2" width="2" height="2" fill="#ffffff"/>
  <rect x="10" y="3" width="1" height="1" fill="#1c1f22"/>
  <rect x="3" y="7" width="2" height="2" fill="#c93f38"/>
  <rect x="6" y="7" width="1" height="2" fill="#c93f38"/>
  <rect x="9" y="7" width="1" height="2" fill="#c93f38"/>
  <rect x="11" y="7" width="2" height="2" fill="#c93f38"/>
</svg>`;

function spawnCrab() {
  const crab = document.createElement('div');
  crab.className = 'crab';
  crab.innerHTML = CRAB_SVG;
  crab.title = 'A wild crab!';
  document.body.appendChild(crab);
  const walk = crab.animate(
    [{ left: '-70px' }, { left: 'calc(100vw + 70px)' }],
    { duration: 16000 + Math.random() * 8000, easing: 'linear' }
  );
  walk.onfinish = () => crab.remove();
  crab.addEventListener('click', () => {
    addScore(2, crab.getBoundingClientRect().left, window.innerHeight - 90, '+2');
    crab.remove();
  });
  setTimeout(spawnCrab, 25000 + Math.random() * 20000);
}
setTimeout(spawnCrab, 9000);

setInterval(() => {
  const b = document.createElement('div');
  b.className = 'bubble';
  b.style.left = Math.random() * window.innerWidth + 'px';
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 2700);
}, 1400);

const TYPED_TEXT = '> REGGIE: Follow me, traveler! Clear all 5 levels...';
const typedEl = document.getElementById('typed');
let ti = 0;
(function type() {
  if (ti <= TYPED_TEXT.length) {
    typedEl.textContent = TYPED_TEXT.slice(0, ti);
    ti++;
    setTimeout(type, 55);
  }
})();

function toast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  t.addEventListener('animationend', () => t.remove());
}

const LEVEL_LINES = {
  1: 'THIS IS MARC! ARF!',
  2: 'HIS EPIC QUESTS!',
  3: 'SO MUCH XP! WOW!',
  4: 'SHINY TROPHIES!',
  5: 'FINAL BOSS: THE INBOX!',
};

const visited = new Set();
const levelObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const n = Number(entry.target.id.split('-')[1]);
    worldEl.textContent = `WORLD 1-${n}`;
    if (!visited.has(n)) {
      visited.add(n);
      if (n > 1) {
        toast(n === 5 ? 'FINAL LEVEL REACHED! +5' : `LEVEL ${n} REACHED! +5`);
        addScore(5, window.innerWidth / 2, 130, '+5');
      }
      say(LEVEL_LINES[n], 2600);
      if (visited.size === 5) {
        setTimeout(() => {
          toast('GAME COMPLETE! 100% — HIRE MARC!');
          say('YOU FOUND EVERYTHING! ARF!', 3200);
          for (let i = 0; i < 16; i++) {
            setTimeout(() => sparkleAt(
              40 + Math.random() * (window.innerWidth - 80),
              100 + Math.random() * (window.innerHeight - 300),
              '✦'
            ), i * 90);
          }
        }, 1600);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.level').forEach((el) => levelObserver.observe(el));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .level-story').forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

function countXp(fill) {
  const name = fill.closest('.skill').querySelector('.skill-name');
  let num = name.querySelector('.xp-num');
  if (!num) {
    num = document.createElement('span');
    num.className = 'xp-num';
    name.appendChild(num);
  }
  const target = Number(fill.dataset.xp);
  let v = 0;
  const t = setInterval(() => {
    v = Math.min(target, v + Math.ceil(target / 14));
    num.textContent = v + '%';
    if (v >= target) clearInterval(t);
  }, 85);
}

const xpObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.xp + '%';
      countXp(fill);
      xpObserver.unobserve(fill);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.xp-fill').forEach((el) => xpObserver.observe(el));

const starsBox = document.getElementById('stars');
for (let i = 0; i < 60; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 65 + '%';
  star.style.animationDelay = (Math.random() * 2.4) + 's';
  if (Math.random() < 0.3) { star.style.width = '2px'; star.style.height = '2px'; }
  starsBox.appendChild(star);
}

const themeBtn = document.getElementById('theme-toggle');

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeBtn.innerHTML = dark ? '&#9728; DAY' : '&#9790; NIGHT';
  themeBtn.setAttribute('aria-pressed', String(dark));
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  say(dark ? 'LIGHTS OUT! LAMP ON!' : 'GOOD MORNING! ARF!', 2600);
});

if (localStorage.getItem('theme') === 'dark') applyTheme(true);

const heroTitle = document.querySelector('.hero-title');
let li = 0;
heroTitle.innerHTML = heroTitle.innerHTML.split(/<br\s*\/?>/i).map((seg) =>
  [...seg].map((ch) => ch === ' ' ? ' ' : `<span class="wl" style="--i:${li++}">${ch}</span>`).join('')
).join('<br/>');

const sunEl = document.querySelector('.pixel-sun');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.body.style.setProperty('--qp', max > 0 ? (window.scrollY / max) * 100 : 0);
  if (sunEl) sunEl.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}, { passive: true });

document.querySelector('.beach').addEventListener('click', (e) => {
  if (e.target.closest('.palm') || e.target.closest('#sealion-wrap')) return;
  state.target = Math.min(maxX(), Math.max(16, e.clientX - 56));
  state.dir = state.target >= state.x ? 1 : -1;
  state.paused = false;
  say('ON MY WAY!', 1600);
});

const GULL_A = `<svg viewBox="0 0 16 9" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="52">
  <rect x="3" y="1" width="3" height="2" fill="#d8dde2"/>
  <rect x="8" y="1" width="3" height="2" fill="#d8dde2"/>
  <rect x="6" y="2" width="2" height="2" fill="#d8dde2"/>
  <rect x="4" y="4" width="7" height="2" fill="#f2f5f7"/>
  <rect x="10" y="3" width="2" height="2" fill="#f2f5f7"/>
  <rect x="11" y="3" width="1" height="1" fill="#1c1f22"/>
  <rect x="12" y="4" width="2" height="1" fill="#f5a623"/>
</svg>`;
const GULL_B = `<svg viewBox="0 0 16 9" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="52">
  <rect x="3" y="6" width="3" height="2" fill="#d8dde2"/>
  <rect x="8" y="6" width="3" height="2" fill="#d8dde2"/>
  <rect x="6" y="5" width="2" height="2" fill="#d8dde2"/>
  <rect x="4" y="4" width="7" height="2" fill="#f2f5f7"/>
  <rect x="10" y="3" width="2" height="2" fill="#f2f5f7"/>
  <rect x="11" y="3" width="1" height="1" fill="#1c1f22"/>
  <rect x="12" y="4" width="2" height="1" fill="#f5a623"/>
</svg>`;

function spawnGull() {
  if (!document.body.classList.contains('dark')) {
    const gull = document.createElement('div');
    gull.className = 'gull';
    gull.innerHTML = `<div class="gull-inner">${GULL_A}</div>`;
    gull.style.top = (70 + Math.random() * 180) + 'px';
    document.body.appendChild(gull);
    const inner = gull.firstChild;
    let flapFrame = false;
    const flap = setInterval(() => {
      flapFrame = !flapFrame;
      inner.innerHTML = flapFrame ? GULL_B : GULL_A;
    }, 200);
    const flight = gull.animate(
      [{ transform: 'translateX(-70px)' }, { transform: `translateX(${window.innerWidth + 70}px)` }],
      { duration: 13000 + Math.random() * 6000, easing: 'linear' }
    );
    const cleanup = () => { clearInterval(flap); gull.remove(); };
    flight.onfinish = cleanup;
    gull.addEventListener('click', (e) => {
      addScore(3, e.clientX, e.clientY - 30, 'SQUAWK! +3');
      cleanup();
    });
  }
  setTimeout(spawnGull, 12000 + Math.random() * 14000);
}
setTimeout(spawnGull, 5000);

for (let i = 0; i < 9; i++) {
  const fly = document.createElement('div');
  fly.className = 'firefly';
  fly.style.left = Math.random() * 100 + 'vw';
  fly.style.bottom = (80 + Math.random() * 140) + 'px';
  fly.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
  fly.style.setProperty('--dy', (Math.random() * -70 - 10) + 'px');
  fly.style.animationDelay = (Math.random() * 6) + 's';
  fly.style.animationDuration = (4 + Math.random() * 5) + 's';
  document.body.appendChild(fly);
}

function spawnShootingStar() {
  if (document.body.classList.contains('dark')) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.left = (40 + Math.random() * 60) + 'vw';
    s.style.top = (4 + Math.random() * 24) + 'vh';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
  setTimeout(spawnShootingStar, 7000 + Math.random() * 9000);
}
setTimeout(spawnShootingStar, 4000);

const palm = document.getElementById('palm');
let palmCooldown = 0;
palm.addEventListener('click', () => {
  if (Date.now() < palmCooldown) return;
  palmCooldown = Date.now() + 6000;
  palm.classList.remove('shake');
  void palm.offsetWidth;
  palm.classList.add('shake');
  setTimeout(() => {
    const rect = palm.getBoundingClientRect();
    const coco = document.createElement('div');
    coco.className = 'coconut';
    coco.style.left = (rect.left + 20 + Math.random() * 30) + 'px';
    coco.style.top = (rect.top + 20) + 'px';
    document.body.appendChild(coco);
    coco.animate(
      [
        { transform: 'translateY(0)' },
        { transform: `translateY(${window.innerHeight - rect.top - 60}px)`, easing: 'cubic-bezier(0.5, 0, 1, 1)' },
        { transform: `translateY(${window.innerHeight - rect.top - 84}px)` },
        { transform: `translateY(${window.innerHeight - rect.top - 60}px)` },
      ],
      { duration: 1100, fill: 'forwards' }
    );
    coco.addEventListener('click', (e) => {
      addScore(5, e.clientX, e.clientY - 30, 'COCO! +5');
      coco.remove();
    });
    setTimeout(() => coco.remove(), 8000);
  }, 450);
});

const avatarBox = document.querySelector('.avatar-box');
const avatarSpeech = document.getElementById('avatar-speech');

const MARC_LINES = [
  'HA HA! HI, PLAYER!',
  'HEHE! THANKS FOR VISITING!',
  "REGGIE'S MY CO-PILOT!",
  "LET'S BUILD WITH AI!",
  'HA HA! PRESS B+A!',
];

let avatarTimer = null;
function marcLaugh() {
  avatarBox.classList.remove('laugh');
  void avatarBox.offsetWidth;
  avatarBox.classList.add('laugh');

  avatarSpeech.textContent = MARC_LINES[Math.floor(Math.random() * MARC_LINES.length)];
  avatarSpeech.classList.remove('hidden');
  clearTimeout(avatarTimer);
  avatarTimer = setTimeout(() => avatarSpeech.classList.add('hidden'), 2400);

  const r = avatarBox.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const ha = document.createElement('div');
      ha.className = 'ha';
      ha.textContent = 'HA!';
      ha.style.left = (r.left + 20 + Math.random() * (r.width - 40)) + 'px';
      ha.style.top = (r.top + 10 + Math.random() * 40) + 'px';
      document.body.appendChild(ha);
      setTimeout(() => ha.remove(), 1100);
    }, i * 220);
  }
}

avatarBox.addEventListener('click', () => {
  marcLaugh();
  addScore(1, avatarBox.getBoundingClientRect().left + 60, avatarBox.getBoundingClientRect().top - 20, '+1');
});

setInterval(() => {
  const r = avatarBox.getBoundingClientRect();
  const inView = r.top < window.innerHeight - 100 && r.bottom > 100;
  if (inView && Math.random() < 0.55) marcLaugh();
}, 14000);

const KONAMI =['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', (e) => {
  ki = e.key === KONAMI[ki] ? ki + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (ki === KONAMI.length) {
    ki = 0;
    addScore(100, window.innerWidth / 2, window.innerHeight / 2, '+100 KONAMI!');
    say('CHEAT CODE! ARF!', 3000);
    document.querySelectorAll('.xp-fill').forEach((el) => {
      el.classList.add('boosted');
      el.style.width = '100%';
      const num = el.closest('.skill').querySelector('.xp-num');
      if (num) num.textContent = '100%';
    });
  }
});

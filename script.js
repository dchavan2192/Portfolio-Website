/* ═══════════════════════════════════════════════════
   DHRUV CHAVAN PORTFOLIO — script.js
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initSpotlight();
  initCursor();
  initNav();
  initActiveNav();
  initNavTransitions();
  initHamburger();
  initCanvas();
  initTypewriter();
  initStagger();
  initReveal();
  initScramble();
  initCounters();
  initTabs();
  initSkillBars();
  initTilt();
  initMagnetic();
  initParallax();
  drawAccuracyChart();
  drawPitchChart();
  drawRadarChart();
});

/* ─── LOADER ─── */
function initLoader() {
  const loader   = document.getElementById('loader');
  const terminal = document.getElementById('loaderTerminal');
  const bar      = document.getElementById('loaderBar');
  const pct      = document.getElementById('loaderPct');
  if (!loader) return;

  const steps = [
    { text: 'initializing dhruv.chavan_portfolio...',  tag: null,    pct: 10 },
    { text: 'importing torch, cv2, sklearn, pandas',   tag: 'ok',    pct: 28 },
    { text: 'loading model weights   [98.2% acc]',     tag: 'ok',    pct: 45 },
    { text: 'compiling CUDA kernels',                  tag: 'ok',    pct: 60 },
    { text: 'mounting neural canvas',                  tag: 'ok',    pct: 74 },
    { text: 'checking internship status',              tag: 'warn',  pct: 85, warn: 'seeking' },
    { text: 'boot complete — welcome',                 tag: null,    pct: 100 },
  ];

  let cursor = document.createElement('span');
  cursor.className = 'lt-cursor';
  terminal.appendChild(cursor);

  let delay = 0;

  steps.forEach((step, i) => {
    delay += i === 0 ? 200 : 380;
    setTimeout(() => {
      // remove cursor from end, add new line, re-append cursor
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

      const line = document.createElement('div');
      line.className = 'lt-line';

      const prompt = document.createElement('span');
      prompt.className = 'lt-prompt';
      prompt.textContent = '›';
      line.appendChild(prompt);

      const txt = document.createElement('span');
      txt.textContent = step.text;
      line.appendChild(txt);

      if (step.tag === 'ok') {
        const ok = document.createElement('span');
        ok.className = 'lt-ok';
        ok.textContent = '✓ ok';
        line.appendChild(ok);
      } else if (step.tag === 'warn') {
        const warn = document.createElement('span');
        warn.className = 'lt-warn';
        warn.textContent = '⚑ ' + step.warn;
        line.appendChild(warn);
      }

      terminal.appendChild(line);
      terminal.appendChild(cursor);

      // progress bar
      bar.style.width = step.pct + '%';
      pct.textContent = step.pct + '%';

      // last step — dismiss loader
      if (i === steps.length - 1) {
        setTimeout(() => {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          loader.classList.add('done');
        }, 650);
      }
    }, delay);
  });
}

/* ─── CUSTOM CURSOR ─── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function lerpRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  }
  lerpRing();

  const hoverTargets = 'a, button, .exp-tab, .bento-card, .rec-card, .model-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
}

/* ─── NAVBAR ─── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── HAMBURGER ─── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
  });
  menu.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

/* ─── NEURAL NETWORK CANVAS ─── */
function initCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Click burst
  const bursts = [];
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const bx = e.clientX - rect.left, by = e.clientY - rect.top;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      bursts.push({ x: bx, y: by, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life: 1, col: Math.random() > 0.5 ? '#60a5fa' : '#34d399' });
    }
  });

  /* Nodes */
  const COUNT = 65;
  const nodes = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r:  Math.random() * 1.8 + 0.4,
  }));

  /* Signal pulses */
  const pulses = [];
  const MAX_DIST = 170;

  setInterval(() => {
    if (pulses.length >= 12) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    const dx = a.x - b.x, dy = a.y - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < MAX_DIST) {
      pulses.push({
        from: a, to: b, t: 0,
        col: Math.random() > 0.5 ? '#60a5fa' : '#34d399',
      });
    }
  }, 250);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Update node positions */
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    /* Draw connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.strokeStyle = `rgba(96,165,250,${(1 - d / MAX_DIST) * 0.14})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* Draw nodes */
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96,165,250,0.55)';
      ctx.fill();
    });

    /* Draw pulses */
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += 0.018;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      const px = p.from.x + (p.to.x - p.from.x) * p.t;
      const py = p.from.y + (p.to.y - p.from.y) * p.t;
      const alpha = Math.sin(p.t * Math.PI);
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.col.replace(')', `,${alpha})`).replace('rgb', 'rgba').replace('##', '#');
      // simpler approach:
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.col;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Draw burst particles
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.94; b.vy *= 0.94;
      b.life -= 0.03;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      ctx.globalAlpha = b.life;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = b.col;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── TYPEWRITER ─── */
function initTypewriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;

  const roles = [
    'DataScientist(OSU)',
    'MLEngineer(BMW)',
    'Researcher(4_labs)',
    'Builder(impact=True)',
    'CNNArchitect(acc=0.982)',
  ];
  let rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const word = roles[rIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 800);
}

/* ─── SCROLL REVEAL ─── */
function initReveal() {
  /* Trigger hero items immediately */
  document.querySelectorAll('.reveal-hero').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
}

/* ─── STAGGER CHILDREN ─── */
function initStagger() {
  // For each stagger container, delay each child's reveal by index
  const containers = [
    { selector: '.bento',      child: '.bento-card',  base: 0,    step: 80  },
    { selector: '.rec-grid',   child: '.rec-card',    base: 0,    step: 90  },
    { selector: '.awards-grid',child: '.award-card',  base: 0,    step: 100 },
    { selector: '.ep-list',    child: 'li',           base: 0,    step: 70  },
    { selector: '.seeking-chips', child: '.sk-chip',  base: 0,    step: 60  },
  ];

  containers.forEach(({ selector, child, base, step }) => {
    document.querySelectorAll(selector).forEach(container => {
      container.querySelectorAll(child).forEach((el, i) => {
        el.classList.add('reveal-scale');
        el.style.transitionDelay = `${base + i * step}ms`;
      });
    });
  });

  // Paper cards slide in from left
  document.querySelectorAll('.paper-card').forEach((el, i) => {
    el.classList.add('reveal-left');
    el.style.transitionDelay = `${i * 100}ms`;
  });

  // Exp tabs slide in from left
  document.querySelectorAll('.exp-tab').forEach((el, i) => {
    el.classList.add('reveal-left');
    el.style.transitionDelay = `${i * 70}ms`;
  });

  // About text elements slide from right
  document.querySelectorAll('.about-text .reveal').forEach((el, i) => {
    el.classList.remove('reveal');
    el.classList.add('reveal-right');
    el.style.transitionDelay = `${i * 80}ms`;
  });
}

/* ─── NUMBER COUNTERS ─── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ─── EXPERIENCE TABS ─── */
function initTabs() {
  const tabs   = document.querySelectorAll('.exp-tab');
  const panels = document.querySelectorAll('.exp-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.exp-panel[data-panel="${idx}"]`)?.classList.add('active');
    });
  });
}

/* ─── ACCURACY TRAINING CURVE ─── */
function drawAccuracyChart() {
  const svg = document.getElementById('trainChart');
  if (!svg) return;

  const W = 500, H = 200;
  const pl = 46, pr = 60, pt = 16, pb = 36;
  const cW = W - pl - pr, cH = H - pt - pb;
  const yMin = 0.55, yMax = 1.0;
  const N = 40;

  // Deterministic pseudo-random (seeded)
  let seed = 137;
  function rng() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const train = [0.623], val = [0.581];
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    train.push(Math.min(0.623 + 0.374 * (1 - Math.exp(-5.5 * t)) + (rng() - 0.5) * 0.016, 0.999));
    val.push  (Math.min(0.581 + 0.405 * (1 - Math.exp(-4.8 * t)) + (rng() - 0.5) * 0.022, 0.988));
  }
  train[N] = 0.991; val[N] = 0.982;

  const sx = i  => pl + (i / N)  * cW;
  const sy = v  => pt + cH - ((v - yMin) / (yMax - yMin)) * cH;

  let h = '';

  // Y grid + labels
  [0.6, 0.7, 0.8, 0.9, 1.0].forEach(v => {
    const y = sy(v);
    h += `<line x1="${pl}" y1="${y}" x2="${W - pr}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    h += `<text x="${pl - 6}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono,monospace">${(v * 100).toFixed(0)}%</text>`;
  });

  // X ticks
  [0, 10, 20, 30, 40].forEach(i => {
    const x = sx(i);
    h += `<text x="${x}" y="${pt + cH + 18}" text-anchor="middle" fill="#64748b" font-size="10" font-family="JetBrains Mono,monospace">${i}</text>`;
  });
  h += `<text x="${pl + cW / 2}" y="${H - 1}" text-anchor="middle" fill="#475569" font-size="9" font-family="JetBrains Mono,monospace">epoch</text>`;

  // Smooth cubic bezier path builder
  function buildPath(data) {
    let d = `M ${sx(0)} ${sy(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      const cpx = (sx(i - 1) + sx(i)) / 2;
      d += ` C ${cpx} ${sy(data[i - 1])}, ${cpx} ${sy(data[i])}, ${sx(i)} ${sy(data[i])}`;
    }
    return d;
  }

  const tp = buildPath(train), vp = buildPath(val);
  const base = `L ${sx(N)} ${pt + cH} L ${pl} ${pt + cH} Z`;

  // Area fills
  h += `<path d="${tp} ${base}" fill="rgba(96,165,250,0.07)"/>`;
  h += `<path d="${vp} ${base}" fill="rgba(52,211,153,0.06)"/>`;

  // Lines
  h += `<path id="cLineT" d="${tp}" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `<path id="cLineV" d="${vp}" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

  // End dots + labels
  h += `<circle cx="${sx(N)}" cy="${sy(0.991)}" r="4" fill="#60a5fa"/>`;
  h += `<circle cx="${sx(N)}" cy="${sy(0.982)}" r="4" fill="#34d399"/>`;
  h += `<text x="${sx(N) + 8}" y="${sy(0.991) + 4}"  fill="#60a5fa" font-size="10" font-family="JetBrains Mono,monospace" font-weight="600">99.1%</text>`;
  h += `<text x="${sx(N) + 8}" y="${sy(0.982) + 14}" fill="#34d399" font-size="10" font-family="JetBrains Mono,monospace" font-weight="600">98.2%</text>`;

  svg.innerHTML = h;

  // Stroke-dashoffset animation on scroll
  const lines = ['cLineT', 'cLineV'];
  lines.forEach(id => {
    const path = svg.querySelector(`#${id}`);
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'none';
  });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    lines.forEach((id, i) => {
      setTimeout(() => {
        const path = svg.querySelector(`#${id}`);
        if (!path) return;
        path.style.transition = `stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1) ${i * 0.2}s`;
        path.style.strokeDashoffset = '0';
      }, 200);
    });
    obs.disconnect();
  }, { threshold: 0.3 });
  obs.observe(svg);
}

/* ─── IMU TEST STAND PITCH CHART ─── */
function drawPitchChart() {
  const svg = document.getElementById('pitchChart');
  if (!svg) return;

  const W = 600, H = 200;
  const pl = 46, pr = 24, pt = 16, pb = 36;
  const cW = W - pl - pr, cH = H - pt - pb;

  // Downsampled real data: [elapsed_s, imu_pitch, enc_pitch]
  const data = [
    [0.000,-0.105,0.090],[0.198,-0.131,0.267],[0.354,-0.153,0.000],
    [0.552,-0.413,-0.126],[0.756,-0.312,-0.200],[0.954,-0.575,-0.225],
    [1.152,-0.501,-0.300],[1.356,-0.403,-0.300],[1.560,-0.561,-0.427],
    [1.758,-0.474,-0.400],[1.950,-0.411,-0.400],[2.154,-0.403,-0.400],
    [2.358,-0.372,-0.400],[2.556,-0.287,-0.400],[2.760,-0.237,-0.300],
    [2.952,-0.240,-0.200],[3.150,-0.255,-0.200],[3.360,-0.190,-0.300],
    [3.558,-0.179,-0.300],[3.762,-0.213,-0.300],[3.954,-0.265,-0.400],
    [4.152,-0.664,-0.590],[4.398,-0.994,-2.732],[4.596,-4.380,-7.475],
    [4.764,-10.532,-12.707],[4.956,-16.703,-18.536],[5.160,-23.522,-25.617],
    [5.352,-30.114,-31.796],[5.550,-36.751,-37.526],[5.754,-41.137,-41.565],
    [5.958,-42.502,-42.002],[6.156,-38.027,-36.465],[6.354,-32.045,-31.141],
    [6.552,-26.273,-24.983],[6.750,-18.534,-16.778],[6.960,-9.833,-8.599],
    [7.158,-1.496,0.315],[7.350,6.101,6.626],[7.554,13.490,15.374],
    [7.752,20.948,22.156],[7.956,26.832,26.500],[8.160,31.184,31.366],
    [8.352,33.254,32.422],[8.550,31.688,29.167],[8.754,28.269,25.156],
    [9.000,22.388,16.417],[9.198,15.303,9.219],[9.360,8.755,4.181],
    [9.558,2.914,-1.284],[9.756,-2.529,-6.323],[9.954,-8.667,-11.849],
    [10.152,-14.589,-16.859],[10.356,-20.638,-23.596],[10.560,-25.283,-27.541],
    [10.752,-31.113,-33.825],[10.950,-35.971,-37.110],[11.154,-39.378,-40.277],
    [11.358,-39.048,-38.599],[11.556,-34.479,-33.856],[11.754,-28.501,-27.713],
    [11.952,-21.745,-20.701],[12.150,-13.777,-12.782],[12.360,-7.153,-6.633],
    [12.558,-1.554,-0.469],[12.756,5.663,7.372],[12.954,14.356,16.399],
    [13.152,20.482,22.200],[13.398,24.751,26.015],[13.596,26.133,24.213],
    [13.752,21.582,19.623],[13.956,14.194,11.683],[14.160,7.286,5.193],
    [14.352,3.081,1.797],[14.550,0.189,-1.107],[14.754,-2.702,-3.425],
    [14.958,-3.264,-4.626],[15.156,-8.966,-10.209],[15.360,-13.771,-15.025],
    [15.552,-19.090,-19.656],[15.750,-20.445,-19.155],[15.960,-15.951,-13.491],
    [16.158,-6.818,-2.247],[16.356,2.464,5.045],[16.554,6.208,8.656],
    [16.752,9.731,11.842],[16.998,13.412,16.299],[17.196,15.228,16.654],
    [17.358,15.812,17.445],[17.550,16.935,18.791],[17.754,19.441,21.058],
    [17.952,21.039,22.835],
  ];

  const tMin = 0, tMax = 17.952;
  const yMin = -46, yMax = 38;

  const sx = t => pl + ((t - tMin) / (tMax - tMin)) * cW;
  const sy = v => pt + ((yMax - v) / (yMax - yMin)) * cH;

  let h = '';

  // Y grid + labels
  [-40,-20,0,20].forEach(v => {
    const y = sy(v);
    h += `<line x1="${pl}" y1="${y}" x2="${W - pr}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    h += `<text x="${pl - 5}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono,monospace">${v}°</text>`;
  });

  // Zero line slightly highlighted
  h += `<line x1="${pl}" y1="${sy(0)}" x2="${W - pr}" y2="${sy(0)}" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4,4"/>`;

  // X axis labels
  [0,3,6,9,12,15,18].forEach(t => {
    h += `<text x="${sx(t)}" y="${pt + cH + 18}" text-anchor="middle" fill="#64748b" font-size="10" font-family="JetBrains Mono,monospace">${t}s</text>`;
  });

  // Path builder (cubic bezier)
  function buildPath(pts) {
    let d = `M ${sx(pts[0][0])} ${sy(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx = (sx(pts[i-1][0]) + sx(pts[i][0])) / 2;
      d += ` C ${cpx} ${sy(pts[i-1][1])}, ${cpx} ${sy(pts[i][1])}, ${sx(pts[i][0])} ${sy(pts[i][1])}`;
    }
    return d;
  }

  const imuPts = data.map(d => [d[0], d[1]]);
  const encPts = data.map(d => [d[0], d[2]]);
  const imuPath = buildPath(imuPts);
  const encPath = buildPath(encPts);

  // Area fill under encoder (ground truth)
  const base = `L ${sx(tMax)} ${sy(0)} L ${sx(tMin)} ${sy(0)} Z`;
  h += `<path d="${encPath} ${base}" fill="rgba(52,211,153,0.05)"/>`;
  h += `<path d="${imuPath} ${base}" fill="rgba(96,165,250,0.05)"/>`;

  // Lines
  h += `<path id="pitchEnc" d="${encPath}" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `<path id="pitchIMU" d="${imuPath}" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  svg.innerHTML = h;

  // Animate stroke-dashoffset on scroll
  ['pitchEnc', 'pitchIMU'].forEach(id => {
    const path = svg.querySelector(`#${id}`);
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'none';
  });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    ['pitchEnc', 'pitchIMU'].forEach((id, i) => {
      setTimeout(() => {
        const path = svg.querySelector(`#${id}`);
        if (!path) return;
        path.style.transition = `stroke-dashoffset 2.2s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s`;
        path.style.strokeDashoffset = '0';
      }, 200);
    });
    obs.disconnect();
  }, { threshold: 0.3 });
  obs.observe(svg);
}

/* ─── RADAR / SPIDER CHART ─── */
function drawRadarChart() {
  const svg = document.getElementById('radarChart');
  if (!svg) return;

  const cx = 160, cy = 155, R = 100;
  const axes = [
    { label: 'Python',    val: 0.95 },
    { label: 'ML / AI',   val: 0.90 },
    { label: 'SQL/Data',  val: 0.87 },
    { label: 'Stats',     val: 0.83 },
    { label: 'Research',  val: 0.86 },
    { label: 'Embedded',  val: 0.76 },
  ];
  const N = axes.length;

  const angle = i => (i / N) * 2 * Math.PI - Math.PI / 2;
  const pt    = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const poly  = (r, indices) => (indices || axes.map((_, i) => i)).map(i => pt(i, r).join(',')).join(' ');

  let h = '';

  // Grid rings (5 levels)
  for (let lv = 1; lv <= 5; lv++) {
    const r = R * lv / 5;
    const op = lv === 5 ? 0.12 : 0.06;
    h += `<polygon points="${poly(r)}" fill="none" stroke="rgba(255,255,255,${op})" stroke-width="1"/>`;
  }

  // Axis spokes
  axes.forEach((_, i) => {
    const [x, y] = pt(i, R);
    h += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  });

  // Data polygon (starts scaled to 0 via CSS transform)
  const dataPoly = axes.map((ax, i) => pt(i, R * ax.val).join(',')).join(' ');
  h += `<polygon id="radarPoly" points="${dataPoly}"
    fill="rgba(96,165,250,0.14)" stroke="#60a5fa" stroke-width="2"
    stroke-linejoin="round" style="transform-origin:${cx}px ${cy}px; transform:scale(0);"/>`;

  // Data point dots
  axes.forEach((ax, i) => {
    const [x, y] = pt(i, R * ax.val);
    h += `<circle cx="${x}" cy="${y}" r="4" fill="#60a5fa" stroke="#07090f" stroke-width="2"
      style="transform-origin:${cx}px ${cy}px; transform:scale(0); transition:transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + i * 0.07}s"/>`;
  });

  // Axis labels (outside)
  axes.forEach((ax, i) => {
    const [x, y] = pt(i, R + 22);
    const anchor = x < cx - 4 ? 'end' : x > cx + 4 ? 'start' : 'middle';
    h += `<text x="${x}" y="${y + 4}" text-anchor="${anchor}" fill="#94a3b8"
      font-size="11" font-family="JetBrains Mono,monospace">${ax.label}</text>`;
  });

  // Percentage labels near each dot
  axes.forEach((ax, i) => {
    const offset = 14;
    const [x, y] = pt(i, R * ax.val + offset);
    const anchor = x < cx - 4 ? 'end' : x > cx + 4 ? 'start' : 'middle';
    h += `<text x="${x}" y="${y + 4}" text-anchor="${anchor}" fill="#60a5fa"
      font-size="9" font-family="JetBrains Mono,monospace" font-weight="700"
      style="transform-origin:${cx}px ${cy}px; transform:scale(0); transition:transform 0.5s var(--ease) ${0.7 + i * 0.07}s">
      ${Math.round(ax.val * 100)}%</text>`;
  });

  svg.innerHTML = h;

  // Animate on scroll
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    setTimeout(() => {
      const poly = svg.querySelector('#radarPoly');
      if (poly) poly.style.transition = 'transform 1s cubic-bezier(0.34,1.56,0.64,1)';
      if (poly) poly.style.transform  = 'scale(1)';
      svg.querySelectorAll('circle, text[style*="scale(0)"]').forEach(el => {
        el.style.transform = 'scale(1)';
      });
    }, 200);
    obs.disconnect();
  }, { threshold: 0.3 });
  obs.observe(svg);
}

/* ─── SKILL BARS (kept for legacy, no-op if no bars exist) ─── */
function initSkillBars() {
  document.querySelectorAll('.sb-fill').forEach(fill => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, 150);
      obs.unobserve(fill);
    }, { threshold: 0.3 });
    obs.observe(fill);
  });
}

/* ─── SCROLL PROGRESS ─── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
  }, { passive: true });
}

/* ─── SPOTLIGHT GLOW ─── */
function initSpotlight() {
  const el = document.getElementById('spotlight');
  if (!el) return;
  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ─── NAV CLICK TRANSITIONS ─── */
function initNavTransitions() {
  document.querySelectorAll('.nav-links a, .mm-link').forEach(link => {
    link.addEventListener('click', function () {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      // Ripple on the clicked link
      const ripple = document.createElement('span');
      ripple.className = 'nav-ripple';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);

      // Glow pulse on the target section
      const target = document.querySelector(href);
      if (target) {
        target.classList.remove('section-arrive');
        void target.offsetWidth; // reflow to restart animation
        target.classList.add('section-arrive');
        target.addEventListener('animationend', () => target.classList.remove('section-arrive'), { once: true });
      }
    });
  });
}

/* ─── ACTIVE NAV ─── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
}

/* ─── TEXT SCRAMBLE on eyebrows ─── */
function initScramble() {
  const CHARS = '01アイウエオカキABCDEF@#%&?!XYZ0123456789';

  function scramble(el) {
    const original = el.textContent;
    let frame = 0;
    const total = original.length * 3;
    const iv = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ' || ch === '/') return ch;
        if (i <= frame / 3) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame > total) { el.textContent = original; clearInterval(iv); }
    }, 28);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      scramble(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.eyebrow').forEach(el => obs.observe(el));
}

/* ─── 3D CARD TILT ─── */
function initTilt() {
  const MAX = 10;
  const cards = document.querySelectorAll('.bento-card, .model-card, .rec-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
    });
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      const rx  = (-y * MAX).toFixed(2);
      const ry  = ( x * MAX).toFixed(2);
      const gx  = (50 + x * 40).toFixed(1);
      const gy  = (50 + y * 40).toFixed(1);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.04), transparent 60%), var(--card)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, background 0.4s';
      card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.background = '';
    });
  });
}

/* ─── MAGNETIC BUTTONS ─── */
function initMagnetic() {
  document.querySelectorAll('.btn-fill, .btn-outline').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.15s ease, box-shadow 0.2s';
    });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left - r.width  / 2) * 0.28).toFixed(1);
      const y = ((e.clientY - r.top  - r.height / 2) * 0.28).toFixed(1);
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = 'translate(0,0)';
    });
  });
}

/* ─── HERO MOUSE PARALLAX ─── */
function initParallax() {
  const heroName  = document.querySelector('.hero-name');
  const heroPhoto = document.querySelector('.hero-photo');
  const heroDesc  = document.querySelector('.hero-desc');

  document.addEventListener('mousemove', e => {
    if (window.scrollY > window.innerHeight * 0.5) return;
    const x = (e.clientX / window.innerWidth  - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    if (heroName)  heroName.style.transform  = `translate(${x * 14}px, ${y * 8}px)`;
    if (heroPhoto) heroPhoto.style.transform = `translate(${-x * 22}px, ${-y * 14}px)`;
    if (heroDesc)  heroDesc.style.transform  = `translate(${x * 6}px, ${y * 4}px)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    [heroName, heroPhoto, heroDesc].forEach(el => {
      if (!el) return;
      el.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1)';
      el.style.transform  = 'translate(0,0)';
    });
  });
}

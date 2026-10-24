// Fond du hero : « du bruit au signal ».
// Des particules entrent à gauche en désordre, puis s'alignent en voies
// parallèles à droite, comme des données brutes qui deviennent exploitables.
// Près du curseur, les points s'allument et se relient.
// Chargé après le rendu ; mis en pause hors écran ou onglet masqué ;
// version allégée sur mobile ; jamais chargé en mouvement réduit.

(function(){
  'use strict';
  const canvas = document.querySelector('.hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const hero = canvas.parentElement;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

  let W = 0, H = 0, particles = [], lanes = [], running = false, raf = 0, t0 = performance.now();
  const mouse = { x: -9999, y: -9999, active: false };
  let accent = '198,243,90', base = '140,150,180';

  function readColors(){
    const light = document.documentElement.dataset.theme === 'light';
    accent = light ? '77,107,0' : '198,243,90';
    base = light ? '74,84,112' : '140,150,180';
  }

  function resize(){
    const r = hero.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Voies ordonnées à droite, centrées un peu sous le milieu
    const laneCount = mobile ? 7 : 11;
    const gap = Math.min(22, H / (laneCount + 6));
    const cy = H * (mobile ? 0.82 : 0.56);
    lanes = Array.from({ length: laneCount }, (_, i) => cy + (i - (laneCount - 1) / 2) * gap);

    const count = mobile ? 46 : Math.min(150, Math.round(W * H / 11000));
    particles = Array.from({ length: count }, () => spawn(true));
  }

  function spawn(anywhere){
    return {
      x: anywhere ? Math.random() * W : -10 - Math.random() * 80,
      y0: Math.random() * H,                       // position « bruitée »
      lane: Math.floor(Math.random() * lanes.length),
      speed: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      r: 0.8 + Math.random() * 1.4,
      hot: Math.random() < 0.12                    // quelques points en couleur d'accent
    };
  }

  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function frame(now){
    const time = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    const pts = [];
    for(const p of particles){
      p.x += p.speed * (mobile ? 0.8 : 1);
      if(p.x > W + 20) Object.assign(p, spawn(false));

      // Progression bruit → signal selon la position horizontale
      const k = smooth(W * 0.38, W * 0.78, p.x);
      const noise = Math.sin(time * 0.9 + p.phase + p.x * 0.012) * 26 * (1 - k);
      let y = p.y0 * (1 - k) + lanes[p.lane] * k + noise;

      // Répulsion douce autour du curseur
      if(mouse.active){
        const dx = p.x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if(d2 < 16000){ y += (dy / Math.sqrt(d2 + 1)) * (1 - d2 / 16000) * 18; }
      }

      const alpha = 0.18 + 0.62 * k;               // discret à gauche, sous le texte
      pts.push({ x: p.x, y, k, alpha, p });

      if(k > 0.6){                                  // traînée sur la partie ordonnée
        ctx.strokeStyle = `rgba(${p.hot ? accent : base},${alpha * 0.45})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x - 18 * k, y); ctx.lineTo(p.x, y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${p.hot || k > 0.92 ? accent : base},${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, Math.PI * 2); ctx.fill();
    }

    // Liens vers le curseur
    if(mouse.active){
      for(const q of pts){
        const dx = q.x - mouse.x, dy = q.y - mouse.y, d = Math.hypot(dx, dy);
        if(d < 150){
          const a = (1 - d / 150) * 0.5;
          ctx.strokeStyle = `rgba(${accent},${a})`;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          ctx.fillStyle = `rgba(${accent},${Math.min(1, a * 2)})`;
          ctx.beginPath(); ctx.arc(q.x, q.y, q.p.r + 1, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    if(running) raf = requestAnimationFrame(frame);
  }

  function start(){ if(!running){ running = true; raf = requestAnimationFrame(frame); } }
  function stop(){ running = false; cancelAnimationFrame(raf); }

  readColors();
  resize();
  canvas.classList.add('is-ready');

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { document.hidden || !visible ? stop() : start(); });
  document.addEventListener('themechange', readColors);

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });

  if(!mobile){
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.active = false; });
  }
})();

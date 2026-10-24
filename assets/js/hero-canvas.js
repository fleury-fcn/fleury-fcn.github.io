// Fond du hero : réseau de nœuds discret.
// Les nœuds dérivent lentement et se relient quand ils sont proches ;
// autour du curseur, ils s'allument et se relient à lui.
// Chargé après le rendu ; pause hors écran ou onglet masqué ;
// version réduite sur mobile ; jamais chargé en mouvement réduit.

(function(){
  'use strict';
  const canvas = document.querySelector('.hx-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
  const LINK = mobile ? 90 : 130;          // distance max entre deux nœuds reliés
  const MOUSE = 170;                        // rayon d'influence du curseur

  let W = 0, H = 0, nodes = [], running = false, raf = 0;
  const mouse = { x: -9999, y: -9999, on: false };
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
    const count = mobile ? 28 : Math.min(90, Math.round(W * H / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: 0.9 + Math.random() * 1.3
    }));
  }

  function frame(){
    ctx.clearRect(0, 0, W, H);
    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > W) n.vx *= -1;
      if(n.y < 0 || n.y > H) n.vy *= -1;
      if(mouse.on){                          // légère attraction vers le curseur
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d2 = dx * dx + dy * dy;
        if(d2 < MOUSE * MOUSE){ n.x += dx * 0.004; n.y += dy * 0.004; }
      }
    }
    ctx.lineWidth = 1;
    for(let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      for(let j = i + 1; j < nodes.length; j++){
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if(d < LINK){
          ctx.strokeStyle = `rgba(${base},${(1 - d / LINK) * 0.16})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      let alpha = 0.35, color = base;
      if(mouse.on){
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if(d < MOUSE){
          const k = 1 - d / MOUSE;
          ctx.strokeStyle = `rgba(${accent},${k * 0.45})`;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          alpha = 0.35 + k * 0.65; color = accent;
        }
      }
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    if(running) raf = requestAnimationFrame(frame);
  }

  const start = () => { if(!running){ running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  readColors(); resize();
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
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.on = false; });
  }
})();

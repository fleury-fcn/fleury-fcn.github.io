// Animations : chargé par main.js uniquement si le mouvement est autorisé.
// Dépend de gsap, ScrollTrigger, SplitText (+ Lenis sur pointeur fin).
// Tout est en transform/opacity ; le contenu est déjà dans le DOM.

(function(){
  'use strict';
  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------------- Scroll fluide (Lenis, ordinateur uniquement) ---------------- */
  let lenis = null;
  if(finePointer && window.Lenis){
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('panel', e => e.detail ? lenis.stop() : lenis.start());
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        const target = id.length > 1 && document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: id === '#accueil' ? 0 : -76, duration: 1.2 });
        history.replaceState(history.state, '', id);
      });
    });
  }

  /* ---------------- Barre de progression ---------------- */
  gsap.to('.progress span', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });

  // Le hero s'estompe légèrement en quittant l'écran (parallaxe)
  gsap.to('.hx-grid', {
    yPercent: -6, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: '.hx', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------------- Titres de section : lignes masquées ---------------- */
  gsap.utils.toArray('.reveal-title').forEach(el => {
    gsap.set(el, { opacity: 1 });
    const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
    gsap.from(s.lines, {
      yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  /* ---------------- Révélations progressives ---------------- */
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true })
  });

  /* ---------------- Parallaxe maîtrisée ---------------- */
  if(!mobile){
    gsap.utils.toArray('.parallax img').forEach(img => {
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.closest('.parallax'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------------- Compteurs animés ---------------- */
  gsap.utils.toArray('.count').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const final = el.textContent;
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(state, {
        v: target, duration: 1.8, ease: 'power2.out',
        onUpdate: () => {
          el.textContent = state.v.toLocaleString(root.lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        },
        onComplete: () => { el.textContent = el.dataset.i18n ? el.textContent : final; }
      })
    });
  });

  // Courbe de croissance de la grande tuile
  const spark = document.querySelector('.spark path');
  if(spark){
    const len = spark.getTotalLength();
    gsap.fromTo(spark, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 2, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.kpis', start: 'top 80%', once: true }
    });
  }

  /* ---------------- Halal Assistant : démo de conversation ---------------- */
  (function chatDemo(){
    const chat = document.querySelector('.chat');
    if(!chat) return;
    const q = chat.querySelector('.msg-user');
    const typing = chat.querySelector('.msg-typing');
    const bot = chat.querySelector('.msg-bot');
    const items = [...bot.querySelectorAll('li')];
    chat.classList.add('is-armed');

    const typeText = (el, text, speed) => new Promise(resolve => {
      el.textContent = ''; el.classList.add('is-typing');
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, ++i);
        if(i < text.length) setTimeout(tick, speed); else { el.classList.remove('is-typing'); resolve(); }
      };
      tick();
    });
    const wait = ms => new Promise(r => setTimeout(r, ms));

    async function play(){
      const text = q.textContent;
      q.classList.add('is-in');
      await typeText(q, text, mobile ? 18 : 28);
      await wait(250);
      typing.classList.add('is-in');
      await wait(1100);
      typing.classList.remove('is-in');
      bot.classList.add('is-in');
      for(const li of items){ await wait(380); li.classList.add('is-in'); }
    }
    ScrollTrigger.create({ trigger: chat, start: 'top 70%', once: true, onEnter: play });
  })();

  /* ---------------- Schéma d'architecture ---------------- */
  const arch = document.querySelector('.arch');
  if(arch){
    gsap.from('.arch .node', {
      x: -24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: arch, start: 'top 75%', once: true }
    });
    ScrollTrigger.create({
      trigger: arch, start: 'top bottom', end: 'bottom top',
      onToggle: self => arch.classList.toggle('is-paused', !self.isActive)
    });
  }

  /* ---------------- Barres de la base de données ---------------- */
  gsap.utils.toArray('.bar').forEach(bar => {
    gsap.from(bar.querySelectorAll('.seg'), {
      scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: bar, start: 'top 85%', once: true }
    });
  });

  gsap.from('.sync-bar i', {
    scaleX: 0, duration: 1.6, ease: 'expo.out', stagger: 0.25,
    scrollTrigger: { trigger: '.tile-sync', start: 'top 85%', once: true }
  });

  /* ---------------- Frise chronologique ---------------- */
  gsap.utils.toArray('.timeline').forEach(line => {
    line.style.setProperty('--progress', 0);
    ScrollTrigger.create({
      trigger: line, start: 'top 70%', end: 'bottom 60%', scrub: true,
      onUpdate: self => line.style.setProperty('--progress', self.progress.toFixed(3))
    });
    line.querySelectorAll('.tl').forEach(item => {
      ScrollTrigger.create({
        trigger: item, start: 'top 65%',
        onToggle: self => item.classList.toggle('is-lit', self.isActive || self.progress === 1),
        onLeave: () => item.classList.add('is-lit'),
        onEnterBack: () => item.classList.add('is-lit'),
        onLeaveBack: () => item.classList.remove('is-lit')
      });
    });
  });

  /* ---------------- Curseur personnalisé + boutons aimantés ---------------- */
  if(finePointer){
    const cursor = document.querySelector('.cursor');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', e => {
      xTo(e.clientX); yTo(e.clientY);
      cursor.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerover', e => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .card'));
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
      const bx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      const by = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        bx((e.clientX - r.left - r.width / 2) * 0.25);
        by((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { bx(0); by(0); });
    });
  }

  // Les polices peuvent changer les hauteurs : recalcule après chargement
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  root.classList.add('motion-ready');
})();

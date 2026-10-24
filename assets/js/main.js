// Portfolio — Fleury Niyokwizera
// Script principal, toujours chargé : navigation, thème, langue, contact,
// stats GitHub, panneau de détail des projets. Les animations lourdes
// (GSAP, Lenis, canvas) sont chargées à la demande par loadMotion().

(function(){
  'use strict';

  const root = document.documentElement;
  const GH_USER = 'fleury-fcn';
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dicts = {};
  const idle = (fn, ms) => window.requestIdleCallback ? requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, ms);

  /* ---------------------------------------------------------------
     En-tête : état au scroll, menu mobile, lien actif
     --------------------------------------------------------------- */
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const closeMenu = () => { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('.menu-links a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  const navLinks = [...document.querySelectorAll('.menu-links a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('is-active', on);
        on ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach(s => spy.observe(s));

  /* ---------------------------------------------------------------
     Thème : sombre par défaut, clair au choix (mémorisé)
     --------------------------------------------------------------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme){
    if(theme === 'light') root.dataset.theme = 'light'; else delete root.dataset.theme;
    themeMeta.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#060a18');
    document.dispatchEvent(new CustomEvent('themechange'));
  }
  applyTheme(root.dataset.theme);
  document.querySelector('.theme-btn').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try{ localStorage.setItem('fn-theme', next); }catch(e){}
  });

  /* ---------------------------------------------------------------
     Langue : pages statiques /  et /en/, bascule instantanée en JS
     --------------------------------------------------------------- */
  const pageLang = root.lang === 'en' ? 'en' : 'fr';
  let currentLang = pageLang;
  const pathFor = lang => lang === 'en' ? '/en/' : '/';

  async function getDict(lang){
    if(!dicts[lang]){
      const res = await fetch(`/assets/i18n/${lang}.json`);
      if(!res.ok) throw new Error('i18n ' + res.status);
      dicts[lang] = await res.json();
    }
    return dicts[lang];
  }

  function applyDict(dict){
    root.lang = dict['meta.lang'];
    document.title = dict['meta.title'];
    // Le document et le contenu des <template> (échanges du hero)
    const scopes = [document, ...[...document.querySelectorAll('template')].map(t => t.content)];
    scopes.forEach(scope => scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if(!(key in dict)) return;
      if(key.endsWith('.html')) el.innerHTML = dict[key]; else el.textContent = dict[key];
    }));
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [name, key] = pair.split('=');
        if(key in dict) el.setAttribute(name, dict[key]);
      });
    });
  }

  async function setLang(lang, { push = true } = {}){
    if(lang === currentLang) return;
    try{
      const dict = await getDict(lang);
      const swap = () => applyDict(dict);
      if(document.startViewTransition && !reducedMotion) await document.startViewTransition(swap).updateCallbackDone;
      else swap();
      currentLang = lang;
      if(push) history.pushState({ lang }, '', pathFor(lang) + location.hash);
      document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }catch(e){
      location.href = pathFor(lang); // repli : navigation classique
    }
  }

  document.querySelectorAll('.lang a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const lang = a.dataset.lang;
      try{ localStorage.setItem('fn-lang', lang); }catch(err){}
      setLang(lang);
    });
  });
  window.addEventListener('popstate', () => setLang(location.pathname.startsWith('/en') ? 'en' : 'fr', { push: false }));

  // Langue initiale : préférence mémorisée, sinon langue du navigateur (page d'accueil FR seulement)
  (function initLang(){
    const isBot = /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent) || navigator.webdriver;
    if(isBot) return;
    let saved = null;
    try{ saved = localStorage.getItem('fn-lang'); }catch(e){}
    if(pageLang === 'fr' && !location.search.includes('lang=fr')){
      const browserEn = (navigator.languages || [navigator.language]).some((l, i) => i === 0 && /^en\b/i.test(l));
      const target = saved || (browserEn ? 'en' : null);
      if(target === 'en'){
        getDict('en').then(dict => {
          applyDict(dict); currentLang = 'en';
          history.replaceState({ lang: 'en' }, '', '/en/' + location.hash);
          document.dispatchEvent(new CustomEvent('langchange', { detail: 'en' }));
        }).catch(() => {});
      }
    }
    // Précharge l'autre langue quand le navigateur est inactif
    const other = pageLang === 'en' ? 'fr' : 'en';
    idle(() => getDict(other).catch(() => {}), 2500);
  })();
  const t = key => (dicts[currentLang] || {})[key];

  /* ---------------------------------------------------------------
     Contact : copier l'email
     --------------------------------------------------------------- */
  const copyBtn = document.querySelector('.copy-btn');
  const copyStatus = document.querySelector('.copy-status');
  copyBtn.addEventListener('click', async () => {
    const dict = await getDict(currentLang).catch(() => ({}));
    let ok = false;
    try{ await navigator.clipboard.writeText(copyBtn.dataset.email); ok = true; }catch(e){}
    copyStatus.textContent = (ok ? dict['contact.copied'] : dict['contact.copyFail']) || copyBtn.dataset.email;
    copyBtn.classList.toggle('is-done', ok);
    clearTimeout(copyBtn._timer);
    copyBtn._timer = setTimeout(() => { copyStatus.textContent = ''; copyBtn.classList.remove('is-done'); }, 4000);
  });

  /* ---------------------------------------------------------------
     Stats GitHub en direct : bloc affiché seulement si l'API répond
     --------------------------------------------------------------- */
  (function githubStats(){
    const box = document.querySelector('.gh');
    if(!box) return;
    const run = async () => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      try{
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${GH_USER}`, { signal: ctrl.signal }),
          fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
        ]);
        if(!u.ok || !r.ok) return;
        const user = await u.json();
        const repos = await r.json();
        if(!Array.isArray(repos)) return;
        const stars = repos.reduce((s, x) => s + (x.stargazers_count || 0), 0);
        const last = repos.map(x => x.pushed_at).filter(Boolean).sort().pop();
        const set = (k, v) => { const el = box.querySelector(`[data-gh="${k}"]`); if(el) el.textContent = v; };
        const fmtNum = n => Number(n || 0).toLocaleString(root.lang);
        set('repos', fmtNum(user.public_repos));
        set('followers', fmtNum(user.followers));
        set('stars', fmtNum(stars));
        set('updated', last ? new Date(last).toLocaleDateString(root.lang, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
        box.hidden = false;
      }catch(e){
        // API indisponible, quota atteint ou délai dépassé : le bloc reste masqué
      }finally{
        clearTimeout(timer);
      }
    };
    // Ne lance la requête que lorsque la section Contact approche
    const io = new IntersectionObserver(entries => {
      if(entries.some(e => e.isIntersecting)){ io.disconnect(); run(); }
    }, { rootMargin: '400px' });
    io.observe(document.getElementById('contact'));
  })();

  /* ---------------------------------------------------------------
     Projets : panneau de détail (dialog). Sans JS, <details> suffit.
     --------------------------------------------------------------- */
  (function projectPanel(){
    if(typeof HTMLDialogElement !== 'function') return;
    const panel = document.createElement('dialog');
    panel.className = 'panel';
    panel.setAttribute('aria-labelledby', 'panel-title');
    document.body.appendChild(panel);
    let opener = null;

    function open(card){
      opener = card.querySelector('summary');
      const tag = card.querySelector('.card-tag');
      const title = card.querySelector('h4');
      const desc = card.querySelector(':scope > p:not(.card-tag)');
      const chips = card.querySelector(':scope > .chips');
      const body = card.querySelector('.more-body');
      panel.innerHTML = `
        <button class="panel-close" type="button" aria-label="${root.lang === 'en' ? 'Close' : 'Fermer'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <p class="card-tag">${tag ? tag.innerHTML : ''}</p>
        <h3 id="panel-title">${title ? title.innerHTML : ''}</h3>
        <p class="panel-desc">${desc ? desc.innerHTML : ''}</p>
        ${body ? body.innerHTML : ''}
        ${chips ? chips.outerHTML : ''}`;
      panel.querySelector('.panel-close').addEventListener('click', () => panel.close());
      panel.showModal();
      document.dispatchEvent(new CustomEvent('panel', { detail: true }));
    }

    panel.addEventListener('close', () => {
      document.dispatchEvent(new CustomEvent('panel', { detail: false }));
      if(opener) opener.focus();
    });
    panel.addEventListener('click', e => { if(e.target === panel) panel.close(); }); // clic sur le fond

    document.querySelectorAll('.card .more summary').forEach(summary => {
      summary.addEventListener('click', e => {
        e.preventDefault();
        open(summary.closest('.card'));
      });
    });
  })();

  /* ---------------------------------------------------------------
     Lueur qui suit le curseur + inclinaison 3D légère
     --------------------------------------------------------------- */
  if(finePointer && !reducedMotion){
    document.querySelectorAll('.tile, .card').forEach(el => {
      const tilt = el.classList.contains('card');
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
        if(tilt) el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-2px)`;
      });
      if(tilt) el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------
     Chargement différé des animations (GSAP, Lenis) et du canvas
     --------------------------------------------------------------- */
  function loadScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function revealAll(){ root.classList.remove('motion'); }

  if(root.classList.contains('motion')){
    // Filet de sécurité : si les animations ne démarrent pas, tout s'affiche
    const safety = setTimeout(revealAll, 3500);
    const libs = ['/assets/vendor/gsap.min.js', '/assets/vendor/ScrollTrigger.min.js', '/assets/vendor/SplitText.min.js'];
    if(finePointer) libs.push('/assets/vendor/lenis.min.js');
    Promise.all(libs.map(loadScript))
      .then(() => loadScript('/assets/js/motion.js'))
      .then(() => clearTimeout(safety))
      .catch(revealAll);
  }

  if(!reducedMotion){
    const startCanvas = () => loadScript('/assets/js/hero-canvas.js').catch(() => {});
    if(document.readyState === 'complete') idle(startCanvas, 300);
    else window.addEventListener('load', () => idle(startCanvas, 300));
  }

  window.FN = { t, getDict, getLang: () => currentLang };
})();

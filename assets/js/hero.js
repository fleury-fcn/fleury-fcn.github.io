// Hero : compteurs, phrase changeante, conversation Halal Assistant,
// recherche réelle dans la base, bloc « en direct », parallaxe, bandeau.
// Sans JS, le hero reste complet (premier échange visible, formulaire
// qui ouvre la vraie recherche du site). Mouvement réduit : pas de boucle,
// pas de frappe, pas de parallaxe ni de défilement.

(function(){
  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.hx');
  if(!hero) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const FOOD = 'https://halalopenfoodfacts.org';
  // Recherche en direct : les endpoints /proxy/v2/search et /proxy/v2/product
  // n'autorisent pas encore les requêtes venant d'un autre domaine (CORS).
  // Passer à true après avoir ajouté « Access-Control-Allow-Origin:
  // https://fleury-fcn.github.io » sur ces deux routes côté serveur.
  const LIVE_SEARCH = false;
  const GH_USER = 'fleury-fcn';

  const lang = () => (window.FN && window.FN.getLang()) || (root.lang === 'en' ? 'en' : 'fr');
  const dict = () => window.FN ? window.FN.getDict(lang()).catch(() => ({})) : Promise.resolve({});
  const fmt = (n, dec = 0) => Number(n).toLocaleString(root.lang, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fill = (str, vars) => String(str || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const idle = (fn, ms) => window.requestIdleCallback ? requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, ms);

  function fetchJSON(url, ms = 6000){
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then(r => { if(!r.ok) throw new Error(String(r.status)); return r.json(); })
      .finally(() => clearTimeout(timer));
  }

  // Le hero est-il visible ? (met en pause boucles et parallaxe hors écran)
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  const active = () => heroVisible && !document.hidden;

  /* ------------------------------------------------------------------
     1. Compteurs : s'incrémentent à l'ouverture
     ------------------------------------------------------------------ */
  (function counters(){
    if(reduced) return;
    const els = [...hero.querySelectorAll('.hx-count')];
    const start = performance.now() + 250, dur = 1700;
    const ease = t => 1 - Math.pow(1 - t, 3);
    function frame(now){
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      els.forEach(el => {
        const to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10);
        el.textContent = fmt(to * ease(t), dec);
      });
      if(t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ------------------------------------------------------------------
     2. Phrase changeante, effet machine à écrire
     ------------------------------------------------------------------ */
  (function rotator(){
    const el = hero.querySelector('.hx-rot-word');
    if(!el || reduced) return;
    let i = 0;
    async function loop(){
      for(;;){
        const words = (el.dataset.words || el.textContent).split('|');
        const word = words[i % words.length];
        await wait(2400);
        while(!active()) await wait(500);
        for(let n = el.textContent.length; n >= 0; n--){ el.textContent = el.textContent.slice(0, n); await wait(28); }
        i++;
        const next = (el.dataset.words || word).split('|')[i % words.length];
        for(let n = 1; n <= next.length; n++){ el.textContent = next.slice(0, n); await wait(55); }
      }
    }
    loop();
  })();

  /* ------------------------------------------------------------------
     3. Conversation Halal Assistant
     ------------------------------------------------------------------ */
  const chat = hero.querySelector('.hx-chat');
  const log = chat.querySelector('.hx-chat-log');
  const chips = [...chat.querySelectorAll('.hx-chip')];
  const form = chat.querySelector('.hx-ask');
  const input = form.querySelector('input');
  let autoplay = !reduced;
  let runId = 0;              // chaque nouvelle séquence annule la précédente

  const example = n => {
    const tpl = document.getElementById(`hx-ex-${n}`);
    return tpl ? { q: tpl.content.querySelector('[data-role="q"]'), a: tpl.content.querySelector('[data-role="a"]') } : null;
  };

  function bubble(cls, node){
    const el = document.createElement(cls === 'user' ? 'p' : 'div');
    el.className = `msg msg-${cls} is-new`;
    if(node) el.append(...node.cloneNode(true).childNodes);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  // Frappe d'un contenu HTML : on vide les nœuds texte puis on les remplit
  async function typeInto(el, speed, id){
    const nodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) nodes.push(walker.currentNode);
    const full = nodes.map(n => n.textContent);
    nodes.forEach(n => { n.textContent = ''; });
    el.classList.add('is-typing');
    el.inert = true;   // contenu partiel : ni lu ni focalisable pendant la frappe
    for(let k = 0; k < nodes.length; k++){
      for(let c = 1; c <= full[k].length; c += 2){
        if(id !== runId){ nodes.forEach((n, j) => { n.textContent = full[j]; }); el.classList.remove('is-typing'); el.inert = false; return false; }
        nodes[k].textContent = full[k].slice(0, c);
        if(c % 12 === 1) log.scrollTop = log.scrollHeight;
        await wait(speed);
      }
      nodes[k].textContent = full[k];
    }
    el.classList.remove('is-typing');
    el.inert = false;
    log.scrollTop = log.scrollHeight;
    return true;
  }

  function typingDots(){
    const d = document.createElement('div');
    d.className = 'hx-typing is-new'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }

  async function playExample(n, { animate }){
    const id = ++runId;
    const ex = example(n);
    if(!ex) return;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.ex === String(n))));
    log.replaceChildren();
    if(!animate){
      bubble('user', ex.q); bubble('bot', ex.a);
      return;
    }
    const q = bubble('user', ex.q);
    if(!await typeInto(q, 34, id)) return;
    await wait(300);
    if(id !== runId) return;
    const dots = typingDots();
    await wait(1000);
    dots.remove();
    if(id !== runId) return;
    const a = bubble('bot', ex.a);
    await typeInto(a, 10, id);
  }

  async function autoLoop(){
    let n = 1;
    await wait(500);
    while(autoplay){
      while(!active()){ await wait(600); if(!autoplay) return; }
      await playExample(n, { animate: true });
      await wait(5200);
      n = n % 3 + 1;
    }
  }

  // Interaction : le visiteur reprend la main, la boucle s'arrête
  function takeOver(){
    autoplay = false;
    log.setAttribute('aria-live', 'polite');
  }
  log.setAttribute('aria-live', autoplay ? 'off' : 'polite');

  chips.forEach(chip => chip.addEventListener('click', () => {
    takeOver();
    playExample(chip.dataset.ex, { animate: false });
  }));

  // Recherche réelle (API publique, lecture seule) : aucun appel au LLM
  const STOP = new Set(('le la les un une des du de d l au aux et ou est sont ce ces cet cette il elle ils je j tu te me moi vous nous on ' +
    'quel quelle quels quelles quoi que qui est-ce sans avec pour par sur dans y a ai as avez peux peut veux voudrais propose proposes ' +
    'conseille conseilles recommande produit produits halal haram bon bonne bons acheter trouver cherche cherches chercher ' +
    'the a an any is are what which who i you me my some do does can could want would like product products buy find recommend ' +
    'suggest suggests please without with for of in on to and or there it its'
  ).split(' '));
  const keywords = text => text.toLowerCase().normalize('NFC')
    .replace(/[^\p{L}\p{N}\s'’-]/gu, ' ').split(/[\s'’-]+/)
    .filter(w => w.length > 1 && !STOP.has(w)).slice(0, 3).join(' ');

  // Mots-clés qui renvoient vers un échange scénarisé (FR + EN)
  const MATCH = [
    [1, /\b(lait|laits|milk)\b/],
    [2, /\b(chamallows?|marshmallows?|g[ée]latines?)\b/],
    [3, /\b(bonbons?|sweets?|cand(y|ies)|porc|pork|alcool|alcohol)\b/]
  ];

  let lastSearch = 0;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim().slice(0, 80);
    const d = await dict();
    takeOver(); ++runId;
    log.replaceChildren();
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    if(text){ const u = bubble('user'); u.textContent = text; }
    const q = keywords(text);
    const lower = text.toLowerCase();
    const match = MATCH.find(([, re]) => re.test(lower));
    if(match && !LIVE_SEARCH){
      // Question proche d'un échange scénarisé : réponse réaliste basée sur des fiches réelles
      const ex = example(match[0]);
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.ex === String(match[0]))));
      bubble('bot', ex.a);
      return;
    }
    const bot = bubble('bot');
    const say = msg => { const p = document.createElement('p'); p.textContent = msg; bot.appendChild(p); return p; };
    if(!q){ say(d['hx.res.empty']); return; }
    if(!LIVE_SEARCH){
      say(d['hx.res.offline']);
      const a = document.createElement('a');
      a.href = `${FOOD}/catalogue.html?q=${encodeURIComponent(q)}`;
      a.target = '_blank'; a.rel = 'noopener'; a.textContent = fill(d['hx.res.open'], { q });
      say('').appendChild(a);
      return;
    }
    if(Date.now() - lastSearch < 1500) await wait(1500);
    lastSearch = Date.now();

    const sendBtn = form.querySelector('button');
    sendBtn.disabled = true; bot.setAttribute('aria-busy', 'true');
    const dots = typingDots();
    try{
      const res = await fetchJSON(`${FOOD}/proxy/v2/search?q=${encodeURIComponent(q)}&page=1`);
      const products = Array.isArray(res.products) ? res.products.slice(0, 3) : [];
      if(!products.length){ say(fill(d['hx.res.none'], { q })); chips[0].focus({ preventScroll: true }); return; }
      // Détail halal des 3 premiers produits (motif, certification), en parallèle
      const details = await Promise.all(products.map(p =>
        fetchJSON(`${FOOD}/proxy/v2/product/${encodeURIComponent(p.code)}.json`, 5000)
          .then(r => (r.product || r).halal || null).catch(() => null)));
      say(fill(d['hx.res.intro'], { n: fmt(res.count || products.length), q }));
      const ul = document.createElement('ul');
      products.forEach((p, i) => {
        const h = details[i] || {};
        const status = h.status || p.halal_status || 'unknown';
        const li = document.createElement('li');
        const name = document.createElement('strong');
        name.textContent = p.product_name || `Code ${p.code}`;
        li.append(name);
        if(p.brands){ li.append(` (${String(p.brands).split(',')[0].trim()})`); }
        li.append(' : ');
        const st = document.createElement('b');
        st.className = `st ${status === 'halal' ? 'st-ok' : 'st-warn'}`;
        st.textContent = d[`hx.st.${status}`] || status;
        li.append(st, '. ');
        const reason = h.reasons && h.reasons[0] && h.reasons[0].text;
        if(reason && lang() === 'fr') li.append(`${reason} `);
        const small = document.createElement('small');
        small.textContent = h.verified_certification ? d['hx.res.verified'] : d['hx.res.unverified'];
        const a = document.createElement('a');
        a.href = `${FOOD}/product.html?code=${encodeURIComponent(p.code)}`;
        a.target = '_blank'; a.rel = 'noopener';
        a.textContent = d['hx.res.link'];
        li.append(a, small);
        ul.appendChild(li);
      });
      bot.appendChild(ul);
      const more = document.createElement('p');
      const ma = document.createElement('a');
      ma.href = `${FOOD}/catalogue.html?q=${encodeURIComponent(q)}`;
      ma.target = '_blank'; ma.rel = 'noopener'; ma.textContent = d['hx.res.more'];
      more.appendChild(ma); bot.appendChild(more);
    }catch(err){
      say(d['hx.res.offline']);
    }finally{
      dots.remove(); sendBtn.disabled = false; bot.removeAttribute('aria-busy');
      log.scrollTop = log.scrollHeight;
    }
  });

  document.addEventListener('langchange', () => {
    // Après une bascule de langue : rejoue l'échange courant dans la nouvelle langue
    const current = chips.find(c => c.getAttribute('aria-pressed') === 'true');
    if(!autoplay) playExample(current ? current.dataset.ex : 1, { animate: false });
  });

  if(autoplay) autoLoop();

  /* ------------------------------------------------------------------
     4. Bloc « en direct » : état des sites et activité GitHub
     ------------------------------------------------------------------ */
  function relTime(iso){
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(root.lang, { numeric: 'auto' });
    const units = [['day', 86400], ['hour', 3600], ['minute', 60]];
    for(const [u, s] of units) if(Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
    return rtf.format(Math.round(diff), 'second');
  }

  async function live(){
    const box = hero.querySelector('.hx-live');
    if(!box) return;
    const d = await dict();
    const sites = [...box.querySelectorAll('[data-site]')];
    await Promise.all(sites.map(async li => {
      const val = li.querySelector('.hx-live-val');
      try{
        const s = await fetchJSON(`${li.dataset.site}/proxy/stats`);
        if(typeof s.total !== 'number') throw new Error('format');
        li.classList.add('is-up');
        li.querySelector('.hx-dot').setAttribute('title', d['hx.live.online']);
        li.querySelector('.sr-only').textContent = d['hx.live.online'];
        val.textContent = fill(d['hx.live.products'], { n: fmt(s.total) });
      }catch(e){
        li.classList.add('is-down');
        val.textContent = d['hx.live.offline'];
      }
    }));
    box.hidden = false;

    try{
      const events = await fetchJSON(`https://api.github.com/users/${GH_USER}/events/public?per_page=20`);
      const kinds = { PushEvent: 'hx.gh.push', CreateEvent: 'hx.gh.create' };
      // Activité la plus récente par dépôt, deux dépôts au plus
      const seen = new Set();
      const picked = (Array.isArray(events) ? events : [])
        .filter(ev => ev.repo && ev.created_at)
        .sort((x, y) => y.created_at.localeCompare(x.created_at))
        .filter(ev => !seen.has(ev.repo.name) && seen.add(ev.repo.name))
        .slice(0, 2);
      if(!picked.length) return;
      const ul = box.querySelector('.hx-live-gh');
      ul.replaceChildren(...picked.map(ev => {
        const li = document.createElement('li');
        const repo = ev.repo.name.split('/').pop();
        const [before, after] = fill(d[kinds[ev.type] || 'hx.gh.other'], { repo: '\u0000' }).split('\u0000');
        const a = document.createElement('a');
        a.href = `https://github.com/${ev.repo.name}`; a.target = '_blank'; a.rel = 'noopener'; a.textContent = repo;
        const time = document.createElement('span');
        time.className = 'hx-live-val'; time.textContent = `· ${relTime(ev.created_at)}`;
        li.append((lang() === 'fr' ? 'GitHub : ' : 'GitHub: ') + before, a, after || '', ' ', time);
        return li;
      }));
      ul.hidden = false;
    }catch(e){
      // API GitHub indisponible ou quota atteint : la ligne reste masquée
    }
  }
  if(document.readyState === 'complete') idle(live, 1500);
  else window.addEventListener('load', () => idle(live, 1500));

  /* ------------------------------------------------------------------
     5. Parallaxe à la souris (photo et conversation)
     ------------------------------------------------------------------ */
  if(finePointer && !reduced){
    const layers = [...hero.querySelectorAll('[data-depth]')];
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      layers.forEach(l => {
        const k = parseFloat(l.dataset.depth);
        l.style.transform = `translate3d(${(x * k).toFixed(2)}px, ${(y * k).toFixed(2)}px, 0)`;
      });
      raf = (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 2 - 1;
      ty = (e.clientY - r.top) / r.height * 2 - 1;
      if(!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if(!raf) raf = requestAnimationFrame(tick); });
  }

  /* ------------------------------------------------------------------
     6. Bandeau des technologies : défilement continu
     ------------------------------------------------------------------ */
  if(!reduced){
    const marquee = hero.querySelector('.hx-marquee');
    const track = marquee && marquee.querySelector('.hx-track');
    if(track){
      [...track.children].forEach(li => {
        const clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      marquee.classList.add('is-running');
    }
  }
})();

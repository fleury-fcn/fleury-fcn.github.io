// Portfolio — Fleury Niyokwizera
// Navigation, thème clair/sombre, bascule FR/EN, CV par langue, stats GitHub.

const CV = {
  fr: 'assets/cv-fleury-niyokwizera.pdf',
  en: 'assets/cv-fleury-niyokwizera-en.pdf'
};
const EMAIL = 'fleuryniyokwizera2021@gmail.com';
const GH_USER = 'fleury-fcn';

/* ----------------------------------------------------------
   Traductions anglaises (le français est dans le HTML)
   ---------------------------------------------------------- */
const translations = {
  en: {
    "meta.title": "Fleury Niyokwizera — Data & AI · Work-study",
    "meta.description": "Fleury Niyokwizera, Chief Engineer at E-halal and first-year Master's student in MIASHS (Data Modeling) at Université de Lille. Looking for a Data Analyst, Data Scientist, Data Engineer or BI work-study position, starting as soon as possible.",

    "a11y.skip": "Skip to content",
    "a11y.nav": "Main navigation",
    "a11y.menu": "Open menu",
    "a11y.theme": "Toggle theme",
    "a11y.tech": "Technologies",

    "nav.home": "Home", "nav.about": "About", "nav.projects": "Projects",
    "nav.path": "Experience", "nav.skills": "Skills", "nav.contact": "Contact",

    "hero.status": "Available for a work-study position as soon as possible · France and Belgium",
    "hero.role": "Chief Engineer @ E-halal | Master's in Data Modeling",
    "hero.lead": "I build data products for real users: open databases, pipelines and AI agents in production.",
    "hero.cta.projects": "View my projects",
    "hero.cta.cv": "Download my CV",
    "hero.cta.contact": "Contact me",
    "hero.photo.alt": "Portrait of Fleury Niyokwizera",

    "about.title": "About",
    "about.p1": "I am Chief Engineer at E-halal, a French non-profit. I design and maintain two open-source platforms in production: Halal Open Food Facts (4.5M+ food products) and Halal Open Beauty Facts (67,000+ cosmetics).",
    "about.p2": "I am also a first-year Master's student in MIASHS, Data Modeling track, at Université de Lille, after a Bachelor's in actuarial science and a Master's in applied statistics at ISTA (University of Burundi).",
    "about.p3": "I am looking for a work-study position as a Data Analyst, Data Scientist, Data Engineer or BI analyst. I bring hands-on experience of the full data chain: collection, modeling, deployment and reporting.",
    "about.f1.k": "Looking for", "about.f1.v": "Data / BI work-study, as soon as possible",
    "about.f2.k": "Location", "about.f2.v": "Lille · open to France and Belgium",
    "about.f3.k": "Education", "about.f3.v": "Master 1 MIASHS, Data Modeling — Université de Lille",
    "about.f4.k": "Languages", "about.f4.v": "French C2 · English C2",

    "proj.title": "Projects",
    "proj.others": "Other projects",

    "feat.kicker": "Featured project · E-halal · 2026",
    "feat.title": "Halal Assistant: an AI agent for Halal Open Food Facts and Halal Open Beauty Facts",
    "feat.problem.h": "Problem",
    "feat.problem.p": "The two databases hold millions of product records. Finding a suitable product, understanding its halal status or knowing how to contribute required mastering the sites' search and filters.",
    "feat.solution.h": "Solution",
    "feat.solution.p": "A conversational assistant built into both sites. It relies on the product database (RAG) and on Claude, via OpenRouter, to answer in plain language, with a link to every product it cites.",
    "feat.f1": "Answers questions about a product.",
    "feat.f2": "Assesses halal compliance from the ingredients, and distinguishes a verified label from one declared by contributors.",
    "feat.f3": "Helps users choose halal products that match their request.",
    "feat.f4": "Helps complete a product record.",
    "feat.f5": "Guides users through the sites.",
    "feat.role.h": "My role",
    "feat.role.p": "Designed the agent and integrated it into both platforms, as E-halal's Chief Engineer.",
    "feat.results.h": "Results",
    "feat.r1": "In production on halalopenfoodfacts.org and halalopenbeautyfacts.org.",
    "feat.r2": "Visible safeguards: a warning about AI limits, a nuanced status (compatible, ambiguous) and a link to the source record.",
    "feat.img1.alt": "Halal Assistant suggests products for the query “halal milk”, with a status and a link to each product record",
    "feat.img1.cap": "Agent answer on halalopenfoodfacts.org (in French).",
    "feat.flow1": "User question",
    "feat.flow2": "Search in the product database (RAG)",
    "feat.flow3": "Generation by Claude via OpenRouter",
    "feat.flow4": "Answer with links to product records",
    "feat.flow.cap": "How the agent works, simplified.",

    "p1.tag": "Data Engineering · E-halal",
    "p1.desc": "Two open-source platforms self-hosted on OVHcloud. 4.5M+ products imported from Open Food Facts and synchronised automatically, a public API, and statistics recomputed after each sync.",
    "p2.tag": "Machine Learning",
    "p2.title": "Insurance claims prediction",
    "p2.desc": "Modular ML pipeline: hyperparameter search (RandomizedSearchCV), cross-validation, configurable dataset mapping and model serialisation.",
    "p3.tag": "Big Data · ISTA",
    "p3.title": "NYC Yellow Taxi Big Data pipeline",
    "p3.desc": "Distributed processing of New York taxi trips, 4 machine learning models and an interactive reporting dashboard.",
    "p4.tag": "Applied statistics",
    "p4.title": "ISOKO IRAMA / SESA study (EU-funded project)",
    "p4.desc": "Statistical analysis of 489 respondents, with a methodological split between organisations and individuals, and field data collection via KoboCollect.",
    "p5.tag": "Full-stack · Marketplace",
    "p5.desc": "Classified ads marketplace for North Africa: geographic search, guided listing creation, buyer/seller messaging, automatic moderation and back-office.",
    "p6.tag": "First-year Master's project · ISTA",
    "p6.desc": "University management platform for ISTA (University of Burundi): students, faculty, courses, library and internal messaging.",
    "p7.tag": "Personal project",
    "p7.desc": "Personal finance tracker in BIF/EUR, in a single HTML page, synchronised through the GitHub Gist API.",

    "path.title": "Experience",
    "path.exp": "Work experience",
    "path.edu": "Education",
    "x1.date": "Since Oct. 2025 · Lille",
    "x1.title": "Chief Engineer — E-halal (French non-profit)",
    "x1.b1": "Design and maintain two open-source platforms in production (Django REST, PostgreSQL, Docker, Redis/Celery).",
    "x1.b2": "Migrated to self-hosted OVHcloud infrastructure: 4.5M+ products imported and synchronised automatically, with no dependency on the public Open Food Facts API.",
    "x1.b3": "Integrated Halal Assistant, an AI agent (Claude via OpenRouter, RAG) deployed on both sites.",
    "x1.b4": "Set up open-source contribution: CI, documentation, licence and security policy.",
    "x2.date": "Feb. – June 2025 · Burundi",
    "x2.title": "Assistant consultant, monitoring & evaluation — UMWUGA N'AKAZI project (CREOPS, BBIN, WHH)",
    "x2.b1": "Collected and analysed field data (KoboToolbox); produced indicators and statistical reports for a socio-economic inclusion project.",
    "x3.date": "July – Oct. 2024 · Burundi",
    "x3.title": "Data Science intern, insurance — SOCAR Vie",
    "x3.b1": "Studied and prototyped the use of AI in life insurance pricing.",
    "e1.title": "Master 1 MIASHS, Data Modeling track",
    "e1.sub": "Université de Lille",
    "e2.title": "Master's in Applied Statistics and Business Intelligence",
    "e2.sub": "ISTA, University of Burundi · thesis being finalised",
    "e3.title": "Bachelor's in Actuarial Science, Risk Analysis",
    "e3.sub": "ISTA, University of Burundi",

    "skills.title": "Skills",
    "s1.h": "Data & machine learning", "s1.stats": "Statistical analysis",
    "s2.h": "Generative AI",
    "s3.h": "Visualisation & BI", "s3.excel": "Advanced Excel",
    "s4.h": "Databases",
    "s5.h": "Development",
    "s6.h": "Infrastructure",
    "s7.h": "Statistical tools",

    "contact.title": "Contact",
    "contact.lead": "Hiring a Data or BI work-study student? Reach me by email or on LinkedIn.",
    "contact.copy": "Copy email",
    "contact.copied": "Email address copied.",
    "contact.copyFail": "Copy failed. The address is: ",

    "gh.label": "On GitHub", "gh.repos": "public repos", "gh.followers": "followers", "gh.stars": "stars",
    "gh.chart.alt": "Fleury Niyokwizera's GitHub contributions over one year",

    "footer.loc": "Lille, France"
  },
  // Chaînes générées par le JS, en français
  fr: {
    "contact.copied": "Adresse email copiée.",
    "contact.copyFail": "La copie a échoué. L'adresse est : "
  }
};

const root = document.documentElement;
let currentLang = 'fr';
const t = (key) => (translations[currentLang] && translations[currentLang][key]) || originals[key] || '';

/* ----------------------------------------------------------
   Bascule FR / EN
   ---------------------------------------------------------- */
const originals = {};
const descMeta = document.querySelector('meta[name="description"]');
originals['meta.title'] = document.title;
originals['meta.description'] = descMeta ? descMeta.content : '';
document.querySelectorAll('[data-i18n]').forEach(el => { originals[el.dataset.i18n] = el.textContent; });
document.querySelectorAll('[data-i18n-aria]').forEach(el => { originals[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
document.querySelectorAll('[data-i18n-alt]').forEach(el => { originals[el.dataset.i18nAlt] = el.getAttribute('alt'); });

function setLang(lang){
  currentLang = lang === 'en' ? 'en' : 'fr';
  const dict = currentLang === 'en' ? translations.en : {};
  const pick = (key) => dict[key] || originals[key];

  root.lang = currentLang;
  document.title = pick('meta.title');
  if(descMeta) descMeta.content = pick('meta.description');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = pick(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', pick(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.setAttribute('alt', pick(el.dataset.i18nAlt)); });
  document.querySelectorAll('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === currentLang)));

  updateCvLinks();

  // URL partageable : ?lang=en (cible du hreflang anglais)
  const url = new URL(window.location.href);
  if(currentLang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
  history.replaceState(null, '', url);

  try{ localStorage.setItem('fn-lang', currentLang); }catch(e){}
}

document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* ----------------------------------------------------------
   CV : version anglaise si le fichier existe, sinon version française
   ---------------------------------------------------------- */
let cvEnAvailable = false;

function updateCvLinks(){
  const href = currentLang === 'en' && cvEnAvailable ? CV.en : CV.fr;
  document.querySelectorAll('.js-cv').forEach(a => a.setAttribute('href', href));
}

fetch(CV.en, { method: 'HEAD' })
  .then(res => { cvEnAvailable = res.ok; updateCvLinks(); })
  .catch(() => {});

/* ----------------------------------------------------------
   Thème clair / sombre
   ---------------------------------------------------------- */
const themeBtn = document.getElementById('themeToggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function isDark(){
  return root.dataset.theme ? root.dataset.theme === 'dark' : darkQuery.matches;
}
if(themeBtn){
  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try{ localStorage.setItem('fn-theme', next); }catch(e){}
  });
}

/* ----------------------------------------------------------
   Menu mobile
   ---------------------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');

function closeMenu(){
  if(!navMenu) return;
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}
if(navToggle && navMenu){
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });
}

/* ----------------------------------------------------------
   Lien actif dans la navigation selon la section visible
   ---------------------------------------------------------- */
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
if('IntersectionObserver' in window){
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', active);
        if(active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
}

/* ----------------------------------------------------------
   Copier l'email
   ---------------------------------------------------------- */
const copyBtn = document.getElementById('copyEmail');
const copyStatus = document.getElementById('copyStatus');

if(copyBtn){
  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try{
      await navigator.clipboard.writeText(EMAIL);
      ok = true;
    }catch(e){}
    if(copyStatus){
      copyStatus.textContent = ok ? t('contact.copied') : t('contact.copyFail') + EMAIL;
      setTimeout(() => { copyStatus.textContent = ''; }, 4000);
    }
  });
}

/* ----------------------------------------------------------
   Stats GitHub : affichées uniquement si l'API répond
   ---------------------------------------------------------- */
(async function loadGithubStats(){
  const box = document.getElementById('ghStats');
  if(!box) return;
  const chart = document.getElementById('ghChart');
  if(chart) chart.addEventListener('error', () => chart.remove());

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try{
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { signal: ctrl.signal }),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`, { signal: ctrl.signal })
    ]);
    if(!userRes.ok || !reposRes.ok) throw new Error('GitHub API ' + userRes.status);
    const user = await userRes.json();
    const repos = await reposRes.json();
    const stars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;
    const fmt = (n) => Number(n || 0).toLocaleString(root.lang);

    document.getElementById('ghRepos').textContent = fmt(user.public_repos);
    document.getElementById('ghFollowers').textContent = fmt(user.followers);
    document.getElementById('ghStars').textContent = fmt(stars);
    box.hidden = false;
  }catch(e){
    // API indisponible ou quota atteint : le bloc reste masqué
  }finally{
    clearTimeout(timer);
  }
})();

/* ----------------------------------------------------------
   Langue initiale : ?lang=en, sinon préférence enregistrée
   ---------------------------------------------------------- */
(function initLang(){
  const param = new URLSearchParams(window.location.search).get('lang');
  let saved = null;
  try{ saved = localStorage.getItem('fn-lang'); }catch(e){}
  const lang = param || saved;
  if(lang === 'en') setLang('en');
})();

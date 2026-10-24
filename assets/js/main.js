const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Barre de progression de lecture
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if(progressBar) progressBar.style.width = pct + '%';
}, { passive:true });

// Halo lumineux qui suit le curseur
const glow = document.getElementById('cursorGlow');
if(glow && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.addEventListener('mousemove', (e)=>{
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.classList.add('active');
  });
  document.addEventListener('mouseleave', ()=> glow.classList.remove('active'));
}

// Compteurs animés (stats du hero)
function animateCount(el, target, suffix, duration){
  const start = performance.now();
  function step(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target < 10 ? (target * eased).toFixed(0) : Math.floor(target * eased);
    el.textContent = (target >= 1000000 ? (val/1000000).toFixed(1)+'M' : val) + suffix;
    if(p < 1) requestAnimationFrame(step);
    else el.textContent = (target >= 1000000 ? (target/1000000).toFixed(1)+'M' : target) + suffix;
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('.hero-stats > div').forEach((wrap, i)=>{
  const numEl = wrap.querySelector('.stat-num');
  if(!numEl) return;
  const raw = numEl.textContent.trim();
  let target, suffix;
  if(raw.includes('M')){ target = parseFloat(raw) * 1000000; suffix = '+'; }
  else if(raw.includes('+')){ target = parseInt(raw); suffix = '+'; }
  else { target = parseInt(raw) || 0; suffix = ''; }
  numEl.dataset.done = 'false';
  const statObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && numEl.dataset.done === 'false'){
        numEl.dataset.done = 'true';
        animateCount(numEl, target, suffix, 1400);
      }
    });
  }, { threshold: 0.5 });
  statObserver.observe(numEl);
});

// Statistiques GitHub en direct
(async function loadGithubStats(){
  const elFollowers = document.getElementById('ghFollowers');
  const elRepos = document.getElementById('ghRepos');
  const elStars = document.getElementById('ghStars');
  try{
    const userRes = await fetch('https://api.github.com/users/fleury-fcn');
    const user = await userRes.json();
    const reposRes = await fetch('https://api.github.com/users/fleury-fcn/repos?per_page=100');
    const repos = await reposRes.json();
    const totalStars = Array.isArray(repos) ? repos.reduce((sum, r)=> sum + (r.stargazers_count||0), 0) : 0;

    if(elFollowers){ elFollowers.classList.remove('loading'); animateCount(elFollowers, user.followers||0, '', 1000); }
    if(elRepos){ elRepos.classList.remove('loading'); animateCount(elRepos, user.public_repos||0, '', 1000); }
    if(elStars){ elStars.classList.remove('loading'); animateCount(elStars, totalStars, '', 1000); }
  }catch(e){
    // Repli silencieux si l'API GitHub est indisponible ou limitée
    if(elFollowers){ elFollowers.classList.remove('loading'); elFollowers.textContent = '—'; }
    if(elRepos){ elRepos.classList.remove('loading'); elRepos.textContent = '—'; }
    if(elStars){ elStars.classList.remove('loading'); elStars.textContent = '—'; }
  }
})();

// Réseau de particules animé (canvas) dans le hero
(function initParticles(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
    particles = Array.from({ length: count }, ()=>({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35, r: Math.random()*1.6+0.6
    }));
  }
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 130){
          ctx.strokeStyle = `rgba(212,175,55,${0.16 * (1 - dist/130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
    particles.forEach(p=>{
      ctx.fillStyle = 'rgba(232,203,116,0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener('resize', resize);
  tick();
})();

// Effet machine à écrire pour les rôles
(function initTypewriter(){
  const el = document.getElementById('typewriterText');
  if(!el) return;
  const roles = {
    fr: ['Data Scientist', 'Ingénieur ML', 'Développeur IA', 'Bâtisseur Open-Source', 'Data Modeler'],
    en: ['Data Scientist', 'ML Engineer', 'AI Developer', 'Open-Source Builder', 'Data Modeler']
  };
  let roleIndex = 0, charIndex = 0, deleting = false;
  function currentRoles(){ return roles[document.documentElement.lang === 'en' ? 'en' : 'fr']; }
  function loop(){
    const list = currentRoles();
    const word = list[roleIndex % list.length];
    if(!deleting){
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if(charIndex === word.length){ deleting = true; setTimeout(loop, 1600); return; }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if(charIndex === 0){ deleting = false; roleIndex++; }
    }
    setTimeout(loop, deleting ? 40 : 80);
  }
  loop();
})();

// Tilt 3D au survol des cartes projets
// Carrousel de la carte ID — alterne photos perso / campus Université de Lille
// avec balayage diagonal (clip-path) + effet Ken Burns continu
(function initIdPhotoCarousel(){
  const top = document.getElementById('idPhotoTop');
  const base = document.getElementById('idPhotoBase');
  const badgeText = document.getElementById('idBadgeText');
  const badge = document.getElementById('idBadge');
  if(!top || !base) return;

  const media = [
    { src:'assets/fleury.jpg', caption:'Fleury Niyokwizera' },
    { src:'assets/lille-university.jpg', caption:'Université de Lille' },
    { src:'assets/fleury-balcony.jpg', caption:'En session de travail' },
    { src:'assets/lille-campus.jpg', caption:'Campus de Lille' },
    { src:'assets/fleury-desk.jpg', caption:'Setup de code' },
    { src:'assets/lille-learning-center.jpg', caption:'Lilliad Learning Center' },
    { src:'assets/lille-euralille.jpg', caption:'Lille, Hauts-de-France' }
  ];
  if(media.length < 2) return;

  const HIDDEN_CLIP = 'polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)';
  const VISIBLE_CLIP = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx = 0;

  function goTo(nextIdx){
    const item = media[nextIdx];
    top.style.transition = 'none';
    top.style.clipPath = HIDDEN_CLIP;
    void top.offsetWidth; // force reflow
    top.src = item.src;
    top.onload = ()=>{
      top.style.transition = 'clip-path 1.3s cubic-bezier(.77,0,.18,1)';
      requestAnimationFrame(()=>{ top.style.clipPath = VISIBLE_CLIP; });
      if(badge){ badge.style.opacity = '0'; }
      setTimeout(()=>{
        base.src = item.src;
        if(badgeText){ badgeText.textContent = item.caption; }
        if(badge){ badge.style.opacity = '1'; }
      }, 1300);
    };
  }

  if(reduceMotion) return; // laisse la première photo fixe si mouvement réduit demandé

  setInterval(()=>{
    idx = (idx + 1) % media.length;
    goTo(idx);
  }, 4600);
})();

(function initTilt(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });
})();

// Copier l'email en un clic
function copyEmail(btn){
  const email = 'fleuryniyokwizera2021@gmail.com';
  const toast = document.getElementById('copyToast');
  const done = ()=>{ if(toast){ toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 2000); } };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(email).then(done).catch(done);
  } else {
    const tmp = document.createElement('input');
    tmp.value = email; document.body.appendChild(tmp); tmp.select();
    document.execCommand('copy'); document.body.removeChild(tmp); done();
  }
}

const translations = {
  en: {
    "gh.heatmap":"Contribution activity — live from GitHub",
    "cta.copy":"📋 Copy email","cta.copied":"✓ Address copied!",
    "gh.followers":"GitHub followers","gh.repos":"Public repos","gh.stars":"Total stars","gh.since":"Active since",
    "nav.projects":"Projects","nav.skills":"Skills","nav.path":"Journey","nav.contact":"Contact me",
    "hero.eyebrow":"Available for an apprenticeship · September 2026",
    "hero.title":"Data Science & Artificial <em>Intelligence</em>,<br>applied to real problems.",
    "hero.sub":"Master's student in Mathematics and Statistics, Data Modeling track, at Université de Lille. I build end-to-end data systems — from collection pipelines to predictive models — and maintain two open-source platforms at E-halal used by thousands of contributors.",
    "hero.cta1":"View my projects →","hero.cta2":"Download my CV",
    "hero.stat1":"OPEN-SOURCE PLATFORMS","hero.stat2":"PRODUCTS IN DATABASE (E-HALAL)","hero.stat3":"TECHNOLOGIES MASTERED",
    "proj.eyebrow":"Selected projects","proj.title":"What I've <em>built.</em>",
    "proj.p1.tag":"Chief Engineer · E-halal",
    "proj.p1.desc":"Two open-source platforms built and maintained solo: a collaborative database of over 4.5M products, a public API, real-time halal compliance scanning.",
    "proj.p2.tag":"Machine Learning","proj.p2.title":"Insurance Claims Prediction",
    "proj.p2.desc":"Modular ML pipeline for claims prediction: hyperparameter tuning via RandomizedSearchCV, robust cross-validation, and model serialization for production.",
    "proj.p3.tag":"Big Data · ISTA","proj.p3.title":"NYC Yellow Taxi Pipeline",
    "proj.p3.desc":"Distributed processing of massive New York trip data, with an interactive dashboard reporting key metrics in real time.",
    "proj.p4.tag":"Applied Statistics","proj.p4.title":"ISOKO IRAMA / SESA Study (EU-funded project)",
    "proj.p4.desc":"Full statistical analysis on 489 respondents for an EU-funded project, with strict structures/individuals separation methodology and field data collection via KoboCollect.",
    "proj.p5.tag":"Full-Stack · Marketplace",
    "proj.p5.desc":"Premium classifieds marketplace for North Africa (Mauritania, Morocco, Algeria, Tunisia, Libya): fine-grained geographic search, guided listing creation, buyer/seller messaging, auto-moderation and a full back-office.",
    "proj.p6.tag":"Capstone Project · ISTA",
    "proj.p6.desc":"Full-featured web platform for university campus management, built for the Institute of Applied Statistics (ISTA), University of Burundi: students, faculty, courses, library, campus life and internal messaging.",
    "proj.p7.tag":"Personal Project",
    "proj.p7.desc":"Bilingual BIF/EUR personal finance tracker in a single HTML page, syncing via GitHub Gist as a remote backend — built for the Burundian financial context.",
    "skills.eyebrow":"Toolbox","skills.title":"Technical <em>skills.</em>","skills.excel":"Advanced Excel",
    "path.eyebrow":"Journey","path.title":"Where I come <em>from.</em>",
    "path.t1.title":"Master in Mathematics and Statistics, Data Modeling track","path.t1.sub":"Université de Lille",
    "path.t2.title":"Master 2 Applied Statistics & Decision Support IT","path.t2.sub":"ISTA — University of Burundi",
    "path.t3.date":"Since 2024","path.t3.title":"Chief Engineer — E-halal (French non-profit)","path.t3.sub":"Design and maintenance of HalalOpenFoodFacts.org and HalalOpenBeautyFacts.org",
    "cta.title":"Let's build something<br><em>useful</em>, together.",
    "cta.sub":"Open to apprenticeship opportunities in Data Science and Software Engineering starting September 2026.",
    "cta.email":"Send an email","footer.loc":"Lille, France"
  }
};

const originals = {};
document.querySelectorAll('[data-i18n]').forEach(el=> originals[el.getAttribute('data-i18n')] = el.textContent );
document.querySelectorAll('[data-i18n-html]').forEach(el=> originals[el.getAttribute('data-i18n-html')] = el.innerHTML );

function setLang(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b=> b.classList.toggle('active', b.dataset.lang===lang) );

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = lang==='en' ? (translations.en[key] || originals[key]) : originals[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = lang==='en' ? (translations.en[key] || originals[key]) : originals[key];
  });
  try{ localStorage.setItem('fn-lang', lang); }catch(e){}
}

try{
  const saved = localStorage.getItem('fn-lang');
  if(saved === 'en') setLang('en');
}catch(e){}

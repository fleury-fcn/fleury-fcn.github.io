// Génère les pages statiques FR (/index.html) et EN (/en/index.html) à partir de
// src/template.html et des dictionnaires src/i18n/*.json, puis copie les
// bibliothèques et polices dans assets/. Usage : npm run build
//
// Conventions du gabarit :
//   data-i18n="clé"            → contenu de l'élément (vide dans le gabarit)
//                                 clé en ".html" = HTML brut, sinon texte échappé
//   data-i18n-attr="a=clé;b=…" → valeurs d'attributs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';

const LANGS = { fr: 'index.html', en: 'en/index.html' };
const SITE = 'https://fleury-fcn.github.io';

const template = readFileSync('src/template.html', 'utf8');
const dicts = Object.fromEntries(
  Object.keys(LANGS).map(l => [l, JSON.parse(readFileSync(`src/i18n/${l}.json`, 'utf8'))])
);

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Vérifie que chaque clé du gabarit existe dans chaque langue
const used = new Set();
for (const m of template.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
for (const m of template.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  m[1].split(';').forEach(pair => used.add(pair.split('=')[1]));
}
let missing = 0;
for (const [lang, dict] of Object.entries(dicts)) {
  for (const key of used) {
    if (!(key in dict)) { console.error(`✗ clé manquante [${lang}] ${key}`); missing++; }
  }
}
if (missing) process.exit(1);

function render(lang){
  const dict = dicts[lang];
  let html = template;

  // 1. Attributs
  html = html.replace(/<([a-zA-Z][\w-]*)(\s[^<>]*?)?\sdata-i18n-attr="([^"]+)"([^<>]*)>/g,
    (_, tag, before = '', spec, after) => {
      let attrs = `${before} data-i18n-attr="${spec}"${after}`;
      for (const pair of spec.split(';')) {
        const [name, key] = pair.split('=');
        attrs = attrs.replace(new RegExp(`\\s${name}="[^"]*"`), '');
        attrs += ` ${name}="${esc(dict[key])}"`;
      }
      return `<${tag}${attrs}>`;
    });

  // 2. Contenus (éléments vides portant data-i18n)
  html = html.replace(/(<([a-zA-Z][\w-]*)\b[^<>]*\sdata-i18n="([^"]+)"[^<>]*>)(<\/\2>)/g,
    (_, open, tag, key, close) => {
      const value = key.endsWith('.html') ? dict[key] : esc(dict[key]);
      return `${open}${value}${close}`;
    });

  return `<!-- Fichier généré par scripts/build.mjs à partir de src/template.html : ne pas modifier directement. -->\n${html}`;
}

for (const [lang, file] of Object.entries(LANGS)) {
  if (file.includes('/')) mkdirSync(file.split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(file, render(lang));
  console.log('✓', file);
}

// Dictionnaires pour la bascule instantanée côté client
mkdirSync('assets/i18n', { recursive: true });
for (const lang of Object.keys(LANGS)) {
  writeFileSync(`assets/i18n/${lang}.json`, JSON.stringify(dicts[lang]));
}

// Bibliothèques (chargées uniquement si les animations sont actives)
mkdirSync('assets/vendor', { recursive: true });
const vendor = {
  'node_modules/gsap/dist/gsap.min.js': 'gsap.min.js',
  'node_modules/gsap/dist/ScrollTrigger.min.js': 'ScrollTrigger.min.js',
  'node_modules/gsap/dist/SplitText.min.js': 'SplitText.min.js',
  'node_modules/lenis/dist/lenis.min.js': 'lenis.min.js'
};
for (const [src, dst] of Object.entries(vendor)) copyFileSync(src, `assets/vendor/${dst}`);

// Polices auto-hébergées (sous-ensemble latin)
mkdirSync('assets/fonts', { recursive: true });
const fonts = [
  'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
  'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'
];
for (const f of fonts) copyFileSync(f, `assets/fonts/${f.split('/').pop()}`);

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const alt = `
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>${alt}
  </url>
  <url>
    <loc>${SITE}/en/</loc>
    <lastmod>${today}</lastmod>${alt}
  </url>
</urlset>
`);
console.log('✓ assets/i18n, assets/vendor, assets/fonts, sitemap.xml');

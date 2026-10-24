# Fleury Niyokwizera — Portfolio

🔗 **Site :** [fleury-fcn.github.io](https://fleury-fcn.github.io) · English: [fleury-fcn.github.io/en/](https://fleury-fcn.github.io/en/)

Portfolio of **Fleury Niyokwizera**, Data Engineer and first-year Master's student in **Data Modeling** at **Université de Lille**.

🔎 **Looking for a work-study position or internship from November 2026**: Data Engineer, AI Engineer, Data Analyst, Data Scientist or BI, in France or Belgium.

## ✨ Highlights

- 🤖 **Halal Assistant**: an AI agent (RAG on pgvector + Claude via OpenRouter) built into [HalalOpenFoodFacts.org](https://halalopenfoodfacts.org) and [HalalOpenBeautyFacts.org](https://halalopenbeautyfacts.org). Responses in under 3 s, 85% accuracy on 200 test questions.
- 🗄️ **Two open source data platforms** in production: 4.5M+ products, sync time cut from 9 h to 55 min, 25,000 Celery tasks a day, 99.5% availability.
- 📊 Big data (PySpark, 40M rides), machine learning and applied statistics projects.

## 🖥️ About this site

A static site served by GitHub Pages from `main`, with no framework.

- **Two real pages**: `/` (French) and `/en/` (English), generated from one template. The language switch is instant with JavaScript and falls back to a normal link without it. The chosen language is remembered, and English-speaking browsers get the English page on their first visit.
- **Design**: dark theme by default (navy and electric lime) with a light theme, Instrument Serif for headings, Geist for text. All fonts are self-hosted.
- **Hero**: headline result (4.5M+ products synced in 55 min instead of 9 h) with an animated gradient, typewriter line, count-up figures, an interactive Halal Assistant demo, a live block (both sites' status from their public `/proxy/stats` endpoint, latest public GitHub activity), a cut-out portrait with mouse parallax, an interactive node network and a technology marquee (logos from Simple Icons, CC0).
- **Halal Assistant demo**: three scripted exchanges built from real product records (links open the real records). The real agent API is not called (cross-origin POST is blocked and would spend the LLM quota). Visitor questions about milk, Chamallow or sweets replay the matching exchange; other questions link to the real search on halalopenfoodfacts.org. A live product search is already coded in `assets/js/hero.js` behind `LIVE_SEARCH = false`: enable it once `/proxy/v2/search` and `/proxy/v2/product` send `Access-Control-Allow-Origin: https://fleury-fcn.github.io`.
- **Motion**: masked title reveals, scroll reveals, counters, animated chat demo and architecture diagram, scroll-drawn timeline, 3D card tilt, custom cursor, smooth scroll. GSAP, ScrollTrigger, SplitText and Lenis load only when motion is allowed. Mobile gets lighter effects.
- **Accessibility**: semantic HTML, AA contrast in both themes, visible focus, skip link, `prefers-reduced-motion` respected (no canvas or heavy animation), all content readable without JavaScript.
- **SEO**: title, description, canonical, hreflang, Open Graph and Twitter images per language, `Person` structured data, `sitemap.xml`, `robots.txt`.
- **Lighthouse (mobile, gzip as on GitHub Pages)**: Performance 97, Accessibility 100, Best Practices 100, SEO 100.

## 📁 Structure

```
.
├── src/
│   ├── template.html          # Single page template (edit the markup here)
│   └── i18n/fr.json, en.json  # All texts, one key per string
├── scripts/
│   ├── build.mjs              # Generates index.html, en/index.html, sitemap.xml, copies libs and fonts
│   ├── images.mjs             # AVIF / WebP / JPEG variants of the photos and screenshots
│   ├── og.html, og.mjs        # Open Graph images (assets/img/og-fr.png, og-en.png)
├── index.html                 # GENERATED — French page
├── en/index.html              # GENERATED — English page
├── assets/
│   ├── css/style.css          # Design system (CSS variables) and layout
│   ├── js/main.js             # Always loaded: nav, theme, language, contact, GitHub stats, project panel
│   ├── js/motion.js           # Loaded on demand: GSAP animations, smooth scroll, cursor
│   ├── js/hero.js             # Hero: counters, typewriter, assistant demo, live block, parallax, marquee
│   ├── js/hero-canvas.js      # Loaded on idle: hero node network
│   ├── i18n/                  # GENERATED — dictionaries for the instant language switch
│   ├── vendor/, fonts/        # GENERATED — copied from node_modules
│   ├── img/                   # Optimised images, favicon, OG images
│   ├── cv-fleury-niyokwizera.pdf      # CV (French)
│   └── cv-fleury-niyokwizera-en.pdf   # CV (English)
├── sitemap.xml, robots.txt
└── README.md
```

## ✏️ Editing

```bash
npm install          # once
npm run build        # after any change in src/ — regenerates the pages
npm run serve        # preview on http://localhost:8765
```

- **Change a text**: edit the key in `src/i18n/fr.json` **and** `src/i18n/en.json`, then `npm run build`. Keys ending in `.html` may contain HTML; the others are escaped.
- **Change the layout**: edit `src/template.html`. Put `data-i18n="key"` on an empty element, or `data-i18n-attr="alt=key;href=key"` for attributes. The build stops if a key is missing in one language.
- **Do not edit** `index.html` or `en/index.html` directly: they are overwritten by the build.
- **Replace a CV**: upload the PDF to `assets/` with the same file name. No build needed.
- **Images**: `npm run images`. **Share images**: `npm run serve`, then `npm run og` in another terminal.

## 🚀 Deployment

GitHub Pages serves the repository from `main`. The generated pages are committed, so every push deploys with no extra step.

## 📫 Contact

- Email: fleuryniyokwizera2021@gmail.com
- [LinkedIn](https://www.linkedin.com/in/fleury-niyokwizera-2a9436291) · [GitHub](https://github.com/fleury-fcn)

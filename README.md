# Fleury Niyokwizera — Portfolio

🔗 **Live site:** [fleury-fcn.github.io](https://fleury-fcn.github.io) · English version: [?lang=en](https://fleury-fcn.github.io/?lang=en)

Personal portfolio of **Fleury Niyokwizera**, Chief Engineer at **E-halal** and first-year Master's student in **MIASHS, Data Modeling track** at **Université de Lille**.

🔎 **Looking for a work-study contract (alternance), starting as soon as possible**: Data Analyst, Data Scientist, Data Engineer or BI, in France or Belgium.

## ✨ Highlights

- 🤖 **Halal Assistant**: an AI agent (Claude via OpenRouter, RAG) running on [HalalOpenFoodFacts.org](https://halalopenfoodfacts.org) and [HalalOpenBeautyFacts.org](https://halalopenbeautyfacts.org). It answers product questions, assesses halal compliance from ingredients, helps users choose products and complete product records, and guides them through the sites.
- 🗄️ **Two open-source data platforms**, self-hosted on OVHcloud: 4.5M+ food products and 67,000+ cosmetics, imported from Open Food Facts and synchronised automatically (Django REST, PostgreSQL, Redis/Celery, Docker).
- 📊 Machine learning, big data (PySpark) and applied statistics projects.

## 🖥️ About this site

A single page in plain HTML, CSS and JavaScript, with no framework and no build step.

- 🌐 FR / EN toggle covering all content, page title and meta description (`?lang=en` URL)
- 🌓 Light / dark theme that follows the system setting, with a manual toggle
- 📱 Mobile-first layout, keyboard navigation, `prefers-reduced-motion` respected
- 📄 CV download in the visitor's language, with the French version as fallback
- 📊 GitHub stats from the GitHub API, hidden if the API is unavailable

## 📁 Structure

```
.
├── index.html                          # Page content (French by default)
├── assets/
│   ├── css/style.css                   # Styles and light/dark theme tokens
│   ├── js/main.js                      # Navigation, theme, FR/EN translations, GitHub stats
│   ├── img/                            # Portrait, project screenshots, favicon
│   ├── cv-fleury-niyokwizera.pdf       # CV (French)
│   └── cv-fleury-niyokwizera-en.pdf    # CV (English), optional
└── README.md
```

Edit French text in `index.html` and the matching English string in the `translations.en` object in `assets/js/main.js`. Both use the same `data-i18n` key.

## 🚀 Deployment

Hosted with **GitHub Pages**, deployed automatically from the `main` branch on every push. To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 📫 Contact

- Email: fleuryniyokwizera2021@gmail.com
- [LinkedIn](https://www.linkedin.com/in/fleury-niyokwizera-2a9436291) · [GitHub](https://github.com/fleury-fcn)

---

*Built and maintained by Fleury Niyokwizera.*

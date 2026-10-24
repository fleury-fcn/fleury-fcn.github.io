// Génère assets/img/og-fr.png et og-en.png à partir de scripts/og.html.
// Prérequis : serveur local sur le port 8765 (npm run serve) et Google Chrome.
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new'
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
for (const lang of ['fr', 'en']) {
  await page.goto(`http://localhost:8765/scripts/og.html?lang=${lang}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `assets/img/og-${lang}.png` });
  console.log('✓ og-' + lang);
}
await browser.close();

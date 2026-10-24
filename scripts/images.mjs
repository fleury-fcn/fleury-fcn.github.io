// Génère les images optimisées (AVIF + WebP + JPEG de repli) dans assets/img/.
// Usage : npm run images
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'assets/img';
mkdirSync(OUT, { recursive: true });

const jobs = [
  // source, nom de sortie, largeurs, formats
  ['assets/fleury-desk.jpg', 'fleury-desk', [480, 800], ['avif', 'webp', 'jpg']],  // photo « À propos »
  ['assets/fleury.jpg', 'fleury', [480], ['jpg']],                                  // données structurées
  ['assets/fleury-cut.png', 'fleury-cut', [360, 640], ['avif', 'webp', 'png']],     // hero (photo détourée)
  ['assets/img/halal-assistant-hoff.jpg', 'halal-assistant-hoff', [1600], ['jpg']]  // capture réelle (lien)
];

const encode = {
  avif: img => img.avif({ quality: 50 }),
  webp: img => img.webp({ quality: 72 }),
  jpg: img => img.jpeg({ quality: 78, mozjpeg: true }),
  png: img => img.png({ palette: true, quality: 85, compressionLevel: 9 })
};

for (const [src, name, widths, formats] of jobs) {
  for (const w of widths) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    for (const f of formats) await encode[f](base.clone()).toFile(`${OUT}/${name}-${w}.${f}`);
  }
  console.log('✓', name);
}

// Renders tools/og/card.html to og.jpg (1200×630) with system Chrome.
// Needs playwright-core: npx -p playwright-core node tools/og/render.mjs
import { chromium } from 'playwright-core';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, 'card.html')).href);
await page.evaluate(() => document.fonts.ready);
const families = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight));
if (families.length < 3) throw new Error('fonts not loaded: ' + families.join(', '));
await page.screenshot({ path: join(here, '..', '..', 'og.jpg'), type: 'jpeg', quality: 88 });
await browser.close();
console.log('wrote og.jpg', families.join(', '));

// Renders favicon.svg to favicon-16/32/48.png and favicon.ico, and tools/favicon/apple-touch-icon.svg
// to apple-touch-icon.png (180×180), with system Chrome.
// Needs playwright-core: npx -p playwright-core node tools/favicon/render.mjs
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
async function render(svg, size, out) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const src = 'data:image/svg+xml;base64,' + readFileSync(svg).toString('base64');
  await page.setContent(`<html><body style="margin:0;background:transparent"><img src="${src}" width="${size}" height="${size}" style="display:block"></body></html>`);
  await page.waitForFunction(() => document.images[0].complete && document.images[0].naturalWidth > 0);
  const png = await page.screenshot({ type: 'png', omitBackground: true });
  writeFileSync(join(root, out), png);
  await page.close();
  return png;
}
const pngs = [];
for (const s of [16, 32, 48]) pngs.push([s, await render(join(root, 'favicon.svg'), s, `favicon-${s}.png`)]);
await render(join(here, 'apple-touch-icon.svg'), 180, 'apple-touch-icon.png');
await browser.close();
// favicon.ico: ICONDIR + one PNG-encoded entry per size.
const dir = Buffer.alloc(6 + 16 * pngs.length);
dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(pngs.length, 4);
let offset = dir.length;
pngs.forEach(([s, png], i) => {
  const e = 6 + 16 * i;
  dir.writeUInt8(s, e); dir.writeUInt8(s, e + 1); dir.writeUInt8(0, e + 2); dir.writeUInt8(0, e + 3);
  dir.writeUInt16LE(1, e + 4); dir.writeUInt16LE(32, e + 6);
  dir.writeUInt32LE(png.length, e + 8); dir.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(join(root, 'favicon.ico'), Buffer.concat([dir, ...pngs.map(([, p]) => p)]));
console.log('wrote favicon-16/32/48.png, favicon.ico, apple-touch-icon.png');

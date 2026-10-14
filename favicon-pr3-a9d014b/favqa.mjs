import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/andrewcouch/pw/');
const { chromium } = require('playwright');
const L = 'http://127.0.0.1:8765/davaus-preview/', LIVE = 'https://squidbay.github.io/davaus-preview/';
const R = ['', 'seedright/', 'kernel-keeper/', 'ride-tamer/', 'about-davaus/', 'support/', 'contact/', 'dealer-resources/', '404.html'];
const br = await chromium.launch({ channel: 'chrome' });
const out = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await br.newContext({ viewport: { width: w, height: h } });
  for (const r of R) {
    const p = await ctx.newPage(); const errs = [], bad = [];
    p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(e.message));
    p.on('response', x => x.status() >= 400 && bad.push(x.status() + ' ' + x.url()));
    await p.goto(L + r, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    const icons = await p.evaluate(() => [...document.querySelectorAll('link[rel~=icon],link[rel=apple-touch-icon]')].map(l => l.href));
    const status = [];
    for (const u of icons) { const x = await p.request.get(u); status.push(x.status() + ' ' + x.headers()['content-type'] + ' ' + u.replace(L, '')); }
    const a = await p.screenshot({ fullPage: true });
    const q = await ctx.newPage(); await q.goto(LIVE + (r === '404.html' ? 'no-such-page/' : r) + '?cb=' + Date.now(), { waitUntil: 'networkidle' }); await q.evaluate(() => document.fonts.ready);
    const b = await q.screenshot({ fullPage: true }); await q.close();
    const same = Buffer.compare(a, b) === 0;
    out.push({ vp: w, r: r || 'home', icons: status, errs, bad, sameAsLive: same });
    console.log(`${w} ${(r || 'home').padEnd(18)} icons=${icons.length} all200=${status.every(s => s.startsWith('200'))} errs=${errs.length} bad=${bad.length} pixelIdenticalToLive=${same}`);
    if (!same) { fs.writeFileSync(`${process.argv[2]}/diff-local-${w}-${r.replace(/\W/g, '') || 'home'}.png`, a); fs.writeFileSync(`${process.argv[2]}/diff-live-${w}-${r.replace(/\W/g, '') || 'home'}.png`, b); }
    await p.close();
  }
  await ctx.close();
}
console.log(out[0].icons.join('\n'));
fs.writeFileSync(`${process.argv[2]}/favicon-local.json`, JSON.stringify(out, null, 1));
await br.close();

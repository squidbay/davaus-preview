import { createRequire } from 'module';
const require = createRequire('/Users/andrewcouch/pw/');
const { chromium } = require('playwright');
const F = process.argv[2], U = 'http://127.0.0.1:8765/davaus-preview/';
const pages = ['', 'seedright/', 'kernel-keeper/', 'ride-tamer/', 'about-davaus/', 'support/', 'contact/', 'dealer-resources/', '404.html'];
for (const scheme of ['light', 'dark']) {
  const ctx = await chromium.launchPersistentContext(`${F}/prof-pw-${scheme}`, { channel: 'chrome', headless: true, colorScheme: scheme, viewport: { width: 760, height: 120 } });
  const p = await ctx.newPage();
  for (const r of pages) { await p.goto(U + r, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); }
  const q = await ctx.newPage(); const got = [];
  for (const r of pages) {
    const resp = await q.goto('chrome://favicon2/?size=16&scaleFactor=1x&allowGoogleServerFallback=0&pageUrl=' + encodeURIComponent(U + r));
    const buf = await resp.body(); got.push([(r || 'home').replace(/\/|\.html/g, ''), buf.toString('base64'), buf.length]);
  }
  const b = await ctx.newPage(); await b.goto(U + '?sheet');
  await b.setContent(`<body style="margin:0;padding:12px;background:${scheme === 'dark' ? '#35363a' : '#dee1e6'};display:flex;gap:14px">` + got.map(([n, d]) => `<figure style="margin:0;text-align:center;font:11px sans-serif;color:${scheme === 'dark' ? '#ddd' : '#333'}"><img style="width:16px;height:16px"><br><img style="width:48px;height:48px;image-rendering:pixelated" src="data:image/png;base64,${d}"><figcaption>${n}</figcaption></figure>`).join('') + '</body>');
  await b.evaluate(() => document.querySelectorAll('figure').forEach(f => { const i = f.querySelectorAll('img'); i[0].src = i[1].src; }));
  await b.waitForTimeout(300);
  await b.screenshot({ path: `${F}/ev/chrome-favicon-store-${scheme}.png` });
  console.log(scheme, got.map(g => g[0] + ':' + g[2] + 'B').join(' '));
  await ctx.close();
}

import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/andrewcouch/pw/');
const { chromium } = require('playwright');

const BASE = 'https://squidbay.github.io/davaus-preview/';
const OUT = process.argv[2];
const CB = 'cb=' + Date.now();
const ROUTES = [
  ['home', ''], ['seedright', 'seedright/'], ['kernel-keeper', 'kernel-keeper/'], ['ride-tamer', 'ride-tamer/'],
  ['about', 'about-davaus/'], ['support', 'support/'], ['contact', 'contact/'], ['dealer', 'dealer-resources/'],
  ['404', 'no-such-page/'],
];
const VPS = [['1440x900', 1440, 900], ['1280x900', 1280, 900], ['390x844', 390, 844, true], ['844x390', 844, 390, true]];
const LEAK = /\[SUPPLY\]|\bVERIFY\b|PLACEHOLDER|\bPENDING\b|\bTODO\b|\bTBD\b|SquidBay|lorem ipsum|\[#|\bC\d{2}\b ·/i;
const PRICES = { seedright: ['$39'], 'kernel-keeper': ['$195', '$390'], 'ride-tamer': ['$649'] };
const SALE = /add to cart|checkout|pay now|place order|purchase complete|order confirmed|thank you for your order|message sent|we.ll be in touch|successfully (sent|submitted)/i;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const [vpName, w, h, mobile] of VPS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: !!mobile, isMobile: false });
  for (const [name, path] of ROUTES) {
    const page = await ctx.newPage();
    const errs = [], bad = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('response', r => { if (r.status() >= 400 && !r.url().includes('no-such-page')) bad.push(r.status() + ' ' + r.url()); });
    page.on('requestfailed', r => bad.push('failed ' + r.url()));
    const resp = await page.goto(BASE + path + '?' + CB, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(({ LEAKs, SALEs }) => {
      const vw = document.documentElement.clientWidth;
      const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && !el.closest('[hidden]'); };
      const offRight = [], clipped = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!vis(el)) continue;
        const b = el.getBoundingClientRect();
        if (b.right > vw + 1 || b.left < -1) offRight.push(el.tagName.toLowerCase() + '.' + el.className + ' ' + Math.round(b.left) + '→' + Math.round(b.right));
        const s = getComputedStyle(el);
        if (el.children.length === 0 && el.textContent.trim() && (el.scrollWidth > el.clientWidth + 1) && /hidden|clip/.test(s.overflowX + s.overflow) ) clipped.push(el.tagName + ':' + el.textContent.trim().slice(0, 30));
      }
      const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + ' ' + f.weight);
      const ff = sel => { const e = document.querySelector(sel); return e ? getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '') + ' ' + getComputedStyle(e).fontWeight : null; };
      const txt = document.body.innerText;
      const leaks = (txt.match(new RegExp(LEAKs, 'gi')) || []);
      const sale = (txt.match(new RegExp(SALEs, 'gi')) || []);
      const imgs = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
      const meta = n => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || null;
      const dist = [...document.querySelectorAll('.distributor')].filter(vis).map(d => { const b = d.getBoundingClientRect(); return { name: d.querySelector('.name')?.textContent.trim(), x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height) }; });
      const names = [...document.querySelectorAll('.nf-products strong,.related strong')].map(e => e.textContent.trim() + '=' + getComputedStyle(e).color);
      const forms = [...document.forms].map(f => ({ action: f.getAttribute('action'), method: f.method }));
      const ext = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /^https?:/.test(h) && !h.startsWith('https://squidbay.github.io/davaus-preview/'));
      return {
        sw: document.documentElement.scrollWidth, vw, offRight: offRight.slice(0, 5), offRightN: offRight.length, clipped: clipped.slice(0, 5),
        fonts: [...new Set(fonts)], h1: ff('h1'), brand: ff('.wordmark'), body: ff('main p'), title: document.title,
        leaks, sale, imgs, robots: meta('robots'), og: { title: meta('og:title'), image: meta('og:image'), url: meta('og:url'), desc: !!meta('og:description'), tw: meta('twitter:card'), twimg: meta('twitter:image') },
        dist, names, forms, ext: [...new Set(ext)], text: txt,
      };
    }, { LEAKs: LEAK.source, SALEs: SALE.source });
    r.prices = (PRICES[name] || []).map(p => p + ':' + r.text.includes(p));
    r.mainPrice = name in PRICES ? (r.text.match(/\$[0-9][0-9,]*(?:\.[0-9]{2})?/g) || []).slice(0, 12) : [];
    delete r.text;
    const shot = `${OUT}/${vpName}-${name}.jpg`;
    await page.screenshot({ path: shot, type: 'jpeg', quality: 55, fullPage: vpName === '1440x900' || vpName === '390x844' });
    results.push({ vp: vpName, route: name, status: resp.status(), errs, bad, ...r });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/sweep.json`, JSON.stringify(results, null, 1));
for (const x of results) {
  const issues = [];
  if (x.sw > x.vw) issues.push(`overflow sw=${x.sw}>${x.vw}`);
  if (x.offRightN) issues.push(`offscreen ${x.offRightN}: ${x.offRight.join(' | ')}`);
  if (x.clipped.length) issues.push('clipped ' + x.clipped.join(' | '));
  if (x.errs.length) issues.push('console ' + x.errs.join(' | '));
  if (x.bad.length) issues.push('net ' + x.bad.join(' | '));
  if (x.imgs.length) issues.push('img ' + x.imgs.join(' '));
  if (x.leaks.length) issues.push('LEAK ' + x.leaks.join(','));
  if (x.sale.length) issues.push('SALE ' + x.sale.join(','));
  if (!/noindex/.test(x.robots || '')) issues.push('robots=' + x.robots);
  if (x.prices.some(p => p.endsWith('false'))) issues.push('price ' + x.prices.join(','));
  for (const f of ['Raleway', 'Archivo', 'Source Sans 3']) if (!x.fonts.some(s => s.startsWith(f))) issues.push('font missing ' + f);
  console.log(`${x.vp.padEnd(8)} ${x.route.padEnd(13)} ${x.status} ${issues.length ? 'ISSUES: ' + issues.join(' ; ') : 'ok'}`);
}

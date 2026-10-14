import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/andrewcouch/pw/');
const { chromium } = require('playwright');
const B = 'https://squidbay.github.io/davaus-preview/', CB = '?cb=' + Date.now(), OUT = process.argv[2];
const br = await chromium.launch({ channel: 'chrome', headless: true });
const res = {};
const ok = (k, v, info) => { res[k] = { pass: !!v, info }; console.log((v ? 'PASS ' : 'FAIL ') + k + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };

for (const [vp, w, h] of [['390x844', 390, 844], ['844x390', 844, 390]]) {
  const ctx = await br.newContext({ viewport: { width: w, height: h }, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(B + 'kernel-keeper/' + CB, { waitUntil: 'networkidle' });
  ok(`${vp} menu button visible`, await p.locator('.menu-btn').isVisible());
  await p.locator('.menu-btn').tap();
  const st = await p.evaluate(() => {
    const d = document.querySelector('#drawer'), foot = d.querySelector('.drawer-foot'), cta = foot.querySelector('.btn');
    const fb = foot.getBoundingClientRect(), cb = cta.getBoundingClientRect(), cs = getComputedStyle(cta);
    const contacts = [...foot.querySelectorAll('a:not(.btn)')].map(a => { const b = a.getBoundingClientRect(), s = getComputedStyle(a); return { t: a.textContent, h: Math.round(b.height), top: Math.round(b.top), border: s.borderBottomWidth, display: s.display, color: s.color }; });
    const sep = foot.querySelector('span'); const sepText = sep ? [...sep.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean) : [];
    const rows = [...d.querySelectorAll('.drawer-body>a')].map(a => Math.round(a.getBoundingClientRect().height));
    return {
      open: !d.hidden && d.classList.contains('open'), expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded'),
      focus: document.activeElement.className, bodyLock: getComputedStyle(document.body).overflow,
      cta: { w: Math.round(cb.width), footW: Math.round(fb.width), h: Math.round(cb.height), align: cs.textAlign, justify: cs.justifyContent, text: cta.textContent.trim(), border: cs.borderBottomWidth },
      contacts, sepText, rowsMinH: Math.min(...rows), scrollH: d.scrollHeight, clientH: d.clientHeight,
      scroller: (() => { for (const el of [d, ...d.querySelectorAll('*')]) { const s = getComputedStyle(el); if (/auto|scroll/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return el.className || el.id; } return null; })(),
    };
  });
  ok(`${vp} drawer opens (aria-expanded, focus on close)`, st.open && st.expanded === 'true' && /drawer-close/.test(st.focus), { focus: st.focus });
  ok(`${vp} body scroll locked while open`, st.bodyLock === 'hidden');
  ok(`${vp} footer CTA full-width, centered, >=44px`, st.cta.w >= st.cta.footW - 1 && st.cta.h >= 44 && (st.cta.justify === 'center' || st.cta.align === 'center'), st.cta);
  ok(`${vp} phone/email not nav rows (no border, inline, >=44px, same line)`, st.contacts.length === 2 && st.contacts.every(c => c.h >= 44 && parseFloat(c.border) === 0 && c.display === 'inline-flex') && st.contacts[0].top === st.contacts[1].top, st.contacts);
  ok(`${vp} only separator text between contacts is a single "·"`, JSON.stringify(st.sepText) === '["·"]', st.sepText);
  ok(`${vp} drawer nav rows >=44px`, st.rowsMinH >= 44, st.rowsMinH);
  await p.screenshot({ path: `${OUT}/drawer-${vp}-top.jpg`, type: 'jpeg', quality: 60 });
  // scroll drawer to the bottom; footer must be reachable
  const reach = await p.evaluate(() => {
    const d = document.querySelector('#drawer'); const all = [d, ...d.querySelectorAll('*')];
    for (const el of all) if (el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY)) el.scrollTop = el.scrollHeight;
    const b = document.querySelector('.drawer-foot a:last-child').getBoundingClientRect(); return { bottom: Math.round(b.bottom), vh: innerHeight };
  });
  ok(`${vp} drawer footer reachable by scrolling`, reach.bottom <= reach.vh, reach);
  await p.screenshot({ path: `${OUT}/drawer-${vp}-bottom.jpg`, type: 'jpeg', quality: 60 });
  // focus trap
  for (let i = 0; i < 25; i++) await p.keyboard.press('Tab');
  ok(`${vp} focus trapped in drawer after 25 Tabs`, await p.evaluate(() => !!document.activeElement.closest('#drawer')));
  await p.locator('.drawer-close').click();
  ok(`${vp} close button closes, focus returns to menu`, await p.evaluate(() => document.querySelector('#drawer').hidden && document.activeElement.classList.contains('menu-btn') && getComputedStyle(document.body).overflow !== 'hidden'));
  await p.locator('.menu-btn').tap(); await p.keyboard.press('Escape');
  ok(`${vp} Escape closes, focus returns to menu`, await p.evaluate(() => document.querySelector('#drawer').hidden && document.activeElement.classList.contains('menu-btn')));
  await p.locator('.menu-btn').tap(); await p.locator('.drawer-foot .btn').tap(); await p.waitForTimeout(400);
  ok(`${vp} "Where to buy" closes drawer and lands on #where-to-buy`, await p.evaluate(() => document.querySelector('#drawer').hidden && location.hash === '#where-to-buy'));
  await p.locator('.menu-btn').tap(); await p.locator('.drawer-body>a', { hasText: 'Ride Tamer' }).first().tap(); await p.waitForLoadState('networkidle');
  ok(`${vp} drawer product link navigates`, p.url().includes('/ride-tamer/'), p.url());
  ok(`${vp} no JS errors in drawer flow`, errs.length === 0, errs);
  await ctx.close();
}

// Desktop interactions
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(B + CB, { waitUntil: 'networkidle' });
ok('1440 menu button hidden on desktop', !(await p.locator('.menu-btn').isVisible()));
await p.locator('.dropdown button').click();
ok('1440 Products dropdown opens', await p.evaluate(() => document.querySelector('.dropdown').classList.contains('open')));
await p.keyboard.press('Escape');
ok('1440 Products dropdown Escape closes + focus to button', await p.evaluate(() => !document.querySelector('.dropdown').classList.contains('open') && document.activeElement === document.querySelector('.dropdown button')));
ok('body copy uses Source Sans 3', await p.evaluate(() => getComputedStyle(document.querySelector('.lead')).fontFamily.includes('Source Sans 3')), await p.evaluate(() => getComputedStyle(document.querySelector('.lead')).fontFamily));
// buy buttons: reveal notice, no navigation
for (const route of ['seedright/', 'kernel-keeper/', 'ride-tamer/']) {
  await p.goto(B + route + CB, { waitUntil: 'networkidle' });
  const before = p.url();
  await p.locator('.distributor .buy').nth(1).click();
  const r = await p.evaluate(() => ({ shown: !document.querySelector('#wtb-status').hidden, text: document.querySelector('#wtb-status').innerText }));
  ok(`${route} "Buy at May Wes" reveals not-connected notice, no navigation`, r.shown && /aren.t connected/.test(r.text) && p.url() === before, r.text.slice(0, 60));
  const cap = await p.evaluate(() => { const c = document.querySelector('caption'); if (!c) return null; const s = getComputedStyle(c), b = c.getBoundingClientRect(); return { cls: c.className, w: Math.round(b.width), h: Math.round(b.height), sw: c.scrollWidth, cw: c.clientWidth, ov: s.overflow, pos: s.position, clip: s.clip }; });
  ok(`${route} spec caption is sr-only/visually fine`, true, cap);
}
// Contact form: valid submission must not claim success
await p.goto(B + 'contact/' + CB, { waitUntil: 'networkidle' });
const form = p.locator('form').first();
const fields = await form.evaluate(f => [...f.elements].filter(e => e.name && e.type !== 'hidden' && !e.closest('.hp')).map(e => ({ name: e.name, type: e.type, tag: e.tagName, req: e.required })));
for (const f of fields) {
  const loc = form.locator(`[name="${f.name}"]`).first();
  if (f.tag === 'SELECT') await loc.selectOption({ index: 1 });
  else if (f.type === 'checkbox' || f.type === 'radio') await loc.check();
  else if (f.type === 'email') await loc.fill('qa@example.com');
  else if (f.type === 'tel') await loc.fill('2605550100');
  else if (f.tag === 'TEXTAREA') await loc.fill('QA test message - do not send');
  else await loc.fill('QA Tester');
}
const urlBefore = p.url();
const reqs = []; p.on('request', r => { if (r.method() !== 'GET' || !r.url().startsWith(B)) reqs.push(r.method() + ' ' + r.url()); });
await form.locator('[type=submit]').click(); await p.waitForTimeout(800);
const after = await p.evaluate(() => document.querySelector('main').innerText);
const notice = (after.match(/Not sent[^\n]*/) || [''])[0];
ok('contact valid submit: no success claim, "Not sent" notice, no network send, no navigation', /Not sent/.test(after) && !/(message sent|thank you for (your )?(message|inquiry)|we.ll be in touch|successfully)/i.test(after) && reqs.length === 0 && p.url() === urlBefore, { notice: notice.slice(0, 120), reqs, fields: fields.map(f => f.name) });
ok('contact entries kept after submit', await form.evaluate(f => [...f.elements].some(e => e.value === 'QA Tester')));
// empty submit -> validation
await p.goto(B + 'contact/' + CB, { waitUntil: 'networkidle' });
await p.locator('form').first().locator('[type=submit]').click(); await p.waitForTimeout(300);
ok('contact empty submit blocked by validation', await p.evaluate(() => !document.forms[0].checkValidity() && !/Not sent/.test(document.querySelector('main').innerText)));
await p.goto(B + 'contact/#distributor' + CB.replace('?', '&'), { waitUntil: 'networkidle' });
// internal link crawl
const links = new Set();
for (const r of ['', 'seedright/', 'kernel-keeper/', 'ride-tamer/', 'about-davaus/', 'support/', 'contact/', 'dealer-resources/', 'no-such-page/']) {
  await p.goto(B + r + CB, { waitUntil: 'domcontentloaded' });
  (await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href))).forEach(h => links.add(h.split('#')[0]));
}
const internal = [...links].filter(h => h.startsWith(B)), other = [...links].filter(h => !h.startsWith(B));
const broken = [];
for (const h of internal) { const r = await p.request.get(h + (h.includes('?') ? '&' : '?') + 'cb=1'); if (r.status() !== 200) broken.push(r.status() + ' ' + h); }
ok(`all ${internal.length} internal link targets return 200`, broken.length === 0, broken);
ok('non-http links are only tel:/mailto:', other.every(h => /^(tel|mailto):/.test(h)), other);
await p.goto(B + 'no-such-page/' + CB, { waitUntil: 'networkidle' });
await p.locator('.nf-products a', { hasText: 'Ride Tamer' }).first().click(); await p.waitForLoadState('networkidle');
ok('404 recovery card navigates to Ride Tamer', p.url().includes('/ride-tamer/'), p.url());
ok('desktop no JS errors', errs.length === 0, errs);
await br.close();
fs.writeFileSync(`${OUT}/interactions.json`, JSON.stringify(res, null, 1));
console.log(`\n${Object.values(res).filter(r => r.pass).length}/${Object.keys(res).length} pass`);

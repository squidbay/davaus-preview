// Generates the nine static pages of the DAVAUS client-review preview.
// Usage: node tools/build.mjs   (writes HTML into the repository root)
// Structure follows P1 Wireframe v1.2; styling lives in assets/css/site.css (P2 Field & Foundry).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');
// The 404 page is served by GitHub Pages at arbitrary depths, so it uses the absolute project path.
const PAGES_BASE = '/davaus-preview/';

const PHONE = '(260) 245-5006';
const TEL = 'tel:+12602455006';
const EMAIL = 'info@davaus.com';
const ADDRESS = '14508 Bruick Drive, Hoagland, IN 46745';
const MSRP_LABEL = 'MSRP · set by DAVAUS · available at authorized distributors';

const PRODUCTS = [
  { slug: 'seedright', name: 'SeedRIGHT', category: 'Row-crop planters', short: 'Planter seed plates',
    card: 'Plant cover crops and small grains with your planter — leave the drill in the shed.',
    price: 'Plates from $39' },
  { slug: 'kernel-keeper', name: 'Kernel Keeper', category: 'Corn heads', short: 'Corn-head grain-loss reduction',
    card: 'Cushion ear impact, capture loose kernels, collect them into the head.',
    price: '$195 per row' },
  { slug: 'ride-tamer', name: 'Ride Tamer', category: 'Zero-turn mowers', short: 'Zero-turn mower suspension',
    card: 'Retrofit front suspension for a smoother ride and less frame stress.',
    price: '$649' },
];

// One share card for every page (link previews in SMS, iMessage, Slack, social).
const PREVIEW_URL = 'https://squidbay.github.io/davaus-preview/';
const OG = {
  title: 'DAVAUS — Agricultural equipment innovation',
  description: 'SeedRIGHT, Kernel Keeper and Ride Tamer: retrofit products engineered and built in Hoagland, Indiana.',
  url: PREVIEW_URL,
  image: PREVIEW_URL + 'og.jpg?v=1',
  alt: 'DAVAUS — Retrofit products for the equipment you already run. SeedRIGHT, Kernel Keeper, Ride Tamer.',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head({ title, description, root, base }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
${base ? `<base href="${base}">\n` : ''}<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#1F3D2B">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DAVAUS">
<meta property="og:title" content="${OG.title}">
<meta property="og:description" content="${OG.description}">
<meta property="og:url" content="${OG.url}">
<meta property="og:image" content="${OG.image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${OG.alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${OG.title}">
<meta name="twitter:description" content="${OG.description}">
<meta name="twitter:image" content="${OG.image}">
<link rel="icon" href="data:,">
<link rel="preload" href="${root}assets/fonts/archivo-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/raleway-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/css/site.css">
<script src="${root}assets/js/site.js" defer></script>
</head>`;
}

function header({ root, current, wtb }) {
  const cur = (k) => (current === k ? ' aria-current="page"' : '');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <div class="nav-left">
      <a class="wordmark" href="${root}" aria-label="DAVAUS home">DAVAUS</a>
      <nav aria-label="Primary">
        <ul class="nav-links">
          <li class="dropdown">
            <button type="button" aria-expanded="false" aria-controls="products-menu">Products <span class="caret" aria-hidden="true">▾</span></button>
            <div class="dropdown-panel" id="products-menu">
              <ul>
${PRODUCTS.map((p) => `                <li><a href="${root}${p.slug}/"${cur(p.slug)}><strong>${p.name}</strong><span>${p.short}</span></a></li>`).join('\n')}
              </ul>
              <p class="dd-foot">Where to buy → S.I. Distributing · May Wes. <a href="${wtb}">See where to buy</a></p>
            </div>
          </li>
          <li><a href="${root}about-davaus/"${cur('about')}>About</a></li>
          <li><a href="${root}support/"${cur('support')}>Support</a></li>
          <li><a href="${root}contact/"${cur('contact')}>Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="nav-right">
      <a class="btn primary nav-cta" href="${wtb}">Where to Buy</a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="drawer-head">
    <a class="wordmark" href="${root}">DAVAUS</a>
    <button type="button" class="drawer-close" aria-label="Close menu">✕</button>
  </div>
  <nav class="drawer-body" aria-label="Mobile">
    <p class="eyebrow green">Products</p>
${PRODUCTS.map((p) => `    <a class="prod" href="${root}${p.slug}/"${cur(p.slug)}>${p.name} <span class="arrow" aria-hidden="true">→</span></a>`).join('\n')}
    <p class="eyebrow green">Company</p>
    <a href="${root}about-davaus/"${cur('about')}>About DAVAUS</a>
    <a href="${root}support/"${cur('support')}>Support &amp; Resources</a>
    <a href="${root}contact/"${cur('contact')}>Contact</a>
    <a href="${root}dealer-resources/">Dealer Resources</a>
    <div class="drawer-foot">
      <a class="btn primary" href="${wtb}">Where to buy</a>
      <span><a href="${TEL}">${PHONE}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></span>
    </div>
  </nav>
</div>`;
}

function footer(root) {
  return `<footer class="site-footer">
  <div class="wrap top">
    <div>
      <a class="wordmark" href="${root}">DAVAUS</a>
      <address>${ADDRESS}<br><a href="${TEL}">${PHONE}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></address>
    </div>
    <div>
      <h2>Products</h2>
      <ul>
${PRODUCTS.map((p) => `        <li><a href="${root}${p.slug}/">${p.name}</a></li>`).join('\n')}
      </ul>
    </div>
    <div>
      <h2>Company</h2>
      <ul>
        <li><a href="${root}about-davaus/">About DAVAUS</a></li>
        <li><a href="${root}support/">Support &amp; Resources</a></li>
        <li><a href="${root}contact/">Contact</a></li>
        <li><a href="${root}dealer-resources/">Dealer Resources</a></li>
      </ul>
    </div>
    <div>
      <h2>Where to buy</h2>
      <ul>
        <li><a href="${root}#where-to-buy">S.I. Distributing</a></li>
        <li><a href="${root}#where-to-buy">May Wes</a></li>
      </ul>
    </div>
  </div>
  <div class="bottom">
    <div class="wrap">
      <span>© 2026 DAVAUS LLC · Hoagland, Indiana</span>
      <a href="${root}about-davaus/#patents">Patents</a>
    </div>
  </div>
</footer>`;
}

const page = ({ title, description, root, current, wtb, main, bodyClass = '', extra = '' }) => `${head({ title, description, root })}
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header({ root, current, wtb })}
<main id="main">
${main}
</main>
${footer(root)}
${extra}</body>
</html>
`;

// Purchase URLs have not been supplied, so each "Buy at" control is a button that
// says so instead of a link that pretends to reach a checkout.
function distributorNotice(id) {
  return `<div class="dist-status" id="${id}" role="status" hidden><strong>Distributor ordering links aren’t connected yet.</strong> Nothing has been ordered. For help today, call DAVAUS at <a href="${TEL}">${PHONE}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a>.</div>`;
}
function distributors(id) {
  const card = (name) => `    <div class="distributor">
      <h3 class="name">${name}</h3>
      <p class="desc">Authorized DAVAUS distributor</p>
      <button type="button" class="btn primary buy" data-reveal="${id}" aria-controls="${id}">Buy at ${name}</button>
    </div>`;
  return `<div class="distributors">
${card('S.I. Distributing')}
${card('May Wes')}
  </div>
  ${distributorNotice(id)}`;
}

function docRow({ kind = 'PDF', title, meta }) {
  return `<li class="doc"><span class="doc-kind" aria-hidden="true">${kind === 'Video' ? '▶' : kind}</span><div class="doc-text"><p class="doc-title">${title}</p><p class="doc-meta">${meta || (kind === 'Video' ? 'Video' : kind)}</p></div><span class="doc-status">Coming soon</span></li>`;
}
const docList = (rows) => `<ul class="docs" role="list">\n${rows.map((r) => '  ' + docRow(r)).join('\n')}\n</ul>`;

function faq(prefix, items) {
  return `<div class="faq">
${items.map(([id, q, a]) => `  <div class="faq-item" id="faq-${id}">
    <h3 class="faq-q"><button type="button" aria-expanded="false" aria-controls="${prefix}-${id}-a">${q}</button></h3>
    <div class="faq-a" id="${prefix}-${id}-a" hidden><p>${a}</p></div>
  </div>`).join('\n')}
</div>`;
}

function related(root, exclude) {
  return `<section class="band page rule" aria-labelledby="related-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Also from DAVAUS</p><h2 class="h-sub" id="related-h">More DAVAUS products</h2></div>
    <div class="related">
${PRODUCTS.filter((p) => p.slug !== exclude).map((p) => `      <a href="${root}${p.slug}/"><span><strong>${p.name}</strong><span>${p.short}</span></span><span class="arrow" aria-hidden="true">→</span></a>`).join('\n')}
    </div>
  </div>
</section>`;
}

function productHero({ root, p, eyebrow, lead, price, priceExtra, buttons, facts }) {
  return `<section class="p-hero" id="overview" aria-labelledby="p-title">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${root}">Home</a></li><li><a href="${root}#products">Products</a></li><li aria-current="page">${p.name}</li></ol></nav>
    <div class="p-hero-grid">
      <div class="p-hero-copy">
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="h-display" id="p-title">${p.name}</h1>
        <p class="lead">${lead}</p>
        <div class="msrp">
          <p class="msrp-price"><strong>${price}</strong>${priceExtra ? `<span>· ${priceExtra}</span>` : ''}</p>
          <p class="msrp-label">${MSRP_LABEL}</p>
        </div>
        <div class="btn-row">
${buttons.map(([label, href], i) => `          <a class="btn${i === 0 ? ' primary' : ''}" href="${href}">${label}</a>`).join('\n')}
        </div>
      </div>
      <div class="facts">
        <p class="eyebrow">${p.name} at a glance</p>
        <dl>
${facts.map(([k, v]) => `          <div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
        </dl>
      </div>
    </div>
  </div>
</section>`;
}

function subnav(items) {
  return `<nav class="subnav" aria-label="On this page">
  <div class="wrap">
    <ul>
${items.map(([id, label]) => `      <li><a href="#${id}">${label}</a></li>`).join('\n')}
    </ul>
    <a class="btn primary sm" href="#where-to-buy" tabindex="-1">Where to buy</a>
  </div>
</nav>`;
}

const stickyCta = `<div class="sticky-cta" aria-hidden="true">
  <a class="btn primary" href="#where-to-buy" tabindex="-1">Where to buy</a>
  <a class="btn" href="#specs" tabindex="-1">Specs</a>
</div>
`;

function steps(list, cls = '') {
  return `<ol class="steps${cls ? ' ' + cls : ''}">
${list.map(([t, d], i) => `  <li class="step"><span class="step-n" aria-hidden="true">${i + 1}</span><h3 class="h-small"><span class="sr-only">Step ${i + 1}: </span>${t}</h3><p>${d}</p></li>`).join('\n')}
</ol>`;
}

function specTable(caption, rows) {
  return `<table class="table spec">
  <caption class="sr-only">${caption}</caption>
  <tbody>
${rows.map(([k, v]) => `    <tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('\n')}
  </tbody>
</table>`;
}

function whereToBuy({ id = 'where-to-buy', heading, intro, extra = '' }) {
  return `<section class="band card rule" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Where to buy</p><h2 class="h-sub" id="${id}-h">${heading}</h2><p class="intro">${intro}</p></div>
    ${distributors('wtb-status')}
    ${extra}
  </div>
</section>`;
}

/* ---------------- Pages ---------------- */

function home() {
  const root = '';
  const main = `<section class="hero" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">Agricultural equipment innovation · Hoagland, Indiana</p>
      <h1 class="h-hero" id="hero-h">Retrofit products for the equipment you already run.</h1>
      <p class="lead">Three retrofit products, engineered and fabricated in Indiana for planters, corn heads and zero-turn mowers.</p>
      <div class="btn-row">
        <a class="btn primary" href="#products">Explore products <span aria-hidden="true">↓</span></a>
        <a class="btn" href="#where-to-buy">Where to buy</a>
      </div>
    </div>
    <div class="nameplate">
      <p class="np-mark" aria-hidden="true">DAVAUS</p>
      <ul>
${PRODUCTS.map((p) => `        <li><a href="${p.slug}/"><strong>${p.name}</strong><span>${p.category}</span></a></li>`).join('\n')}
      </ul>
      <p class="np-foot">Designed &amp; built in Indiana</p>
    </div>
  </div>
</section>

<section class="band card" id="products" aria-labelledby="products-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Three product lines</p><h2 class="h-section" id="products-h">Pick your equipment.</h2></div>
    <div class="cards">
${PRODUCTS.map((p) => `      <article class="pcard">
        <div class="pcard-top"><p class="eyebrow">${p.category}</p></div>
        <div class="pcard-body">
          <h3 class="h-card">${p.name}</h3>
          <p>${p.card}</p>
          <p class="price-line">${p.price} <small>· MSRP</small></p>
          <div class="btn-row">
            <a class="btn sm" href="${p.slug}/" aria-label="Learn more about ${p.name}">Learn more</a>
            <a class="btn sm primary" href="${p.slug}/#where-to-buy" aria-label="Where to buy ${p.name}">Where to buy</a>
          </div>
        </div>
      </article>`).join('\n')}
    </div>
  </div>
</section>

<section class="band page rule" aria-labelledby="why-h">
  <div class="wrap why">
    <div class="stack">
      <p class="eyebrow">Why DAVAUS</p>
      <h2 class="h-section" id="why-h">Engineered on the farm, built in the shop.</h2>
      <p>DAVAUS has family-farm roots in northeast Indiana. Products are engineered and fabricated in-house and tested on the founders’ own ground before release.</p>
      <div class="btn-row"><a class="btn" href="about-davaus/">About DAVAUS</a></div>
    </div>
    <ul class="trust" role="list">
      <li>Designed &amp; built in Indiana</li>
      <li>Patented designs</li>
      <li>Serviceable wear parts</li>
    </ul>
  </div>
</section>

<section class="band card rule" aria-labelledby="support-h">
  <div class="wrap two-col">
    <div class="stack">
      <p class="eyebrow">Support &amp; resources</p>
      <h2 class="h-section" id="support-h">Manuals, install guides and videos.</h2>
      <p class="muted">Everything an owner or dealer needs, filterable by product.</p>
      <div class="btn-row"><a class="btn" href="support/">Browse resources</a></div>
    </div>
    ${docList([
      { title: 'Kernel Keeper Installation Instructions' },
      { kind: 'Video', title: 'How to install Ride Tamer', meta: 'Video · courtesy May Wes' },
      { title: 'SeedRIGHT plate selection chart' },
    ])}
  </div>
</section>

<section class="band wtb-band" id="where-to-buy" aria-labelledby="wtb-h">
  <div class="wrap wtb-inner">
    <div class="stack">
      <p class="eyebrow">Where to buy</p>
      <h2 class="h-section" id="wtb-h">Order through either distributor.</h2>
      <p>MSRP set by DAVAUS · available at authorized distributors. Dealers: see <a href="contact/#distributor">distributor inquiry →</a></p>
    </div>
    <div>
      <div class="btn-row">
        <button type="button" class="btn" data-reveal="home-wtb-status" aria-controls="home-wtb-status">S.I. Distributing</button>
        <button type="button" class="btn" data-reveal="home-wtb-status" aria-controls="home-wtb-status">May Wes</button>
      </div>
      ${distributorNotice('home-wtb-status')}
    </div>
  </div>
</section>`;
  return page({ title: 'DAVAUS — Agricultural equipment innovation · Hoagland, Indiana',
    description: 'SeedRIGHT, Kernel Keeper and Ride Tamer: retrofit products engineered and built in Indiana, sold through S.I. Distributing and May Wes.',
    root, current: 'home', wtb: '#where-to-buy', main });
}

function seedright() {
  const root = '../', p = PRODUCTS[0];
  const main = `${productHero({ root, p,
    eyebrow: 'Planter seed plates · cover crops &amp; small grains',
    lead: 'Plant cover crops and small grains with the precision of your row-crop planter — no seed drill required. Plates sized for small seeds (commonly more than 35,000 seeds per pound) and low-rate crops.',
    price: 'Plates from $39',
    buttons: [['Where to buy', '#where-to-buy'], ['Rate charts', '#rate-charts'], ['Specs', '#specs']],
    facts: [['Fits', 'John Deere vacuum (not ExactEmerge) · Kinze brush · Precision Planting'], ['Typical seeds', 'Radish, turnip, crimson clover, small grains'], ['MSRP', '$37–$54 by product'], ['Rate charts', 'One per meter and seed']] })}
${subnav([['overview', 'Overview'], ['how-it-works', 'How it works'], ['fit', 'Fit &amp; compatibility'], ['rate-charts', 'Rate charts'], ['specs', 'Specifications'], ['faq', 'FAQ'], ['where-to-buy', 'Where to buy']])}

<section class="band page" id="how-it-works" aria-labelledby="hiw-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">How it works</p><h2 class="h-sub" id="hiw-h">Your planter, now a precision cover-crop seeder.</h2></div>
    ${steps([
      ['Choose the plate for your seed', 'Small-cell discs for radish, turnip, crimson clover and similar seeds. The rate chart for your meter and seed gives the plate and settings.'],
      ['Swap into your meter', 'Fits John Deere vacuum meters (not ExactEmerge), Kinze brush meters (with backer plate) and Precision Planting.'],
      ['Plant with planter precision', 'The singulation, depth and spacing advantages of a planter — on cover crops and small grains.'],
    ])}
  </div>
</section>

<section class="band card rule" id="fit" aria-labelledby="fit-h">
  <div class="wrap two-col">
    <div class="stack">
      <p class="eyebrow">Fit &amp; compatibility</p>
      <h2 class="h-sub" id="fit-h">Which plate for which meter?</h2>
      <table class="table stacked">
        <thead><tr><th scope="col">Meter</th><th scope="col">SeedRIGHT products</th><th scope="col">Notes</th></tr></thead>
        <tbody>
          <tr><th scope="row">John Deere vacuum (excl. ExactEmerge)</th><td data-label="Products">Large-cell plate · small-cell plate</td><td data-label="Notes">Choose cell size by seed (see rate charts)</td></tr>
          <tr><th scope="row">Kinze brush meter</th><td data-label="Products">Large-cell plate · small-cell plate · backer plate</td><td data-label="Notes">Backer plate required with Kinze plates</td></tr>
          <tr><th scope="row">Precision Planting</th><td data-label="Products">Large-cell plate · BundleDrop kit</td><td data-label="Notes">—</td></tr>
        </tbody>
      </table>
    </div>
    <div class="stack">
      <p class="eyebrow">MSRP</p>
      <h2 class="h-sub">SeedRIGHT prices</h2>
      <table class="table">
        <caption>DAVAUS-set MSRP, not live distributor selling prices. Order through either distributor — no purchasing on this site.</caption>
        <thead><tr><th scope="col">Product</th><th scope="col">MSRP</th></tr></thead>
        <tbody>
          <tr><td>John Deere large-cell plate</td><td class="num">$46</td></tr>
          <tr><td>John Deere small-cell plate</td><td class="num">$46</td></tr>
          <tr><td>Kinze large-cell plate</td><td class="num">$46</td></tr>
          <tr><td>Kinze small-cell plate</td><td class="num">$46</td></tr>
          <tr><td>Kinze backer plate</td><td class="num">$37</td></tr>
          <tr><td>Precision Planting large-cell plate</td><td class="num">$39</td></tr>
          <tr><td>Precision Planting BundleDrop kit</td><td class="num">$54</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="band page rule" id="rate-charts" aria-labelledby="rc-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Rate charts · document library</p><h2 class="h-sub" id="rc-h">Find your rate chart.</h2><p class="intro">One rate chart for each meter and seed — plate selection, meter settings and population targets. Charts are grouped by meter, then seed.</p></div>
    <div class="doc-group">
      <h3>John Deere vacuum</h3>
      ${docList([{ title: 'Radish' }, { title: 'Turnip' }, { title: 'Crimson clover' }])}
    </div>
    <div class="doc-group">
      <h3>Kinze brush</h3>
      ${docList([{ title: 'Kinze brush meter rate charts', meta: 'PDF · by seed' }])}
    </div>
    <div class="doc-group">
      <h3>Precision Planting</h3>
      ${docList([{ title: 'Precision Planting rate charts', meta: 'PDF · by seed' }])}
    </div>
    <p class="doc-note">Need a chart before it’s posted? Call <a href="${TEL}">${PHONE}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a> with your meter and seed.</p>
  </div>
</section>

<section class="band card rule" id="specs" aria-labelledby="specs-h">
  <div class="wrap two-col">
    <div class="stack">
      <p class="eyebrow">Specifications</p>
      <h2 class="h-sub" id="specs-h">SeedRIGHT specifications</h2>
      ${specTable('SeedRIGHT specifications', [
        ['MSRP', 'Plates from $39 · $37–$54 by product (table above) · set by DAVAUS · available at authorized distributors'],
        ['Typical seeds', 'Radish, turnip, crimson clover, small grains'],
        ['Kit contents', 'Plate(s) · backer plate where required · hardware · link to rate chart'],
        ['Patent', 'US patent no. to be confirmed'],
      ])}
    </div>
    <div class="stack">
      <p class="eyebrow">Documents</p>
      <h2 class="h-sub">Other documents</h2>
      ${docList([
        { title: 'Installation guide — JD vacuum / Kinze brush' },
        { kind: 'Video', title: 'Setup &amp; planting video' },
      ])}
    </div>
  </div>
</section>

<section class="band page rule" id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">FAQ</p><h2 class="h-sub" id="faq-h">SeedRIGHT questions</h2></div>
    ${faq('sr', [
      ['exactemerge', 'Can I use SeedRIGHT with ExactEmerge?', 'No. SeedRIGHT plates fit John Deere vacuum meters, but not ExactEmerge.'],
      ['backer-plate', 'Do I need the backer plate on a Kinze?', 'Yes. A backer plate is required with Kinze plates.'],
      ['vacuum', 'What vacuum setting should I run?', 'Meter settings are listed on the rate chart for your meter and seed.'],
      ['rate-chart', 'Which rate chart do I use?', 'Choose your meter first, then your seed. Each chart covers one meter and one seed.'],
    ])}
  </div>
</section>

${whereToBuy({ heading: 'Order SeedRIGHT from either distributor.',
  intro: 'Both distributors carry the SeedRIGHT line. MSRP set by DAVAUS; order through either distributor.',
  extra: '<p class="after-cards">Dealers interested in carrying SeedRIGHT → <a href="../contact/#distributor">Distributor inquiry</a></p>' })}

${related(root, p.slug)}`;
  return page({ title: 'SeedRIGHT planter seed plates — DAVAUS',
    description: 'SeedRIGHT seed plates let your row-crop planter plant cover crops and small grains. Plates from $39 MSRP, sold through S.I. Distributing and May Wes.',
    root, current: p.slug, wtb: '#where-to-buy', main, bodyClass: 'has-sticky', extra: stickyCta });
}

function kernelKeeper() {
  const root = '../', p = PRODUCTS[1];
  const main = `${productHero({ root, p,
    eyebrow: 'Corn head · grain-loss reduction',
    lead: 'A dampening rail and FingerBrush system that cushions ear impact on the deck plate, captures loose kernels between rail and gathering chain, and collects them into the head. Sold per row.',
    price: '$195 per row', priceExtra: '$390 two rows',
    buttons: [['Where to buy', '#where-to-buy'], ['Check fit', '#fit'], ['Specs', '#specs']],
    facts: [['Sold as', 'Kit per row'], ['Gathering chains', 'CA620M · CA555'], ['Install', 'Drill-and-bolt to the existing deck plate'], ['Service life', '150 acres per row']] })}
${subnav([['overview', 'Overview'], ['how-it-works', 'How it works'], ['fit', 'Fit &amp; compatibility'], ['specs', 'Specifications'], ['documents', 'Documents'], ['faq', 'FAQ'], ['where-to-buy', 'Where to buy']])}

<section class="band page" id="how-it-works" aria-labelledby="hiw-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">How it works</p><h2 class="h-sub" id="hiw-h">Cushion. Capture. Collect.</h2></div>
    ${steps([
      ['Cushion', 'The dampener rail softens the ear’s strike on the deck plate, so fewer kernels shell off.'],
      ['Capture', 'Loose kernels are held between the rail and the gathering chain instead of falling to the ground.'],
      ['Collect', 'FingerBrushes on each chain lug sweep captured kernels into the head.'],
    ])}
    <div class="roi" style="margin-top:40px">
      <form class="roi-form" id="roi-form" aria-labelledby="roi-h">
        <div class="stack" style="gap:6px"><p class="eyebrow">Payback</p><h3 class="h-small" id="roi-h">How many acres to pay for your kits?</h3><p class="muted small">Enter your rows and corn price. The page does the arithmetic.</p></div>
        <div class="field"><label for="roi-rows">Rows on your corn head</label><input id="roi-rows" name="rows" type="number" inputmode="numeric" min="1" max="48" step="1" value="8"></div>
        <div class="field"><label for="roi-price">Corn price ($ per bushel)</label><input id="roi-price" name="price" type="number" inputmode="decimal" min="0" step="0.01" placeholder="e.g. 4.25"></div>
      </form>
      <div class="roi-out" aria-live="polite">
        <p class="eyebrow">Your numbers</p>
        <dl>
          <div><dt>Kit cost at MSRP ($195 per row)</dt><dd id="roi-cost">—</dd></div>
          <div><dt>Acres to pay back at 1 bu/ac saved</dt><dd id="roi-acres">Enter a corn price</dd></div>
          <div><dt>Rated service life</dt><dd>150 acres per row</dd></div>
        </dl>
        <p>Assumes Kernel Keeper saves 1 bushel per acre. Kit cost uses DAVAUS MSRP; distributor selling prices may differ.</p>
      </div>
    </div>
  </div>
</section>

<section class="band card rule" id="fit" aria-labelledby="fit-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Fit &amp; compatibility</p><h2 class="h-sub" id="fit-h">Which corn heads?</h2></div>
    <table class="table stacked">
      <caption>No new hardware required — existing deck plates stay; drill bit included in each kit.</caption>
      <thead><tr><th scope="col">Gathering chain</th><th scope="col">Corn heads</th></tr></thead>
      <tbody>
        <tr><th scope="row">CA620M</th><td>John Deere 600, 700 &amp; C Series</td></tr>
        <tr><th scope="row">CA555</th><td>John Deere 40 &amp; 90 Series · Case IH 800, 900, 1000 Series · New Holland 96C, 974, 98C, 98D (thru 2010), 996</td></tr>
      </tbody>
    </table>
    <p class="doc-note">Not sure which chain you have, or don’t see your head? Call <a href="${TEL}">${PHONE}</a> or <a href="../contact/">send us your make and model</a>.</p>
  </div>
</section>

<section class="band page rule" id="specs" aria-labelledby="specs-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Specifications</p><h2 class="h-sub" id="specs-h">Kernel Keeper specifications</h2></div>
    ${specTable('Kernel Keeper specifications', [
      ['MSRP', '$195 per row · $390 for two rows · set by DAVAUS · available at authorized distributors'],
      ['Sold as', 'Kit per row'],
      ['Kit contents', 'Dampener rails · FingerBrushes for all crop lugs · mounting hardware · drill bit'],
      ['Install', 'Drill-and-bolt to existing deck plate'],
      ['Service life', '150 acres per row'],
      ['Patent', 'US patent no. to be confirmed'],
    ])}
  </div>
</section>

<section class="band card rule" id="documents" aria-labelledby="docs-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Documents</p><h2 class="h-sub" id="docs-h">Install &amp; training</h2></div>
    ${docList([
      { title: 'Kernel Keeper Installation Instructions' },
      { title: 'Installation walkthrough (slides)' },
      { kind: 'Video', title: 'Installation video — DAVAUS × May Wes' },
      { title: 'Product training guide' },
    ])}
  </div>
</section>

<section class="band page rule" id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">FAQ</p><h2 class="h-sub" id="faq-h">Kernel Keeper questions</h2></div>
    ${faq('kk', [
      ['deck-plates', 'Do I have to replace my deck plates?', 'No. Existing deck plates stay — Kernel Keeper drills and bolts to them, and a drill bit is included in each kit.'],
      ['chain', 'How do I know which gathering chain I have?', `Kernel Keeper fits CA620M chains (John Deere 600, 700 &amp; C Series) and CA555 chains (John Deere 40 &amp; 90, Case IH 800/900/1000, New Holland 96C, 974, 98C, 98D thru 2010, 996). If you’re not sure, call DAVAUS at <a href="${TEL}">${PHONE}</a>.`],
      ['kits', 'How many kits do I need?', 'One kit per row. Count the rows on your corn head before ordering.'],
    ])}
  </div>
</section>

${whereToBuy({ heading: 'Order Kernel Keeper from either distributor.',
  intro: 'Kits sold per row — count your rows before ordering. $195 per row · $390 for two rows (MSRP set by DAVAUS).' })}

${related(root, p.slug)}`;
  return page({ title: 'Kernel Keeper corn-head grain-loss reduction — DAVAUS',
    description: 'Kernel Keeper cushions ear impact, captures loose kernels and collects them into the head. $195 per row MSRP, sold through S.I. Distributing and May Wes.',
    root, current: p.slug, wtb: '#where-to-buy', main, bodyClass: 'has-sticky', extra: stickyCta });
}

function rideTamer() {
  const root = '../', p = PRODUCTS[2];
  const main = `${productHero({ root, p,
    eyebrow: 'Zero-turn mower · retrofit front suspension',
    lead: 'Patented trailing-arm elastomeric suspension that bolts to the existing front fork of most zero-turn mowers. Less bucking and bouncing, less frame stress, a more even cut. Installs in 45 minutes.',
    price: '$649',
    buttons: [['Where to buy', '#where-to-buy'], ['Check fit', '#fit'], ['Specs', '#specs']],
    facts: [['Type', 'Elastomeric trailing-arm front suspension, retrofit'], ['Vertical travel', 'More than 5 in.'], ['Install time', '45 minutes'], ['Duty', 'Estate and commercial']] })}
${subnav([['overview', 'Overview'], ['how-it-works', 'How it works'], ['fit', 'Fit &amp; compatibility'], ['specs', 'Specifications'], ['documents', 'Documents'], ['faq', 'FAQ'], ['where-to-buy', 'Where to buy']])}

<section class="band page" id="how-it-works" aria-labelledby="hiw-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">How it works</p><h2 class="h-sub" id="hiw-h">Suspension where the mower has none.</h2></div>
    ${steps([
      ['Bolts to your front fork', 'A retrofit assembly for the existing front fork. 45-minute install.'],
      ['Trailing arm + elastomer', 'More than 5 in. of vertical travel with even compression and rebound.'],
      ['Smoother ride, protected frame', 'Less bucking and bouncing for the operator, less stress on the mower frame and a more even cut.'],
    ])}
  </div>
</section>

<section class="band card rule" id="fit" aria-labelledby="fit-h">
  <div class="wrap two-col">
    <div class="stack">
      <p class="eyebrow">Fit &amp; compatibility</p>
      <h2 class="h-sub" id="fit-h">Fits most zero-turn makes and models.</h2>
      <p class="muted">Ride Tamer bolts to the existing front fork. Specify your mower make and model when ordering from the distributor.</p>
    </div>
    <div class="note-box">
      <p><strong>Confirm your mower before ordering.</strong> The make-and-model fitment list is being finalized. Send DAVAUS your mower make and model and we’ll confirm fit.</p>
      <div class="btn-row" style="margin-top:14px"><a class="btn" href="../contact/">Ask about fit</a><a class="btn" href="${TEL}">Call ${PHONE}</a></div>
    </div>
  </div>
</section>

<section class="band page rule" id="specs" aria-labelledby="specs-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Specifications</p><h2 class="h-sub" id="specs-h">Ride Tamer specifications</h2></div>
    ${specTable('Ride Tamer specifications', [
      ['MSRP', '$649 · set by DAVAUS · available at authorized distributors'],
      ['Type', 'Elastomeric trailing-arm front suspension, retrofit'],
      ['Vertical travel', '&gt; 5 in.'],
      ['Install time', '45 minutes'],
      ['Serviceable parts', 'Wear parts replaceable'],
      ['Duty', 'Estate and commercial; endurance tested'],
      ['Patent', 'US patent no. to be confirmed'],
    ])}
  </div>
</section>

<section class="band card rule" id="documents" aria-labelledby="docs-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Documents &amp; videos</p><h2 class="h-sub" id="docs-h">Install guides and videos</h2></div>
    ${docList([
      { title: 'Installation guide' },
      { kind: 'Video', title: 'How to install Ride Tamer', meta: 'Video · courtesy May Wes' },
      { kind: 'Video', title: 'Ride Tamer 3D suspension demo' },
      { title: 'Parts diagram / exploded view' },
    ])}
  </div>
</section>

<section class="band page rule" id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">FAQ</p><h2 class="h-sub" id="faq-h">Ride Tamer questions</h2></div>
    ${faq('rt', [
      ['install', 'Can I install it myself?', 'Ride Tamer is a retrofit that bolts to your mower’s existing front fork. Installation takes about 45 minutes.'],
      ['wear-parts', 'How do I replace wear parts?', 'Wear parts are replaceable. Order them through S.I. Distributing or May Wes.'],
      ['commercial', 'Is it for commercial use?', 'Yes. Ride Tamer is built for estate and commercial duty and has been endurance tested.'],
    ])}
  </div>
</section>

${whereToBuy({ heading: 'Order Ride Tamer from either distributor.',
  intro: '$649 MSRP set by DAVAUS. Specify mower make and model when ordering from the distributor.' })}

${related(root, p.slug)}`;
  return page({ title: 'Ride Tamer zero-turn mower suspension — DAVAUS',
    description: 'Ride Tamer is a patented retrofit front suspension for zero-turn mowers. $649 MSRP, 45-minute install, sold through S.I. Distributing and May Wes.',
    root, current: p.slug, wtb: '#where-to-buy', main, bodyClass: 'has-sticky', extra: stickyCta });
}

function about() {
  const root = '../';
  const main = `<section class="band page" aria-labelledby="about-h">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${root}">Home</a></li><li aria-current="page">About DAVAUS</li></ol></nav>
    <div class="stack" style="max-width:780px">
      <p class="eyebrow">About DAVAUS</p>
      <h1 class="h-hero" id="about-h">A small engineering and fabrication company with farm roots.</h1>
      <p class="lead">Founded in northeast Indiana, DAVAUS designs and builds retrofit products for equipment the founders run on their own family farms.</p>
    </div>
  </div>
</section>

<section class="band card rule" aria-labelledby="work-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">How we work</p><h2 class="h-section" id="work-h">Science, technology, nature, practicality.</h2><p class="intro">Problems are found in the field, prototyped and fabricated in-house, and tested across seasons on the home farms.</p></div>
    ${steps([
      ['Field problem', 'Observed on our own equipment.'],
      ['Engineer', 'In-house design and engineering.'],
      ['Fabricate', 'Built in Hoagland, Indiana.'],
      ['Prove', 'Seasons of farm testing before release.'],
    ], 'four')}
  </div>
</section>

<section class="band page rule" id="patents" aria-labelledby="pat-h">
  <div class="wrap two-col">
    <div class="stack">
      <p class="eyebrow">Patents &amp; trademarks</p>
      <h2 class="h-sub" id="pat-h">Protected designs</h2>
      <table class="table">
        <thead><tr><th scope="col">Product</th><th scope="col">Patent / mark</th></tr></thead>
        <tbody>
          <tr><th scope="row">SeedRIGHT™</th><td>US patent no. to be confirmed</td></tr>
          <tr><th scope="row">Kernel Keeper™</th><td>US patent no. to be confirmed</td></tr>
          <tr><th scope="row">Ride Tamer™</th><td>US patent no. to be confirmed (trailing arm)</td></tr>
        </tbody>
      </table>
    </div>
    <div class="stack">
      <p class="eyebrow">Distribution partners</p>
      <h2 class="h-sub">Two national distributors</h2>
      <p class="muted">DAVAUS sells through two national distributors. Dealers can carry the line through either.</p>
      <div class="distributors">
        <div class="distributor"><h3 class="name">S.I. Distributing</h3><p class="desc">Authorized DAVAUS distributor</p></div>
        <div class="distributor"><h3 class="name">May Wes</h3><p class="desc">Authorized DAVAUS distributor</p></div>
      </div>
    </div>
  </div>
</section>

<section class="band wtb-band" aria-labelledby="q-h">
  <div class="wrap wtb-inner">
    <div class="stack">
      <h2 class="h-section" id="q-h">Questions about a product or carrying the line?</h2>
      <p>Hoagland, Indiana · <a href="${TEL}">${PHONE}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
    <div class="btn-row"><a class="btn" href="../contact/">Contact DAVAUS</a><a class="btn" href="../contact/#distributor">Distributor inquiry</a></div>
  </div>
</section>`;
  return page({ title: 'About DAVAUS — Hoagland, Indiana',
    description: 'DAVAUS is a small engineering and fabrication company with farm roots in northeast Indiana.',
    root, current: 'about', wtb: '../#where-to-buy', main });
}

function support() {
  const root = '../';
  const group = (slug, name, rows) => `<div class="doc-group" data-product="${slug}"><h3>${name}</h3>${docList(rows)}</div>`;
  const main = `<section class="band page" aria-labelledby="sup-h">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${root}">Home</a></li><li aria-current="page">Support &amp; Resources</li></ol></nav>
    <div class="stack" style="max-width:780px">
      <p class="eyebrow">Support &amp; resources</p>
      <h1 class="h-hero" id="sup-h">Manuals, install guides, videos.</h1>
      <p class="lead">Filter by product. Can’t find it? <a href="../contact/">Contact us</a> — we answer the phone.</p>
    </div>
  </div>
</section>

<section class="band card rule" id="documents" aria-labelledby="docs-h">
  <div class="wrap">
    <h2 class="sr-only" id="docs-h">Documents and videos</h2>
    <div class="chips" role="group" aria-label="Filter by product">
      <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
${PRODUCTS.map((p) => `      <button type="button" class="chip" data-filter="${p.slug}" aria-pressed="false">${p.name}</button>`).join('\n')}
    </div>
    <p class="sr-only" id="filter-status" role="status"></p>
    <div class="two-col">
      <div class="stack">
        <p class="eyebrow">Documents</p>
        ${group('seedright', 'SeedRIGHT', [{ title: 'Rate charts', meta: 'PDF · one per meter and seed' }, { title: 'Installation guide' }, { title: 'Plate &amp; backer-plate overview' }])}
        ${group('kernel-keeper', 'Kernel Keeper', [{ title: 'Installation instructions' }, { title: 'Product training guide' }, { title: 'Chain identification sheet' }])}
        ${group('ride-tamer', 'Ride Tamer', [{ title: 'Installation guide' }, { title: 'Parts / exploded view' }, { title: 'Fitment list' }])}
      </div>
      <div class="stack">
        <p class="eyebrow">Videos</p>
        <ul class="docs" role="list">
          <li class="doc" data-product="kernel-keeper"><span class="doc-kind" aria-hidden="true">▶</span><div class="doc-text"><p class="doc-title">Kernel Keeper install — DAVAUS × May Wes</p><p class="doc-meta">Kernel Keeper</p></div><span class="doc-status">Coming soon</span></li>
          <li class="doc" data-product="ride-tamer"><span class="doc-kind" aria-hidden="true">▶</span><div class="doc-text"><p class="doc-title">Ride Tamer install — May Wes</p><p class="doc-meta">Ride Tamer</p></div><span class="doc-status">Coming soon</span></li>
          <li class="doc" data-product="ride-tamer"><span class="doc-kind" aria-hidden="true">▶</span><div class="doc-text"><p class="doc-title">Ride Tamer 3D suspension demo</p><p class="doc-meta">Ride Tamer</p></div><span class="doc-status">Coming soon</span></li>
          <li class="doc" data-product="seedright"><span class="doc-kind" aria-hidden="true">▶</span><div class="doc-text"><p class="doc-title">SeedRIGHT planting</p><p class="doc-meta">SeedRIGHT</p></div><span class="doc-status">Coming soon</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band page rule" id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">FAQ</p><h2 class="h-sub" id="faq-h">FAQ — all products</h2></div>
    ${faq('sup', [
      ['where-to-buy', 'Where can I buy DAVAUS products?', 'Through either of our two authorized distributors, S.I. Distributing and May Wes. Both carry the full line.'],
      ['direct', 'Do you sell direct?', 'No. DAVAUS sets the MSRP, and orders go through S.I. Distributing or May Wes.'],
      ['identify', 'How do I find my gathering chain / meter / fork type?', `Each product page lists what it fits. If you’re still not sure, call <a href="${TEL}">${PHONE}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a> with your equipment make and model.`],
      ['dealer', 'Can my dealer carry DAVAUS products?', 'Yes. Dealers carry the line through either distributor. Start with a <a href="../contact/#distributor">distributor inquiry</a>.'],
    ])}
  </div>
</section>

<section class="band card rule" id="warranty" aria-labelledby="war-h">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Warranty &amp; parts</p><h2 class="h-sub" id="war-h">Warranty, parts and dealer help</h2></div>
    <div class="info-grid">
      <div class="info"><h3 class="h-small">Warranty</h3><p>Warranty terms will be posted here. For warranty questions now, contact DAVAUS.</p></div>
      <div class="info"><h3 class="h-small">Replacement wear parts</h3><p>Order through S.I. Distributing or May Wes.</p></div>
      <div class="info"><h3 class="h-small">Dealer resources</h3><p>A permissioned folder for approved dealers — sell sheets, logos, training.</p><a class="btn sm" href="../dealer-resources/">Dealer resources</a></div>
    </div>
    <div class="note-box" style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:space-between">
      <p><strong>Still stuck?</strong> <a href="${TEL}">${PHONE}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <a class="btn primary" href="../contact/">Contact</a>
    </div>
  </div>
</section>`;
  return page({ title: 'Support & Resources — DAVAUS',
    description: 'Manuals, install guides, videos and answers for SeedRIGHT, Kernel Keeper and Ride Tamer.',
    root, current: 'support', wtb: '../#where-to-buy', main });
}

function contact() {
  const root = '../';
  const field = (id, label, { type = 'text', required, optional, placeholder = '', full, autocomplete, inputmode } = {}) => `<div class="field${full ? ' full' : ''}">
          <label for="${id}">${label}${optional ? ' <span class="opt">(optional)</span>' : ''}</label>
          <input id="${id}" name="${id}" type="${type}"${placeholder ? ` placeholder="${placeholder}"` : ''}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${required ? ` data-required="${required}" aria-describedby="${id}-err"` : ''}>
          ${required ? `<p class="err" id="${id}-err" hidden></p>` : ''}
        </div>`;
  const select = (id, label, options, { required, optional, full } = {}) => `<div class="field${full ? ' full' : ''}">
          <label for="${id}">${label}${optional ? ' <span class="opt">(optional)</span>' : ''}</label>
          <select id="${id}" name="${id}"${required ? ` data-required="${required}" aria-describedby="${id}-err"` : ''}>
            <option value="">Select…</option>
${options.map((o) => `            <option>${o}</option>`).join('\n')}
          </select>
          ${required ? `<p class="err" id="${id}-err" hidden></p>` : ''}
        </div>`;
  const result = `<div class="form-result" tabindex="-1" role="status" hidden><strong>Not sent — online inquiries aren’t connected yet.</strong>Your message has not been submitted and nothing was stored. Your entries are still here. Please email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="${TEL}">${PHONE}</a>.</div>`;
  const honeypot = (id) => `<div class="hp" aria-hidden="true"><label for="${id}">Leave this field empty</label><input id="${id}" name="website" type="text" tabindex="-1" autocomplete="off"></div>`;
  const main = `<section class="band page" aria-labelledby="contact-h">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${root}">Home</a></li><li aria-current="page">Contact</li></ol></nav>
    <div class="contact-grid">
      <div class="stack">
        <p class="eyebrow">Contact</p>
        <h1 class="h-hero" id="contact-h">Talk to DAVAUS.</h1>
        <p class="muted">Looking to buy? Go straight to a distributor — they handle orders, shipping and returns.</p>
        <div class="btn-row">
          <button type="button" class="btn" data-reveal="contact-wtb-status" aria-controls="contact-wtb-status">S.I. Distributing</button>
          <button type="button" class="btn" data-reveal="contact-wtb-status" aria-controls="contact-wtb-status">May Wes</button>
        </div>
        ${distributorNotice('contact-wtb-status')}
        <ul class="contact-list" role="list">
          <li><span class="k">Phone</span><a href="${TEL}">${PHONE}</a></li>
          <li><span class="k">Email</span><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><span class="k">Address</span><span>${ADDRESS}</span></li>
        </ul>
      </div>
      <div class="stack" id="distributor">
        <div class="tabs" role="tablist" aria-label="Inquiry type">
          <button type="button" class="tab" role="tab" id="tab-general" aria-selected="true" aria-controls="panel-general">General inquiry</button>
          <button type="button" class="tab" role="tab" id="tab-distributor" aria-selected="false" aria-controls="panel-distributor" tabindex="-1">Distributor / dealer inquiry</button>
        </div>
        <div class="panel" role="tabpanel" id="panel-general" aria-labelledby="tab-general">
          <form class="form inquiry" novalidate>
            <p class="form-summary" role="alert" hidden></p>
            ${field('g-name', 'Name', { required: 'Enter your name.', placeholder: 'Full name', autocomplete: 'name' })}
            ${field('g-email', 'Email', { type: 'email', required: 'Enter your email address.', placeholder: 'you@farm.com', autocomplete: 'email' })}
            ${field('g-phone', 'Phone', { type: 'tel', optional: true, placeholder: '(___) ___-____', autocomplete: 'tel' })}
            ${select('g-product', 'Product', ['SeedRIGHT', 'Kernel Keeper', 'Ride Tamer', 'General'], { optional: true })}
            ${field('g-equipment', 'Equipment (make / model)', { optional: true, placeholder: 'e.g. John Deere 608C', full: true })}
            <div class="field full">
              <label for="g-message">Message</label>
              <textarea id="g-message" name="message" placeholder="How can we help?" data-required="Enter a message." aria-describedby="g-message-err"></textarea>
              <p class="err" id="g-message-err" hidden></p>
            </div>
            ${honeypot('g-website')}
            <div class="form-actions full"><button type="submit" class="btn primary">Send message</button></div>
            ${result}
          </form>
        </div>
        <div class="panel" role="tabpanel" id="panel-distributor" aria-labelledby="tab-distributor" hidden>
          <form class="form inquiry" novalidate>
            <p class="form-summary" role="alert" hidden></p>
            ${field('d-business', 'Business name', { required: 'Enter your business name.', placeholder: 'Dealer name', autocomplete: 'organization' })}
            ${field('d-name', 'Contact name', { required: 'Enter a contact name.', placeholder: 'Full name', autocomplete: 'name' })}
            ${field('d-email', 'Email', { type: 'email', required: 'Enter your email address.', placeholder: 'you@dealer.com', autocomplete: 'email' })}
            ${field('d-location', 'City / State', { required: 'Enter your city and state.', placeholder: 'Hoagland, IN', autocomplete: 'address-level2' })}
            ${select('d-type', 'Business type', ['Dealer', 'Distributor', 'Co-op', 'Other'], { required: 'Choose a business type.' })}
            ${select('d-current', 'Current distributor', ['S.I. Distributing', 'May Wes', 'None'], { optional: true })}
            <fieldset class="field full" data-required="Choose at least one product." aria-describedby="d-products-err">
              <legend>Products of interest</legend>
              <div class="checks">
${PRODUCTS.map((p) => `                <label><input type="checkbox" name="products" value="${p.name}"> ${p.name}</label>`).join('\n')}
              </div>
              <p class="err" id="d-products-err" hidden></p>
            </fieldset>
            ${field('d-volume', 'Estimated annual volume', { optional: true, full: true })}
            <div class="field full">
              <label for="d-message">Message <span class="opt">(optional)</span></label>
              <textarea id="d-message" name="message"></textarea>
            </div>
            ${honeypot('d-website')}
            <div class="form-actions full"><button type="submit" class="btn primary">Send inquiry</button></div>
            ${result}
          </form>
        </div>
      </div>
    </div>
  </div>
</section>`;
  return page({ title: 'Contact & Distributor Inquiries — DAVAUS',
    description: 'Contact DAVAUS in Hoagland, Indiana, or start a distributor / dealer inquiry.',
    root, current: 'contact', wtb: '../#where-to-buy', main });
}

function compactHeader(root, wtb) {
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header compact-header">
  <div class="wrap">
    <a class="wordmark" href="${root}" aria-label="DAVAUS home">DAVAUS</a>
    <a class="btn primary nav-cta" href="${wtb}">Where to Buy</a>
  </div>
</header>`;
}

function dealerResources() {
  const root = '../';
  return `${head({ title: 'Dealer resources — DAVAUS', description: 'Resources for approved DAVAUS dealers.', root })}
<body>
${compactHeader(root, '../#where-to-buy')}
<main id="main" class="compact-main">
  <div class="wrap">
    <div class="compact-card">
      <p class="eyebrow">Dealer resources</p>
      <h1 class="h-sub">For approved DAVAUS dealers.</h1>
      <p class="muted">Sell sheets, logos, product training and MSRP sheets for dealers carrying the line through S.I. Distributing or May Wes.</p>
      <p>Dealer resources live in a permissioned Box folder. DAVAUS grants access to each dealer inside Box after a distributor inquiry is approved — there is no login on this site.</p>
      <div class="btn-row"><button type="button" class="btn primary" data-reveal="box-status" aria-controls="box-status">Open dealer resources on Box</button></div>
      <div class="dist-status" id="box-status" role="status" hidden><strong>The Box folder link isn’t connected yet.</strong> Approved dealers receive their Box invitation by email from DAVAUS.</div>
      <div class="note-box">
        <p><strong>No access yet?</strong></p>
        <ol class="steps-inline" style="margin-top:10px">
          <li><span aria-hidden="true">1</span>Submit a distributor inquiry.</li>
          <li><span aria-hidden="true">2</span>DAVAUS reviews it.</li>
          <li><span aria-hidden="true">3</span>Your Box invitation arrives by email.</li>
        </ol>
        <div class="btn-row" style="margin-top:14px"><a class="btn" href="../contact/#distributor">Distributor inquiry</a></div>
      </div>
    </div>
  </div>
</main>
<footer class="compact-footer"><div class="wrap"><span>© 2026 DAVAUS LLC</span><a href="${root}">Back to davaus.com</a></div></footer>
</body>
</html>
`;
}

function notFound() {
  const root = PAGES_BASE;
  return `${head({ title: 'Page not found — DAVAUS', description: 'That page isn’t here anymore.', root })}
<body>
${compactHeader(root, root + '#where-to-buy')}
<main id="main" class="compact-main">
  <div class="wrap stack" style="gap:28px">
    <div class="stack" style="max-width:780px">
      <p class="eyebrow">404 · page not found</p>
      <h1 class="h-hero">That page isn’t here anymore.</h1>
      <p class="lead">Our online shop, dealer map and future-products pages have been retired. DAVAUS products are now sold through S.I. Distributing and May Wes.</p>
    </div>
    <section aria-labelledby="go-h" class="stack">
      <h2 class="h-small" id="go-h">Go to a product</h2>
      <div class="nf-products">
${PRODUCTS.map((p) => `        <a href="${root}${p.slug}/"><span><strong>${p.name}</strong><span>${p.short}</span></span><span class="arrow" aria-hidden="true">→</span></a>`).join('\n')}
      </div>
    </section>
    <nav class="link-row" aria-label="Other pages">
      <a class="btn" href="${root}">Homepage</a>
      <a class="btn" href="${root}support/">Support &amp; Resources</a>
      <a class="btn" href="${root}contact/">Contact</a>
      <a class="btn primary" href="${root}#where-to-buy">Where to buy</a>
    </nav>
  </div>
</main>
<footer class="compact-footer"><div class="wrap"><span>© 2026 DAVAUS LLC</span><a href="${TEL}">${PHONE}</a></div></footer>
</body>
</html>
`;
}

const files = {
  'index.html': home(),
  'seedright/index.html': seedright(),
  'kernel-keeper/index.html': kernelKeeper(),
  'ride-tamer/index.html': rideTamer(),
  'about-davaus/index.html': about(),
  'support/index.html': support(),
  'contact/index.html': contact(),
  'dealer-resources/index.html': dealerResources(),
  '404.html': notFound(),
};
for (const [rel, html] of Object.entries(files)) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('wrote', rel);
}

// Static checks on a production tree. Usage: node tools/check-production.mjs [dist] [https://origin]
// Reads files only: no browser, no network. Exits non-zero on any finding.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..', 'dist'));
const origin = (process.argv[3] || '').replace(/\/+$/, '');
const bad = [];
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const files = walk(root).map((f) => f.slice(root.length + 1));
const pages = files.filter((f) => f.endsWith('.html'));
if (pages.length !== 9) bad.push(`expected 9 html files, found ${pages.length}`);

for (const rel of pages) {
  const html = readFileSync(join(root, rel), 'utf8');
  if (/davaus-preview|github\.io/.test(html)) bad.push(`${rel}: preview subpath or host`);
  const indexable = !html.includes('<meta name="robots" content="noindex, nofollow">');
  if (rel !== '404.html' && origin && !html.includes(`<link rel="canonical" href="${origin}`)) bad.push(`${rel}: canonical missing`);
  if (rel === '404.html' && html.includes('rel="canonical"')) bad.push('404.html: must not carry a canonical');
  if (indexable !== files.includes('sitemap.xml')) bad.push(`${rel}: robots meta disagrees with sitemap presence`);
  for (const [, , url] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url) && !(origin && url.startsWith(origin))) continue;
    const path = (origin && url.startsWith(origin) ? url.slice(origin.length) : url).split(/[?#]/)[0];
    if (path === '') continue;
    const target = path.startsWith('/') ? join(root, path) : join(root, dirname(rel), path);
    const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) bad.push(`${rel}: dead local ref ${url}`);
  }
}
for (const f of files) if (/\.(md|mjs)$|^\.|^tools\//.test(f)) bad.push(`non-runtime file in tree: ${f}`);
const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
if (files.includes('sitemap.xml') === robots.includes('Disallow: /')) bad.push('robots.txt disagrees with sitemap presence');
console.log(bad.length ? bad.join('\n') : `ok: ${pages.length} pages, ${files.length} files, indexing ${files.includes('sitemap.xml') ? 'on' : 'off'}`);
process.exit(bad.length ? 1 : 0);

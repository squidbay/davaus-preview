# Production build

The preview (GitHub Pages, repository root) and the production tree come from the same templates in `tools/build.mjs`. The preview is unchanged by this document: `node tools/build.mjs` still writes the nine pages into the repository root.

## Build the production tree

```bash
SITE_TARGET=production PUBLIC_ORIGIN=https://<host> node tools/build.mjs
node tools/check-production.mjs dist https://<host>
```

Add `SEARCH_INDEXING=on` only at launch. Neither command needs `npm install`; both use Node's standard library (Node 20+).

| | `SEARCH_INDEXING` unset (default) | `SEARCH_INDEXING=on` |
|---|---|---|
| Page `robots` meta | `noindex, nofollow` | removed |
| `robots.txt` | `Disallow: /` | `Allow: /` + sitemap |
| `X-Robots-Tag` header | `noindex` | none |
| `sitemap.xml` | none | the eight public pages |

`PUBLIC_ORIGIN` has no default and must be `https://` plus a host only. The build refuses to run without it, so no production tree can carry a guessed domain. A first deploy to any throwaway hostname stays unindexed.

## What differs from the preview

- Links use `/` instead of the `/davaus-preview/` project path (affects only `404.html`; every other page already uses relative links).
- Each page except the 404 carries a canonical link and a per-page `og:url`; the share card and icons use the origin.
- `dist/` holds runtime files only: the nine pages, `assets/`, icons, `og.jpg`, `robots.txt`, `_headers` and, with indexing on, `sitemap.xml`. No sources, notes or tools.
- `_headers` sets `nosniff`, a referrer policy and a permissions policy. It sets **no Content-Security-Policy**: the pages use inline `style` attributes and a policy needs a browser pass before it is trusted.
- Nothing about layout, copy, scripts, forms or styling changes. `assets/js/site.js` is copied as is.

## Checks

`tools/check-production.mjs` reads files only (no browser, no network). It checks nine pages, no preview path or host left behind, canonical present (404 excluded), every local `href`/`src` resolves inside the tree, robots files agree with the page meta, and no source files in the tree. Not covered: rendering, scripts running, contact-form behaviour; those were verified on the preview and are not re-run here.

## Deploy and rollback (reference only; not performed by this repository)

Deploy is a direct upload of `dist/` to a Cloudflare Pages project, for example `npx wrangler pages deploy dist --project-name <project> --branch main --commit-hash $(git rev-parse HEAD)`, run by whoever holds the target account. Roll back by promoting the previous deployment in the Pages dashboard or redeploying the earlier commit's `dist/`. The preview on GitHub Pages is unaffected and stays available. Attaching a domain, DNS and the indexing switch are separate steps taken by the account holder.

## Still open before launch (unchanged by this change)

Content the site is still waiting on is listed in `ASSETS.md` under *Awaiting supply*. The contact and distributor forms still validate and then say that nothing was sent; the production tree preserves that behaviour. Connecting a delivery route is a separate, authorised change.

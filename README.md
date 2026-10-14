# DAVAUS — Website Preview (client review)

A static, client-review preview of the proposed DAVAUS website. This is **not** the production website. It is published so DAVAUS can review the structure and look of the site in a real browser.

- Preview URL (after merge and Pages deployment): https://squidbay.github.io/davaus-preview/
- Every page carries `<meta name="robots" content="noindex, nofollow">`, so search engines are asked not to index it.

## What's here

| Path | Page (P1 board) |
|---|---|
| `index.html` | Home (3a) |
| `seedright/` | SeedRIGHT (3b) |
| `kernel-keeper/` | Kernel Keeper (3c) |
| `ride-tamer/` | Ride Tamer (3d) |
| `about-davaus/` | About DAVAUS (3e) |
| `support/` | Support & Resources (3f) |
| `contact/` | Contact & Distributor Inquiries (3g) · `contact/#distributor` opens the dealer tab |
| `dealer-resources/` | Dealer Resources interstitial (3h) |
| `404.html` | 404 / recovery (3i) — GitHub Pages serves it for any missing path, e.g. `/shop` |

- `assets/css/site.css` — all styling (P2 Field & Foundry tokens and components).
- `assets/js/site.js` — menu, drawer, FAQ, sticky sub-nav, support filter, payback arithmetic, form validation. No third-party scripts, no tracking, no network requests.
- `assets/fonts/` — self-hosted WOFF2 files and their SIL Open Font License notices (see `ASSETS.md`).
- `og.jpg` — the 1200×630 share card shown when the link is pasted into SMS/iMessage, Slack or social. Every page uses the same card, title and description. Source: `tools/og/card.html`; re-render with `tools/og/render.mjs` (system Chrome + `playwright-core`), then bump `?v=` in `tools/build.mjs`.
- `tools/build.mjs` — generates the nine HTML files from shared header, footer and component templates. Edit it, then run `node tools/build.mjs`.
- `DESIGN-AUTHORITY.md` — which approved source governs what.
- `ASSETS.md` — source files, font provenance, and everything still awaiting supply from DAVAUS.

## Viewing locally

The pages use relative links, so any static server works from the repository root:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000/`. (The 404 page uses the absolute `/davaus-preview/` path that GitHub Pages serves it from, so test it on Pages or under that path.)

## Preview-only behavior

- **No checkout, cart or payments.** MSRP is shown as set by DAVAUS. Distributor purchase URLs have not been supplied, so "Buy at S.I. Distributing" / "Buy at May Wes" are buttons that say the ordering link isn't connected yet and that nothing was ordered. They never link to a checkout.
- **Contact and distributor forms send nothing.** They validate the entries, then tell the visitor plainly that the message was **not** sent and nothing was stored, keep the entries on screen, and give the DAVAUS email and phone. There is no success screen.
- **Documents and videos** are listed with a "Coming soon" tag until DAVAUS supplies the files.
- **No product photography** has been supplied. Layouts use typography and the approved palette instead of placeholder boxes; no product imagery has been invented.
- The Box folder link for dealers has not been supplied; the Dealer Resources button explains that instead of opening anything.

## Limitations

See `ASSETS.md` → *Awaiting supply* for the full list of content DAVAUS still needs to provide before launch.

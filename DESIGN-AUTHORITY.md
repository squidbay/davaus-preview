# Design authority

This preview combines two approved, frozen authorities. It does not reopen or redesign either.

| Authority | Source | Governs |
|---|---|---|
| **P1 — DAVAUS Website Wireframe v1.2** | `DAVAUS Website Wireframe Design.zip` (`davaus-wireframe-static.html`) | Information architecture, the nine page surfaces, content, components C01–C16, responsive breakpoints, interaction states (5a/5b), buying journey |
| **P2 — Field & Foundry Final v2** | Canva design `DAHX_S0NL0g`; `Color and type pairings review.zip` (`export/p2-final-v2/`) | Palette, typography, component styling, distributor-card geometry, implementation handoff tokens |

## Applied from P2

- Palette: Field green `#1F3D2B` · Workshop charcoal `#3A3936` · Harvest `#C8842B` · Page `#F6F4EE` · Card `#FFFFFF`, plus the P2 support tokens (alt `#ECE8DE`, text `#1C1B18` / `#5B5853`, border `#D8D3C7`, focus `#2F6A46`, CTA hover `#173021`, error `#A83A2A`).
- Type: Raleway SemiBold 600 (wordmark 20px, tracking .22em; small-caps labels 12–13px, tracking .16em) · Archivo 800 headings · Source Sans 3 body and UI. Raleway is used only for the wordmark and labels, never for headings, body, tables, forms, buttons or prices.
- Distributor cards (C03): P1 v1.2 geometry exactly as the P2 handoff — `grid-template-columns:1fr 1fr; gap:24px`; card `flex-direction:column; align-items:flex-start; gap:14px; padding:24px`; button `margin-top:4px; min-height:44px`, following its content. No equal-height rule, spacer, forced baseline or `margin-top:auto`. At ≤843px: one column, gap 16px, button stretches to the card width. S.I. Distributing first, May Wes second, identical styling, no badges.

## Applied from P1

- Nine surfaces, navigation (Products ▾ · About · Support · Contact · Where to Buy), three-product architecture, MSRP presentation ("MSRP · set by DAVAUS · available at authorized distributors"), compatibility tables, documents sections, FAQ, equal-weight Where-to-Buy modules, sticky product sub-nav, 404 recovery for retired `/shop`, `/dealer-locator`, `/future-products` URLs.
- Breakpoints: ≥1280 three product cards; 844–1279 two-up; ≤843 one-up with drawer nav and sticky product CTA; nav collapses below 1024; content capped at 1200px.
- Superseded material not used: earlier P2 directions, the Blair ITC proposal, and the rescinded distributor bottom-alignment request.

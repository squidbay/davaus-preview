# DAVAUS preview: QA evidence (not deployed, do not merge)

Independent Claude Code audit evidence, 2026-10-14. GitHub Pages serves `main`, so nothing on this branch is published to the site.

- `post-merge-1773325e/`: live Pages QA of `main` @ `1773325e` (PR #1 + #2). `sweep.json` has 9 pages × 4 viewports (1440×900, 1280×900, 390×844, 844×390). `interactions.json` has the drawer, forms, buy-button and link checks. Screenshots are named `<viewport>-<page>.jpg` and `drawer-*.jpg`.
- `favicon-pr3-a9d014b/`: PR #3 favicon checks against a local server at `/davaus-preview/`:
  - `favicon-local.json`: icon URLs and status on all 9 pages, plus a pixel-identity check against the live site.
  - `chrome-favicon-store-light.png` / `chrome-favicon-store-dark.png`: Chrome's own stored tab icon for all 9 pages.
  - `safari-*`: the Safari 26 tab bar.
  - `favicon-sizes-light-dark-sheet.png`: 16/32/48/180 px icons on light and dark tab-strip greys.

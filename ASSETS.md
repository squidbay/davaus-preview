# Source and asset inventory

## Approved sources (read, not copied into this repository)

| File | SHA-256 | Used for |
|---|---|---|
| `DAVAUS Website Wireframe Design.zip` | `9fe3e05614075eb8220ada792e015ccbaac437e45dec9679b1050d1707ca41ee` | P1 v1.2 structure and content |
| `Color and type pairings review.zip` | `14618f7a66a8c11fa9d731eb7b15b85fb899be9f5b1dc8b9b8bae4c6f8d079b4` | P2 Final v2 tokens and component styling (Canva `DAHX_S0NL0g`) |

The ZIPs contain design review boards (static HTML renders of the wireframe and the Canva pages), not website code. No HTML from them is reused; this site is a fresh implementation of what they specify.

## Fonts (self-hosted, SIL Open Font License 1.1)

Latin-subset WOFF2 files from the Fontsource packages on npm, which repackage the Google Fonts open-source releases. Licence notices are in `assets/fonts/OFL-*.txt`.

| Family | Weights | Package |
|---|---|---|
| Raleway | 600 | `@fontsource/raleway@5.3.0` |
| Archivo | 500, 700, 800 | `@fontsource/archivo@5.3.0` |
| Source Sans 3 | 400, 600, 700 | `@fontsource/source-sans-3@5.3.1` |

| File | SHA-256 |
|---|---|
| `archivo-latin-500-normal.woff2` | `ab74eca5ad115fe4cfec82ba641e5d37e4d92c58dfb1bfc1e464e9039c9d17cf` |
| `archivo-latin-700-normal.woff2` | `abada6cd4c92a9a706f6d7ed3189f322ff43dd78b9402c7d1137465b861d2a04` |
| `archivo-latin-800-normal.woff2` | `c26cda2400b374eb1adb6e0973c86f455e2df17ca57c6755eb37d7bde47663fb` |
| `raleway-latin-600-normal.woff2` | `0a66971e5a13d918e9b8cddd1da9a2490694c8f508f3546e4b200d700c7a136b` |
| `source-sans-3-latin-400-normal.woff2` | `0f73f35e08cde0a2f10c109c6e01d71459d97e4099ecd9a50f1b6c0209e4de2b` |
| `source-sans-3-latin-600-normal.woff2` | `14527d193b0e30bc32ef931549a246cdfd286573bb12869b7e052b8101a39d38` |
| `source-sans-3-latin-700-normal.woff2` | `ae35266f2ab0d5314ff9a04127931eb26c793e4f1269bb240046d4d2db4b7bb1` |

No other third-party assets. No images are used.

## Awaiting supply from DAVAUS (from the P1 review sheet and P2 handoff)

Nothing below is invented on the site. Each item shows a neutral treatment until supplied.

| Item | Where it goes | Preview treatment |
|---|---|---|
| Product, hero, shop and field photography; diagrams; portraits | All pages | Typographic layouts (wordmark nameplate, key-facts panels); no image slots shown |
| DAVAUS logo artwork beyond the Raleway wordmark | Header, footer | Raleway wordmark |
| Final homepage headline | Home hero | Interim line built from approved P1 copy (see PR notes) |
| S.I. Distributing and May Wes logos, purchase URLs, phone, hours, ship-from | Every Where-to-Buy | Name + "Authorized DAVAUS distributor"; Buy buttons explain the link isn't connected |
| 66 SeedRIGHT rate-chart PDFs (meter × seed) | SeedRIGHT, Support | Grouped by meter, "Coming soon" |
| Install guides, training guide, chain identification sheet, parts diagram, fitment list, warranty PDFs | Product Documents, Support | "Coming soon" |
| Video URLs (install videos, 3D demo, planting video) | Product Documents, Support | "Coming soon" |
| Patent numbers ×3 | Specs, About | "US patent no. to be confirmed" (approved P2 wording) |
| Ride Tamer make/model fitment list; any additional Kernel Keeper fitments | Ride Tamer / Kernel Keeper fit sections | Ride Tamer: "confirm your mower" note with contact routes; Kernel Keeper: CA620M / CA555 table only |
| Named extension-source citation for "about 2 kernels/ft² ≈ 1 bu/ac" | Kernel Keeper payback module | Claim omitted; module shows pure arithmetic with the 1 bu/ac assumption stated |
| SeedRIGHT material and cell sizes; Kernel Keeper install time; Ride Tamer wear-part list | Spec tables | Rows omitted |
| Founders' names, founding year, people/portraits | About | Founders/year omitted; People module omitted (N7) |
| Box folder URL; inquiry routing email; business hours; privacy policy | Dealer Resources, Contact, footer | Box button explains it isn't connected; forms send nothing; hours and Privacy link omitted |
| Answers for FAQ items that need DAVAUS input (warranty, shipping outside the US, cut height, stand-on mowers, down corn, FingerBrush replacement) | FAQ sections | Those questions omitted; only questions answerable from approved content are shown |
| Confirmation of the address line ("Bruick Drive" vs "Ln") | Footer, Contact | "14508 Bruick Drive" as shown in P1/P2 |

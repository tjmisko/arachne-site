# Arachne site — design decisions

The public site is the first Arachne surface that lives outside the product
canvas. The governing risk is that a marketing page drifts toward consumer-SaaS
gloss and disowns the product it describes. The whole approach is a response to
that: **bend the layout, hold the voice.** Open up the type, whitespace, and
reading rhythm so a first-time visitor isn't reading dense 12px monospace at a
wall — but keep the palette, the structural monospace, the restraint, and the
terse, declarative copy. The site should read like the product wrote it.

## Locked decisions

| # | Decision | Choice |
|---|---|---|
| Aesthetic | Fidelity to the product | **Bend it** — softer, more open layout; same palette and voice. |
| Hero | The centerpiece | **Animated execution** — a rotating set of six domain flows, each fanning out into parallel steps that converge on a human gate. The diagram is non-interactive; only the domain dots that switch flows take input. Freezes under `prefers-reduced-motion`. |
| Scope | Page count | **Small multi-page** — Home / How it works / Philosophy / Ownership + Blog. |
| Voice | The hard constraint | **Does not bend.** Terse, declarative, specific. No marketing vocabulary. |
| Mode | Default theme | **Dark.** A light marketing site would feel disowned by a dark product. |
| Blog | Presence | **One quiet nav item.** No home feed, no popups, no email capture. RSS for those who want it. |
| Blog | Post types | **Essay / Use Case / Note** — a spectrum from editorial prose to terse machine voice. |
| CTA | Conversion | **Get the artifact.** Local-first needs no account; the honest action is "Get started / View on GitHub," not a signup funnel. |

## How the design binds to the product

- **Palette is inherited verbatim.** `src/styles/tokens.css` is a vendored copy
  of the canvas design system (slate/graphite surfaces, the single cool slate
  `--accent #8a9ab2`, the block-category colors). It is never edited here. The
  site extends it in `src/styles/marketing.css` and nowhere touches the base.
  No new accent, no promoted brand pop color.
- **Two voices, by typeface.** Monospace (JetBrains Mono) is the machine and the
  artifact: wordmark, eyebrows, status chips, block names, code, JSON, metrics.
  A readable face (Inter) is *us explaining* — display headlines, body, nav.
  This mirrors the boundary the product draws between the execution plane and
  the prose around it.
- **Restraint.** No gradients in chrome, no decorative icons, no emoji, no
  testimonial carousel, no logo soup. Motion is limited to execution state —
  the one place motion carries meaning — and freezes under
  `prefers-reduced-motion`.

## Stack

- **Astro**, static output. `astro build` emits plain HTML/CSS/JS; no SSR
  runtime, no SPA framework. Deploy is rsync to nginx.
- **Scoped CSS** on top of the vendored token file. No CSS framework.
- **Blog posts are markdown files** in `src/content/blog/`, git-versioned — the
  same ownership grain as flows. The generator renders them; the file is
  canonical. One RSS feed; no list we hold over the reader.
- Self-hosted fonts (weight axis only) to keep the payload small.

## Open items (deferred, with sane defaults in place)

| # | Item | Current default |
|---|---|---|
| Readable face | Inter for all prose in V1; the editorial zone (Philosophy, Essays) references `--font-editorial` so a serif can swap in later with a one-line change. |
| OSS / commercial | The Ownership page is built price-agnostic, with a marked drop-in slot for a pricing/licensing block. |
| Docs site | Doesn't exist yet; "Read the docs" points at the repo until it does. |
| Hero flow | A rotating set of six domain flows (Competitive intel, Customer feedback, Recruiting, AP, Inbound leads, Contract review) + a hidden TPS easter egg; each fans out into parallel steps converging on a human gate. **Open thread:** three of the six (Recruiting, AP, Contract) must ship as bundled templates in the product repo to keep the "mirrors a real template" promise — tracked in Arachne's `Hero Template Set` planning doc. |
| Mobile | **Shipped** (`docs/mobile-plan.md`, branch `hero-mobile-scroll`). Canvas is desktop-first, so mobile lands the pitch + routes to desktop rather than demoing the canvas. At ≤860px the hero is a **horizontal scroll-follow window** (LTR is load-bearing grammar — never rotate flows vertical): nodes at a legible fixed scale (`--node-scale: 0.9`), the SVG overflowing its viewport, auto-panning to keep the running stage centered (a user swipe pauses the pan ~4s), with edge fades. Plus a mobile-only "best on desktop" line under the hero canvas, no funnel; `FlowSnippet` scrolls instead of wrapping; the display headline no longer right-cuts on small phones. |

## Pre-launch checklist

- Replace the placeholder domain `arachne.example.com` (in `astro.config.mjs`,
  `public/robots.txt`, `deploy/nginx.conf`).
- Add `public/og.png` (1200×630) for social previews.
- Set the real GitHub / docs URLs (currently `https://github.com/` placeholders
  in `Header.astro`, `Footer.astro`, page CTAs).
- Seed posts are drafts pending an author pass.

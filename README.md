# arachne-site

Public marketing/landing page for **Arachne** — a visual canvas for building,
running, and auditing information-processing pipelines.

Separate from the main [Arachne](https://github.com/) application repo on
purpose: this is human/design-maintained, statically built, and deployed
independently to nginx. It has no dependency on the Rust backend or the app
frontend.

## Stack

- [Astro](https://astro.build) — build-time components/layouts, static HTML out.
- Scoped CSS + a single design-tokens file (`src/styles/tokens.css`). No CSS framework.
- Zero JS shipped by default. The waitlist form is a plain `<form>` POST.

## Develop

```
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built dist/ locally
```

## Structure

```
src/
  layouts/BaseLayout.astro    # <head>, SEO/OG meta, header + footer slot
  components/                 # Header, Footer, Pillar
  pages/index.astro           # the landing page (all sections + content)
  styles/                     # tokens.css (brand) + global.css (resets/helpers)
public/                       # favicon, robots.txt (copied verbatim to dist/)
deploy/                       # nginx.conf, deploy.sh, deploy instructions
```

Copy is sourced from the Arachne Product Vision Brief
(`ops/planning/2026-04-13 - Product Vision Brief.md` in the app repo).

## Deploy

Static build → rsync to nginx on the VPS. See [`deploy/README.md`](deploy/README.md).

## Before launch

- Find-and-replace the placeholder domain `arachne.example.com` (see deploy README).
- Point the waitlist form `action` at a real endpoint (`src/pages/index.astro`).
- Add `public/og.png` (1200×630) for social previews.
- Set the real GitHub URL in `src/components/Footer.astro`.

# arachne-site

Public marketing site for **Arachne** — a visual canvas for building, running,
and auditing information-processing pipelines.

Separate from the main Arachne application repo on purpose: this is
human/design-maintained, statically built, and deployed independently to
nginx. It has no dependency on the Rust backend or the app frontend.

## Stack

- [Astro](https://astro.build) — build-time components/layouts, static HTML out.
- Scoped CSS over a vendored copy of the canvas design tokens
  (`src/styles/tokens.css`), extended in `src/styles/marketing.css`. No CSS
  framework.
- Self-hosted Inter + JetBrains Mono (a two-voice split: prose vs. machine).
- Blog posts are markdown files in `src/content/blog/`, rendered at build time;
  one RSS feed.

See [`docs/DESIGN.md`](docs/DESIGN.md) for the design decisions and rationale.

## Develop

```
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built dist/ locally
npm run check      # astro check (typecheck)
```

## Structure

```
src/
  layouts/BaseLayout.astro    # <head>, SEO/OG meta, header + footer
  components/                 # Header, Footer, Button, Chip, Pillar,
                              # FlowSnippet, BlockCard, CodeBlock, Hero (animated)
  pages/
    index.astro               # Home (animated hero + the argument)
    how-it-works.astro
    philosophy.astro          # editorial column
    ownership.astro
    blog/index.astro          # type-filtered index
    blog/[...slug].astro       # per-type post layout
    rss.xml.ts                # RSS feed
  content/blog/*.md           # posts (essay | usecase | note)
  styles/                     # tokens.css (vendored) + marketing.css + global.css
  lib/flow.ts                 # shared category/state → token map
public/                       # favicon, robots.txt
deploy/                       # nginx.conf, deploy.sh, deploy instructions
```

## Deploy

Static build → rsync to nginx on the VPS. See [`deploy/README.md`](deploy/README.md).

## Pre-launch

See the checklist at the end of [`docs/DESIGN.md`](docs/DESIGN.md): real domain,
`og.png`, real GitHub/docs URLs, and an author pass on the seed posts.

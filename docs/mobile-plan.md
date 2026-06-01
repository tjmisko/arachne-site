# Mobile plan — arachne-site

*Drafted 2026-06-01. Governs how the desktop-first site degrades to phones.
Companion to `DESIGN.md` and `parallel-flow-plan.md`.*

## Governing constraints

1. **The product is desktop-first.** The canvas is spatial and basically
   unusable on a phone. So a mobile visitor is **evaluating, not building** —
   the mobile site's job is to land the pitch and route them back to desktop,
   not to simulate the canvas. (Memory: `arachne-product-desktop-first`.)
2. **Left-to-right is load-bearing grammar.** A flow reads `source → … → action`
   left-to-right, like reading a sentence. **Do not rotate flows to vertical on
   mobile** — it breaks the grammar. (User, 2026-06-01.) This rules out the
   common "stack the steps top-to-bottom" responsive trick.

## Decided direction

### 1. Hero on mobile = horizontal scroll-follow window

Keep the flow at a **legible fixed node size** (wider than the viewport) instead
of scaling the whole DAG down to fit. Wrap it in a horizontally-scrollable
viewport that **auto-pans to keep the active stage in view as the timeline
runs** — the pan tracks execution rightward, reinforcing the LTR grammar rather
than fighting it. Manual swipe is allowed; edge fades hint there's more.

Why this over the alternatives: vertical-stack breaks the grammar; fit-to-width
makes labels ~6px (illegible); a static poster loses the "watch it run" hook.
Scroll-follow keeps all three — legible nodes, LTR reading, live execution.

### 2. Stance: lean into "best on desktop"

A tasteful, **mobile-only** line near the hero/CTA — e.g. *"A desktop canvas.
Best explored on a big screen."* (mono, `--fg-3`). Turns the desktop-only
constraint into serious-tool positioning (an IDE, not a one-handed toy). CTA is
unchanged: **View on GitHub / How it works**. **No email capture, no funnel** —
this holds the DESIGN.md CTA stance.

## Hero mechanic (implementation detail)

- **Breakpoint ≤860px:** stop the `preserveAspectRatio` fit-to-width sizing;
  render the active flow's SVG at a fixed legible scale so it overflows its
  container. Wrap in `overflow-x: auto` (momentum scroll on iOS).
- **Auto-follow:** in the timeline, when a stage goes RUNNING, scroll its column
  into horizontal center (`scrollIntoView({ inline: "center", behavior:
  "smooth" })`), but only when the container is actually scrollable. Parallel
  nodes share a column, so one scroll reveals both branches.
- **Lanes still fit:** the vertical fan (2 lanes) fits portrait height; only the
  horizontal extent scrolls. (The hidden TPS egg has 4 lanes — it may also scroll
  vertically; acceptable, it's an easter egg.)
- **Edge fades:** subtle left/right gradient masks to signal scrollability.
- **Reduced motion:** no smooth auto-scroll (jump or none); the static freeze
  still applies; the user can scroll manually.
- **Dots + pain line:** unchanged — full-size text below the window carries the
  domain message regardless of the diagram.

## Other spatial elements (audit, same principle)

- `FlowSnippet` diagrams and the how-it-works visuals: scroll-or-wrap
  horizontally, **never** rotate a left-right pipeline to vertical. Audit each
  for overflow + legibility under the same rule.
- Pre-existing: the display headline overflows ~16px at ≤414px — fix with a
  `clamp()`/wrap pass during the mobile build (separate from the hero).

## Sub-decisions (settled at build, branch `hero-mobile-scroll`)

- **Mobile node size** — `--node-scale: 0.9` (≈108px nodes, label ~9.9px),
  exposed as a CSS var on `.hero-rot` for easy tuning. The SVG width is
  `calc(var(--vw) * var(--node-scale) * 1px)`; the global `svg { max-width: 100% }`
  reset is overridden with `max-width: none` so the flow can overflow and scroll.
- **Swipe vs auto-follow** — they coexist, but a genuine user gesture
  (`pointerdown`/`touchstart`/`wheel`) pauses auto-follow for ~4s so a swipe
  isn't fought. Programmatic `scrollTo` doesn't trip the cooldown.
- **"Best on desktop" placement** — a small mono `--fg-3` line directly under the
  hero canvas (`index.astro`), shown only ≤860px. No funnel.
- **`FlowSnippet`** — switched from `flex-wrap: wrap` to `nowrap` +
  `overflow-x: auto` so a left-to-right pipeline scrolls rather than wrapping.
- **Headline** — `overflow-wrap: break-word` + `hyphens: auto`, plus a
  `≤480px` font clamp; verified `documentElement` has zero horizontal overflow
  at a true 360/390/414px viewport.

## Sequencing

Shipped as its own follow-up PR (branch `hero-mobile-scroll`), independent of the
hero PR that carried the scale-to-fit stopgap. Done.

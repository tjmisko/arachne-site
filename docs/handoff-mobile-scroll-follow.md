# Handoff — mobile hero scroll-follow window

*Written 2026-06-01 for a fresh agent. Self-contained: you should not need the
originating conversation. Implements the mobile direction decided in
`docs/mobile-plan.md`. Companion: `docs/parallel-flow-plan.md` (hero spec),
`docs/DESIGN.md`.*

## TL;DR

The desktop hero (`src/components/Hero.astro`) is done and on `main`: a rotating
set of six domain flows whose branches run in parallel and converge on a human
gate, with clickable domain dots. On mobile it currently just **scales the whole
SVG to fit width** → labels become ~6px and illegible. Replace that with a
**horizontal scroll-follow window**: keep nodes at a legible fixed size (wider
than the viewport) and **auto-pan horizontally to track the running stage**, so
the diagram reads left-to-right as execution advances. Add a mobile-only "best
on desktop" line. Ship as its own PR/branch.

## Non-negotiable constraints (read first)

1. **Left-to-right is load-bearing grammar.** A flow reads `source → … → action`
   like a sentence. **Do NOT rotate flows to vertical** or stack stages
   top-to-bottom on mobile — it destroys the meaning. (This is why we scroll
   horizontally instead of the usual responsive stack.)
2. **The product is desktop-first.** The mobile site's job is to land the pitch
   and route the visitor back to desktop, not to simulate the canvas. Lean into
   it (see memory `arachne-product-desktop-first`). The "best on desktop" signal
   is part of this task.
3. **Voice/restraint holds** (`DESIGN.md`): no new colors — reuse `categoryVar`
   tints + existing run-state tokens; `src/styles/tokens.css` is never edited.
   Motion only carries execution state. Freeze under `prefers-reduced-motion`.
4. **Breakpoint is `≤860px`** (matches the rest of the site).

## Where things are

- `src/components/Hero.astro` — the whole component. Key parts:
  - **Frontmatter `layout(flow)`** computes per-flow geometry: `vw`, `vh`,
    `nodes` (each with `x/y/cx/cy`), `edges` (bezier `d`). Geometry consts:
    `NW 120 · NH 58 · MX 14 · GAP 20 · MY 16 · ROW_GAP 30 · ROW_PITCH 88`.
  - **Markup:** `.hero-rot` > `.hero-stage-wrap` > one `.hero-stage[data-flow]`
    per flow (all but the first `hidden`) > `<svg width:100%>`. Below that:
    `.hero-pain[data-pain]`, `.hero-foot` (`.hero-dots` + `.hero-caption`), and
    an `aria-live` `[data-live]`.
  - **Client script** (bottom `<script>`): reads the `#hero-data` JSON island
    (`TIMELINES`). Key fns: `showFlow(id)` (toggles `.hero-stage.hidden`, updates
    pain/dots/live), `advance(flowEl,id,ms)` and `gate(flowEl,id,ms)` (set
    run-state + light edges), `runFlow(t,g)` (walks `t.stages`, `Promise.all` per
    stage), and the controller loop with `selected`/`auto`/`gen` (interruptible
    rotation; dots set `selected` and bump `gen`).
- `src/lib/heroFlows.ts` — `FLOWS` (7) + `ROTATION` (6, no easter egg). Each flow
  has `nodes[{col,lane}]`, `edges`, `stages` (topological; inner arrays run
  concurrently), `gate`, `maxLane`, `domain`, `pain`, `aria`. The TPS egg
  (`id: "tps-reports"`, `easterEgg: true`) has **`maxLane: 3`** (4 lanes) — the
  only flow taller than 2 lanes; mind it on mobile.
- `src/pages/index.astro` — embeds `<Hero/>` inside `.hero-canvas`. The display
  headline + lead + CTA buttons live here (lines ~56–77). The "best on desktop"
  line and the headline-overflow fix touch this file.

## What to build

### 1. Mobile sizing: fixed-scale SVG inside a scroll container
- At `≤860px`, stop the fit-to-width behavior (`svg { width:100% }`). Instead make
  each `.hero-stage` (or `.hero-stage-wrap`) a horizontal scroll container
  (`overflow-x:auto; overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch`)
  and give the `<svg>` a **fixed width derived from its viewBox** so nodes render
  at a legible size and the flow overflows.
- Recommended mechanism: emit the viewBox width as a CSS var per stage in the
  frontmatter — `style={`--vw:${vw}`}` on `.hero-stage` — then at the breakpoint
  set `svg { width: calc(var(--vw) * 0.9px); height:auto; }` (0.9 ≈ node ~108px;
  tune — see open decisions). Desktop keeps `width:100%`.
- Keep `preserveAspectRatio="xMidYMid meet"` (fine in both modes).
- Vertical: 2-lane flows fit portrait height. The **TPS egg is 4 lanes** — let it
  also scroll vertically (`overflow:auto`) or accept a taller box; it's hidden
  behind the `🖇` dot, so don't over-invest.

### 2. Auto-follow the running stage
- Add `followColumn(flowEl, id)` that, **only when the container is scrollable**
  (`scrollWidth > clientWidth`) and not reduced-motion, scrolls the active node's
  column to horizontal center: `node.scrollIntoView({ inline:"center", block:"nearest", behavior:"smooth" })` (or compute `scrollLeft` from `node.offsetLeft` for finer control — note SVG children don't have `offsetLeft`; use `getBoundingClientRect` deltas against the container).
- Call it at the **start of `advance()` and `gate()`** (right after setting
  `RUNNING`/`NEEDS-INPUT`). Parallel nodes share a column, so one call reveals
  both branches.
- On `showFlow(id)`, reset the container `scrollLeft = 0` so each flow starts at
  the left (preserves the LTR reading start).

### 3. Manual swipe + auto-follow coexistence
- Native `overflow-x:auto` gives free swipe. Decide interplay (open decision):
  simplest is to let auto-follow always run; a nicer touch is to **pause
  auto-follow ~4s after a user scroll/touch** (listen for `scroll`/`pointerdown`,
  set a timestamp, skip `followColumn` while within the cooldown). Keep it small.

### 4. Edge fades
- Add left/right gradient masks on the scroll container (e.g. a `::before`/`::after`
  or `mask-image: linear-gradient(...)`) that hint there's more to scroll. Use
  `--bg-*` tokens; fade only when scrollable.

### 5. Reduced motion
- No smooth auto-scroll (jump `behavior:"auto"` or skip). The static freeze
  (`paintComplete` on Feedback Synthesis) still applies. Manual scroll remains.

### 6. "Best on desktop" signal (mobile-only)
- Add a tasteful, **mobile-only** line near the hero/CTA — e.g. *"A desktop
  canvas. Best explored on a big screen."* (mono, `--fg-3`). Likely in
  `index.astro` under `.hero-canvas` or beside the CTA buttons; hidden ≥861px.
  Do **not** add an email/signup funnel (DESIGN.md CTA stance). CTA stays
  "Get started / See how it works".

### 7. Audit other spatial diagrams (same rule)
- `src/components/FlowSnippet.astro` and the how-it-works visuals: ensure they
  **scroll-or-wrap** horizontally on mobile, never vertical-rotate a left-right
  pipeline. Apply the same scroll-container treatment where they overflow.

### 8. Fix the pre-existing headline overflow (small, separate)
- At `≤414px` the display headline `"Delegate the by-"` overflows ~16px,
  dragging the lead/dots right-cut. In `index.astro`, give `.display` a tighter
  `clamp()` / `overflow-wrap:break-word` / hyphenation so it fits. Pre-existing;
  not caused by the hero, but in scope here.

## Acceptance criteria

- At `≤860px`: node labels are legible (no ~6px text); the flow overflows and the
  view **auto-pans to keep the running stage visible**, advancing left-to-right.
- LTR preserved — no vertical/stacked flow anywhere.
- Edge fades hint scrollability; manual swipe works.
- A mobile-only "best on desktop" line shows; absent on desktop; no funnel added.
- `prefers-reduced-motion`: static, fully-completed Feedback Synthesis; no
  auto-scroll; manual scroll OK.
- Headline no longer right-cuts at 414px.
- Desktop behavior unchanged (regression-check the rotation + dots).
- `npx astro check` 0 errors; `npx astro build` clean.

## Verify (this repo, headless — no Playwright MCP needed)

```bash
# Worktree setup: symlink node_modules from the main checkout (fast), then dev.
ln -s ~/Projects/arachne-site/node_modules <worktree>/node_modules   # if missing
npm run dev   # astro dev, prints a localhost URL (4321/4322)

# Headless screenshots via the system chromium (no project dep):
chromium-browser --headless=new --no-sandbox --hide-scrollbars \
  --user-data-dir=/tmp/cr-m --window-size=390,1400 --virtual-time-budget=2500 \
  --screenshot=/tmp/hero-mobile.png http://localhost:<port>/
# Vary --virtual-time-budget (1500/4000/9000) to land mid-parallel, at the gate,
# and after rotation. Read the PNG to inspect.
```
For reduced motion there is no chromium flag; verify by toggling OS reduce-motion
in a real browser, or trust the `reduce` branch (it skips the controller).

## Gotchas

- Each flow's `<svg>` has its **own** `viewBox` and `marker id` (`arrow-<flowId>`)
  — there are 7 SVGs in the DOM, 6 `hidden`. Hidden ones are `display:none` (no
  animation cost). Size/scroll logic must target the **visible** stage.
- SVG `<g>`/`<rect>` have no `offsetLeft`; use `getBoundingClientRect()` against
  the scroll container for scroll math, or `scrollIntoView`.
- The controller is interruptible via `gen`; if you add async work inside
  `advance`/`gate`, keep honoring the `interrupted(g)` checks in `runFlow`.
- Don't commit the `node_modules` symlink (it shows as untracked) — stage
  explicit paths.
- `BASE 950 / GATEMS 1800 / SETTLE 1500` ms pacing — auto-scroll should feel
  tied to these; don't add long scroll animations that outlast a stage.

## Open sub-decisions (pick a default, note it in the PR)

- **Mobile node scale** — `--vw * 0.9` (≈108px nodes) vs `* 0.8` (more on screen).
  Default 0.9; tune against the 390px screenshot.
- **Swipe vs auto-follow** — always auto-follow (simplest) vs pause-after-touch
  (nicer). Default: pause ~4s after a user scroll.
- **"Best on desktop" placement** — under `.hero-canvas` vs beside the CTA.
  Default: a small line directly under the hero canvas.

## Workflow

- New branch off `main` (e.g. `hero-mobile-scroll`); worktree per repo
  convention. Commit conventionally (`feat(hero): …`), no emoji. PR for review;
  do not push straight to `main` unless asked.
- Update `docs/DESIGN.md` (Mobile open-item) + `docs/mobile-plan.md` "Open
  sub-decisions" once settled. This file can be deleted when the work lands.

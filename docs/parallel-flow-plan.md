# Rotating hero — six domain flows — spec

*Rewritten 2026-06-01 after the hero-flow workshop. Supersedes the earlier
single-flow "parallelize the Analyst Memo" draft. Scope: `src/components/Hero.astro`
(+ a small flow-data module) in `arachne-site`, **and** three new bundled
templates in the `~/Projects/Arachne` repo. Companion to `DESIGN.md`.*

## Why

The hero must *show* what the copy claims: independent steps executing **in
parallel**, each isolated, joined under a human gate. Today it shows one linear
chain advancing node-by-node — it proves *a flow runs*, not *parallel runs*.

The workshop settled a stronger frame than "make the one flow parallel": a
**rotating hero that cycles through six domain-specific flows**, each legible to
someone who actually does that job. The parallel fan-out → fan-in → **human gate**
shape is constant; the domain, vocabulary, and the *native* parallel pattern
change per flow. A visitor in any of the six fields should think "that's my
Monday."

Messaging source-of-truth: `~/Projects/Arachne/ops/planning/2026-06-01 - Trust
Thesis and Messaging Synthesis.md` (Move 1 — bounded, isolated steps). Vocabulary
gate: the `arachne-positioning-vocabulary` memory.

## Locked decisions (2026-06-01)

1. **Slate of six is fixed** (below). Covers Analyst, CS/Founder, HR, Finance,
   Sales, Legal — all by-the-book frontline work, each natively fan-out → fan-in
   → gate.
2. **Each domain uses the parallel pattern native to its pain** — not six copies
   of one shape. The set spans all four patterns (what-changed / reconcile /
   batch-extract / triage). This is what makes the rotation feel real per viewer.
3. **The minor judgment is delegated; the consequential one stays human.** Each
   parallel branch carries a small `extraction` (classify / score / flag). The
   `Gate` is where the human keeps the call that matters (per
   `judgment-is-not-delegable`).
4. **Honesty: the three non-bundled flows become real templates.** Recruiting, AP,
   and Contract review do not exist as bundled templates yet. `DESIGN.md` requires
   the hero to mirror a real template, not a contrived demo — so we stub all three
   in the Arachne repo (`flows/` + a planning doc) as part of this work. Site and
   product stay in sync.

## The six flows

Constant skeleton: `source(s) → ×N parallel branch (minor extraction) → Merge
(control) → Gate (human) → synthesis → action`. Rendered at **2 visible lanes**
with "×N" implied (2 is the mobile legibility ceiling — see Constraints).

| # | Domain (who recognizes it) | Pattern | Flow (block · category) | Bundled? |
|---|---|---|---|---|
| 1 | **Competitive intel** (market/product analyst) | what changed? | `Schedule`·source → ×2 [`Fetch`·source → `Extract Δ`·extraction] → `Merge`·control → `Rank`·transformation → `Gate`·human → `Brief`·synthesis → `Post`·action | new → bundle |
| 2 | **Customer feedback** (Head of CS / PM) | reconcile | ×2 [`Ingest`·source → `Extract themes`·extraction] → `Merge`·control → `Cluster`·transformation → `Validate`·control → `Gate`·human → `Summarize`·synthesis → `Send`·action | **Feedback Synthesis** ✓ |
| 3 | **Recruiting screen** (recruiter / hiring mgr) | batch-extract | `Applications`·source → ×2 [`Parse`·transformation → `Score vs. rubric`·extraction] → `Merge`·control → `Rank`·transformation → `Gate: borderline band`·human → `Draft`·synthesis → `Send`·action | new → bundle |
| 4 | **AP reconciliation** (AP clerk / controller) | three-way match | `Invoices`·source → ×2 [`Extract fields`·extraction → `Match PO+receipt`·transformation] → `Merge`·control → `Gate: exceptions only`·human → `Post / queue`·action | new → bundle |
| 5 | **Inbound leads** (SDR / RevOps) | triage | `New leads`·source → ×2 [`Enrich`·io → `Score fit`·extraction] → `Merge`·control → `Route by tier`·control → `Gate: AE claims tier-1`·human → `Sync CRM`·action | ~Intake Triage |
| 6 | **Contract / NDA review** (contracts mgr / counsel) | batch-check | `Contracts`·source → ×2 [`Regularize`·transformation → `Check vs. playbook`·extraction → `Flag`·extraction] → `Merge`·control → `Gate: flagged clauses`·human → `Draft redlines`·synthesis → `Send`·action | new → bundle |

Per-flow domain label + one-line "hair on fire" pain copy (insider voice) lives
in the flow-data module; see the workshop quotes in the conversation record.

### Easter egg — TPS reports (Office Space)

A seventh, **comedic** flow. **Not** in the honesty/bundled set, never claimed as
a shipped template — a knowing wink to the cubicle-dweller ICP. Lives in the flow
data behind an `easterEgg: true` flag; rendered behind a **hidden 7th dot** (a
small `🖇` Swingline), off the main auto-rotation. Reduced-motion ignores it.

> "Yeahhh… I'm gonna need you to go ahead and get those TPS reports out. Did you
> get the memo about the new cover sheet?"

`Case of the Mondays`·source *(scheduled trigger)* → **×8** [`Attach new cover
sheet`·transformation → `Check the memo`·extraction] *(one branch per boss — "I
have eight different bosses right now")* → `Merge`·control → `Gate: Lumbergh
("…that'd be greaaat")`·human → `Collate TPS report`·synthesis → `Send to the
Bobs`·action

Gags: fan-out is **×8** (most-parallel diagram in the set, and the literal
punchline); the action node flashes `PC LOAD LETTER` instead of `RUNNING`; if the
Lumbergh gate is never approved and it loops too long, Milton sets the building on
fire — the literal "hair on fire" the whole hero is themed around (optional hidden
end-state). Keep tints/run-state tokens normal — the joke is in the labels, not
new colors.

## Hero UX

- **Rotating.** One flow shows at a time; after a flow completes one run, advance
  to the next. Small indicator (dots/labels) shows position in the set of six and
  names the current domain.
- **Domain-legible.** Each flow surfaces its **domain label** + one-line pain
  above/below the SVG so the framing — not just the topology — reads to a
  practitioner. (Caption treatment mirrors `FlowSnippet`.)
- **Caption.** One line, on-voice: *"Independent steps run in parallel — each
  isolated."* Mono, `--fg-3`, small, centered.
- **Reduced motion.** Freeze on a single clean static flow (the bundled Feedback
  Synthesis), fully `completed`, every edge lit. No rotation, no pulse.
- **Auto-rotate + clickable domain dots.** Cycles through the six on a timer;
  domain dots/labels (`[Intel][CS][Recruiting][AP][Leads][Legal]`) let a visitor
  jump to their field and pause there — the "that's my Monday" hook. The dots are
  the **only** interactive element; the flow animation itself stays
  non-interactive. Requires pointer + keyboard a11y (focusable dots, `aria-current`,
  arrow-key nav, visible focus ring).

## Renderer architecture

One **data-driven DAG renderer** fed by a `FLOWS` array (six entries) in a new
`src/lib/heroFlows.ts`:

- **Node model → (col, lane).** Each node: `{ id, label, cat, col, lane }`. `x`
  from `col`, `y` from `lane` (add `ROW_GAP`). `VW` from max col, `VH` from max
  lanes. Keep `NW/NH`. Cap visible lanes at 2.
- **Edges = arbitrary `from → to` pairs** (not just consecutive). Real beziers
  with horizontal control handles for fan-out/fan-in curves. A node may have
  multiple outgoing edges; each gets a stable id + `data-from` for lighting.
- **Timeline = DAG, not a linear `ORDER`.** Small dependency model; run the
  parallel stage with `await Promise.all([...])` so ≥2 branches are `RUNNING`
  together; the `Merge` node awaits all upstream. `outEdges(id)` (plural) lights
  all outgoing edges on completion.
- **Reuse the entire run-state vocabulary** (`idle/running/completed/needs-input`,
  `.ring`, `.bar`, gate `approved`, provenance flourish). Only topology + the
  fact that several light at once is new. No new colors — `categoryVar` tints +
  existing run-state tokens only.

## Cross-repo work (Arachne)

Stub three new bundled templates so the hero's promise is honest:

1. `flows/` JSON for **Recruiting screen**, **AP reconciliation**, **Contract
   review** — minimal but runnable, matching the block ontology.
2. A planning doc `~/Projects/Arachne/ops/planning/YYYY-MM-DD - Hero Template
   Set.md` recording the six as the canonical demo/template set, tracked in
   `STATUS.md`. Reconcile names with existing templates (Feedback Synthesis,
   Intake Triage) rather than inventing site-only names.

## Implementation tasks (sequenced)

1. `src/lib/heroFlows.ts` — `FLOWS` data for all six (nodes w/ col+lane, edges,
   dep order, domain label, pain line). Single source the renderer reads.
2. `Hero.astro` — generalize geometry to (col, lane); branching edges; DAG
   timeline with `Promise.all`; rotation controller; domain label + caption;
   reduced-motion freeze on Feedback Synthesis; rewrite `aria-label` per flow.
3. Mobile pass — verify 2-lane legibility at ≤860px via `preserveAspectRatio`.
4. Arachne repo — three template stubs + planning doc (+ `STATUS.md` entry).
5. Refresh `DESIGN.md` open-items (Logo/wordmark + Hero flow rows are stale).

## Constraints (from `DESIGN.md`)

- Voice/restraint holds. No new colors. Motion only carries execution state.
  Freeze under `prefers-reduced-motion`. `tokens.css` is never edited.
- Plausible, not contrived — now enforced literally: every hero flow is a real
  (or to-be-shipped) bundled template.
- Vocabulary gate before any copy lands: grep the changed files for the banned
  words in the `arachne-positioning-vocabulary` memory.

## Acceptance criteria

- Hero rotates through the six; each shows ≥2 nodes `RUNNING` simultaneously.
- Each flow surfaces its domain label + pain line; fan-out/fan-in legible at hero
  width **and** ≤860px.
- Caption present, on-voice; vocabulary gate passes.
- `prefers-reduced-motion` → one clean fully-`completed` static flow.
- Three Arachne template stubs exist + planning doc tracked in `STATUS.md`.
- `astro check` 0 errors; `astro build` clean; visual check (normal + reduced).

## Settled build decisions (2026-06-01)

- **Rotation interaction:** auto-rotate **+ clickable domain dots** (jump + pause).
  Dots are the only interactive element; flow animation stays non-interactive.
  This is a scoped exception to `DESIGN.md`'s "non-interactive (no pointer/input)"
  constraint — note it when refreshing DESIGN.md.
- **Build sequencing:** **site hero first** (against the six specs), then the three
  Arachne template stubs before launch.

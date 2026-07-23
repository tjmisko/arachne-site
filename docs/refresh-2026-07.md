# Site refresh audit — 2026-07-22

The site's copy was frozen 2026-06-01 against the **trust thesis**
(`Arachne/ops/planning/2026-06-01 - Trust Thesis and Messaging Synthesis.md`).
Since then the Arachne repo has taken **530 commits**, a **direction refresh**
(2026-06-19) that repositions the wedge, and essentially **no movement at all**
on distribution. This document audits the site section by section, separates
*wrong* from *stale* from *missing*, and collects the questions that gate a
rewrite.

**Read §0 first.** The most important finding is not about copy.

**Method.** Five parallel read-only sweeps of `~/Projects/Arachne` — ops corpus,
code since 2026-06-01, vocabulary/register, positioning docs, and
build/run/distribute. Conflicts between sweeps were resolved against the source
(noted inline where they mattered).

---

## 0. The blocker: there is nothing to ship to

Every CTA on this site — `Get started`, `View on GitHub`, the whole Self-hosting
page — points at `https://github.com/`. Behind that placeholder:

| | Status |
|---|---|
| GitHub repo | **private** (`gh repo view` → `"visibility": "PRIVATE"`) |
| LICENSE / COPYING / NOTICE | **none anywhere in the repo** |
| Releases | **none** (`gh release list` → empty) |
| `cargo install` | nothing published; workspace version `0.1.0` |
| Product container | **none.** The root `Dockerfile` is the *unattended-agent development sandbox* — it installs Claude Code, MCP servers and Playwright, and its `CMD` is the agent loop driver |
| Backend production build | **none.** `scripts/build.sh:7` builds only `web/dist` |
| Static serving | **none.** `arachne-server` never mounts `ServeDir`/`ServeFile`; the frontend is served by Vite proxying `/api` to `:3001` |
| Docker Compose / K8s / systemd unit | **none.** The one `.service` file is for the agent pump |
| Hosted option | **does not exist in any form** — no code, no infra, no planning doc |
| Build/test CI | one workflow, `bench.yml`, gated on bench paths |

The only path to a running Arachne is **clone → `git submodule update` →
`./scripts/run.sh`**, which needs a Rust toolchain *and* Node, runs three
processes, and has a ~38s backend recompile loop. That is a developer setup, not
an install.

`ops/planning/STATUS.md:507-514` names all of this as an open gap, verbatim:

> ## Coverage gaps
> - **Deployment / Distribution** — local, self-host, cloud
> - **Security & Trust Model** — … broader threat model and sandboxing still pending
> - **Open-source / Commercial Strategy** — licensing, pricing, what's free vs. paid

A sweep of all 99 planning docs plus `ideas/` found **no pricing model, no
license choice, no tiers, no launch date, no waitlist, no design partners, and
no beta/GA definition.** There is no definition of done for a public launch
anywhere in ops.

**On the distribution paths specifically, nothing moved since the site was
written.** `git log` since 2026-06-01 on `README.md`, `Makefile`, `scripts/`,
`Dockerfile` and `.github/` is ~40 commits, essentially all agent-harness work.
On the product's own runtime paths (`main.rs`, `persistence.rs`,
`arachne-sandbox/`, `arachne-kms/`, `auth/`, `middleware/`): **five commits, two
substantive.** The sandbox and KMS crates are untouched.

**This changes what the site is for.** A page headed "The flows are yours. The
data is yours." currently makes promises a reader cannot verify or act on. See
Q1 — this is the first decision, ahead of any positioning question.

---

## 1. What actually changed

### 1.1 The wedge moved

June 1 said the wedge was **legible judgment inside the pipeline**, with
auditability as the payoff. June 19 explicitly demotes that. The frontmatter of
the Direction Refresh says so mechanically:

```
supersedes_emphasis_of:
  - 2026-04-13 - Product Vision Brief.md   # auditability/compliance demoted from WEDGE to OUTCOME
```

> The differentiator is **not** capability and **not** auditability … A coding
> agent can already build you a formalized pipeline. The problem is the
> *artifact*: an illegible codebase you can't read from above without
> understanding it yourself, and that isn't conducive to rapid iteration.
> **Arachne makes the formalized process legible (the canvas) and iterable …
> and keeps a human in command of a tool rather than supervising an agent.**
>
> Auditability and compliance are the **reward of formalization** (they kick in
> as you enframe), not the opening argument.
> — Direction Refresh §5

And in the founder's own words:

> Auditability is not actually that important a wedge. … at the start,
> auditability is a means to discovering the correct process. If agents have to
> discover the correct thing to do over and over again in the context window,
> why not just take that out of the context window entirely, or reduce it to a
> series of smaller and cheaper context windows?
> — freestyle-onramp interview, Q19

**The foil changed too.** The site's foil is *the CLI transcript* and *other
canvases that show only plumbing*. The current foil is **a coding agent's
illegible codebase**. That is a sharper enemy and the site never names it.

Balancing fact, worth holding onto: the *endpoint* claim is **strengthened**, not
weakened —

> the auditability story is **strengthened, not weakened.** The shippable
> artifact is *always* a deterministic, auditable, human-verifiable flow —
> freestyle is never shipped as the trusted endpoint; it is the captured,
> studied, graduated on-ramp.
> — Freestyle Onramp Posture, §audit verdict

### 1.2 The new spine: the discretion gradient (explore → exploit)

A **third axis** joins purity and determinism:

| Axis | Range | Where |
|---|---|---|
| Purity | `Pure < ReadsExternal < WritesExternal < FullIo` | `crates/arachne-schema/src/effect.rs` |
| Determinism | `Deterministic < ModelDependent < NonDeterministic` | same |
| **Discretion** | `Mechanical < Bounded < Open` | **new**, `effect.rs:47-60` |

The rungs, verbatim from the F61 design doc: `Mechanical` = *"No discretion.
Deterministic logic; no model in the loop. The graduation end-state."*;
`Bounded` = *"Enframed model judgment: the four F55 ceilings hold."*; `Open` =
*"Self-directed discretion… no typed contract — freestyle."*

> ⚠️ **Name collision.** `Bounded` is our trust-pillar name *and* the middle
> discretion rung. On the site it means *the whole product is hard to run off
> the road*; in the app it means *one specific mid-discretion setting*. A reader
> who goes site → app meets a narrower word. See Q9.

Ceilings are **opt-in and late-stage, not a guard** — worth quoting because it
inverts the natural marketing reading:

> Ceilings are what the user wants to enforce once they know the process. They
> are not a defensive guard on an untrusted agent — they are the **formalized
> expression of "I now know the right process is always X."**
> — F61, §1

The pitch that falls out of the axis:

> use the smartest available model **once**, as a tool, to help a human
> **discover a process** — and then let **dumb, cheap, simple, deterministic
> transformations** run that process from then on. The frontier model is the
> scaffolding you build the bridge with, not the bridge.
>
> You don't keep a genius on staff to re-derive the same answer every morning;
> you watch the genius solve it once, write down the method, and hand the method
> to a clerk — or to a machine that costs a thousandth as much.
> — technology-as-tool thesis §1

And the nuance flagged in the source as "do not lose it":

> the product does **not** push you to *minimize* discretion. Discretion is the
> **dial you control**. … It has the tools to turn discretion into reliability;
> it has no opinion that you must.
> — Direction Refresh §3

**Consequence:** the site's inversion section describes an *authoring* loop. The
new story is an *operating* loop — hand work to an agent at high discretion,
watch it across runs, and pin down the reliable parts. The site has **no
on-ramp story at all**, and no vocabulary for the middle period where you are
still watching.

### 1.3 The single best sentence in the corpus

`ops/planning/2026-07-23 - Flow Synthesis Rubric v1.md` (`status:
authoritative`, written yesterday) states the new thesis in public-safe words
*and* rebuilds the bridge to "trust" — which the June 19 reframe had left
dangling:

> **A good flow is not a transcript replay. It is the reliable, auditable,
> *generalized* process that the transcript is one instance of.** The whole
> point of synthesis is to move from "**an agent did this once, opaquely**"
> toward "**a flow that no longer depends on any agent's in-the-moment
> choices**" — line by line, block by block.

> **Trust is earned by *removing* dependence on an agent's in-the-moment
> choices, not by banning the agent.** An Agent block / Open discretion is a
> legitimate on-ramp and is **never** wrong by mere presence.

Zero barred vocabulary. If the rewrite needs one anchor sentence, it is the
second one.

### 1.4 New product vocabulary

| Term | Meaning | Shipped as |
|---|---|---|
| **Agent** | the high-discretion primitive; multi-turn, tool-using, `FullIo + NonDeterministic` | `BlockType::Agent`, `BlockCategory::Agent`, magenta token, **hazy edge rendering** |
| **Discretionary** vs **enframed** | data/results from a node that had shaping power, vs. a node penned in to one narrow job | pervasive; *Discretionary* formally **replaces the rejected "Freestyle"** |
| **Jig** | reusable, visually-obvious known-good composite — *"a fixture guaranteeing a repeatable result"* | backend identity landed in F72 (`jig_kind` persists in flow JSON; a `jig_membership` map attributes provenance/cost/errors to the jig). Three ship: **best-of-N, checklist, Curator**. UI header is literally "Jig Library" |
| **Graduation** | narrowing a step down the discretion dial | `AgentGraduationSection.tsx` |
| **Distillation** | training a cheap classifier from captured LLM judgment. **Reserved word** — never use it for fan-in aggregation (use *aggregate / synthesize / converge*) | `arachne-distill`, `BlockType::DistilledClassifier` |
| **Divergence study** | run a formal flow beside an agent; the edge case the agent finds becomes a one-click flow addition | `arachne-eval`, `DivergenceInspector.tsx` |

**Renames:** Superblock → **Jig**; Freestyle → **Discretionary** (incomplete —
"freestyle" still ships in UI strings, §2.15); `formalization_stage` →
**deleted** in F49.1, with a standing rule that no per-block formalization stage
may be reintroduced and a grep regression guard enforcing it.

### 1.5 What shipped in the code

22 crates, **nine net-new since June 1**: `arachne-silk` (the LLM-facing flow
DSL + typed diff protocol), `arachne-judge`, `arachne-distill`,
`arachne-retrieval`, `arachne-artifact`, `arachne-knowledge`, `arachne-synth`,
`arachne-bench`, `arachne-telemetry`.

> **Do not source copy from the repo's own docs.** `docs/REPO_MAP.md:31-40`
> lists 6 crates. `CLAUDE.md` says "Block-type count is now 99" and "25+ types
> across 9 categories". All stale — the enum has **132 variants across 15
> categories**. (Two sweeps disagreed here; I counted the enum.)

The six new block types since June: `Agent`, `Select` (best-of-N judge),
`ChecklistLine`, `DistilledClassifier`, `Recall`, `Curate`. Also now present and
unmentioned by the site: **23 connector providers** (Gmail, Outlook, IMAP/SMTP,
Google Calendar/Drive, OneDrive/SharePoint, S3, Slack, Teams, Salesforce,
HubSpot, Jira, Asana, Linear, Notion, Stripe, QuickBooks, DocuSign, Twilio,
Zoom, Postgres, MySQL, Airtable — 14 with live credential verification), **five
human blocks**, **five compliance blocks**, and the knowledge blocks.

Ledger: **582 done / 27 open / 7 blocked** across F0–F75. `main` now contains
`integration/f60-f75`.

> ⚠️ **A `done` in the ledger is not always a shipped user-facing feature.** Ops
> itself flags this: the dominant backlog pattern is *"schema landed, UI never
> followed,"* and two **false-dones** were caught by a "must have a real
> non-test production caller" rule. Verify anything load-bearing before
> claiming it.

### 1.6 Ops

`ops/` is a separate repo (`tjmisko/arachne-ops`), submodule-mounted, 920 files.
Three layers: **dated append-only docs** indexed by `STATUS.md`; a **task DAG**
of 616 one-file-per-task markdown files whose frontmatter only
`scripts/arachne-task` may write; and **the pump** — a host-level supervisor
that recomputes the ready frontier each tick, launches one Docker container per
phase-worktree, and pauses feeding at ~95% plan utilization, so you can *"point
the loop at a range of phases, start it, and walk away for days."*

Two things in ops are directly useful here:

- **A brand-voice guide already exists** (`ops/design/2026-04-27/README.md`):
  *"Arachne's voice is **terse, technical, second-person-implicit**. It reads
  like high-quality dev tooling — Vim, tmux, k9s — not like consumer SaaS."* …
  *"No marketing words ('supercharge', 'magic', 'AI-powered')."* … *"Mood. Late-
  night coding tool… closer to a debugger or a node-graph shader editor than to
  a SaaS dashboard."* **Caveat:** it scopes itself to the canvas and says
  outright *"There is no marketing site, mobile app, or docs site in the
  codebase"* — it was never extended to cover this repo. See Q16.
- **The pump's own after-action report** is unusually candid and would make a
  good essay if the site ever tells this story: *"a ~3-hour productive burst
  that produced two clean PRs and five completions, followed by ~4 hours of a
  **stalled** supervisor that could neither launch nor exit. The run did not
  fail loudly; it wedged quietly, which is worse."* See Q19.

---

## 2. Section-by-section audit

Legend: **WRONG** = factually inaccurate today · **STALE** = true but off-thesis
· **THIN** = true but under-claims what shipped · **OK** = leave it.

### 2.1 `BaseLayout.astro` — global meta

| Line | Current | Verdict |
|---|---|---|
| 14 | title: "…visible, bounded, auditable automation for knowledge work" | **STALE.** The triad appears **nowhere in the repo after 2026-06-01** — three hits total, all in the June 1 Site Copy Update Plan. It is orphaned, not overturned. |
| 15 | description: "A visual canvas for building, running, and auditing information-processing pipelines. The agent builds the flow. You verify it. Then it runs." | **STALE**, and note it is the same sentence as `README.md:3` — which is itself unreconciled April framing. |

### 2.2 Hero (`index.astro:56–79`)

- H1 *"Delegate the by-the-book work to agents — and see exactly what they
  do."* — **OK on vocabulary** (delegation is a locked public word), **STALE on
  thesis.** It sells supervision; the new thesis sells *escaping* supervision.
- Lead: *"a sandboxed runtime that executes it — independent steps running in
  parallel, each one isolated"* — **WRONG, and worse than it first looks.**
  - The Starlark sandbox is **opt-in and defaults OFF** (`blocks.rs:232`). The
    default `Code` path spawns an unsandboxed host subprocess — `python3 -c` /
    `bash -c` (`crates/arachne-blocks/src/code.rs:46-47,462`).
  - The `Command` block **is not sandboxed at all**, by its own admission at the
    spawn site: *"SPEC_GAP: sandbox-not-applied. Spec §8 mandates seccomp/
    landlock parity with the Code block. Code itself runs unsandboxed today"*
    (`command/executor.rs:609-611`).
  - The real mechanism is **OS subprocesses with resource caps and a binary
    allowlist** — not containers, not WASM, not namespaces, not seccomp.
  - Parallelism *is* real: `ParallelExecutor` is the sole path, stage-parallel
    with per-resource semaphores acquired in canonical sorted order.

  Two defensible substitutes, both stronger than the current sentence because
  they survive scrutiny: *"Code steps can run in a structurally hermetic
  interpreter — no filesystem, no network, no clock — under explicit time and
  memory budgets"*; and *"steps can only invoke a curated set of binaries, with
  explicit argv and no shell."*
- *"Trust the process, not the run: verify it once, and you don't have to
  re-check every run."* — **survives**, but understates the model. Current model
  is *watch across runs, then narrow.* See Q6.

### 2.3 The gap (`index.astro:81–101`)

*"Run agents you can't trust?"* / *"Trust the process, not the implementer."* —
**STALE but salvageable.** The new framing isn't "you can't trust agents," it's
that agents are the right tool for one half of the job:

> Flexibility is great for discovery and exploration, but must transition from
> explore to exploit quickly. Agents are extremely helpful for explore mode, but
> are totally unreliable and simply the wrong model for exploit mode. But agents
> can make the formalization process much cheaper, and help the correct process
> discover itself.
> — freestyle-onramp interview, Q4

More generous, more defensible, and it sets up the on-ramp story the site
lacks. See Q5.

### 2.4 Pillars (`index.astro:12–28, 103–112`)

- **Bounded** ("Hard to run off the road") — **in real tension now.** Two
  constraints from the shipped design docs:

  > A new Agent node starts **permissive** — the agent can do whatever it needs
  > to in order to accomplish the task. High discretion, high capability… a
  > **hard ceiling on the maximum, not an intent to minimise capability at
  > launch.** — F56 §0

  > **v1 is soft — state it explicitly in every surface.** F55 must not present
  > the four ceilings as a hard sandbox. They constrain and flag what leaves the
  > block; **they do not contain a malicious model.** — F55.0 §1

  The pillar survives in its *original* rationale — reduce risk, make deviation
  visible, never claim a guarantee — which is exactly what `safety-is-a-road`
  argues. It does **not** survive as a containment claim. Whether "state it
  explicitly in every surface" binds marketing is unresolved. See Q10.
- **Auditable** — demoted from wedge to outcome, and its body copy contains a
  **factual error**: *"Every AI claim traces to its source passage."* True for
  **extraction** (`ExtractInsights`/`ExtractEntities` populate
  `source_references`, with a test asserting it —
  `crates/arachne-blocks/src/extraction.rs:155,287,806-807`) and **false for
  synthesis** — `synthesis.rs:882-883` asserts the opposite of our marketing
  claim: *synthesis blocks must leave grounding empty*. Summarize / Compare /
  Draft carry no passage-level citations. Same sentence on How-it-works and in
  `analyst-weekly-memo.md`. See Q12.
- **Visible** — **untouched and arguably promoted**, since legibility is now the
  entire wedge.

### 2.5 The inversion (`index.astro:114–156`)

**The most affected section.** "The agent builds the flow. You verify it. Then
it runs." is still true — the canvas agent ships, on a Silk DSL with a typed
diff protocol, and F68 live-build **is merged to main** (`205d744d`; a STATUS.md
row still says otherwise, and is stale). But it is now **one mode, not the
story**:

> Data **may** flow through an Arachne flow by passing to a freestyle agent —
> that is a legitimate, often the *first*, way to get a result… **freestyle is
> neither the destination nor contraband: it is the on-ramp**… an un-captured
> freestyle is the real anti-pattern.
> — `CLAUDE.md:218` (rewritten in commit `9c402fbe`)

The site presents a binary where the repo now presents a dial you move over
time. See Q6.

### 2.6 What's different (`index.astro:158–173`)

**STALE — rewrite to the new wedge.** Leads with the audit trail; should lead
with legible + iterable formalization against the illegible-codebase foil.

### 2.7 Who it's for (`index.astro:175–196`)

**OK, with a caveat that may be the biggest strategic gap in the corpus.**
"By-the-book work" is still the only ICP on record and was re-affirmed as
recently as 2026-07-21 — where it is used to *discipline* an over-claim, so it
is live, not vestigial. But the new thesis's natural buyer (someone already
running coding agents and paying frontier-model bills) is a *different person*
from "a human following a script," and nothing in the corpus adjudicates it.
Personas are marked *"Legacy — re-author pending"* and the n8n competitor doc
is untouched since April. See Q13.

Usable if you want concrete workloads: F63's six task classes, ordered
thesis-strong → thesis-weak — deterministic reformat · schema-bound extraction
(invoice fields, KYC identifiers, contract dates) · open-vocabulary
classification (intake triage routing) · conditional multi-step routing ·
templated synthesis (analyst memo, AP reconciliation note) · open research
synthesis (**pre-committed as the weak spot**).

### 2.8 What it is not (`index.astro:45–51, 198–211`)

- *"Not a general-purpose AI agent — no open-ended autonomous execution."* —
  **WRONG, and the repo already flagged this exact line** as superseded and
  wrote the replacement:

  > **Reframe, don't drop:** "Not a general-purpose agent for *unsupervised*
  > execution. You partner with an agent on discovery, every pass is captured,
  > and you own the result once it's formalized."

  The F55 gating decision **inverted the promotion gate — "start open → restrict
  as process discovered"** — which is the precise opposite of what this bullet
  claims.
- The companion line *"every step declared, typed, and inspectable before it
  runs"* is **structurally still true** (sketches hard-fail compilation via
  `PlanError::FlowContainsSketches`; the canvas stays bijective with the JSON)
  but **rhetorically stale** — the product now deliberately ships a node whose
  behavior is not declared in advance.
- *"Not a storage system."* — **flatly WRONG now.** F73 shipped durable
  per-Project markdown knowledge bases with structural reachability boundaries
  plus `Recall`/`Curate`; F70 shipped a content-addressed artifact store with
  GDPR tombstone/GC; F73.4 event-sources the `Accumulator`/`State` backing.
  See Q12.
- *"Not code-first"* — **OK**, and stronger than ever at 132 block types.
- *"Not a replacement for judgment"* — **OK.**

### 2.9 CTA (`index.astro:213–226`), Header, Footer

*"Leave with the tool, not a credential."* / *"local-first and needs no account
for local use."* Splitting these, because they fare very differently:

- **"Leave with the tool, not a credential" — TRUE in substance, and it is the
  best claim on the site.** No license keys, no entitlements, no billing, and —
  verified — **no telemetry of any kind**: no PostHog, Mixpanel, Amplitude,
  Segment, GA, Sentry or Datadog anywhere in `crates/` or `web/src/`.
  `arachne-telemetry` is the *opposite* of a phone-home: its `aggregate_metric!`
  macro is type-gated so passing a `String`/`Uuid`/flow id is a **compile
  error**, backed by a repo-root `clippy.toml` lint blocking raw `metrics::*`
  calls from every other crate. Metrics never leave the process. Connectors are
  BYO-OAuth — you register your own apps, there is no vendor middleman.
- **"Needs no account" — FALSE.** F46 shipped JWT sessions, password hashing,
  revocable sessions, tenant resolution. Protected routes require a Bearer token
  by default (`middleware/auth.rs:127-130`). `AuthGate.tsx:20-33` renders
  `LoginScreen` for any unauthenticated session. The bypass is hard-gated on
  `import.meta.env.DEV`, which Vite statically replaces with `false` — so it is
  **tree-shaken out of production builds and can never ship**. The local
  experience exists only because `run.sh` exports four dev escape hatches,
  including a signing key literally named
  `arachne-dev-signing-key-do-not-use-in-prod`. `web/src/features/tenants/` also
  ships a `TenantSwitcher` — the product is multi-tenant by construction.

  See Q4 — one option is a small server change that would make the claim true.

### 2.10 `how-it-works.astro`

- H1 *"You build the flow by running it."* — **OK, better supported than when
  written.**
- §1 **Sketch · Refine · Formalize** (37–65) — **STALE in mechanism, right in
  spirit.** The choreography still ships (SketchExpand "Accept"/"Refine",
  `formalizeSketch`), so the section isn't dead — but the *stage enum* was
  deleted in F49.1 and formalization is now explicitly emergent:

  > **Formalization is not a global state machine** you transition through — it
  > is an **emergent, local property** computed from the kinds of nodes in each
  > region of a flow, surfaced (legibly) zone by zone. — Direction Refresh §3

  The ladder is now **Sketch → Agent → typed blocks**, and sketch→Agent is an
  **authoring action, not a compile-time desugar** — with a rationale worth
  borrowing wholesale, because it's the bijection argument in one line: a
  desugar would mean *"the thing that runs is **not a node in the JSON and not
  visible on the canvas**… You could no longer point at the running thing on the
  canvas."*
- §2 **Blocks · Effects · Provenance** (67–107) — **OK and THIN.**
  Document/Record still stands in the type system. Effects and provenance still
  stand, and provenance grew: `ProvenanceEntry` now carries seven side-cars
  (`sandbox`, `agent` with declared+measured discretion, `decision` — which
  keeps **every loser's score and rationale** from a best-of-N — `heap_access`,
  `correction`, `command`, `fetch_metadata`) plus `prompt_hash`, `config_hash`,
  `variable_refs`, `secret_ref_hashes`. **Missing: the third axis.** This page
  already explains purity and determinism; adding discretion here is a small
  edit with a large payoff. Caveat on Document/Record — see Q14.
- §3 **Humans are first-class** (109–134) — **THIN, and attributed to the wrong
  block.** The described behavior — *"pauses execution, routes a structured task
  to the right person, and resumes when they've acted"* — is **`Handoff`**
  (`HandoffAssignment::{SpecificUser, Role, Queue, Expression}`, Email/Slack/
  in-app notification, fallback assignee, escalation, 24h default deadline —
  `handoff.rs:103-250`). `Gate` is assignee + timeout + timeout action only
  (`blocks.rs:712-727`). Five human blocks over one pause primitive; paused runs
  are durable across restart. Same misattribution on the homepage and in
  `judgment-is-not-delegable.md`.
- §4 **Errors produce durable fixes** (136–155) — **OK**, and the divergence
  study is a far better illustration than the current abstract phrasing.

### 2.11 `philosophy.astro`

Holds up best of any page — it was written from the philosophical claims, and
those were *extended*, not overturned. Register-clean: no *program*, no
*principal-agent*, no *standing-reserve*. Three gaps:

- **Missing the thesis entirely.** ASI-is-not-required; use the smartest model
  once; the goal is *human freedom, not human replacement* — *"A tool that
  demands constant supervision hasn't removed the drudgery; it's relocated
  it."* This is philosophy-page material and it is the best writing in the
  corpus.
- **"Data control is architectural, not a policy"** — the argument is right but
  one sentence overclaims: *"Sensitive fields can be redacted or blinded before
  anything reaches a model."* PII redaction is an **opt-in per-node validator,
  regex-only, four categories** (email, US SSN, US phone, credit card w/ Luhn —
  `pii_detect.rs`). Reframe as a capability, not a property. It *does* record a
  `PiiRedactionRecord` in the provenance chain, which is a good true detail and
  more on-brand than the sweeping version.
- **"Trust is checking placed on purpose"** — survives, and could be sharpened
  with the newer formulation: *"Trust is never a system guarantee; it stays
  latent in the human, who reads the flags."*

### 2.12 `self-hosting.astro`

Read §0 first. Claim by claim:

| Claim | Verdict |
|---|---|
| "A flow is a JSON file you own, version, commit" (`:14,:50`) | **TRUE — the strongest claim on the site.** `flows/{id}/flow.json`, written with `to_string_pretty`, so it diffs cleanly. |
| The `flow.json` sample (`:57-67`) | **WRONG SHAPE.** Real schema is `nodes` (not `blocks`) with a tagged `block_type` object, and edges carry `source_port`/`target_port`/`verified`. ⚠️ Do **not** copy a fixture verbatim — several on-disk flow files still carry `formalization_stage`, a key removed in F49.1 that the deserializer now ignores and never re-emits. The real shape is *more* persuasive: `verified` on an edge is a visible trust artifact. |
| "no proprietary store to escape from" (`:14`) | **HALF-TRUE.** Flows are files; run history is SQLite. |
| "Runs where you run it… from day one" (`:19,:39`) | **CANNOT CLAIM.** Private repo, no license, no release, no container, no backend build. |
| "Hosted infrastructure is available as a convenience" (`:19,:88`) | **CANNOT CLAIM — exists in no form.** Cut it. |
| "The data never leaves infrastructure you control" (`:24`) | **CANNOT CLAIM unqualified.** The default LLM provider shells out to the `claude` CLI → Anthropic. True only with Ollama or `--no-llm`. See Q15. |
| "Sensitive fields are redacted or blinded before anything reaches a model" (`:24,:103`) | **CANNOT CLAIM as a guarantee** — see §2.11. |
| "Low-stakes inference can run on local models" (`:24,:104`) | **TRUE, and newly so.** Ollama is genuinely wired (`providers/ollama.rs`, default `localhost:11434`) and fail-closed when the daemon is down. F58 adds per-node model tiers; F62 distillation removes the model entirely. This was aspirational in June and is real now — give it more space, not less. |
| "execution history is recorded where you direct it" (`:91`) | **TRUE** (env-var relocatable) — but say "SQLite"; don't imply files. |
| "The JSON and every intermediate state work fully offline" (`:117`) | **TRUE.** |
| "Local use needs no account" (`:120`) | **CANNOT CLAIM** — §2.9. |
| "Licensing details are coming" (`:129-134`) | **ACCURATE** — matches `STATUS.md:512` exactly. Keep verbatim. |
| "Leave with the tool, not a credential" (`:142`) | **TRUE in substance** — lead with it. |

**One unmentioned feature belongs on this page.** A filesystem watcher pushes
external edits to `flow.json` into the running canvas (`flow_watcher::spawn`,
`main.rs:287-289`). *"Edit the file in your editor, or check out a different
branch, and the canvas follows"* is concrete, demonstrable, on-thesis, and a
better desktop-only demo hook than the abstract ownership language now in that
slot.

**One caveat that argues against over-promising on security:** credentials are
**plaintext at rest by default**. The server prints its own warning at boot —
*"OAuth tokens and connector credentials will be stored AS PLAINTEXT at rest in
`~/.arachne/state.db`"*. Real AES/KMS machinery exists but is opt-in, and
`run.sh` deliberately leaves it off.

### 2.13 Blog

| Post | Verdict |
|---|---|
| `safety-is-a-road` | **OK — strengthened.** Road/markings/signs *is* the enframement argument in permitted words. Best-positioned post on the site, and the model for how to handle Q3. |
| `judgment-is-not-delegable` | **OK**, modulo the Gate/Handoff swap. |
| `verifiability-is-not-trust` | **Register violation.** Calls the flow "the program itself" (¶26, ¶34). Locked private: *"Calling a flow 'a program' cuts directly against the non-programmer thesis… Safe internally; unsafe as messaging."* Two sentences to fix. |
| `at-least-once-over-exactly-once` | **OK — and now enforced.** The executor **refuses to retry a `WritesExternal` block without an idempotency declaration** (`retry.rs:211`). The post argues in the abstract; the runtime backs it. |
| `why-the-void-block` | **OK** — `BlockType::Void` still ships. |
| 3 use-case posts | **OK**, now backed by real bundled templates. |

### 2.14 Hero, tokens, DESIGN.md

- **Design tokens are stale.** `DESIGN.md` says `tokens.css` is a vendored copy
  "never edited here." The product added `agent: rgba(214, 92, 171, 0.9)`
  (`categoryColor.ts:21`) plus `compliance` and `security` categories; the
  site's `tokens.css` and `src/lib/flow.ts` have none of them. Re-vendor.
- **Hero template promise: now mostly honest.** All three missing templates
  shipped. The one remaining gap is **Competitive intel**, which still has no
  backing template — and `DESIGN.md` requires the hero to mirror a real one.
  See Q22.
- **Open design question:** should the hero show an Agent node with hazy edges
  graduating into typed blocks? That's the repositioning in one image, and the
  hero can't currently express it. See Q21.
- **Pre-launch checklist entirely undone** — placeholder domain in
  `astro.config.mjs` / `robots.txt` / `deploy/nginx.conf`; no `og.png`; bare
  `https://github.com/` links.

### 2.15 Cross-cutting: the register problem

**The product is now shipping words the site is forbidden to use.** The June 1
rules ban *harden/hardening* and lock *enframe* private. Yet:

- the June 19 wedge sentence itself says *"move along the discretion dial,
  watch, **harden**"*;
- the shipped ConfigPanel says *"**bounded** — **enframed** model judgment at
  most"* and *"**open** — admits **freestyle** (legal no-op)"* — both a barred
  word and a retired word, in front of users;
- a whole phase is titled *"Enframement **Hardening**."*

Nobody has adjudicated whether in-product copy is exempt. See Q3.

**But the product also solved the problem for us.** Two shipped UI strings are
the public-safe rendering of enframement, and they're good:

> Once you know a node's process, **pen it in**: declare the most discretion any
> upstream step may exercise. Violations surface as a compiler finding.
> — `ConfigPanel.tsx:488`

> Once you have watched this agent across runs, **pen it in** — narrow what it
> may do, part by part. Every step lowers discretion and raises reliability.
> — `AgentGraduationSection.tsx:246`

And there is a **register rule pinned in a code comment** that the site should
simply adopt (`AgentGraduationSection.tsx:55`):

> copy says **"narrow" / "graduate" / "downgrade", never "promote" / "unlock"**

One more inconsistency to settle: **"pipelines" or "flows"?** `README.md` and
the product's onboarding subtitle both say *information-processing pipelines*;
everything else in the product and all of the site says *flows*.

---

## 3. What the site can newly claim

Everything above is subtraction. This is the addition — shipped capability the
current copy doesn't know exists, roughly by how much it would improve the site.

1. **The graduation arc, end to end.** Hand a task to a free Agent → watch it
   across runs → narrow it part by part → **distill the judgment into a
   classifier that needs no model at all** (`DistilledClassifier`, `(Pure,
   Deterministic)`, offline). Append-only `GraduationEvent` lineage records
   every step. The product's best story; the site tells none of it.
2. **The divergence study — and it landed.** Run a formal flow beside a free
   Agent, score the divergence, and **convert an edge case the agent found into
   a one-click flow addition** (`TestOrigin::AgentFoundGap`). F60.3/.4 are
   `done` (a roadmap doc listing them as outstanding is one day stale). This is
   the concrete payoff of "the process learns."
3. **Cost is now a mechanical argument, not a slogan.** Per-node model tiers
   (`Fast | Balanced | Powerful`), per-node cost/latency surfacing, a wired
   Ollama provider, and distillation to no-model-at-all.
4. **Dry run / effect preview (F47).** `Block::dry_run`, prepare/commit split on
   write blocks, an "intended effect" panel — **see what a flow would send
   before it sends it.**
5. **Three test tiers.** Test (fixtures injected, writes quarantined), Staging
   (real reads, writes still quarantined), Production — plus **LLM cassettes for
   deterministic replay**. The site says "testable before it touches real data";
   the product has a much more precise answer.
6. **Run-policy decomposition (F69).** `EffectCommitPolicy {Commit|Preview|Stub}`
   × `DurableWritePolicy {Persist|Suppress}` × `trace_verbose`. Worth citing for
   one consequence: *a test run structurally cannot write to your knowledge
   base* — it falls out of the effect gate rather than being a remembered rule.
7. **Axis legibility on canvas (F56).** *"purity / determinism / discretion
   increases here, caused by node X"*, hazy edges on Agents, and a per-zone
   signal that is **computed, never stored** and **describes, never enforces** —
   *"a zone is as discretionary as its most discretionary node."* This *is* the
   new wedge, rendered.
8. **Real-time collaboration (F48).** Per-flow WS rooms, presence, a durable
   server-applied oplog, server-authoritative CRDT merge, and **agent edits
   unified onto the same merge layer as human edits.** The site presents Arachne
   as single-player.
9. **The AAR agent (F73).** Reflects over run history, writes process knowledge,
   and *suggests* formalizations — but **never mutates a flow** (`aar.rs:1-21`).
   That restraint is exactly the site's voice.
10. **The editor is modal.** `ModePill` shows NORMAL / INSERT / COMMAND / HINT /
    FIND. Never mentioned on the site, and it is both a "built to work in your
    hands" proof point and the honest justification for desktop-first.
11. **The file watcher** (§2.12) and **idempotency-enforced retries** (§2.13).

**Not claimable:**

- **Any benchmark number.** The results doc is *"placeholder / structure-
  validation… **not** a real benchmark run"* against a seeded fixture, and the
  harness runs an offline deterministic stub. The *methodology* is real,
  pre-registered and frozen — see Q20.
- **Transcript→flow synthesis (F75).** `status: plan`, pending human decisions;
  the end-to-end handler is `open`; in-Arachne capture is blocked. No front
  door.
- **The whole 2026-07-21 context/knowledge arc** (stack/heap, Project primitive,
  zettelkasten). Its own doc says *"almost none of this exists yet, and that is
  fine"* — and bars its vocabulary from public copy outright.
- **Enframement as delivered.** v1 is soft by design (§2.4).

---

## 4. Questions for you

### First, and blocking everything

**Q1 — Is the repo going public, and when?** Every ownership claim on this site
is unverifiable while `tjmisko/Arachne` is private, unlicensed, and unreleased,
and every CTA is a dead link. If the answer is "not soon," Self-hosting's job
changes from *"here's how to self-host"* to *"here's the ownership model we
commit to"* — a defensible page, but a different one. What does `Get started`
point at on day one?

**Q2 — What license?** Undecided per `STATUS.md`. The page's core argument —
"ownership is a property of the architecture, not a clause" — reads very
differently under AGPL vs. MIT vs. source-available. Different claims survive
each.

### Positioning

**Q3 — Does the site lead or follow the repo?** The June 19 refresh demotes
auditability, but `STATUS.md:13` **still names the June 1 Trust Thesis as
authoritative for Messaging & Positioning**, and the reconciliation tasks
**D-1…D-6 are all still unchecked — none of those docs exist.** No vision
refresh, no discretion/enframement philosophy addendum, no three-axis doc. So a
rewrite runs ahead of the corpus. My recommendation: proceed against the
Refresh and treat the site as the forcing function for D-1 — but that is a
founder call, not mine.

**Q4 — Is the trust triad retired?** `Visible · Bounded · Auditable` appears
**nowhere in the repo after 2026-06-01**. It is orphaned rather than overturned:
*Visible* is promoted, *Auditable* is demoted-by-name but strengthened-in-
substance, *Bounded* is in tension with a permissive-by-default Agent. Keep,
rework, or retire?

**Q5 — Does "Run agents you can't trust?" survive?** The explore/exploit framing
is more generous and more defensible. But the current line is yours from the
June 1 interview and it has bite.

**Q6 — Is "the inversion" still the signature move?** "The agent builds the
flow. You verify it. Then it runs." was locked as the signature headline. It is
now demoted to one mode. Two beats, one replacing the other, or the inversion as
a sub-point of a larger operating story?

**Q7 — Close the blank.** *"Intelligence is an asset for exploration and a
liability when control, reliability, and ___ is the objective."* The Refresh
leads *accountability*; STATUS records it as "provisionally the full congeries"
— i.e. still not a publishable word. This sentence is good enough to be a
homepage line if you finish it.

### Vocabulary

**Q8 — Can the site say "pen it in"?** This is the crux. *Enframe*,
*bureaucratize*, *harden* and *surveil* are all barred, but "enframed" is now a
core product concept — and the product's *own* UI already ships the public-safe
rendering: **"pen it in."** It is vivid, it is in front of users today, and
under the current rules the site cannot use it. Lift the ban for this phrase,
or find another?

Related and cheap: adopt the product's pinned register rule verbatim —
**"narrow / graduate / downgrade, never promote / unlock."**

**Q9 — Do *Agent*, *Jig*, and *discretion* go public?** All three are shipped
user-facing vocabulary; none is on the locked public word list. Note the site
already uses "agent" generically ~20 times, which will collide with the proper
noun. And "Bounded" now means something narrower in-app than on the site.

**Q10 — "Pipelines" or "flows"?** The README and product onboarding say
pipelines; everything else says flows. Pick one and fix the README too.

### Claims

**Q11 — How honest must the site be about "soft"?** F55.0 requires the
soft-not-a-sandbox caveat *"in every surface."* Whether that binds marketing is
unresolved. Any copy implying containment contradicts it. `safety-is-a-road`
already threads this needle — is the pillar allowed to lean on the essay, or
does it need its own hedge?

**Q12 — Does "Not a storage system" get dropped or rewritten?** False as
written. Drop it, or rewrite as "not a system of record" — which stays true and
still refuses the scope?

**Q13 — How do we fix the grounding claim?** True for extraction, false for
synthesis by explicit code assertion. (a) narrow it — "extraction blocks cite
the passage behind every claim"; (b) drop it; (c) treat it as a product gap to
close before launch. Appears in three places.

**Q14 — How do we handle "no account"?** Four options: (a) drop the word and say
"runs single-user by default"; (b) say nothing, let data-locality carry it;
(c) ship a genuine `--single-user` production mode so the claim becomes
structurally true — a small server change; (d) accept it and reframe entirely on
"no license key, no telemetry, no vendor middleman," which is verified true.

**Q15 — Is the local-model story the default or a step?** Ollama is your best
"data never leaves" evidence, but the default provider shells out to the Claude
CLI. Is the intended default changing, or does the page present "configure a
local model" as an explicit step?

### Scope

**Q16 — Who is the buyer?** The corpus's biggest gap. "By-the-book work" is the
only ICP on record and was re-affirmed 2026-07-21 — but the new thesis's natural
buyer already runs coding agents and pays frontier-model bills, which is a
different person. Personas are "legacy, re-author pending"; the competitor doc
is four months old. Same ICP, second ICP, or is the frontier-model-cost angle a
message rather than an audience?

**Q17 — Does the site get its own design-system entry?** `ops/design/` predates
this repo and says outright *"There is no marketing site… in the codebase."* Its
voice guide ("terse, technical… Vim, tmux, k9s — not consumer SaaS") is exactly
right and worth adopting formally rather than by osmosis.

**Q18 — Do we add a page, or hold at five?** Two candidates have the material:
**(a) Discretion / how formalization works** — three axes, the ladder,
graduation, distillation; **(b) Agents & trust** — the explore/exploit argument.
Either could instead be an essay. DESIGN.md locks "small multi-page."

**Q19 — Does the pump become public?** The ops story — a usage-governed
autonomous pump, 616 task files, a parallel worktree fleet, and a genuinely
candid after-action report about it wedging — is the most unusual thing about
this project. Strong essay, real distraction, and it reveals a lot about how the
product is made. Blog post, or nothing?

**Q20 — Do we mention the benchmark program?** F63 is a pre-registered,
falsifiable two-arm study with a pre-committed honest-weak-spot section, frozen
before any data existed so it *"cannot be retuned to flatter the thesis."*
Potentially the most credible asset in the repo — and it has **no results**. Do
we describe the *program* (we pre-registered a test of our own claim), or stay
silent until it runs? The thesis doc asks this same question of itself and
leaves it open.

**Q21 — Does the hero change?** The rotating six-flow hero shows a *finished*
formal flow. The new story is a flow *moving* — an Agent node with hazy edges
being narrowed into typed blocks. That is the repositioning in one image, and
the hero cannot currently express it. It is also the most expensive item on this
list, and the current hero is three weeks old. Leave it, add a seventh
"graduation" flow to the rotation, or rebuild the animation around the dial?

**Q22 — Two smaller ones.** Does *Competitive intel* get a real template, or
does the mirror promise get softened? And do we adopt the newly public-cleared
**river metaphor** (diverging / meandering / converging) — the only new
brand-safe material since June 1, and a natural partner to the implicit web?

### Deferred, not blocking

**Q23 — Document / Record.** Still the one explicitly unresolved copy question
from June 1 ("Document doesn't read as informal, Record doesn't read as
formal"). June 19 escalated it: the whole dichotomy *"may be the wrong
formalism,"* flagged for future litigation. **Don't build new copy on it.**

**Q24 — Pre-launch checklist.** Domain, `og.png`, real GitHub and docs URLs,
licensing block. All gated on Q1/Q2.

---

## 5. Suggested sequencing

1. **Answer Q1 and Q2.** Distribution reality determines whether Self-hosting is
   a how-to or a manifesto, and what every CTA points at.
2. **Answer Q3–Q6** (positioning spine). Everything in the copy cascades.
3. **Factual corrections** — safe to do now, independent of the reframe:
   the "Not a general-purpose AI agent" reframe (the replacement is already
   written); the storage claim; the Gate→Handoff swap in three places; the
   grounding claim in three places; the sandbox/isolation sentence; the PII
   sentence; the `flow.json` sample shape; the "program" sentences in
   `verifiability-is-not-trust.md`; re-vendor `tokens.css` + `flow.ts`.
4. **Homepage rewrite** — wedge band, gap, inversion, pillar bodies.
5. **How-it-works §1 and §2** — the ladder replaces the stage framing;
   discretion joins purity and determinism.
6. **Philosophy** — add the technology-as-tool / human-freedom section; soften
   the PII sentence.
7. **Self-hosting** — rebuild on §0's answer. Add the file watcher.
8. **Hero** — only if Q21 says the Agent node goes in.
9. **Pre-launch checklist.**

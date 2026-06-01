/**
 * Hero flow data — the single source the rotating hero renderer reads.
 *
 * Six domain flows (+ one hidden Office Space easter egg) that all share the
 * same parallel skeleton: source(s) → ×N parallel branch carrying a small
 * `extraction` (the *minor* judgment) → Merge → a human Gate (where the
 * *consequential* judgment stays) → synthesis → action. Each domain uses the
 * parallel pattern native to its pain so a practitioner in that field reads it
 * as their own Monday.
 *
 * Layout model: every node carries an explicit (col, lane). `col` (stage index)
 * → x; `lane` (vertical slot, fractional centers between lanes) → y. The
 * renderer derives geometry, `VW` from max col, `VH` from `maxLane`. Edges are
 * arbitrary from→to pairs (a node may fan out to several). `stages` is the
 * execution order: each inner array runs concurrently (`Promise.all`), stages
 * run in sequence — so ≥2 branch nodes hold RUNNING at once and the Merge node
 * waits on all upstream branches.
 *
 * Vocabulary gate (arachne-positioning-vocabulary memory): public words are
 * delegation/trust; the pain copy is insider/by-the-book voice. No banned words.
 */

import type { BlockCategory } from "./flow";

export interface HeroNode {
  id: string;
  label: string;
  cat: BlockCategory;
  col: number;
  lane: number;
  /** Easter-egg only: status text that flashes in place of RUNNING. */
  errorStatus?: string;
}

export interface HeroEdge {
  from: string;
  to: string;
}

export interface HeroFlow {
  id: string;
  /** Short chip label for the dot/indicator, e.g. "Competitive intel". */
  domain: string;
  /** Who recognizes it, e.g. "market/product analyst". */
  who: string;
  /** Native parallel pattern, e.g. "what changed?". */
  pattern: string;
  /** One-line "hair on fire" pain, insider voice. Shown under the diagram. */
  pain: string;
  /** Bundled template name if this mirrors a real one; else undefined. */
  template?: string;
  bundled: boolean;
  /** Hidden, comedic, never claimed as a shipped template. */
  easterEgg?: boolean;
  /** Highest lane index used — renderer sizes VH from this. */
  maxLane: number;
  nodes: HeroNode[];
  edges: HeroEdge[];
  /** The human-checkpoint node id (gets the needs-input → approved beat). */
  gate: string;
  /** Topological run order; each inner array runs concurrently. */
  stages: string[][];
  /** Accessible description of the parallel topology. */
  aria: string;
}

/** Build the straight chain of edges/stages shared by the simple-tail flows. */

export const FLOWS: HeroFlow[] = [
  // 1 ── Competitive intel · what changed? ───────────────────────────────────
  {
    id: "competitive-intel",
    domain: "Competitive intel",
    who: "market / product analyst",
    pattern: "what changed?",
    pain: "Every Monday I open a dozen competitor pages and changelogs, eyeball what moved, and write it up before the 10am sync.",
    bundled: false,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "schedule", label: "Schedule", cat: "source", col: 0, lane: 0.5 },
      { id: "scanA", label: "Extract Δ", cat: "extraction", col: 1, lane: 0 },
      { id: "scanB", label: "Extract Δ", cat: "extraction", col: 1, lane: 1 },
      { id: "merge", label: "Merge", cat: "control", col: 2, lane: 0.5 },
      { id: "rank", label: "Rank", cat: "transformation", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "brief", label: "Brief", cat: "synthesis", col: 5, lane: 0.5 },
      { id: "post", label: "Post", cat: "action", col: 6, lane: 0.5 },
    ],
    edges: [
      { from: "schedule", to: "scanA" },
      { from: "schedule", to: "scanB" },
      { from: "scanA", to: "merge" },
      { from: "scanB", to: "merge" },
      { from: "merge", to: "rank" },
      { from: "rank", to: "gate" },
      { from: "gate", to: "brief" },
      { from: "brief", to: "post" },
    ],
    stages: [["schedule"], ["scanA", "scanB"], ["merge"], ["rank"], ["gate"], ["brief"], ["post"]],
    aria:
      "A competitive-intel flow: a scheduled trigger fans out to several sources extracted for changes in parallel, merged and ranked, reviewed at a human gate, then briefed and posted.",
  },

  // 2 ── Customer feedback · reconcile (bundled Feedback Synthesis) ───────────
  {
    id: "feedback-synthesis",
    domain: "Customer feedback",
    who: "Head of CS / PM",
    pattern: "reconcile",
    pain: "Churn signals are scattered across tickets, call recordings, NPS, and reviews — I sample a few by hand each month and hope I'm not missing a pattern.",
    template: "Feedback Synthesis",
    bundled: true,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "ingestA", label: "Ingest", cat: "source", col: 0, lane: 0 },
      { id: "ingestB", label: "Ingest", cat: "source", col: 0, lane: 1 },
      { id: "themesA", label: "Extract themes", cat: "extraction", col: 1, lane: 0 },
      { id: "themesB", label: "Extract themes", cat: "extraction", col: 1, lane: 1 },
      { id: "merge", label: "Merge", cat: "control", col: 2, lane: 0.5 },
      { id: "cluster", label: "Cluster", cat: "transformation", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "summarize", label: "Summarize", cat: "synthesis", col: 5, lane: 0.5 },
      { id: "send", label: "Send", cat: "action", col: 6, lane: 0.5 },
    ],
    edges: [
      { from: "ingestA", to: "themesA" },
      { from: "ingestB", to: "themesB" },
      { from: "themesA", to: "merge" },
      { from: "themesB", to: "merge" },
      { from: "merge", to: "cluster" },
      { from: "cluster", to: "gate" },
      { from: "gate", to: "summarize" },
      { from: "summarize", to: "send" },
    ],
    stages: [["ingestA", "ingestB"], ["themesA", "themesB"], ["merge"], ["cluster"], ["gate"], ["summarize"], ["send"]],
    aria:
      "A customer-feedback synthesis flow: several feedback sources ingested and theme-extracted in parallel, merged and clustered, reviewed at a human gate, then summarized and sent.",
  },

  // 3 ── Recruiting screen · batch-extract ───────────────────────────────────
  {
    id: "recruiting-screen",
    domain: "Recruiting screen",
    who: "recruiter / hiring manager",
    pattern: "batch-extract",
    pain: "120 applicants by Friday; I skim each resume against the must-haves and try to be consistent, but applicant #5 and #95 get a different bar.",
    bundled: false,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "apps", label: "Applications", cat: "source", col: 0, lane: 0.5 },
      { id: "parseA", label: "Parse", cat: "transformation", col: 1, lane: 0 },
      { id: "parseB", label: "Parse", cat: "transformation", col: 1, lane: 1 },
      { id: "scoreA", label: "Score", cat: "extraction", col: 2, lane: 0 },
      { id: "scoreB", label: "Score", cat: "extraction", col: 2, lane: 1 },
      { id: "merge", label: "Rank", cat: "control", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "draft", label: "Draft", cat: "synthesis", col: 5, lane: 0.5 },
      { id: "send", label: "Send", cat: "action", col: 6, lane: 0.5 },
    ],
    edges: [
      { from: "apps", to: "parseA" },
      { from: "apps", to: "parseB" },
      { from: "parseA", to: "scoreA" },
      { from: "parseB", to: "scoreB" },
      { from: "scoreA", to: "merge" },
      { from: "scoreB", to: "merge" },
      { from: "merge", to: "gate" },
      { from: "gate", to: "draft" },
      { from: "draft", to: "send" },
    ],
    stages: [["apps"], ["parseA", "parseB"], ["scoreA", "scoreB"], ["merge"], ["gate"], ["draft"], ["send"]],
    aria:
      "A recruiting-screen flow: a pile of applications parsed and scored against a rubric in parallel, ranked, with the borderline band reviewed at a human gate, then drafted and sent.",
  },

  // 4 ── AP reconciliation · three-way match ─────────────────────────────────
  {
    id: "ap-reconciliation",
    domain: "AP reconciliation",
    who: "AP clerk / controller",
    pattern: "three-way match",
    pain: "Month-end: match each invoice to its PO and receipt across two systems; the ones that don't tie out are buried in a 200-row sheet.",
    bundled: false,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "invoices", label: "Invoices", cat: "source", col: 0, lane: 0.5 },
      { id: "fieldsA", label: "Extract", cat: "extraction", col: 1, lane: 0 },
      { id: "fieldsB", label: "Extract", cat: "extraction", col: 1, lane: 1 },
      { id: "matchA", label: "Match", cat: "transformation", col: 2, lane: 0 },
      { id: "matchB", label: "Match", cat: "transformation", col: 2, lane: 1 },
      { id: "merge", label: "Merge", cat: "control", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "post", label: "Post", cat: "action", col: 5, lane: 0.5 },
    ],
    edges: [
      { from: "invoices", to: "fieldsA" },
      { from: "invoices", to: "fieldsB" },
      { from: "fieldsA", to: "matchA" },
      { from: "fieldsB", to: "matchB" },
      { from: "matchA", to: "merge" },
      { from: "matchB", to: "merge" },
      { from: "merge", to: "gate" },
      { from: "gate", to: "post" },
    ],
    stages: [["invoices"], ["fieldsA", "fieldsB"], ["matchA", "matchB"], ["merge"], ["gate"], ["post"]],
    aria:
      "An accounts-payable reconciliation flow: invoices field-extracted and matched to PO and receipt in parallel, merged, with exceptions reviewed at a human gate, then posted.",
  },

  // 5 ── Inbound leads · triage ──────────────────────────────────────────────
  {
    id: "inbound-leads",
    domain: "Inbound leads",
    who: "SDR / RevOps",
    pattern: "triage",
    pain: "300 form-fills overnight; I enrich each, guess fit, and route — half are junk and the good ones go cold while I dig.",
    bundled: false,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "leads", label: "New leads", cat: "source", col: 0, lane: 0.5 },
      { id: "enrichA", label: "Enrich", cat: "io", col: 1, lane: 0 },
      { id: "enrichB", label: "Enrich", cat: "io", col: 1, lane: 1 },
      { id: "scoreA", label: "Score fit", cat: "extraction", col: 2, lane: 0 },
      { id: "scoreB", label: "Score fit", cat: "extraction", col: 2, lane: 1 },
      { id: "route", label: "Route", cat: "control", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "sync", label: "Sync CRM", cat: "action", col: 5, lane: 0.5 },
    ],
    edges: [
      { from: "leads", to: "enrichA" },
      { from: "leads", to: "enrichB" },
      { from: "enrichA", to: "scoreA" },
      { from: "enrichB", to: "scoreB" },
      { from: "scoreA", to: "route" },
      { from: "scoreB", to: "route" },
      { from: "route", to: "gate" },
      { from: "gate", to: "sync" },
    ],
    stages: [["leads"], ["enrichA", "enrichB"], ["scoreA", "scoreB"], ["route"], ["gate"], ["sync"]],
    aria:
      "An inbound-lead triage flow: new leads enriched and fit-scored in parallel, routed by tier, with tier-one claimed at a human gate, then synced to the CRM.",
  },

  // 6 ── Contract / NDA review · batch-check ─────────────────────────────────
  {
    id: "contract-review",
    domain: "Contract review",
    who: "contracts manager / counsel",
    pattern: "batch-check",
    pain: "A stack of inbound NDAs and vendor MSAs; the same dozen playbook checks each time — but a missed carve-out is a real problem.",
    bundled: false,
    maxLane: 1,
    gate: "gate",
    nodes: [
      { id: "contracts", label: "Contracts", cat: "source", col: 0, lane: 0.5 },
      { id: "regA", label: "Regularize", cat: "transformation", col: 1, lane: 0 },
      { id: "regB", label: "Regularize", cat: "transformation", col: 1, lane: 1 },
      { id: "checkA", label: "Check", cat: "extraction", col: 2, lane: 0 },
      { id: "checkB", label: "Check", cat: "extraction", col: 2, lane: 1 },
      { id: "merge", label: "Merge", cat: "control", col: 3, lane: 0.5 },
      { id: "gate", label: "Gate", cat: "control", col: 4, lane: 0.5 },
      { id: "redline", label: "Redlines", cat: "synthesis", col: 5, lane: 0.5 },
      { id: "send", label: "Send", cat: "action", col: 6, lane: 0.5 },
    ],
    edges: [
      { from: "contracts", to: "regA" },
      { from: "contracts", to: "regB" },
      { from: "regA", to: "checkA" },
      { from: "regB", to: "checkB" },
      { from: "checkA", to: "merge" },
      { from: "checkB", to: "merge" },
      { from: "merge", to: "gate" },
      { from: "gate", to: "redline" },
      { from: "redline", to: "send" },
    ],
    stages: [["contracts"], ["regA", "regB"], ["checkA", "checkB"], ["merge"], ["gate"], ["redline"], ["send"]],
    aria:
      "A contract-review flow: inbound contracts regularized and checked against a playbook in parallel, merged, with flagged clauses reviewed at a human gate, then redlined and sent.",
  },

  // 7 ── TPS reports · Office Space easter egg (hidden, comedic) ──────────────
  // Not a bundled template, never claimed as one. The joke is in the labels and
  // the ×4 fan-out (implying "eight different bosses"); tints/run-state tokens
  // stay normal. Renderer keeps this behind a hidden dot and off auto-rotation.
  {
    id: "tps-reports",
    domain: "TPS reports",
    who: "any Initech cubicle",
    pattern: "did you get the memo?",
    pain: "Yeahhh… I'm gonna need you to go ahead and get those TPS reports out. Did you get the memo about the new cover sheet?",
    bundled: false,
    easterEgg: true,
    maxLane: 3,
    gate: "gate",
    nodes: [
      { id: "mondays", label: "The Mondays", cat: "source", col: 0, lane: 1.5 },
      { id: "coverA", label: "Cover sheet", cat: "transformation", col: 1, lane: 0 },
      { id: "coverB", label: "Cover sheet", cat: "transformation", col: 1, lane: 1 },
      { id: "coverC", label: "Cover sheet", cat: "transformation", col: 1, lane: 2 },
      { id: "coverD", label: "Cover sheet", cat: "transformation", col: 1, lane: 3 },
      { id: "memoA", label: "The memo", cat: "extraction", col: 2, lane: 0 },
      { id: "memoB", label: "The memo", cat: "extraction", col: 2, lane: 1 },
      { id: "memoC", label: "The memo", cat: "extraction", col: 2, lane: 2 },
      { id: "memoD", label: "The memo", cat: "extraction", col: 2, lane: 3 },
      { id: "merge", label: "Merge", cat: "control", col: 3, lane: 1.5 },
      { id: "gate", label: "Lumbergh", cat: "control", col: 4, lane: 1.5 },
      { id: "collate", label: "Collate TPS", cat: "synthesis", col: 5, lane: 1.5 },
      { id: "send", label: "The Bobs", cat: "action", col: 6, lane: 1.5, errorStatus: "PC LOAD LETTER" },
    ],
    edges: [
      { from: "mondays", to: "coverA" },
      { from: "mondays", to: "coverB" },
      { from: "mondays", to: "coverC" },
      { from: "mondays", to: "coverD" },
      { from: "coverA", to: "memoA" },
      { from: "coverB", to: "memoB" },
      { from: "coverC", to: "memoC" },
      { from: "coverD", to: "memoD" },
      { from: "memoA", to: "merge" },
      { from: "memoB", to: "merge" },
      { from: "memoC", to: "merge" },
      { from: "memoD", to: "merge" },
      { from: "merge", to: "gate" },
      { from: "gate", to: "collate" },
      { from: "collate", to: "send" },
    ],
    stages: [
      ["mondays"],
      ["coverA", "coverB", "coverC", "coverD"],
      ["memoA", "memoB", "memoC", "memoD"],
      ["merge"],
      ["gate"],
      ["collate"],
      ["send"],
    ],
    aria:
      "A tongue-in-cheek TPS-report flow: a cover sheet attached and the memo checked across eight bosses in parallel, merged, approved at a Lumbergh gate, then collated and sent to the Bobs.",
  },
];

/** The six real domains that auto-rotate, in order. */
export const ROTATION: HeroFlow[] = FLOWS.filter((f) => !f.easterEgg);

/** Look up a flow by id (used by the hidden easter-egg dot). */
export const flowById = (id: string): HeroFlow | undefined => FLOWS.find((f) => f.id === id);

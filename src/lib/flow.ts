/**
 * Shared flow vocabulary — keeps the hero, block cards, and flow snippets
 * mapping block categories and run states to the *same* canvas tokens.
 * Mirrors `categoryColor.ts` in the app repo.
 */

export type BlockCategory =
  | "source"
  | "transformation"
  | "extraction"
  | "synthesis"
  | "control"
  | "action"
  | "io"
  | "state"
  | "human"
  | "module";

/** CSS custom property (from tokens.css) for a category's tint. */
export const categoryVar: Record<BlockCategory, string> = {
  source: "var(--cat-source)",
  transformation: "var(--cat-transformation)",
  extraction: "var(--cat-extraction)",
  synthesis: "var(--cat-synthesis)",
  control: "var(--cat-control)",
  action: "var(--cat-action)",
  io: "var(--cat-io)",
  state: "var(--cat-state)",
  human: "var(--cat-human)",
  module: "var(--cat-module)",
};

export type RunState = "idle" | "running" | "completed" | "needs-input";

export const stateLabel: Record<RunState, string> = {
  idle: "IDLE",
  running: "RUNNING",
  completed: "COMPLETED",
  "needs-input": "NEEDS-INPUT",
};

export const stateVar: Record<RunState, string> = {
  idle: "var(--fg-3)",
  running: "var(--accent-strong)",
  completed: "var(--success)",
  "needs-input": "var(--conf-needs-input)",
};

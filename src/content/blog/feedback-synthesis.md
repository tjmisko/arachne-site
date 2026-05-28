---
type: usecase
title: "Synthesizing feedback from many sources"
dek: "A fan-in pipeline that merges several feedback streams, extracts entities, compares across sources, and validates before it writes."
date: 2026-05-12
template: "Feedback Synthesis"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

Feedback about the same thing arrives from several sources at once: a survey export, a stack of support threads, a handful of interview notes. Each comes in a different shape. Someone reconciles them by hand, reading across all three, deciding what agrees and what conflicts, and writing it up.

It is slow, and the result is hard to defend. When a stakeholder asks where a conclusion came from, the trail is in the synthesizer's head, not on the page.

## The flow

The `Feedback Synthesis` template is a fan-in. Two source paths run in parallel and converge.

Each source enters its own `Regularize` block, which normalizes that source's shape into a common form. The survey and the support threads do not share a structure, so they do not share a path.

Each normalized stream feeds its own `Extract Entities` block. These pull structured items out of the text: themes, complaints, requests. Every extracted item carries a reference back to the source passage it came from.

The two extraction paths meet at `Compare`. This is the convergence point. `Compare` reconciles the items across sources, surfacing where they agree and where they disagree.

`Validate` checks the merged result against declared rules before anything leaves the pipeline. `Draft` produces the written synthesis. `Write` records it as an artifact.

## Key decisions

Each source gets its own `Regularize` and `Extract Entities` path because the sources are not comparable until they have been normalized separately. Merging early would mean reconciling raw shapes; merging at `Compare` means reconciling structured items.

`Validate` sits before `Write`, not after. A bad merge is cheaper to catch as a failed check than as a published artifact. Nothing is written until the rules pass.

Provenance is load-bearing here. Because `Extract Entities` ties each item to its source passage and `Compare` preserves those ties, every line of the final synthesis traces back to which source said it. The "where did this come from" question has an answer on the page.

## What it teaches

This is the canonical fan-in shape: multiple inputs, parallel extraction, cross-source comparison, validation before output. It generalizes to any task that reconciles many sources into one defensible result — competitive research, incident retrospectives, merging notes from several reviewers.

## Start from this template

Open the `Feedback Synthesis` template and run it on your own sources. Add more source paths as more feedback streams appear; each gets its own `Regularize` and `Extract Entities`. Tighten the `Validate` rules as you learn what a good merge looks like in your data.

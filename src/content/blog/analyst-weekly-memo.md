---
type: usecase
title: "The analyst's weekly memo, as a flow"
dek: "A linear pipeline that turns a week of source material into a reviewed, sent memo — with a human sign-off in the middle."
date: 2026-05-22
template: "Analyst Weekly Memo"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

An analyst writes a weekly memo from a recurring pile of source material: reports, feeds, meeting notes. Done by hand, it is slow and the output varies week to week — what gets cited, how findings are framed, which sources made the cut. Done by pasting everything into a chat window, it is faster but leaves no artifact: no record of which sources fed which claim, no version to review, nothing to rerun next week. The work is mechanical enough to formalize and consequential enough to need a checkpoint.

## The flow

Six blocks, in order, fired by a scheduled trigger once a week:

- `Regularize` — takes the incoming material and normalizes it into a consistent shape, so the downstream blocks see one format instead of five.
- `Extract Insights` — reads the normalized material and emits structured findings. Each finding traces back to the source passage that supports it.
- `Gate` — pauses the run. The analyst reviews the extracted findings before any prose exists. Nothing past this point runs until they approve.
- `Summarize` — condenses the approved findings.
- `Draft` — writes the memo from the summary and findings.
- `Send` — delivers the finished memo.

## Key decisions

The `Gate` sits before `Summarize` and `Draft`, not after. The analyst reviews the findings — the claims and their sources — while they are still cheap to correct, before the model spends effort turning them into prose. Catching a bad finding here is one edit; catching it after the memo is written is a rewrite.

Provenance carries through the whole flow. Every claim in the drafted memo traces back through `Extract Insights` to a specific source passage. When the analyst reviews at the `Gate`, or when a reader questions a line in the sent memo, the supporting passage is attached, not reconstructed from memory.

The scheduled trigger makes it repeatable. The same flow runs every week against that week's inputs and produces a memo built the same way each time.

## What it teaches

This is the canonical shape: a sequential flow with a human-in-the-loop checkpoint, AI blocks bounded by typed inputs and outputs, and an output action at the end. The AI blocks do synthesis and extraction, but they operate on declared schemas and emit traceable findings — they do not freestyle through the data. The same shape fits any recurring synthesis task: a research digest, a compliance summary, a status report.

## Start from this template

Open the **Analyst Weekly Memo** template and point it at your own sources. You can refine it incrementally: tighten the schema on `Extract Insights`, add a second `Gate` before `Send`, or swap the output action for your channel of choice.

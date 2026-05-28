---
type: usecase
title: "Intake triage with a branch and an escalation"
dek: "A branching pipeline that classifies incoming requests, routes by urgency, and escalates the hard cases to a person."
date: 2026-05-18
template: "Intake Triage"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

A team receives a stream of incoming requests: support tickets, applications, referrals. Each one has to be sorted, routed, and answered. Done by hand, the sorting is uneven. Two similar requests land in different queues depending on who picked them up. And when someone asks why a request went where it did, there is no record. The decision lived in a person's head and is gone.

## The flow

The `Intake Triage` template runs seven blocks in order.

`Regularize` takes the raw incoming request and normalizes it into a consistent shape, so a terse one-line ticket and a long email arrive at the next block looking the same.

`Classify` assigns a category and an urgency to the normalized request. This is the only block that judges the content.

`Branch` routes on that classification. A billing request takes one path; a bug report takes another; an account question takes a third. The routes are separate edges on the canvas, not a hidden switch.

On the high-urgency and low-confidence path, a `Gate` pauses. The clear, routine cases flow straight through. The consequential and uncertain ones wait.

`Manual Input` captures the human's structured decision at the gated path: the final category, an action, a note.

`Write` records the outcome, including the classification and the route taken.

`Send` delivers the response to the requester.

## Key decisions

Classification happens before routing. `Classify` decides what the request is; `Branch` decides where it goes. Splitting them keeps the routing logic readable and lets you change one without disturbing the other.

Only some paths hit a `Gate`. Escalating every request would defeat the point. The gate sits on the cases where being wrong is expensive or where `Classify` was unsure. The clear cases never wait on a person.

The routing logic is declared on the canvas. The conditions on each `Branch` edge are visible and editable. They are not buried inside a model prompt.

Every routed item carries its classification and the reason in its provenance. The category, the urgency, the path it took, and the human note when there was one all travel with the request. The answer to "why did this go here" is recorded.

## What it teaches

This is the canonical branching shape: conditional routing, multiple output paths, selective human escalation. It generalizes to any sort-and-route intake, whatever the requests are.

## Start from this template

Open `Intake Triage` and adapt the categories on `Classify` and the conditions on `Branch` to your own queues. Tune the urgency threshold on the `Gate`. When the naive routing keeps getting a particular case wrong, add a `Gate` on that path and let a person decide until the rule is right.

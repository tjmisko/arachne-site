---
type: essay
title: "Verifiability is necessary but not sufficient for trust"
dek: "Being able to check an output after the fact is not the same as being able to trust the process that produced it."
date: 2026-05-08
relatedHref: /philosophy
relatedLabel: "Philosophy"
---

There is a comfortable idea, common in discussions of machine intelligence, that if you can check the work you can trust it. Show me the citations, show me the chain of reasoning, let me trace the output back to its source, and I will believe what you tell me. This idea is half right, and the half it gets right is the easier half.

Verifiability — the ability to confirm, after the fact, that an output is correct and that you can trace where it came from — is not optional. Without it, you are accepting a result on faith. Faith is a poor foundation for anything an organization has to stand behind. So Arachne takes verifiability seriously, and concretely: every output carries provenance back to its source, and every claim an AI block makes references the specific passage that supports it. You can follow any conclusion back to the words it rests on. That is the floor. It is not the ceiling.

## What a trace cannot tell you

Here is the problem with stopping at verifiability. A trace tells you that one particular run was sound. It says nothing about the next one.

Consider a process you can audit perfectly but that changes shape every time it runs — that lives in one person's head, that no one formally owns, that produces a defensible result today by means you could not predict tomorrow. You can verify each individual output and still be unable to rely on the thing that produced it. Auditing the result is not the same as trusting the process, because in that situation there is no process in any durable sense. There is only a series of decisions made at runtime, each reasonable on its own, none of them committed to in advance.

Trust requires more than the ability to check. It requires stability: the thing does the same thing tomorrow that it did today. It requires ownership: someone is responsible for it, and can change it deliberately rather than having it drift. And it requires legibility: you can see what it does without having to run it and inspect the wreckage afterward. These are properties of a process, not of any single output a process happens to emit.

## Explaining an improvisation

Much of what travels under the banner of explainable AI stops exactly at verifiability. Here is the trace. Here is why the model did what it did this time. This is genuinely useful, and I do not want to wave it away. But notice what is being explained: an improvisation. The trace describes what an agent happened to do on this occasion, given this input and this internal state. It is a faithful account of an event.

An event is not a program. A declared program is something you can read before it runs, test against cases it has not yet seen, and depend on because its behavior is specified rather than discovered. A trace of what an agent did once is a description of behavior; a declared program is a commitment to behavior. You can verify the trace down to the last token and still not trust the underlying process, because the process was never the artifact. The runtime decisions were the artifact, and they are gone the moment the run ends.

## The declared flow

This is the distinction that matters, and it is why Arachne is built around a declared flow rather than an inspectable run. A declared flow is specified before it executes. It is the same artifact every time. It is owned, and it is versioned, so that when it changes, someone changed it on purpose and you can see what changed and when.

Verifiability tells you that a single run was sound. The declared flow tells you that every run will be — not because the outputs are identical, but because the process that produces them is fixed, visible, and accountable. Trust is built on the second thing. The first thing is a precondition for it, never a substitute.

The practical consequence is simple, and it shapes the whole product. Arachne makes the process the artifact, not the trace. The canvas is not a window into a run you can squint at afterward. It is the program itself — the thing you inspect, the thing you own, the thing you can hand to someone else and expect to behave the same way in your absence. You can verify a run. You trust a flow.

---
type: note
title: "Why discarding data needs its own block"
dek: "A flow should never drop data silently. Making 'discard' an explicit, named step keeps the audit trail honest."
date: 2026-05-26
---

In a flow where every file carries provenance and every step is declared, silently dropping data is a hole in the record. Something enters the flow and disappears, and the audit trail can no longer answer the basic question: what happened to this?

So discarding data is itself a step. A void block is the explicit, named destination for data the flow intentionally drops — filtered-out records, rejected items, branches that end. The discard is declared, visible on the canvas, and recorded in provenance like any other action. You can point at it and say: this is where these records went, and this is why.

The alternative looks simpler. Let a branch quietly terminate and write no extra block. But that is the thing that makes a process untrustworthy. The data went somewhere, and no one can say where. A reviewer reading the flow later has to guess whether the omission was intent or a bug. Naming the void closes that gap.

The principle is narrow and absolute: nothing leaves a flow without a declared destination, even if that destination is nowhere.

---
type: note
title: "At-least-once, with idempotent steps"
dek: "Exactly-once delivery is a promise distributed systems can't really keep. We chose the honest guarantee instead."
date: 2026-05-16
---

"Exactly-once delivery" sounds like what everyone wants. Across a boundary that can fail — a network call, a crash between doing the work and recording that it was done — it is not something you can truly guarantee. A system that claims it usually means at-least-once plus deduplication, with the dedup hidden somewhere you don't see.

Arachne makes the honest choice. We deliver at-least-once, and we design steps to be idempotent: running a step twice with the same input produces the same result and no extra side effect. A retry is safe because the second run is indistinguishable from the first.

The trade is deliberate. Rather than promise a guarantee the world cannot honor, we guarantee something true — the work will happen, at least once — and make repetition harmless. Provenance records each attempt, so a duplicate is visible rather than mysterious. You can see that a step ran twice, and you can see that the second run changed nothing.

The principle generalizes: prefer a guarantee you can actually keep. Then make the failure mode — a repeat — safe by design, instead of papering over it with a promise that breaks the first time the network does.

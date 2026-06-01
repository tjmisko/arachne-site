---
type: essay
title: "We can't make agents safe. We can build roads."
dek: "Safety isn't a switch you flip. It's a road — lanes, markings, and signs that shrink what an agent can do, so staying on course is the easy path and leaving it is loud."
date: 2026-06-01
draft: false
relatedHref: /philosophy
relatedLabel: "Philosophy"
---

It would be a lie to call an AI agent safe. A capable model asked to do real work is a powerful, unpredictable thing, and on any given run it might do something no one intended. Safety, in the sense of a guarantee, is not on the menu — not from us, not from anyone. Anyone selling it is selling the appearance of it.

What you *can* do is change the terrain the agent moves through. You can't promise a driver won't crash. You can build a road.

## The road

A road is a constraint that doesn't feel like one. Mostly it's just the easy way to get where you're going. You *could* drive into the field beside it, but the road is graded, paved, and pointed at your destination, so you don't.

A flow is the same kind of constraint. Each step has a narrow job and only the information it needs to do it; each connection says what may pass and where it may go. An agent on that road has very few places it can end up — not because leaving is forbidden, but because leaving is harder than staying. The first move in making misbehavior rare is not a rule against it. It is a road that doesn't lead there.

## The markings

Road markings don't physically stop you crossing them. They make the intended path obvious, and they make a deviation visible.

Arachne's markings are its types. A connection that doesn't typecheck shows up as an unverified edge on the canvas *before* anything runs — a painted line you can see you're about to cross. The lane is legible, which means wandering out of it is legible too. You are not trusting the agent to stay between the lines on faith; you can see where the lines are, and so can it.

## The signs

Signs constrain by telling you what the road expects right here. A Gate is a stop sign: the flow holds, and a person decides. A validator is a weight limit: data that doesn't meet the spec doesn't get waved through. A declared effect is the sign that warns this exit leaves the protected area and touches the outside world — posted before you take it, not discovered after.

None of these is a wall. Each one shrinks the set of reasonable next moves and marks the ones that aren't.

## The line you can finally see

Put the road, the markings, and the signs together and something useful happens to the hardest question in this whole field: where is the line between good behavior and bad?

With a bare agent, the line is invisible. It lives somewhere inside a model you can't see, and you usually learn you've crossed it only after the damage is done. On a road, the line is painted. Good behavior is staying in the lane, stopping at the signs, taking only the posted exits. Bad behavior is the car in the ditch — and you can *see* the car in the ditch.

That is the real point of bounding each step. Not to make a wrong move impossible — you can't — but to make the difference between fine and not-fine something you can see, before it ships and after it fails.

## A smaller promise, and a truer one

This is a humbler claim than "safe," and a more honest one. A determined driver can still leave the road. A flow can still be built badly, or pushed past what it was meant to carry. But the ordinary failure mode — the agent quietly doing the wrong thing while no one notices — is exactly what a road is good at preventing. You make the right path the path of least resistance, and you make leaving it loud.

With AI, that is most of what safety can honestly mean. It also happens to be most of what you actually need.

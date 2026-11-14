import { test } from "node:test";
import assert from "node:assert/strict";
import { MILESTONES } from "../data/quest.ts";
import * as E from "./quest-engine.ts";

test("hash compare correct/incorrect", async () => {
  const m = MILESTONES[0];
  assert.equal(await E.verifyCode("oasis", m.passwordHash), true);
  assert.equal(await E.verifyCode("OASIS", m.passwordHash), true);
  assert.equal(await E.verifyCode("wrong", m.passwordHash), false);
});

test("hydration", () => {
  const storage = new Map();
  storage.set("benjamin-quest-progress", JSON.stringify(["hydration-oasis"]));
  const state = E.hydrate(storage);
  assert.equal(state.completed.has("hydration-oasis"), true);
  assert.equal(state.ready, true);
});

test("undo", async () => {
  const storage = new Map();
  const s0 = E.emptyState();
  const s1 = await E.completeMilestone(s0, "hydration-oasis", "oasis", MILESTONES, storage);
  assert.equal(s1.result, "complete");
  const s2 = E.undoMilestone(s1.state, "hydration-oasis", storage);
  assert.equal(s2.completed.has("hydration-oasis"), false);
});

test("clear", () => {
  const storage = new Map();
  storage.set("benjamin-quest-progress", JSON.stringify(["hydration-oasis"]));
  const s = E.parseState(storage.get("benjamin-quest-progress"));
  const cleared = E.clearProgress(s, storage);
  assert.equal(cleared.completed.size, 0);
});

test("stateful flow", async () => {
  const storage = new Map();
  E.hydrateProgress(storage);
  const r1 = await E.completeWithPassword("hydration-oasis", "oasis");
  assert.equal(r1, "complete");
  const r2 = await E.completeWithPassword("hydration-oasis", "oasis");
  assert.equal(r2, "already");
  const r3 = await E.completeWithPassword("wind-tunnel", "nope");
  assert.equal(r3, "wrong");
  assert.equal(E.getSnapshot().completed.has("hydration-oasis"), true);
  E.undoMilestone("hydration-oasis");
  assert.equal(E.getSnapshot().completed.has("hydration-oasis"), false);
  E.clearProgress();
  assert.equal(E.getSnapshot().completed.size, 0);
});
import test from "node:test";
import assert from "node:assert/strict";
import { createState, stageOf } from "../src/state.js";
import { choose, currentEvent, validateContinuity } from "../src/engine.js";
import { remaining, completion, applyTasks } from "../src/tasks.js";
import { prefix, paths, play } from "./helpers.js";
test("18个节点与四阶段边界，决策不可变且拒绝过期及非法选项", () => {
  assert.deepEqual(
    Array.from({ length: 18 }, (_, i) => stageOf(i)),
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3],
  );
  const s = createState(),
    e = currentEvent(s),
    n = choose(s, e.id, 0);
  assert.equal(s.turn, 0);
  assert.equal(n.turn, 1);
  assert.ok(n.work > s.work);
  assert.throws(() => choose(n, e.id, 0));
  for (const i of [-1, 99, "0", "constructor", 1.5, null])
    assert.throws(() => choose(s, e.id, i));
  const { state } = play(paths.earlyNormal);
  assert.equal(currentEvent(state), undefined);
  assert.throws(() => choose(state, "opening", 0));
});
test("休息不干活、不凭空拉仇恨；四难度休息不会统一追加惩罚", () => {
  for (const d of ["easy", "normal", "hard", "hell"]) {
    let { state: s } = prefix(["quiet"], d),
      n = choose(s, currentEvent(s).id, 0);
    assert.equal(n.time - s.time, 3);
    assert.equal(n.work, s.work);
    assert.equal(remaining(n, "report"), remaining(s, "report"));
    assert.ok(n.fatigue < s.fatigue);
    assert.equal(n.suspicion - s.suspicion, 2);
  }
});
test("帮同事消耗自己的时间和精力，不伪造自己的工作进度", () => {
  const { state: s } = prefix(["focus"]);
  const n = choose(s, currentEvent(s).id, 0);
  assert.equal(n.time - s.time, 5);
  assert.equal(n.work, s.work);
  assert.ok(n.relation > s.relation);
  assert.ok(n.fatigue > s.fatigue);
  assert.equal(n.coworkerLoad.chen, -8);
});
test("新增、完成、延期、委托和接回都留下账本记录", () => {
  const s = createState();
  applyTasks(
    s,
    [{ type: "add", id: "extra", title: "核数", effort: 4, reviewAt: 8 }],
    "test",
  );
  const before = s.work;
  applyTasks(
    s,
    [{ type: "defer", id: "extra", agreement: "老板确认明早交" }],
    "test",
  );
  assert.equal(s.work, before);
  assert.throws(() =>
    applyTasks(s, [{ type: "complete", id: "extra" }], "test"),
  );
  applyTasks(
    s,
    [
      { type: "reclaim", id: "extra", agreement: "确认今晚接回自己做" },
      { type: "complete", id: "extra" },
    ],
    "test",
  );
  assert.ok(s.work > before);
  assert.equal(s.work, completion(s.tasks));
  assert.throws(() =>
    applyTasks(s, [{ type: "add", id: "extra", effort: 1 }], "test"),
  );
  const other = createState();
  assert.throws(() =>
    applyTasks(other, [{ type: "defer", id: "report" }], "test"),
  );
  assert.throws(() =>
    applyTasks(other, [{ type: "complete", id: "missing" }], "test"),
  );
});
test("相同协商策略在两条真实路径中分别成功或被拒绝", () => {
  const a = prefix([
    "focus",
    "help-chen",
    "verify",
    "rush",
    "accept-ppt",
    "send-agenda",
    "take-breath",
    "save-favor",
    "part-task",
    "send-proof",
    "wait-read",
    "reply",
    "keep-work",
  ]).state;
  const b = prefix([
    "focus",
    "help-chen",
    "cache",
    "rush",
    "accept-ppt",
    "send-agenda",
    "take-breath",
    "save-favor",
    "part-task",
    "send-proof",
    "bluff",
    "reply",
    "keep-work",
  ]).state;
  assert.equal(currentEvent(a).id, "extra-still-open");
  assert.equal(currentEvent(b).id, "extra-still-open");
  const yes = choose(a, "extra-still-open", 1),
    no = choose(b, "extra-still-open", 1);
  assert.equal(yes.tasks.find((t) => t.id === "ppt").status, "deferred");
  assert.equal(yes.work, a.work);
  assert.equal(no.tasks.find((t) => t.id === "ppt").status, "pending");
  assert.equal(no.work, b.work);
  assert.match(no.history.at(-1).feedback, /没同意|没谈成/);
});

test("真实进度始终受账本约束；伪造交付或回帮会被连续性检查拦截", () => {
  const s = createState();
  s.work = 100;
  assert.throws(() => validateContinuity(s));
  const p = createState();
  p.facts.delivered = true;
  assert.throws(() => validateContinuity(p));
  const q = createState();
  q.facts.chenHelpUsed = true;
  assert.throws(() => validateContinuity(q));
});

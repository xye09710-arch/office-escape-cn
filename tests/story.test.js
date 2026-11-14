import test from "node:test";
import assert from "node:assert/strict";
import { events } from "../src/events.js";
import { stageOf } from "../src/state.js";
import {
  currentEvent,
  choose,
  availableEvents,
  unlocked,
  validateContinuity,
} from "../src/engine.js";
import { pendingTasks, remaining } from "../src/tasks.js";
import { simulated, paths, play, prefix } from "./helpers.js";
test("56种情境分布于18个节点，前置条件唯一匹配且全部实际可达", () => {
  assert.equal(events.length, 56);
  assert.ok(events.filter((e) => e.hidden).length >= 5);
  const seen = new Set(),
    conditions = new Set(),
    effects = new Set();
  for (const d of ["easy", "normal", "hard", "hell"])
    for (let seed = 1; seed <= 2500; seed++) {
      const { states } = simulated(seed, d);
      for (const s of states.slice(0, 18)) {
        const e = currentEvent(s);
        assert.equal(availableEvents(s).length, 1);
        seen.add(e.id);
        assert.equal(e.stage, stageOf(s.turn));
        assert.ok(e.text.length > 10);
        assert.ok(e.options.length >= 3 && e.options.length <= 4);
        assert.equal(
          new Set(e.options.map((o) => o.id)).size,
          e.options.length,
        );
        for (const o of e.options) {
          assert.ok(o.id && o.label && o.hint && o.feedback);
          assert.ok(o.effect.time >= 1);
          assert.equal(Object.hasOwn(o.effect, "work"), false);
          effects.add(JSON.stringify(o.effect));
          if (o.require) conditions.add(`${e.id}/${o.id}`);
        }
      }
      for (const s of states) validateContinuity(s);
    }
  assert.equal(seen.size, events.length);
  assert.ok(conditions.size >= 10);
  assert.ok(effects.size > 30);
});
test("接下的PPT必在对应节点追问，忽略不会让工作消失", () => {
  const { state: s } = prefix([
    "focus",
    "help-chen",
    "cache",
    "ignore",
    "accept-ppt",
    "skip",
    "keep-quiet",
    "save-favor",
  ]);
  assert.equal(currentEvent(s).id, "ppt-due");
  const before = remaining(s, "ppt");
  const n = choose(s, "ppt-due", 1);
  assert.ok(remaining(n, "ppt") > 0);
  assert.ok(remaining(n, "ppt") < before);
  assert.ok(n.history.at(-1).reviewedTasks.includes("ppt"));
  const { state: late } = play(paths.extraAnalysis);
  assert.ok(late.tasks.some((t) => t.id === "analysis"));
  assert.ok(
    late.tasks.every(
      (t) => t.status === "pending" || t.remaining === 0 || t.agreement,
    ),
  );
});
test("人情只回报实际帮过的人，而且每份回帮只能消费一次", () => {
  const yes = prefix([
    "template",
    "help-lin",
    "verify",
    "honest",
    "send-old",
    "send-agenda",
    "take-breath",
  ]).state;
  assert.equal(currentEvent(yes).id, "lin-return");
  const returned = choose(yes, "lin-return", 0);
  assert.equal(returned.facts.linHelpUsed, true);
  assert.ok(returned.history.at(-1).tasks.length > 0);
  assert.ok(returned.coworkerLoad.lin > yes.coworkerLoad.lin);
  const no = prefix([
    "template",
    "use-template",
    "verify",
    "honest",
    "send-old",
    "send-agenda",
    "take-breath",
  ]).state;
  assert.equal(currentEvent(no).id, "no-return");
  assert.equal(no.facts.helpedLin, undefined);
  const shortcut = prefix([
    "template",
    "help-lin",
    "verify",
    "honest",
    "delegate-ppt",
    "send-agenda",
    "take-breath",
  ]).state;
  assert.equal(currentEvent(shortcut).id, "no-return");
});
test("真实回执避免重复追责，但不能抵销自己没核的数据", () => {
  const { states } = play(paths.receiptProtects);
  const s = states.find((s) => s.turn === 10);
  assert.equal(currentEvent(s).id, "evidence-protects");
  const n = choose(s, "evidence-protects", 0);
  assert.equal(n.facts.evidenceCleared, true);
  assert.equal(n.work, s.work);
  assert.deepEqual(n.tasks, s.tasks);
  assert.match(n.history.at(-1).feedback, /看漏|收到/);
  const unsafe = prefix([
    "focus",
    "help-chen",
    "cache",
    "rush",
    "accept-ppt",
    "send-agenda",
    "take-breath",
    "ask-proof",
    "finish-task",
    "send-proof",
  ]).state;
  assert.equal(unsafe.facts.receipt, true);
  assert.ok(remaining(unsafe, "data"));
  assert.equal(currentEvent(unsafe).id, "data-question");
});
test("延期和委托的日报不被当成成品，接回时才实际完成", () => {
  const planned = prefix([
    "focus",
    "help-chen",
    "verify",
    "honest",
    "send-old",
    "send-agenda",
    "take-breath",
    "save-favor",
    "defer-task",
  ]).state;
  assert.equal(planned.tasks[0].status, "deferred");
  assert.ok(planned.tasks[0].remaining > 0);
  assert.equal(currentEvent(planned).id, "report-arranged");
  const confirmed = choose(planned, "report-arranged", 0);
  assert.equal(confirmed.facts.reportSubmitted, undefined);
  assert.equal(currentEvent(confirmed).id, "arrangement-question");
  const reclaimed = choose(planned, "report-arranged", 1);
  assert.equal(reclaimed.tasks[0].status, "completed");
  assert.equal(reclaimed.facts.reportSubmitted, true);
  assert.ok(reclaimed.history.at(-1).tasks.some((t) => t.type === "reclaim"));
});
test("第16次关机后，确有交接问题才叫回；反馈写入全部18次记录", () => {
  for (const path of [paths.earlyNormal, paths.caught, paths.burnout]) {
    const { state, states } = play(path);
    assert.equal(states[16].location, "door");
    assert.equal(states[16].computerOn, false);
    for (const h of state.history) assert.ok(h.feedback.length > 5);
    if (state.facts.callback)
      assert.ok(state.history.some((h) => h.facts.callback === true));
    assert.equal(new Set(state.seen).size, 18);
  }
  const { state: early } = play(paths.earlyNormal);
  assert.equal(early.facts.callback, undefined);
  assert.equal(early.location, "outside");
  assert.equal(pendingTasks(early).length, 0);
});

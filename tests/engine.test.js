import test from "node:test";
import assert from "node:assert/strict";
import { createState, stageOf } from "../src/state.js";
import { choose, currentEvent } from "../src/engine.js";
test("四阶段边界为4、5、5、4", () =>
  assert.deepEqual(
    Array.from({ length: 18 }, (_, i) => stageOf(i)),
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3],
  ));
test("决策不可变地更新状态并拒绝过期事件", () => {
  const s = createState(),
    e = currentEvent(s),
    n = choose(s, e.id, 0);
  assert.equal(s.turn, 0);
  assert.equal(n.turn, 1);
  assert.ok(n.work > s.work);
  assert.throws(() => choose(n, e.id, 0));
});
test("状态上下限、非法选项及锁定选项均受引擎约束", () => {
  let s = createState();
  const e = currentEvent(s);
  assert.throws(() => choose(s, e.id, -1));
  assert.throws(() => choose(s, e.id, 99));
  s.work = 99;
  s.relation = 99;
  s.suspicion = 1;
  s.fatigue = 0;
  const n = choose(s, e.id, 0);
  for (const k of ["work", "relation", "suspicion", "fatigue"])
    assert.ok(n[k] >= 0 && n[k] <= 100);
});
test("拒绝字符串或原型属性作为选项编号", () => {
  const s = createState(),
    e = currentEvent(s);
  for (const index of ["0", "constructor", 1.5, null])
    assert.throws(() => choose(s, e.id, index));
});

import test from "node:test";
import assert from "node:assert/strict";
import { createState } from "../src/state.js";
import { choose, currentEvent, unlocked } from "../src/engine.js";
import { load, persist } from "../src/storage.js";
import { cards, earnedCards } from "../src/achievements.js";
import { outcome, DIFFICULTIES } from "../src/rules.js";
const memory = () => {
  let value = null;
  return {
    getItem: () => value,
    setItem: (k, v) => {
      value = v;
    },
  };
};
test("存档可重放续玩，重复结算不重复计数", () => {
  const store = memory();
  let p = load(store).profile,
    s = createState();
  for (let i = 0; i < 9; i++) s = choose(s, currentEvent(s).id, 0);
  p = persist(store, p, s).profile;
  assert.deepEqual(load(store).profile.session, s);
  for (let i = 9; i < 18; i++) s = choose(s, currentEvent(s).id, 0);
  p = persist(store, p, s).profile;
  assert.equal(p.runs, 1);
  p = persist(store, p, s).profile;
  assert.equal(p.runs, 1);
  assert.ok(p.cards.includes("first"));
  assert.deepEqual(load(store).profile.cards, p.cards);
});
test("损坏存档和存储禁用时有明确提示", () => {
  assert.ok(load({ getItem: () => "{bad" }).warning);
  assert.ok(
    persist(
      {
        setItem: () => {
          throw Error();
        },
      },
      load(memory()).profile,
      createState(),
    ).warning,
  );
});
test("14张成就均有确定条件且能够真实解锁", () => {
  assert.equal(cards.length, 14);
  const earned = new Set();
  for (const d of Object.keys(DIFFICULTIES))
    for (let seed = 1; seed <= 1503; seed++) {
      let s = createState(d),
        r = seed;
      for (let i = 0; i < 18; i++) {
        const e = currentEvent(s),
          opts = e.options
            .map((o, i) => (unlocked(o, s) ? i : -1))
            .filter((i) => i >= 0);
        r = (r * 1664525 + 1013904223) >>> 0;
        s = choose(
          s,
          e.id,
          opts[seed > 1500 ? (seed - 1501) % opts.length : r % opts.length],
        );
      }
      const a = earnedCards(s, outcome(s));
      assert.deepEqual(a, earnedCards(s, outcome(s)));
      a.forEach((id) => earned.add(id));
    }
  assert.deepEqual([...earned].sort(), cards.map((c) => c.id).sort());
});

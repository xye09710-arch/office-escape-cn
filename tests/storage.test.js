import test from "node:test";
import assert from "node:assert/strict";
import { createState } from "../src/state.js";
import { load, persist, restoreState } from "../src/storage.js";
import { cards, earnedCards } from "../src/achievements.js";
import { outcome } from "../src/rules.js";
import { paths, play } from "./helpers.js";
const memory = (value = null) => ({
  getItem() {
    return value;
  },
  setItem(k, v) {
    value = v;
  },
});
test("事实、任务、人情、即时反馈都可准确续玩，结算不重复计数", () => {
  const { state: s, states } = play(paths.earlyNormal),
    store = memory();
  let p = load(store).profile;
  p = persist(store, p, states[9]).profile;
  assert.deepEqual(load(store).profile.session, states[9]);
  p = persist(store, p, s).profile;
  assert.equal(p.runs, 1);
  assert.equal(persist(store, p, s).profile.runs, 1);
  assert.deepEqual(load(store).profile.session, s);
});
test("十四张卡都有确定条件与固定可达路径；不会提前解锁", () => {
  assert.equal(cards.length, 14);
  for (const c of cards) {
    const { state: s } = play(paths["card-" + c.id]);
    assert.ok(earnedCards(s, outcome(s)).includes(c.id));
    assert.deepEqual(earnedCards(s, outcome(s)), earnedCards(s, outcome(s)));
    assert.ok(c.rule.length > 5);
  }
  assert.deepEqual(earnedCards(createState(), {}), []);
});
test("旧版进度留档，已有收藏、结局与局数保留，开始新局后仍保留旧档", () => {
  const legacy = { version: 2, turn: 9, runId: "old-game", history: [] };
  const store = memory(
    JSON.stringify({
      version: 2,
      cards: ["first", "team"],
      endings: ["team"],
      runs: 2,
      session: legacy,
    }),
  );
  const loaded = load(store);
  assert.match(loaded.warning, /旧局已留档/);
  assert.equal(loaded.profile.session, null);
  assert.deepEqual(loaded.profile.cards, ["first", "team"]);
  assert.deepEqual(loaded.profile.legacySession, legacy);
  const saved = persist(store, loaded.profile, createState());
  assert.deepEqual(load(store).profile.legacySession, legacy);
  assert.equal(saved.profile.runs, 2);
});
test("损坏当前局不会删除收藏；篡改的事件和选项拒绝重放", () => {
  const { state: s } = play(paths.team),
    bad = structuredClone(s);
  bad.history[0].optionId = "not-an-option";
  assert.throws(() => restoreState(bad));
  const store = memory(
    JSON.stringify({
      version: 3,
      cards: ["first"],
      runs: 1,
      endings: ["ontime"],
      session: bad,
    }),
  );
  const loaded = load(store);
  assert.ok(loaded.warning);
  assert.deepEqual(loaded.profile.cards, ["first"]);
  assert.deepEqual(loaded.profile.recoverySession, bad);
  assert.equal(loaded.profile.session, null);
});
test("存储不可用有提示，不会假装保存成功", () => {
  assert.ok(
    load({
      getItem() {
        throw Error();
      },
    }).warning,
  );
  assert.ok(
    persist(
      {
        setItem() {
          throw Error();
        },
      },
      load(memory()).profile,
      createState(),
    ).warning,
  );
});

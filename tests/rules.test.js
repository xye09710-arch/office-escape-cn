import test from "node:test";
import assert from "node:assert/strict";
import { createState } from "../src/state.js";
import { choose, currentEvent } from "../src/engine.js";
import { outcome, DIFFICULTIES, ENDINGS } from "../src/rules.js";
import { play, paths } from "./helpers.js";
test("四难度改变具体任务量、会议长度与实际干活耗时", () => {
  const end = Object.keys(DIFFICULTIES).map((d) => {
    let s = createState(d);
    for (let i = 0; i < 18; i++) s = choose(s, currentEvent(s).id, 0);
    return s;
  });
  assert.equal(new Set(end.map((s) => s.time)).size, 4);
  assert.ok(end[3].time > end[0].time);
  assert.ok(
    end[3].tasks.find((t) => t.id === "ppt").total >
      end[0].tasks.find((t) => t.id === "ppt").total,
  );
});
test("六种结局均有固定18步见证路径，时间与事实一致", () => {
  for (const id of Object.keys(ENDINGS)) {
    const path = paths[id],
      { state: s } = play(path),
      r = outcome(s);
    assert.equal(s.turn, 18);
    assert.equal(r.id, id);
    assert.equal(r.time, path.time);
    assert.equal(
      r.time - s.time,
      r.breakdown.reduce((n, b) => n + b.minutes, 0),
    );
    assert.ok(r.settledTasks.every((t) => t.status !== "pending"));
    assert.equal(r.ranking.length, 5);
    assert.ok(r.ranking.every((p, i, a) => !i || p.time >= a[i - 1].time));
    if (id === "ontime") assert.ok(r.time <= 1080);
    if (id === "caught") assert.equal(s.facts.callback, true);
    if (id === "unfinished")
      assert.ok(s.tasks.some((t) => t.status === "pending") && r.time > 1080);
    if (id === "burnout") assert.ok(s.fatigue >= 65 && r.time >= 1110);
    if (id === "team") {
      assert.equal(s.facts.leaveTogether, true);
      assert.equal(
        r.ranking.find((p) => p.id === s.facts.partner).time,
        r.time,
      );
    }
  }
});
test("普通难度可18:00前成功离开，失败路线明显加班至19点后", () => {
  const early = outcome(play(paths.earlyNormal).state),
    late = outcome(play(paths.burnout).state);
  assert.equal(paths.earlyNormal.difficulty, "normal");
  assert.ok(early.time < 1080);
  assert.equal(early.id, "ontime");
  assert.ok(late.time >= 1140);
  assert.ok(late.time - early.time >= 60);
});
test("接手任务会占同事时间；相同分钟正确并列", () => {
  const { state: s } = play(paths.team),
    r = outcome(s);
  const you = r.ranking.find((p) => p.player),
    partner = r.ranking.find((p) => p.id === s.facts.partner);
  assert.equal(you.time, partner.time);
  assert.equal(you.rank, partner.rank);
  assert.ok(r.extra >= 0);
  assert.ok(r.departureStats.work >= 0 && r.departureStats.work <= 100);
});
test("同事不会一边在后续帮忙，一边在排名里早已离开；委托真的占他们的时间", () => {
  for (const path of Object.values(paths)) {
    const { state: s } = play(path),
      r = outcome(s);
    for (const h of s.history)
      for (const id of h.people)
        assert.ok(
          r.ranking.find((p) => p.id === id).time >= h.time,
          `${id}不应在第${h.node + 1}次互动前离开`,
        );
  }
});

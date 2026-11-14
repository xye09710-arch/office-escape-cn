import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createState } from "../src/state.js";
import { choose, currentEvent, unlocked } from "../src/engine.js";
export const paths = JSON.parse(
  readFileSync(new URL("./fixtures/paths.json", import.meta.url), "utf8"),
);
export function prefix(choices, difficulty = "normal") {
  let state = createState(difficulty);
  const states = [state];
  for (const id of choices) {
    const e = currentEvent(state),
      index = e.options.findIndex((o) => o.id === id);
    assert.ok(index >= 0, `节点${state.turn + 1}/${e.id}不提供${id}`);
    assert.ok(unlocked(e.options[index], state), `${id}尚未解锁`);
    state = choose(state, e.id, index);
    states.push(state);
  }
  return { state, states };
}
export function play(path) {
  const result = prefix(path.choices, path.difficulty);
  assert.deepEqual(result.state.seen, path.events);
  return result;
}
export function simulated(seed, difficulty = "normal") {
  let state = createState(difficulty),
    r = seed;
  const states = [state];
  for (let i = 0; i < 18; i++) {
    const e = currentEvent(state),
      opts = e.options
        .map((o, i) => (unlocked(o, state) ? i : -1))
        .filter((i) => i >= 0);
    r = (r * 1664525 + 1013904223) >>> 0;
    state = choose(state, e.id, opts[r % opts.length]);
    states.push(state);
  }
  return { state, states };
}

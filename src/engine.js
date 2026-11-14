import { DIFFICULTIES } from "./rules.js";
import { events } from "./events.js";
import { stageOf } from "./state.js";
import { applyTasks, validateTasks } from "./tasks.js";
export function availableEvents(s) {
  return s.turn >= 18
    ? []
    : events.filter((e) => e.node === s.turn && e.when(s));
}
export function currentEvent(s) {
  if (s.turn >= 18) return undefined;
  const matches = availableEvents(s);
  if (matches.length !== 1)
    throw new Error(`剧情节点${s.turn + 1}必须且只能匹配一个情境`);
  const e = matches[0];
  for (const key of e.because || [])
    if (!s.factSources[key] || s.factSources[key].turn >= s.turn)
      throw new Error("剧情缺少对应的前因");
  return {
    ...e,
    text: typeof e.text === "function" ? e.text(s) : e.text,
    options: e.options.map((o) => (typeof o === "function" ? o(s) : o)),
  };
}
export function unlocked(option, s) {
  return !option.require || option.require(s);
}
export function choose(s, eventId, index) {
  if (s.turn >= 18) throw new Error("本局已经结束");
  if (!Number.isInteger(index) || index < 0) throw new Error("选项编号不正确");
  const e = currentEvent(s),
    o = e.options[index];
  if (e.id !== eventId || !o || !unlocked(o, s))
    throw new Error("当前选项不可用");
  const n = structuredClone(s),
    before = {
      time: s.time,
      work: s.work,
      suspicion: s.suspicion,
      relation: s.relation,
      fatigue: s.fatigue,
    };
  const effect = {
    time: 0,
    suspicion: 0,
    relation: 0,
    fatigue: 0,
    ...o.effect,
  };
  if (
    !Number.isInteger(effect.time) ||
    effect.time < 1 ||
    Object.hasOwn(effect, "work")
  )
    throw new Error("时间或工作效果不符合账本约定");
  const changes = applyTasks(n, o.tasks || [], e.id);
  const effort = changes
    .filter((c) => c.type === "advance" || c.type === "complete")
    .reduce((v, c) => v + c.amount, 0);
  // 只有实际干活才受工作强度和疲劳影响，休息/聊天/协商不套用统一惩罚。
  const workDelay =
    effort && !o.assisted
      ? Math.ceil(effort * (DIFFICULTIES[s.difficulty].workPace - 1)) +
        (s.fatigue >= 65 ? Math.ceil(effort / 3) : 0)
      : 0;
  effect.time += workDelay;
  if (effort && !o.assisted) effect.fatigue += Math.ceil(workDelay / 2);
  for (const [k, v] of Object.entries(effect))
    n[k] = k === "time" ? s[k] + v : Math.max(0, Math.min(100, s[k] + v));
  for (const [k, v] of Object.entries(o.facts || {})) {
    n.facts[k] = v;
    n.factSources[k] = { eventId: e.id, optionId: o.id, turn: s.turn };
  }
  for (const [id, delta] of Object.entries(o.coworkers || {})) {
    n.coworkerLoad[id] += delta;
    n.coworkerReadyAt[id] =
      delta > 0
        ? Math.max(s.time, n.coworkerReadyAt[id]) + delta
        : Math.max(s.time, n.coworkerReadyAt[id] + delta);
  }
  const people = [
    ...new Set([
      ...e.people(s),
      ...Object.keys(o.coworkers || {}),
      ...(o.facts?.partner ? [o.facts.partner] : []),
    ]),
  ];
  for (const id of people)
    n.coworkerReadyAt[id] = Math.max(n.time, n.coworkerReadyAt[id]);
  if (o.location) n.location = o.location;
  if (typeof o.computerOn === "boolean") n.computerOn = o.computerOn;
  n.flags = Object.entries(n.facts)
    .filter(([, v]) => v === true)
    .map(([k]) => k);
  n.seen.push(e.id);
  n.turn++;
  const delta = Object.fromEntries(
    Object.keys(before).map((k) => [k, n[k] - before[k]]),
  );
  const feedback =
    o.feedback + (workDelay ? `这会儿核对得慢，多花了${workDelay}分钟。` : "");
  n.history.push({
    eventId: e.id,
    optionId: o.id,
    index,
    node: s.turn,
    title: e.title,
    choice: o.label,
    time: n.time,
    feedback,
    delta,
    tasks: changes,
    people,
    reviewedTasks: e.reviews(s),
    causes: (e.because || []).map((k) => ({ fact: k, ...s.factSources[k] })),
    tags: [...new Set([...(e.tags || []), ...(o.tags || [])])],
    facts: structuredClone(o.facts || {}),
  });
  validateContinuity(n);
  return n;
}
export function validateContinuity(s) {
  validateTasks(s);
  for (const [key, value] of Object.entries(s.facts)) {
    const source = s.factSources[key],
      h = source && s.history[source.turn];
    if (
      !h ||
      h.eventId !== source.eventId ||
      h.optionId !== source.optionId ||
      h.facts[key] !== value
    )
      throw new Error("剧情事实缺少真实的行动来源");
  }
  for (const t of s.tasks)
    if (
      t.createdAt >= 0 &&
      !s.history[t.createdAt]?.tasks.some(
        (c) => c.type === "add" && c.id === t.id,
      )
    )
      throw new Error("任务缺少接下时的记录");
  for (const t of s.tasks)
    if (
      t.status === "pending" &&
      s.turn > t.reviewAt &&
      !s.history.some(
        (h) => h.node === t.reviewAt && h.reviewedTasks.includes(t.id),
      )
    )
      throw new Error("到期任务没有进入对应剧情节点");
  if (
    s.history.length !== s.turn ||
    s.seen.length !== s.turn ||
    new Set(s.seen).size !== s.turn
  )
    throw new Error("剧情步数不一致");
  for (const [i, h] of s.history.entries())
    if (h.node !== i || !h.feedback) throw new Error("剧情节点或反馈缺失");
  if (s.location === "outside" && s.turn < 18)
    throw new Error("故事尚未结束，不能提前离场");
  if (s.facts.delivered && !s.facts.reportSubmitted)
    throw new Error("没有发出的文件，不能确认收到");
  if (s.facts.chenHelpUsed && !s.facts.helpedChen)
    throw new Error("没有帮过小陈，不能兑现小陈的人情");
  if (s.facts.linHelpUsed && !s.facts.helpedLin)
    throw new Error("没有帮过小林，不能兑现小林的人情");
  if (s.facts.evidenceCleared && !s.facts.receipt)
    throw new Error("没有回执，不能用回执免责");
}

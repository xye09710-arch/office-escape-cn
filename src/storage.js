import { createState, STORY_VERSION } from "./state.js";
import { choose, currentEvent } from "./engine.js";
import { outcome, ENDINGS } from "./rules.js";
import { cards, earnedCards } from "./achievements.js";
const KEY = "office-escape-v2"; // 沿用浏览器键，避免升级丢掉已收藏卡牌。
const empty = () => ({
  version: STORY_VERSION,
  session: null,
  cards: [],
  runs: 0,
  endings: [],
  legacySession: null,
  recoverySession: null,
});
export function restoreState(raw) {
  if (
    !raw ||
    raw.version !== STORY_VERSION ||
    !Array.isArray(raw.history) ||
    raw.history.length > 18 ||
    typeof raw.runId !== "string"
  )
    throw new Error("存档版本或格式不正确");
  let s = createState(raw.difficulty);
  s.runId = raw.runId;
  for (const h of raw.history) {
    const e = currentEvent(s);
    if (!e || e.id !== h.eventId) throw new Error("存档剧情与当前版本不一致");
    const index = e.options.findIndex((o) => o.id === h.optionId);
    s = choose(s, h.eventId, index);
  }
  if (s.turn !== raw.turn) throw new Error("存档进度不一致");
  return s;
}
export function load(storage) {
  let p;
  try {
    p = JSON.parse(storage.getItem(KEY));
  } catch {
    return {
      profile: empty(),
      warning: "本地存档无法读取；原内容没有被覆盖，请先保留此页面。",
    };
  }
  if (!p) return { profile: empty() };
  if (typeof p !== "object" || ![2, STORY_VERSION].includes(p.version))
    return {
      profile: empty(),
      warning: "存档版本无法识别，原内容没有被覆盖。",
    };
  const profile = {
    ...empty(),
    cards: [
      ...new Set(
        (Array.isArray(p.cards) ? p.cards : []).filter((id) =>
          cards.some((c) => c.id === id),
        ),
      ),
    ],
    runs: Number.isInteger(p.runs) && p.runs >= 0 ? p.runs : 0,
    endings: [
      ...new Set(
        (Array.isArray(p.endings) ? p.endings : []).filter((id) =>
          Object.hasOwn(ENDINGS, id),
        ),
      ),
    ],
    legacySession: p.legacySession || null,
    recoverySession: p.recoverySession || null,
  };
  if (p.session?.version !== STORY_VERSION && p.session) {
    profile.legacySession = p.session;
    return {
      profile,
      warning: "剧情已更新，旧局已留档；已收藏的卡牌保留，请开始新一局。",
    };
  }
  try {
    profile.session = p.session ? restoreState(p.session) : null;
    return { profile };
  } catch {
    profile.recoverySession = p.session;
    return {
      profile,
      warning: "这局进度无法重放，已保留原存档和收藏；请开始新一局。",
    };
  }
}
export function persist(storage, profile, state) {
  const next = {
    ...profile,
    version: STORY_VERSION,
    session: state,
    cards: [...profile.cards],
    endings: [...profile.endings],
  };
  let newly = [];
  if (
    state?.turn === 18 &&
    (profile.session?.runId !== state.runId || profile.session?.turn !== 18)
  ) {
    const r = outcome(state),
      earned = earnedCards(state, r);
    newly = earned.filter((id) => !next.cards.includes(id));
    next.cards = [...new Set([...next.cards, ...earned])];
    next.endings = [...new Set([...next.endings, r.id])];
    next.runs++;
  }
  try {
    storage.setItem(KEY, JSON.stringify(next));
    return { profile: next, newly };
  } catch {
    return {
      profile: next,
      newly,
      warning:
        "浏览器未能保存进度，请保持此页面打开；收藏暂时只在本次页面中有效。",
    };
  }
}

import "./style.css";
import { createState, clock, STAGES, stageOf, COUNTS } from "./state.js";
import { currentEvent, choose, unlocked } from "./engine.js";
import { DIFFICULTIES, outcome } from "./rules.js";
import { cards, earnedCards } from "./achievements.js";
import { pendingTasks } from "./tasks.js";
import { load, persist } from "./storage.js";
const app = document.querySelector("#app");
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  };
}
const loaded = load(storage);
let profile = loaded.profile,
  warning = loaded.warning || "",
  state = null,
  view = "home",
  newly = [],
  notice = "";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function save(s) {
  const result = persist(storage, profile, s);
  profile = result.profile;
  newly = result.newly;
  warning = result.warning || "";
}
const button = (id, text, cls = "") =>
  `<button id="${id}" class="${cls}">${text}</button>`;
function gallery() {
  return `<div class="section-heading"><div><p class="eyebrow">下班收藏册</p><h1>每张卡，都是你的经历</h1></div><span class="pill">${profile.cards.length} / ${cards.length} 已收藏</span></div><p>没有抽卡，没有概率。完成一局后按条件解锁，稀有度只代表达成难度。收藏保存在当前浏览器。</p><div class="cards">${cards.map((c) => `<article class="card ${profile.cards.includes(c.id) ? "collected" : "locked"}"><span class="rarity">${c.rarity} · ${profile.cards.includes(c.id) ? "已收藏" : "未解锁"}</span><div class="card-icon">${c.icon}</div><h3>${c.name}</h3><p>${c.rule}</p></article>`).join("")}</div>${button("back", "返回首页", "secondary")}`;
}
function scene() {
  return `<div class="office" role="img" aria-label="傍晚的办公室，四名同事坐在工位前，窗外天色渐暗"><div class="window"><span></span><i></i><i></i><i></i></div><div class="wall-clock">18:00</div><div class="office-sign">今日目标：按时回家</div><div class="people">${["小林", "小周", "小陈", "老王"].map((p, i) => `<div class="person person-${i}"><div class="pixel-person"><i></i></div><div class="desk"><b></b></div><span>${p}</span></div>`).join("")}</div><div class="floor"></div></div>`;
}
function home() {
  return `<div class="hero"><div><p class="eyebrow"><span class="status-dot"></span> 办公室生存小剧场 · 第二版</p><h1>今天必须<br><em>准时下班</em><span class="title-dot">。</span></h1><p class="intro">活可以明天干，<br>今晚的生活不能明天过。</p><div class="tags"><span>18 次抉择</span><span>约 3—5 分钟</span><span>6 种结局</span></div></div><div class="hero-scene">${scene()}<p class="scene-caption">17:00 · 距离下班还有一小时，理论上。</p></div></div><section class="start-panel"><div><p class="eyebrow">先选今天的工作强度</p><h2>今天，是什么局？</h2></div><div class="difficulties">${Object.entries(
    DIFFICULTIES,
  )
    .map(
      ([id, d]) =>
        `<label class="difficulty"><input type="radio" name="difficulty" value="${id}" ${id === "normal" ? "checked" : ""}><span><strong>${d.name}</strong><small>${d.note}</small></span></label>`,
    )
    .join(
      "",
    )}</div><div class="actions">${button("start", "打卡，开始今天 →", "primary")}${profile.session ? button("resume", profile.session.turn === 18 ? "查看上次战绩" : `继续上次 · 已选 ${profile.session.turn}/18 题`, "secondary") : ""}</div><p class="fine">选择会改变进度、人情与后续剧情。每次选择自动保存，不限时，不用注册。</p>${profile.session && profile.session.turn < 18 ? '<p class="fine">开始新一局会替换当前进度，已收藏的卡牌会保留。</p>' : ""}</section><div class="home-bottom"><p>你不是一个人在等六点。<br><small>小林热心、小周踩点、小陈抠细节、老王稳收尾。</small></p>${button("gallery", `翻翻成就图鉴 · ${profile.cards.length}/14`, "secondary")}</div>`;
}
function stats(values = state) {
  return `<div class="stats">${[
    ["work", "工作完成度", "只计算真正做完的内容"],
    ["suspicion", "老板怀疑值", "追问能否说清，还看事实和证据"],
    ["relation", "同事关系", "影响互助与条件选项"],
    ["fatigue", "疲劳值", "太累时干活会慢，休息能恢复"],
  ]
    .map(
      ([key, name, hint]) =>
        `<div class="stat ${key}"><div><span>${name}</span><strong>${values[key]}<small>/100</small></strong></div><progress max="100" value="${values[key]}" aria-label="${name}"></progress><small>${hint}</small></div>`,
    )
    .join("")}</div>`;
}
function feedback() {
  const h = state.history.at(-1);
  if (!h) return "";
  const names = {
    time: "耗时",
    work: "完成度",
    relation: "关系",
    suspicion: "怀疑",
    fatigue: "疲劳",
  };
  return `<section class="feedback" role="status" aria-live="polite"><strong>刚才发生了什么</strong><p>${esc(h.feedback)}</p><div class="feedback-deltas">${Object.entries(
    h.delta,
  )
    .filter(([, v]) => v !== 0)
    .map(
      ([k, v]) =>
        `<span>${names[k]} ${v > 0 ? "+" : ""}${v}${k === "time" ? " 分钟" : ""}</span>`,
    )
    .join("")}</div></section>`;
}
function taskList(tasks = state.tasks, final = false) {
  const status = {
    pending: "待处理",
    completed: "已完成",
    deferred: "已约明早",
    delegated: "已有人接手",
  };
  return `<details class="task-list"><summary>手头的事 · ${tasks.filter((t) => t.status === "pending").length} 项待处理${final ? " · 离开时" : ""}</summary><ul>${tasks.map((t) => `<li><strong>${esc(t.title)}</strong><span>${status[t.status]}${t.status === "pending" ? ` · 正常速度还需约 ${t.remaining} 分钟` : ""}</span>${t.agreement ? `<small>${esc(t.agreement)}</small>` : ""}</li>`).join("")}</ul><p class="fine">改期和交接会保留约定，不会假装成已经做完；结算会列出最后补掉的内容。</p></details>`;
}
function game() {
  const e = currentEvent(state),
    stage = stageOf(state.turn),
    offset = [0, 4, 9, 14][stage];
  return `<div class="game-header"><div><p class="eyebrow">${DIFFICULTIES[state.difficulty].name}模式 · 下班倒计时</p><strong class="time">${clock(state.time)}</strong></div><div class="turn-count"><b>${state.turn + 1}</b> / 18 次决策<p>当前阶段 ${state.turn - offset + 1} / ${COUNTS[stage]}</p></div></div><div class="stages">${STAGES.map((s, i) => `<div class="${stage === i ? "active" : stage > i ? "done" : ""}"><span>0${i + 1}</span>${s}</div>`).join("")}</div>${stats()}${feedback()}${taskList()}<div class="play-layout"><article class="event" aria-labelledby="event-title"><div class="event-top"><span class="pill">${e.hidden ? "隐藏事件" : e.because?.length ? "事情有了下文" : "职场现场"}</span><span>${STAGES[stage]}</span></div><h1 id="event-title" tabindex="-1">${e.title}</h1><p class="event-text">${e.text}</p><p class="choice-prompt">你打算怎么接这一招？</p><div class="choices">${e.options.map((o, i) => `<button class="choice" data-choice="${i}" data-option="${o.id}" ${unlocked(o, state) ? "" : "disabled"}><span class="choice-number">${["甲", "乙", "丙", "丁"][i]}</span><span><strong>${o.label}</strong><small>${unlocked(o, state) ? o.hint : `尚未解锁：${o.locked}`}</small></span><span class="choice-arrow">↗</span></button>`).join("")}</div><p class="fine">没有标准答案。多做、巧做、借力，都有各自的代价。</p></article><aside>${scene()}<details class="history"><summary>决策记录 · ${state.history.length} 条</summary>${state.history.length ? `<ol>${state.history.map((h) => `<li><time>${clock(h.time)}</time><strong>${esc(h.title)}</strong><p>${esc(h.choice)}</p><p class="history-feedback">${esc(h.feedback)}</p></li>`).join("")}</ol>` : "<p>今天的故事，从这一题开始。</p>"}</details></aside></div>${button("exit", "保存并返回首页", "text-button")}`;
}
function results() {
  const r = outcome(state);
  return `<div class="result-heading"><p class="eyebrow">今日下班战绩 · ${DIFFICULTIES[state.difficulty].name}模式</p><span class="result-stamp">已下班</span><h1>${r.name}</h1><p>${r.text}</p><div class="result-numbers"><div><small>实际下班</small><strong>${clock(r.time)}</strong></div><div><small>办公室排名</small><strong>第 ${r.rank} 名</strong></div><div><small>收尾耗时</small><strong>${r.extra} 分钟</strong></div></div></div><div class="result-grid"><section class="ranking"><h2>今天谁先溜？</h2><p class="fine">时间由难度、剧情和当前状态计算，同分钟并列。</p>${r.ranking.map((p) => `<div class="rank-row ${p.player ? "is-you" : ""}"><b>${p.rank}</b><div><strong>${p.name}${p.player ? " · 你" : ""}</strong><small>${p.personality}</small></div><time>${clock(p.time)}</time></div>`).join("")}</section><section><h2>今天带走的纪念</h2><p>${newly.length ? `新解锁 ${newly.length} 张卡牌` : "每种下班方式，都值得记一笔。"}</p><div class="mini-cards">${cards
    .filter((c) => earnedCards(state, r).includes(c.id))
    .map(
      (c) =>
        `<div class="mini-card"><b>${c.icon}</b><span>${c.name}</span>${newly.includes(c.id) ? "<small>新获得</small>" : ""}</div>`,
    )
    .join(
      "",
    )}</div>${button("gallery", "查看完整图鉴", "secondary")}</section></div>${stats(r.departureStats)}${feedback()}${taskList(r.settledTasks, true)}${r.breakdown.length ? `<details class="history settlement"><summary>实际收尾与等待 · ${r.extra} 分钟</summary><ul>${r.breakdown.map((b) => `<li><strong>${esc(b.title)} · ${b.minutes} 分钟</strong><p>${esc(b.reason)}</p></li>`).join("")}</ul></details>` : ""}<details class="history"><summary>回看今天的 18 次选择</summary><ol>${state.history.map((h) => `<li><time>${clock(h.time)}</time><strong>${esc(h.title)}</strong><p>${esc(h.choice)}</p><p class="history-feedback">${esc(h.feedback)}</p></li>`).join("")}</ol></details><div class="actions">${button("share", "复制战绩，喊同事来比比", "primary")}${button("back", "再过一个工作日", "secondary")}</div><p id="share-notice" role="status">${notice}</p><textarea id="share-fallback" class="share-fallback" readonly aria-label="可复制的战绩" hidden></textarea>`;
}
function render() {
  app.innerHTML = `<nav><a href="#" id="brand">▦ 下班事务所</a><button id="nav-gallery" class="nav-button">成就图鉴 <span>${profile.cards.length}/14</span></button></nav><main>${warning ? `<p class="warning" role="status">${warning}</p>` : ""}${view === "gallery" ? gallery() : view === "game" ? game() : view === "result" ? results() : home()}</main><footer>今天必须准时下班 · 工作留在工位，生活带回家</footer>`;
  const on = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  };
  on("brand", (e) => {
    e.preventDefault();
    view = "home";
    render();
  });
  on("nav-gallery", () => {
    view = "gallery";
    render();
  });
  on("gallery", () => {
    view = "gallery";
    render();
    window.scrollTo(0, 0);
  });
  on("back", () => {
    view = "home";
    notice = "";
    render();
    window.scrollTo(0, 0);
  });
  on("start", () => {
    state = createState(
      document.querySelector("[name=difficulty]:checked").value,
    );
    save(state);
    view = "game";
    render();
    window.scrollTo(0, 0);
  });
  on("resume", () => {
    state = profile.session;
    newly = [];
    view = state.turn === 18 ? "result" : "game";
    render();
  });
  on("exit", () => {
    view = "home";
    render();
  });
  document.querySelectorAll("[data-choice]").forEach(
    (b) =>
      (b.onclick = () => {
        const e = currentEvent(state);
        state = choose(state, e.id, Number(b.dataset.choice));
        save(state);
        view = state.turn === 18 ? "result" : "game";
        render();
        document.getElementById("event-title")?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }),
  );
  on("share", async () => {
    const r = outcome(state),
      text = `《今天必须准时下班》\n${r.name}\n${DIFFICULTIES[state.difficulty].name}模式 · ${clock(r.time)}下班 · 第${r.rank}名\n完成度${r.departureStats.work}，关系${state.relation}，疲劳${r.departureStats.fatigue}\n18次选择，你能比我早走吗？`;
    try {
      await navigator.clipboard.writeText(text);
      document.getElementById("share-notice").textContent =
        "战绩已复制，可以粘贴分享给同事。";
    } catch {
      const box = document.getElementById("share-fallback");
      box.hidden = false;
      box.value = text;
      box.focus();
      box.select();
      document.getElementById("share-notice").textContent =
        "请长按或选中下方文字复制战绩。";
    }
  });
}
render();

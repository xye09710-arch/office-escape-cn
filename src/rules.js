import { pendingTasks, completion } from "./tasks.js";
export const DIFFICULTIES = {
  easy: {
    name: "简单",
    note: "日报好核，临时活少，搭子也有空",
    ppt: 4,
    analysis: 4,
    workPace: 1,
    meeting: 4,
    load: -8,
  },
  normal: {
    name: "普通",
    note: "偶尔加戏，还能商量着来",
    ppt: 6,
    analysis: 6,
    workPace: 1,
    meeting: 7,
    load: 0,
  },
  hard: {
    name: "困难",
    note: "多查一轮，临时会也长一点",
    ppt: 9,
    analysis: 9,
    workPace: 1.3,
    meeting: 11,
    load: 7,
  },
  hell: {
    name: "地狱",
    note: "改稿量翻倍，救场前先看谁有空",
    ppt: 12,
    analysis: 12,
    workPace: 1.6,
    meeting: 16,
    load: 13,
  },
};
export const ENDINGS = {
  ontime: {
    name: "准点下班，理直气壮",
    text: "今天该交的已经交了，该挪到明天的也谈妥了。你刷开门禁，晚高峰还没完全堵起来。",
  },
  team: {
    name: "组队撤离成功",
    text: "你们把各自的尾巴收干净，真的在同一班电梯碰了头。今晚不聊工作，先研究吃什么。",
  },
  late: {
    name: "晚了一点，也算赢",
    text: "该补的都补完了，虽然晚了一会儿，好在没把电脑带回家。楼下的煎饼摊还亮着灯。",
  },
  caught: {
    name: "门口被叫回",
    text: "手机响了，确实还有一处没交代清楚。你回工位把任务和交接重新说清，确认对方接下，才第二次刷开门禁。",
  },
  unfinished: {
    name: "尾款是加班",
    text: "答应的活还有尾巴，也没人接手。你把它们逐项做完再走，今晚的饭只能往后推了。",
  },
  burnout: {
    name: "工位续费成功",
    text: "这会儿连核对页码都得看两遍。等最后的任务和交接都有了去处，你才拎起包，办公室已经安静了。",
  },
};
export function coworkerTimes(s) {
  const load = DIFFICULTIES[s.difficulty].load;
  return [
    {
      id: "lin",
      name: "小林",
      personality: "热心搭子",
      time: s.coworkerReadyAt?.lin ?? 1070 + load + s.coworkerLoad.lin,
    },
    {
      id: "zhou",
      name: "小周",
      personality: "踩点达人",
      time:
        s.coworkerReadyAt?.zhou ??
        1077 + Math.max(0, (load / 2) | 0) + s.coworkerLoad.zhou,
    },
    {
      id: "chen",
      name: "小陈",
      personality: "细节控",
      time: s.coworkerReadyAt?.chen ?? 1088 + load + s.coworkerLoad.chen,
    },
    {
      id: "wang",
      name: "老王",
      personality: "稳稳收尾",
      time: s.coworkerReadyAt?.wang ?? 1082 + load + s.coworkerLoad.wang,
    },
  ];
}
export function outcome(s) {
  if (s.turn !== 18) throw new Error("完成十八次决策后才能结算");
  const d = DIFFICULTIES[s.difficulty],
    open = pendingTasks(s);
  const breakdown = open.map((t) => ({
    id: t.id,
    title: t.title,
    minutes: Math.ceil(t.remaining * d.workPace),
    reason: "答应的任务尚未完成，离开前补齐",
  }));
  if (s.facts.callback && !s.facts.callbackResolved)
    breakdown.push({
      id: "callback",
      title: "回工位补交接",
      minutes: 5,
      reason: s.facts.callbackReason,
    });
  if (s.facts.unresolvedDelivery && !s.facts.callback)
    breakdown.push({
      id: "delivery",
      title: "补发并确认文件",
      minutes: 4,
      reason: "文件尚未确认收到",
    });
  const tired =
    s.fatigue >= 65 &&
    s.time + breakdown.reduce((n, b) => n + b.minutes, 0) >= 1110;
  if (tired)
    breakdown.push({
      id: "recheck",
      title: "疲劳后的复核",
      minutes: 8,
      reason: "眼花漏看了两处，逐项复核后才交付",
    });
  const workTime = s.time + breakdown.reduce((n, b) => n + b.minutes, 0);
  const coworkers = coworkerTimes(s);
  const partner = s.facts.leaveTogether
    ? coworkers.find((p) => p.id === s.facts.partner)
    : null;
  const team = Boolean(
    partner &&
    !s.facts.callback &&
    open.length === 0 &&
    !s.facts.unresolvedDelivery,
  );
  const time = team ? Math.max(workTime, partner.time) : workTime;
  if (team && time > workTime)
    breakdown.push({
      id: "wait",
      title: `等${partner.name}一起走`,
      minutes: time - workTime,
      reason: "约好了同一班电梯，不是各走各的",
    });
  if (team) partner.time = time;
  const id = tired
    ? "burnout"
    : s.facts.callback
      ? "caught"
      : open.length && time > 1080
        ? "unfinished"
        : team
          ? "team"
          : time <= 1080
            ? "ontime"
            : "late";
  const ranking = [
    {
      id: "player",
      name: "你",
      personality: "今天也辛苦了",
      time,
      player: true,
    },
    ...coworkers,
  ]
    .sort((a, b) => a.time - b.time)
    .map((p, i, a) => ({
      ...p,
      rank: a.findIndex((x) => x.time === p.time) + 1,
    }));
  const settledTasks = s.tasks.map((t) =>
    t.status === "pending"
      ? {
          ...t,
          remaining: 0,
          status: "completed",
          agreement: "结算时按账本余量补完",
          settledInEnding: true,
        }
      : structuredClone(t),
  );
  const departureStats = {
    work: completion(settledTasks),
    suspicion: s.suspicion,
    relation: s.relation,
    fatigue: Math.min(
      100,
      s.fatigue + open.reduce((n, t) => n + t.remaining, 0),
    ),
  };
  return {
    id,
    ...ENDINGS[id],
    time,
    extra: time - s.time,
    breakdown,
    ranking,
    rank: ranking.find((p) => p.player).rank,
    settledTasks,
    departureStats,
    evidenceCount: s.history.filter((h) => h.tags.includes("evidence")).length,
  };
}

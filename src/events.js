import { DIFFICULTIES } from "./rules.js";
import { pendingTasks, remaining, task } from "./tasks.js";
const f = (s, k) => s.facts[k];
const O = (id, label, hint, values, feedback, extra = {}) => ({
  id,
  label,
  hint,
  effect: {
    time: values[0],
    relation: values[1],
    suspicion: values[2],
    fatigue: values[3],
  },
  feedback,
  ...extra,
});
const progress = (s, id, n) =>
  remaining(s, id)
    ? [{ type: "advance", id, amount: Math.min(n, remaining(s, id)) }]
    : [];
const finish = (s, id) => (remaining(s, id) ? [{ type: "complete", id }] : []);
const add = (id, title, effort, reviewAt) => ({
  type: "add",
  id,
  title,
  effort,
  reviewAt,
});
const clear = (s) =>
  pendingTasks(s).map((t) => ({ type: "complete", id: t.id }));
const units = (s) => pendingTasks(s).reduce((n, t) => n + t.remaining, 0);
const finishAll = (s, id = "finish-all") =>
  O(
    id,
    "把答应的活逐项做完",
    "实际剩多少就做多少，交完再走",
    [Math.max(2, units(s) + 1), 0, -5, Math.max(1, units(s))],
    pendingTasks(s).length
      ? "你按清单做掉剩下的活，把文件放到了约定的位置。"
      : "你核对了一遍，清单上确实没有欠着的活。",
    { tasks: clear(s), facts: { allChecked: true } },
  );
function reportWork(s, id, label, minutes, relation = 0, facts = {}) {
  const amount = Math.min(minutes, remaining(s, "report"));
  return O(
    id,
    amount ? label : "日报已补完，再核一次说明",
    amount ? "只推进实际还欠着的内容" : "文件已完整，复核不会凭空增加完成度",
    [minutes, relation, 0, amount ? 3 : 1],
    amount
      ? "你把日报实际欠着的内容补了一段，剩余项仍按清单保留。"
      : "你又核了一遍说明，没有发现新问题；已经做完的内容没有重复算进度。",
    { tasks: progress(s, "report", minutes), facts },
  );
}
// 改期并非永远成功：接收方今晚是否要用、你是否已经许诺交清，都有影响。
export function canDefer(s, t) {
  if (f(s, "dataBluffed") || f(s, "stalledDelivery") || f(s, "vaguePromise"))
    return false;
  if (t.id === "report")
    return !!f(s, "scopeKnown") && t.remaining <= 4 && !f(s, "claimedDone");
  if (t.id === "data") return !f(s, "reportSubmitted") || !!f(s, "dataWarning");
  if (t.id === "ppt") return s.turn < 14 || t.remaining <= 2;
  if (t.id === "analysis")
    return (
      s.difficulty === "easy" ||
      (s.difficulty === "normal" && !!f(s, "scopeKnown"))
    );
  return false;
}
function deferChoice(s, id, label, extra = {}) {
  const selected =
    id === "all" ? pendingTasks(s) : pendingTasks(s).filter((t) => t.id === id);
  const accepted = selected.every((t) => canDefer(s, t));
  return O(
    extra.optionId || "negotiate-rest",
    label,
    accepted
      ? "对方有余地商量；谈妥后保留明确交期"
      : "这项今晚要用或前面已保证过交清，可能谈不下来",
    [4 + (selected.length > 1 ? 1 : 0), 0, accepted ? 2 : 4, 0],
    accepted
      ? "你把范围和交期逐项说清，对方明确同意明早十点前交；约定留在清单上。"
      : "老板指着刚才的约定：“这个今晚要用，今天得交。”改期没谈成，任务一项没少。",
    accepted
      ? {
          ...extra,
          tasks: selected.map((t) => ({
            type: "defer",
            id: t.id,
            agreement: `老板确认：${t.title}明早十点前交`,
          })),
        }
      : {
          ...extra,
          ...(extra.onRefused || {}),
          tasks: [],
          facts: { negotiationRefused: true, ...(extra.refusedFacts || {}) },
          feedback:
            extra.refusedFeedback ||
            "老板说这项今晚就要用，没同意改期；任务仍在清单里，你得换个办法。",
        },
  );
}
const E = (node, id, title, text, options, when = () => true, extra = {}) => ({
  node,
  id,
  stage: node < 4 ? 0 : node < 9 ? 1 : node < 14 ? 2 : 3,
  title,
  text,
  options: [...options],
  when,
  ...extra,
});
const nodes = [];
// 第一阶段：今天到底还欠什么，以及你怎样对待第一个求助。
nodes.push(
  E(
    0,
    "opening",
    "五点了，日报还差个尾巴",
    "右下角跳到五点。日报还剩两列数据和一段说明，老板在群里问：“六点前能收齐吧？”",
    [
      (s) =>
        O(
          "focus",
          "先补最费脑的那一段",
          "先干一点，群消息稍后回",
          [3, 0, 2, 3],
          "说明补好了，群里那个问号还挂着。",
          { tasks: progress(s, "report", 2), facts: { approach: "focus" } },
        ),
      O(
        "template",
        "找小林借现成的格式",
        "省排版时间，得先开口求人",
        [2, 1, 0, 0],
        "小林发来一个链接：“能用，不过我那张图也卡着呢。”",
        { facts: { approach: "template" } },
      ),
      O(
        "quiet",
        "先把群静音，慢慢弄",
        "耳根清净一会儿，别忘了回来回话",
        [1, 0, 3, -2],
        "群不响了，手头的两列数据可没跟着消失。",
        { facts: { approach: "quiet" } },
      ),
    ],
  ),
  E(
    1,
    "lin-request",
    "模板借到了，图还没画",
    "小林把模板发你，接着问：“我这张柱状图，帮我看一下？就差横轴了。”",
    [
      O(
        "help-lin",
        "帮她把横轴和标注理好",
        "自己的日报先停四分钟",
        [4, 12, 0, 3],
        "图能看了。小林松了口气：“等我发出去，回来帮你核日报。”",
        {
          facts: { helpedLin: true, linPromise: true },
          coworkers: { lin: -7 },
        },
      ),
      (s) =>
        O(
          "use-template",
          "先用模板，图让她自己调",
          "省下排版，少欠一份新活",
          [2, -2, 0, 1],
          "你道了谢，先把自己的表头套好。小林转回去继续磨那张图。",
          { tasks: progress(s, "report", 1), facts: { templateReady: true } },
        ),
      O(
        "swap",
        "把教程发她，约好互查",
        "她先自己调，你留个回查的人情",
        [3, 6, 0, 1],
        "你标了教程里最有用的一步。小林说：“行，晚点互相看一眼。”",
        {
          facts: { helpedLin: true, linPromise: true },
          coworkers: { lin: -3 },
        },
      ),
    ],
    (s) => f(s, "approach") === "template",
    { because: ["approach"] },
  ),
  E(
    1,
    "chen-request",
    "小陈的表格冒出一个奇怪的数",
    "你刚写到一半，小陈把屏幕转过来：“这个合计是不是多算了一行？”他的源数据正好也是你要的。",
    [
      O(
        "help-chen",
        "替他核出重复行",
        "花五分钟，换一份确认过的数据",
        [5, 13, 0, 4],
        "重复的那行找到了。小陈把干净数据发你：“后面有事喊我。”",
        {
          facts: { helpedChen: true, chenPromise: true, cleanData: true },
          coworkers: { chen: -8 },
        },
      ),
      (s) =>
        O(
          "borrow-data",
          "先借源表，自己的先做",
          "不接他的检查，自己核自己用的部分",
          [3, -2, 0, 2],
          "小陈把源表发来，转头继续找错。你先补上自己的两行。",
          { tasks: progress(s, "report", 2), facts: { sourceData: true } },
        ),
      O(
        "decline",
        "说还没忙完，让他找老王",
        "保住自己的时间，别指望马上有人回帮",
        [1, -5, 0, 0],
        "小陈点点头，抱着电脑去找老王。你这边的数据仍得自己核。",
        { facts: { chenBusy: true }, coworkers: { wang: 5 } },
      ),
    ],
    (s) => f(s, "approach") === "focus",
    { because: ["approach"] },
  ),
  E(
    1,
    "zhou-break",
    "静音之后，小周来搭话",
    "小周端着水过来：“你也静音了？群里正催数据呢。”他看起来已经准备等电梯了。",
    [
      O(
        "rest",
        "跟他在窗边站三分钟",
        "真休息，不会替你做完日报",
        [3, 3, 2, -8],
        "你活动了一下肩膀，舒服多了。小周提醒你回去看看群。",
        { facts: { rested: true, zhouTip: true } },
      ),
      (s) =>
        O(
          "return",
          "把水接好就回去补两行",
          "保住这段安静的工作时间",
          [3, 0, 0, 2],
          "两行补进去了，杯里的水还没凉。",
          { tasks: progress(s, "report", 2), facts: { sourceData: true } },
        ),
      O(
        "ask-shortcut",
        "问他有没有省事的数据入口",
        "小周指路，核不核还得你自己定",
        [2, 4, 0, -1],
        "“上周的缓存还在，日期可得看清。”小周把入口发你。",
        { facts: { cacheKnown: true, zhouTip: true } },
      ),
    ],
    (s) => f(s, "approach") === "quiet",
    { because: ["approach"] },
  ),
);
// 第二列数据的来源会决定是否留下校验债务。
const dataChoices = (kind) => [
  (s) =>
    O(
      "verify",
      kind === "clean" ? "用小陈核过的数据补齐" : "查源表，把两列一项项对上",
      kind === "clean" ? "有现成数据，少走一遍弯路" : "慢一点，今晚不留数据坑",
      [kind === "clean" ? 3 : 5, 0, 0, kind === "clean" ? 2 : 4],
      kind === "clean"
        ? "你对上日期，把干净数据填进日报。"
        : "两列数据都核过了，那个异常值也有了说明。",
      {
        tasks: progress(s, "report", kind === "clean" ? 5 : 4),
        facts: { dataVerified: true },
      },
    ),
  (s) =>
    O(
      "cache",
      "先贴缓存数字，回头再验",
      "眼下快，但校验这件事不会自动算完",
      [2, 0, 2, 1],
      "表格先填上了。你在待办里记下：发出去前还得核日期。",
      {
        tasks: [
          ...progress(s, "report", 3),
          add("data", "缓存数据的日期与数值校验", 3, 10),
        ],
        facts: { usedCache: true },
      },
    ),
  (s) =>
    O(
      "blank",
      "空着两列，先写其余说明",
      "不编数字，剩下的核对稍后做",
      [2, 0, 1, 1],
      "你给空值加了说明，数据那两列还原样等着。",
      { tasks: progress(s, "report", 1), facts: { dataWaiting: true } },
    ),
];
nodes.push(
  E(
    2,
    "clean-data",
    "小陈把干净的数据发来了",
    "你刚帮他找出重复行，他顺手把你要的区间也筛好了。文件名里带着今天的日期。",
    dataChoices("clean"),
    (s) => !!f(s, "cleanData"),
    { because: ["cleanData"] },
  ),
  E(
    2,
    "cached-data",
    "这个入口确实快",
    "小周发来的缓存秒开，数字也挺齐。就是页脚的更新日期，小得像免责声明。",
    dataChoices("cache"),
    (s) => !f(s, "cleanData") && !!f(s, "cacheKnown"),
    { because: ["cacheKnown"], hidden: true },
  ),
  E(
    2,
    "source-data",
    "日报卡在最后两列",
    "源系统总算能打开了。你把两张表并排，发现同一个指标用了两种口径。",
    dataChoices("source"),
    (s) => !f(s, "cleanData") && !f(s, "cacheKnown"),
  ),
  E(
    3,
    "progress-draft",
    "老板又发了一个问号",
    "日报还没收齐。老板问的是“进度”，倒也没说你现在就得交成品。",
    [
      O(
        "honest",
        "说清还差什么，附当前版本",
        "别让人猜你在干什么",
        [2, 0, -5, 0],
        "老板回：“行，缺的数据标出来，交之前叫我。”",
        { facts: { progressShared: true, scopeKnown: true } },
      ),
      (s) =>
        O(
          "rush",
          "先补完日报，再发链接",
          "这几分钟集中干完，但老板得等",
          [Math.max(2, remaining(s, "report")), 0, 1, remaining(s, "report")],
          "你把日报主文件补完发出了。老板还没点开，收到没有得再确认。",
          { tasks: finish(s, "report"), facts: { reportSubmitted: true } },
        ),
      O(
        "ignore",
        "等他问具体的再回",
        "省掉解释，追问可能会跟过来",
        [1, 0, 6, -1],
        "你没回。群里那个问号现在单独占着一行。",
        { facts: { ignoredPing: true } },
      ),
    ],
    (s) => remaining(s, "report") > 0,
  ),
  E(
    3,
    "progress-ready",
    "日报主文件填完了",
    "说明和数据都有了，老板恰好又问进度。缓存是否核过，还得看你前面怎么做的。",
    [
      O(
        "send-proof",
        "发链接，写清版本和未决项",
        "留下这次实际交付的记录",
        [2, 0, -6, 0],
        "链接和版本号发出去了。有没有未核数据，你也写在同一条里。",
        {
          facts: { reportSubmitted: true, receipt: true, progressShared: true },
          tags: ["evidence"],
        },
      ),
      O(
        "send-short",
        "只回一句“已经好了”",
        "少打几个字，对方还没拿到文件",
        [1, 0, -1, 0],
        "“发我一下。”老板回得比你想象中快。",
        { facts: { claimedDone: true } },
      ),
      O(
        "polish",
        "再打磨一遍说明再发",
        "内容没变多少，排版更好看了",
        [5, 0, 0, 3],
        "你把两个小标题换了位置，发出了新版本。",
        { facts: { reportSubmitted: true } },
      ),
    ],
    (s) => remaining(s, "report") === 0,
  ),
);
const pptOptions = (busy) => [
  (s) =>
    O(
      "accept-ppt",
      "把这几页接下来改",
      "接了就会进自己的清单，后面得兑现",
      [2, busy ? -1 : 1, -2, 1],
      `你答应了。老板把源文件和${DIFFICULTIES[s.difficulty].ppt}分钟左右的修改清单发来。`,
      {
        tasks: [
          add("ppt", "老板临时追加的汇报页", DIFFICULTIES[s.difficulty].ppt, 8),
        ],
        facts: { pptDecision: "accepted" },
      },
    ),
  O(
    "negotiate-ppt",
    "说今晚只保日报，页子明早改",
    "把顺序谈明白，不是偷偷放着",
    [3, 0, 2, 0],
    "老板看了看时间：“行，明早十点前给我，今晚别扩内容。”",
    { facts: { pptDecision: "tomorrow", pptTomorrow: true } },
  ),
  O(
    "send-old",
    "发上次模板，请他先用现成的",
    "省自己时间，也可能被嫌没新意",
    [2, -1, 4, 0],
    "老板翻了两页：“这版也能讲，今天先用。”你没接下新改稿。",
    { facts: { pptDecision: "template", oldDeckUsed: true } },
  ),
];
nodes.push(
  E(
    4,
    "ppt-after-send",
    "发完日报，老板想起了 PPT",
    "你刚发出链接，老板就回：“既然日报快了，明天汇报那几页，今天顺便改一下？”",
    pptOptions(false),
    (s) => !!f(s, "reportSubmitted"),
    { because: ["reportSubmitted"] },
  ),
  E(
    4,
    "ppt-while-busy",
    "日报没收尾，PPT 又来了",
    "老板把汇报稿拖进群：“这几页能顺手改不？”你的日报还在旁边开着。",
    pptOptions(true),
    (s) => !f(s, "reportSubmitted"),
  ),
  E(
    5,
    "meeting-ppt",
    "改稿之前，又来一个会",
    (s) =>
      f(s, "pptDelegated")
        ? "那几页已明确交给小林，老板仍把你拉进讨论。小林也收到邀请，你可以先把范围说清，免得她白改。"
        : "老板刚发来临时会议邀请，要讨论你刚接下的那几页。附件是同一份 PPT。",
    [
      O(
        "send-agenda",
        "先把修改范围列出来，请他群里拍板",
        "争取不开会，但得花时间把问题问准",
        [3, 0, 0, 1],
        "你把需要决定的两处列进群。老板说先看，看完再定要不要开。",
        { facts: { meetingPlan: "agenda", agendaSent: true } },
      ),
      O(
        "attend",
        "接会议邀请，当面讲清楚",
        "会要占时间，但可能少改一轮",
        [1, 0, -1, 0],
        "你点了接受，给日历留出一块。PPT 的修改还没开始。",
        { facts: { meetingPlan: "attend" } },
      ),
      O(
        "skip",
        "先不点接受，躲过这一轮",
        "眼下空出来，问到你时得解释",
        [1, 0, 3, 0],
        "你把邀请放在一边。会议里是否会定到你的任务，暂时还不知道。",
        { facts: { meetingPlan: "skip" } },
      ),
    ],
    (s) => f(s, "pptDecision") === "accepted",
    { because: ["pptDecision"] },
  ),
  E(
    5,
    "meeting-tomorrow",
    "明早的事，今晚要先聊吗",
    "PPT 已谈好明早交，会议邀请却还挂在今天。老板大概顺手复制了上次日程。",
    [
      O(
        "move-meeting",
        "提醒他改到明早",
        "既然交期改了，会议也一起改",
        [2, 0, -1, 0],
        "老板改了日程：“那明早一起看。”今晚这段时间空了。",
        { facts: { meetingPlan: "moved", meetingSettled: true } },
      ),
      O(
        "attend",
        "今晚先听听，明早少猜一点",
        "用时间买确定性",
        [1, 0, -1, 0],
        "你接受了邀请，今晚先把想法对齐。",
        { facts: { meetingPlan: "attend" } },
      ),
      O(
        "skip",
        "当没看见，直接忙自己的",
        "可能真没人找你，也可能点名",
        [1, 0, 2, 0],
        "你没动邀请，继续看自己的表。",
        { facts: { meetingPlan: "skip" } },
      ),
    ],
    (s) => f(s, "pptDecision") === "tomorrow",
    { because: ["pptDecision"] },
  ),
  E(
    5,
    "meeting-template",
    "旧模板也被拉进了会议",
    "老板打开上次的稿子，邀请你一起看：“不改内容，就确认一下顺序。”",
    [
      O(
        "send-agenda",
        "把页码顺序发群里让他选",
        "有机会用几条消息替掉一个会",
        [2, 0, 0, 0],
        "页码清单发出去了，老板开始在消息里逐项回复。",
        { facts: { meetingPlan: "agenda", agendaSent: true } },
      ),
      O(
        "attend",
        "进去把顺序捋清楚",
        "少一点来回消息，多占一段时间",
        [1, 0, -1, 0],
        "你收下邀请，准备等他开会。",
        { facts: { meetingPlan: "attend" } },
      ),
      O(
        "skip",
        "说模板都有备注，不参加了",
        "省会时，但老板不一定细看备注",
        [2, 0, 3, 0],
        "你发了一句模板有备注。老板没回，会议照常发起了。",
        { facts: { meetingPlan: "skip" } },
      ),
    ],
    (s) => f(s, "pptDecision") === "template",
    { because: ["pptDecision"] },
  ),
);
// 第二阶段：会议和人情各有来处，接下的稿子会在第九个节点追到。
nodes.push(
  E(
    6,
    "hidden-cancelled",
    "这会还真取消了",
    "你刚发的那几条问题，老板都在群里答完了。他撤掉邀请：“那就不开了，按这个来。”",
    [
      (s) =>
        O(
          "use-gap",
          "趁空档做自己的日报",
          "省掉的是会议，活还是得自己做",
          [3, 0, -1, 2],
          "你把空出来的三分钟用来补日报，不用再听一遍同样的话。",
          { tasks: progress(s, "report", 3), facts: { meetingSettled: true } },
        ),
      O(
        "take-breath",
        "把椅子往后挪，歇两分钟",
        "今天终于有个会凭空消失了",
        [2, 0, 0, -7],
        "你看了会儿窗外，手机难得没响。",
        { facts: { meetingSettled: true, rested: true } },
      ),
      O(
        "share-answer",
        "把已确认的答案转给同事",
        "他们也少等一场会",
        [2, 6, 0, 0],
        "小林回了个大拇指：“我正准备找耳机呢。”",
        { facts: { meetingSettled: true }, coworkers: { lin: -2, wang: -2 } },
      ),
    ],
    (s) => f(s, "meetingPlan") === "agenda",
    { because: ["agendaSent"], hidden: true, tags: ["evidence"] },
  ),
  E(
    6,
    "meeting-moved",
    "日历总算跟交期对上了",
    "老板把会议挪到明早，今晚不用再为明天的稿子守着麦克风。",
    [
      (s) => reportWork(s, "work-gap", "趁没人打断，补日报", 4),
      O(
        "rest-gap",
        "认真喝完这杯水",
        "暂时不碰任务，脑子缓一缓",
        [3, 0, 0, -9],
        "水喝完了，肩膀也不那么僵。清单里的任务一个没少。",
        { facts: { rested: true } },
      ),
      O(
        "tell-others",
        "提醒小陈会议改期了",
        "免得他一个人傻等在会议室",
        [2, 7, 0, 0],
        "小陈把耳机摘了：“你不说我真就进去了。”",
        { coworkers: { chen: -2 } },
      ),
    ],
    (s) => f(s, "meetingPlan") === "moved",
    { because: ["meetingSettled"] },
  ),
  E(
    6,
    "meeting-happening",
    "十分钟的会，先别急着信",
    "大家总算进齐了。老板开始翻页：“就两个事，一个是顺序，一个是要不要补数据。”",
    [
      (s) =>
        O(
          "limit-meeting",
          "先问今天必须拍板哪一项",
          "可能显得急，但能及时打住",
          [DIFFICULTIES[s.difficulty].meeting, 0, 1, 3],
          "顺序定下来了。老板同意新增数据明天补，今晚不加这一项。",
          { facts: { meetingSettled: true, scopeKnown: true } },
        ),
      (s) =>
        O(
          "take-analysis",
          "主动接下补数据，会上一次讲完",
          "多接一个实活，散会后得做",
          [DIFFICULTIES[s.difficulty].meeting + 3, 2, -3, 6],
          "老板把补数据也划给你了。你记下了口径，清单又多一行。",
          {
            tasks: [
              add(
                "analysis",
                "会上追加的数据拆分",
                DIFFICULTIES[s.difficulty].analysis,
                13,
              ),
            ],
            facts: { meetingSettled: true, analysisAccepted: true },
          },
        ),
      (s) =>
        O(
          "listen",
          "先听完，不抢着认领",
          "时间花了，但不把别人的活揽过来",
          [DIFFICULTIES[s.difficulty].meeting + 5, 0, 0, 5],
          "会比邀请长了一截。新增数据分给了原负责人，你只需要记住已定的顺序。",
          { facts: { meetingSettled: true }, coworkers: { wang: 4 } },
        ),
    ],
    (s) => f(s, "meetingPlan") === "attend",
    { because: ["meetingPlan"] },
  ),
  E(
    6,
    "meeting-skipped",
    "会议里真的叫到你了",
    "你没进会，小周发来一条：“刚问你那边今晚能交什么，我没替你答。”",
    [
      O(
        "get-summary",
        "请小周转结论，马上回复范围",
        "躲掉大部分会议，补一次说明",
        [3, -2, 1, 1],
        "小周转来两行结论。你回了自己负责的部分，没有接下新增数据。",
        {
          facts: { meetingSettled: true, meetingFollowup: false },
          coworkers: { zhou: 2 },
        },
      ),
      O(
        "keep-quiet",
        "继续不回，先留着这段安静",
        "省下眼前的说明，点名的事还悬着",
        [1, 0, 5, -1],
        "你把聊天框收起来。小周没再替你解释，会议结论里留了“待本人确认”。",
        { facts: { meetingFollowup: true } },
      ),
      (s) =>
        O(
          "accept-remotely",
          "回群说新增数据我来补",
          "没开会也能接活，但任务会跟来",
          [2, 1, -1, 1],
          "老板把补数据的范围贴了过来。你没进会，活倒是一点没躲过。",
          {
            tasks: [
              add(
                "analysis",
                "缺席会议后接下的数据拆分",
                DIFFICULTIES[s.difficulty].analysis,
                13,
              ),
            ],
            facts: { meetingSettled: true, analysisAccepted: true },
          },
        ),
    ],
    (s) => f(s, "meetingPlan") === "skip",
    { because: ["meetingPlan"] },
  ),
);
const helpTarget = (s) => pendingTasks(s)[0];
function returnHelp(s, who) {
  const t = helpTarget(s),
    n = t ? Math.min(3, t.remaining) : 0;
  return O(
    "accept-help",
    t
      ? `请${who === "lin" ? "小林" : "小陈"}帮你核${t.title}`
      : "请他帮忙查一下交付链接",
    t ? "有人帮核几处内容，自己的负担轻一点" : "没有未完工作，就只检查能否打开",
    [2, 4, -1, 0],
    t
      ? "对方替你核了几处，你把确认过的内容补进文件。"
      : "对方试了链接，能打开；你不用再重新打包。",
    {
      tasks: t ? progress(s, t.id, n) : [],
      assisted: true,
      facts: {
        [who === "lin" ? "linHelpUsed" : "chenHelpUsed"]: true,
        helper: who,
      },
      coworkers: { [who]: n + 1 },
    },
  );
}
nodes.push(
  E(
    7,
    "lin-return",
    "小林真记着那张图",
    "小林把图发出去了，转头来敲你的桌子：“刚说好了帮你核，现在哪块最急？”",
    [
      (s) => returnHelp(s, "lin"),
      (s) =>
        reportWork(s, "self-work", "让她先走，自己再做几行", 4, 3, {
          linSavedForLater: true,
        }),
      O(
        "save-favor",
        "现在先不用，留到发稿前帮忙看",
        "人情没用掉，稍后还有机会",
        [1, 2, 0, 0],
        "小林说：“行，发之前叫我。”小林回去收她自己的尾巴，你这边还得接着弄。",
        { facts: { linSavedForLater: true } },
      ),
    ],
    (s) => !!f(s, "helpedLin") && !f(s, "linHelpUsed"),
    { because: ["helpedLin"] },
  ),
  E(
    7,
    "chen-return",
    "小陈带着干净表格回来了",
    "重复行修好了。小陈说：“你刚帮我那五分钟没白花，现在我有空，换我帮你。”",
    [
      (s) => returnHelp(s, "chen"),
      O(
        "ask-proof",
        "请他确认数据口径，回在群里",
        "以后有人问，能找到这次确认",
        [3, 3, -4, 0],
        "小陈在群里写明了日期和口径。你把这条确认留在日报旁边。",
        {
          facts: { dataWitness: true },
          tags: ["evidence"],
          coworkers: { chen: 2 },
        },
      ),
      O(
        "save-favor",
        "先别急，待会儿交稿再看",
        "保留他的空档，眼前没有进度奖励",
        [1, 1, 0, 0],
        "小陈说：“那我先收一下自己的。”他还没替你干活。",
        { facts: { chenSavedForLater: true } },
      ),
    ],
    (s) =>
      (!f(s, "helpedLin") || f(s, "linHelpUsed")) &&
      !!f(s, "helpedChen") &&
      !f(s, "chenHelpUsed"),
    { because: ["helpedChen"] },
  ),
  E(
    7,
    "no-return",
    "大家都在收自己的尾巴",
    "小林在改图，小陈还在对数。你看了圈办公室，今天暂时没有谁欠你一个救场。",
    [
      (s) => reportWork(s, "work-alone", "关掉闲聊，做四分钟自己的事", 4),
      O(
        "ask-zhou",
        "问小周能不能试开一下链接",
        "只请他做一件很小的事",
        [2, -1, 0, 0],
        "小周说现在手头有事，发链接时再叫他。他现在没空，链接还得等发出时再确认。",
        { facts: { zhouCanCheck: true }, coworkers: { zhou: 1 } },
      ),
      O(
        "pause",
        "先去洗把脸",
        "累了先缓缓，活仍在清单上",
        [3, 0, 1, -10],
        "冷水一扑，脑子清醒了一点。回来还是那张表。",
        { facts: { rested: true } },
      ),
    ],
    (s) =>
      (!f(s, "helpedLin") || f(s, "linHelpUsed")) &&
      (!f(s, "helpedChen") || f(s, "chenHelpUsed")),
  ),
);
function taskChoices(id) {
  const styles = {
      ppt: {
        noun: "这几页 PPT",
        part: "先改影响汇报顺序的两页",
        amount: 2,
        overhead: 2,
        suspicion: -2,
        factor: 0.8,
        partial: "页序和标题先对齐了，其他修改还留在这份任务里。",
      },
      data: {
        noun: "缓存校验",
        part: "先核最有疑点的那个数",
        amount: 1,
        overhead: 1,
        suspicion: -4,
        factor: 0.7,
        partial: "最可疑的数核清了，其他日期与数值仍待逐项对照。",
      },
      report: {
        noun: "日报",
        part: "先补汇总的人马上要看的部分",
        amount: 3,
        overhead: 1,
        suspicion: -1,
        factor: 1,
        partial: "关键说明先补上了，其余未写的部分仍然空着，等你回来补。",
      },
    },
    v = styles[id];
  return [
    (s) =>
      O(
        "finish-task",
        `把${v.noun}做完`,
        "只处理这件，别顺手扩大范围",
        [
          remaining(s, id) + v.overhead,
          0,
          v.suspicion,
          Math.ceil(remaining(s, id) * v.factor),
        ],
        `${v.noun}按实际范围处理完了，你划掉这一项；其他待办照常保留。`,
        { tasks: finish(s, id) },
      ),
    (s) =>
      O(
        "part-task",
        v.part,
        "先救眼前的急，剩下的还得处理",
        [
          Math.min(v.amount, remaining(s, id)) + v.overhead,
          0,
          1,
          Math.min(v.amount, remaining(s, id)),
        ],
        v.partial,
        { tasks: progress(s, id, v.amount) },
      ),
    (s) =>
      deferChoice(s, id, "拿着具体范围，商量改到明早", {
        optionId: "defer-task",
      }),
  ];
}
nodes.push(
  E(
    8,
    "ppt-due",
    "刚接的 PPT 找上门了",
    "老板问：“那几页改到哪了？”你答应的是今晚，源文件还在你的清单里。",
    taskChoices("ppt"),
    (s) => remaining(s, "ppt") > 0,
    { because: ["pptDecision"] },
  ),
  E(
    8,
    "cache-due",
    "缓存的日期还没核",
    "你刚填过的那两列旁边，自己留的“发前核日期”还没打勾。现在不核，发出去就得带着风险。",
    taskChoices("data"),
    (s) => !remaining(s, "ppt") && remaining(s, "data") > 0,
    { because: ["usedCache"] },
  ),
  E(
    8,
    "report-due",
    "终于轮到自己的日报",
    "临时稿暂时处理完了，日报还在等你。日报的窗口还停在刚才那一行，光标也没挪过窝。",
    taskChoices("report"),
    (s) =>
      !remaining(s, "ppt") &&
      !remaining(s, "data") &&
      remaining(s, "report") > 0,
  ),
  E(
    8,
    "hidden-clear",
    "清单上真的少了好几行",
    "你逐项对过：日报、临时页和数据校验，没有欠着的这一类活。会议里的新增数据若接过，还另有一行。",
    [
      O(
        "check-link",
        "把交付链接和权限检查一遍",
        "做检查，不凭空增加任务进度",
        [2, 0, -2, 1],
        "链接能打开，权限也放对了。你把检查结果留在消息旁边。",
        { facts: { linkChecked: true }, tags: ["evidence"] },
      ),
      O(
        "stretch",
        "伸个懒腰，什么新活也不接",
        "已经清掉的活不必再做一遍",
        [2, 0, 0, -8],
        "你站起来伸了个懒腰，没有为了显忙重新打开旧稿。",
        { facts: { rested: true } },
      ),
      O(
        "check-friends",
        "问问搭子还有多久",
        "想一起走，得先知道他忙到哪",
        [2, 5, 0, 0],
        "小林说会尽快收尾。你只是问了时间，还没替她许下交接。",
        { facts: { askedPartner: true } },
      ),
    ],
    (s) =>
      !remaining(s, "ppt") && !remaining(s, "data") && !remaining(s, "report"),
    { hidden: true },
  ),
);
// 第三阶段：交的是哪一版、有没有人收到，决定追问能不能当场结束。
const sendProof = (s) =>
  O(
    "send-proof",
    "发固定链接，写清版本和待办",
    "只为实际发出的这份留证",
    [2, 0, -5, 0],
    "版本号、链接和未决项都写在同一条里。这份记录能证明你发过什么，不能替你做完没做的活。",
    {
      facts: { reportSubmitted: true, receipt: true, ignoredPing: false },
      tags: ["evidence"],
    },
  );
nodes.push(
  E(
    9,
    "delivery-unfinished",
    "要发日报了，主文件还差一点",
    "老板说要汇总日报，你的主文件还没做完。现在只能把差的内容做掉，或者明说交的是草稿。",
    [
      (s) =>
        O(
          "finish-send",
          "补完主文件，连版本号一起发",
          "耗时看实际余量；缓存校验另算",
          [remaining(s, "report") + 2, 0, -4, remaining(s, "report")],
          "主文件补齐发出了。其他单独登记的待办，你也列在消息里。",
          {
            tasks: finish(s, "report"),
            facts: { reportSubmitted: true, receipt: true, ignoredPing: false },
            tags: ["evidence"],
          },
        ),
      O(
        "draft",
        "先发草稿，标清还没完成的地方",
        "别人能先看，但你还欠着内容",
        [2, 0, 1, 0],
        "草稿发出去了，标题里带着“待补”。对方知道这份还不能直接当成品用。",
        { facts: { draftSent: true, progressShared: true } },
      ),
      O(
        "delay-send",
        "再等等，等问到再说",
        "自己暂时没多干活，汇总的人会等你",
        [1, -1, 6, -1],
        "你没发文件。群里“还差谁”下面，很快出现了你的名字。",
        { facts: { ignoredPing: true } },
      ),
    ],
    (s) => remaining(s, "report") > 0,
  ),
  E(
    9,
    "delivery-first",
    "文件做完了，还没真正交出去",
    "你说过“好了”，但群里还没有这份文件。对方手上没有链接，就没法拿它汇总。",
    [
      (s) => sendProof(s),
      O(
        "quick-send",
        "把文件直接拖进群",
        "快一点，之后找版本得多留意",
        [1, 0, -2, 0],
        "文件发出去了，没注明版本。群里的历史附件可不止这一份。",
        {
          facts: { reportSubmitted: true, receipt: false, ignoredPing: false },
        },
      ),
      O(
        "ask-check",
        "请小周先试开链接，再发群里",
        "多一道检查，少一次权限误会",
        [3, -1, -3, 0],
        "小周试开后说没问题。你把链接发进群，记下了版本。",
        {
          facts: {
            reportSubmitted: true,
            receipt: true,
            linkChecked: true,
            ignoredPing: false,
          },
          coworkers: { zhou: 2 },
          tags: ["evidence"],
        },
      ),
    ],
    (s) => task(s, "report").remaining === 0 && !f(s, "reportSubmitted"),
  ),
  E(
    9,
    "delivery-sent",
    "刚发的文件，被消息顶上去了",
    "日报已经发过，工作群却在聊今晚谁点奶茶。老板又问：“文件在哪条？”",
    [
      (s) => sendProof(s),
      O(
        "say-above",
        "回一句“上面发了”",
        "少打字，不保证对方真能翻到",
        [1, 0, 2, 0],
        "你说在上面，老板继续往上翻。有没有看到，还没给你准话。",
        { facts: { deliveryVague: true } },
      ),
      O(
        "confirm",
        "重新贴链接，请他确认能打开",
        "花两分钟，把交付最后一步收掉",
        [2, 0, -4, 0],
        "老板回：“打开了，收到了。”这次不是你单方面说发过。",
        {
          facts: {
            delivered: true,
            receipt: true,
            linkChecked: true,
            ignoredPing: false,
          },
          tags: ["evidence"],
        },
      ),
    ],
    (s) => task(s, "report").remaining === 0 && !!f(s, "reportSubmitted"),
  ),
  E(
    10,
    "data-question",
    "那列数字果然被问到了",
    "缓存校验还在待办里，老板问：“这两列是哪天的数据？”这次不是找茬，你确实还没核。",
    [
      (s) =>
        O(
          "verify-now",
          "现在核清日期，必要时更正",
          "有回执也不能替数据正确性作保",
          [remaining(s, "data") + 2, 0, -3, 3],
          "你对过源表，修正了日期说明，把更正版发在原链接下。",
          {
            tasks: finish(s, "data"),
            facts: {
              dataVerified: true,
              dataCorrected: true,
              reportSubmitted: task(s, "report").remaining === 0,
            },
            tags: ["evidence"],
          },
        ),
      O(
        "admit-pending",
        "说明是待核稿，约定离开前补齐",
        "承认实际状态，校验仍在你的清单上",
        [2, 0, 2, 0],
        "老板说：“行，别把待核稿当正式数字用。”这项任务还没划掉。",
        { facts: { dataWarning: true } },
      ),
      O(
        "bluff",
        "说缓存应该差不多，先这么用",
        "省眼前几分钟，错误风险还在",
        [1, 0, 8, 0],
        "老板没再回，但把这两列圈了起来。待核数字依旧是待核数字。",
        { facts: { dataBluffed: true } },
      ),
    ],
    (s) => remaining(s, "data") > 0,
    { because: ["usedCache"] },
  ),
  E(
    10,
    "evidence-protects",
    "“你是不是没交？”",
    "汇总的人漏看了消息，群里又点了你。你手上留着这次文件的版本号和发送记录。",
    [
      O(
        "show-receipt",
        "把原消息和版本号贴回去",
        "这次误会可以当场说清",
        [2, 0, -6, 0],
        "对方点开原消息：“看漏了，收到。”你没为同一份文件再做一遍。",
        {
          facts: { evidenceCleared: true, delivered: true, ignoredPing: false },
          tags: ["evidence"],
        },
      ),
      O(
        "repackage",
        "不解释，再打包发一遍",
        "息事宁人，但重复劳动要花时间",
        [5, 0, -2, 3],
        "你又打了一次包。文件没变，对方这回回了“收到”。",
        { facts: { delivered: true, ignoredPing: false } },
      ),
      O(
        "wait-read",
        "先把原消息顶一下，等他看",
        "少打字，确认还得等下一步",
        [1, 0, 0, 0],
        "原消息顶回视野，对方暂时没回。原消息还在，对方的输入框却没动。",
        { facts: { waitingAck: true } },
      ),
    ],
    (s) => !remaining(s, "data") && !!f(s, "receipt"),
    { because: ["receipt"] },
  ),
  E(
    10,
    "no-receipt",
    "“群里那份到底是不是新的？”",
    "你发过文件，但版本没说清。汇总的人翻出两份同名附件，不敢随便用。",
    [
      O(
        "identify",
        "确认当前版本，补一条说明",
        "现在留证，别让同名文件继续打架",
        [3, 0, -3, 1],
        "你指出了正确附件，并写下版本和时间。对方确认用了这一份。",
        {
          facts: { receipt: true, delivered: true, ignoredPing: false },
          tags: ["evidence"],
        },
      ),
      O(
        "send-again",
        "再发一份，加上“就用这个”",
        "能解决眼前问题，会多一份附件",
        [4, 0, -1, 2],
        "你又发了一份，这回对方点了确认。",
        { facts: { delivered: true, ignoredPing: false } },
      ),
      O(
        "shrug",
        "说最新那份就是，先不管",
        "省下解释，交付仍未确认",
        [1, 0, 5, 0],
        "对方没有替你猜。群里留着“待确认版本”几个字。",
        { facts: { versionUnclear: true } },
      ),
    ],
    (s) =>
      !remaining(s, "data") && !f(s, "receipt") && !!f(s, "reportSubmitted"),
    { because: ["reportSubmitted"] },
  ),
  E(
    10,
    "where-is-file",
    "汇总表里还缺你的链接",
    "你之前发的是草稿，或者根本还没发。汇总的人问：“成品能给我了吗？”",
    [
      (s) =>
        O(
          "finish-deliver",
          "补完日报，当场发到固定位置",
          "真做完再确认，不靠一句好了",
          [remaining(s, "report") + 3, 0, -4, remaining(s, "report")],
          "主文件补齐了，对方也确认打开。单独登记的其他任务仍按清单处理。",
          {
            tasks: finish(s, "report"),
            facts: {
              reportSubmitted: true,
              receipt: true,
              delivered: true,
              ignoredPing: false,
            },
            tags: ["evidence"],
          },
        ),
      O(
        "ask-time",
        "明说还没收尾，请他稍等",
        "比装作交过靠谱，活还得做",
        [2, 0, 1, 0],
        "对方把你这一格留空，说做完叫他。你没拿到交付确认。",
        { facts: { progressShared: true } },
      ),
      O(
        "stall",
        "说网络卡，继续拖一会儿",
        "理由能用一次，文件不会自动出现",
        [1, -1, 7, -1],
        "对方回：“那你好了直接发。”你清单上的日报还在。",
        { facts: { stalledDelivery: true } },
      ),
    ],
    (s) =>
      !remaining(s, "data") &&
      !f(s, "receipt") &&
      !f(s, "reportSubmitted") &&
      task(s, "report").status !== "deferred" &&
      task(s, "report").status !== "delegated",
  ),
);
nodes.push(
  E(
    11,
    "meeting-chase",
    "“刚才会上的事，你确认了吗？”",
    "你缺席后没补结论，小周留的“待本人确认”终于被老板看到了。现在问的是责任范围，不是在线状态。",
    [
      O(
        "confirm-scope",
        "看完结论，只认自己那一项",
        "补三分钟说明，不额外认领",
        [3, 0, -3, 1],
        "你把自己的范围回清楚，老板删掉了“待确认”。没接的新增数据没有塞给你。",
        {
          facts: {
            meetingFollowup: false,
            meetingSettled: true,
            scopeKnown: true,
          },
        },
      ),
      (s) =>
        O(
          "accept-late",
          "干脆把新增数据也接了",
          "用实际任务换一句别再问了",
          [2, 1, -2, 1],
          "新增数据正式落到了你头上，任务表也多了一行。",
          {
            tasks: [
              add(
                "analysis",
                "补确认时接下的数据拆分",
                DIFFICULTIES[s.difficulty].analysis,
                13,
              ),
            ],
            facts: {
              meetingFollowup: false,
              meetingSettled: true,
              analysisAccepted: true,
            },
          },
        ),
      O(
        "ignore-again",
        "继续不回，赌他去忙别的",
        "这一轮能省，没解释的事会留到门口",
        [1, 0, 7, 0],
        "对话停在老板的问号上。问号还在原地，老板没替你把范围划掉。",
        { facts: { meetingUnresolved: true } },
      ),
    ],
    (s) => !!f(s, "meetingFollowup"),
    { because: ["meetingFollowup"] },
  ),
  E(
    11,
    "ping-chase",
    "老板来工位看进度了",
    "你前面有消息没回，老板索性走过来：“现在还剩什么？”这回人就在旁边。",
    [
      O(
        "show-list",
        "把真实清单给他看",
        "不装忙，也不装做完",
        [3, 0, -5, 0],
        "他看完剩余项，知道你在做什么了。追问停了，任务本身没消失。",
        { facts: { ignoredPing: false, scopeKnown: true } },
      ),
      (s) =>
        O(
          "work-in-front",
          "当着他的面做掉关键的那部分",
          "进度会动，解释就简短一点",
          [3, 0, -2, 3],
          "你补了关键的那部分，老板看得到进度，转身去忙了。",
          { tasks: progress(s, "report", 2), facts: { ignoredPing: false } },
        ),
      O(
        "fake-busy",
        "切几个窗口，说快好了",
        "撑过去一分钟，别指望这就是交付",
        [1, 0, 6, 1],
        "老板看着来回切的窗口：“那发的时候叫我。”他还在等你发出那份文件。",
        { facts: { vaguePromise: true } },
      ),
    ],
    (s) => !f(s, "meetingFollowup") && !!f(s, "ignoredPing"),
    { because: ["ignoredPing"] },
  ),
  E(
    11,
    "group-notice",
    "群里让大家确认收到",
    "行政发了明天的通知，下面整整齐齐一排“收到”。这条不用你再做一份材料。",
    [
      O(
        "reply",
        "看清内容，回个收到",
        "一分钟，不把简单通知做成项目",
        [1, 0, 0, 0],
        "明天换会议室，记住了。你回完就把群收起来。",
        { facts: { noticeRead: true } },
      ),
      O(
        "remind",
        "顺手提醒旁边还戴耳机的同事",
        "花点时间，也让人少跑错一层",
        [2, 5, 0, 0],
        "小陈把新会议室记下，跟你说了声谢。",
        { facts: { noticeRead: true }, coworkers: { chen: -1 } },
      ),
      O(
        "rest-phone",
        "先不回，把手机扣下休息",
        "这条不紧急，晚点看也行",
        [2, 0, 0, -6],
        "没人因此找你。两分钟后，你把手机翻回来。",
        { facts: { rested: true } },
      ),
    ],
    (s) => !f(s, "meetingFollowup") && !f(s, "ignoredPing"),
  ),
);
function lateHelp(s, who) {
  const all = pendingTasks(s),
    t = all.find((t) => t.id === "ppt") || all[0];
  return O(
    "use-favor",
    t
      ? `请${who === "lin" ? "小林" : "小陈"}接手${t.title}`
      : "请搭子替你确认文件能打开",
    t ? "明确交给谁，别只说帮个忙" : "小检查也说清楚，不凭空增加完成度",
    [3, 4, -2, 0],
    t
      ? "对方明确答应接手，你把源文件、范围和交付时间一并发了。"
      : "对方试开链接，回了能打开。这次只检查链接，手头的活还得另收尾。",
    {
      tasks: t
        ? [
            {
              type: "delegate",
              id: t.id,
              assignee: who,
              agreement: `${who === "lin" ? "小林" : "小陈"}明确接手${t.title}并负责交付`,
            },
          ]
        : [],
      facts: {
        [who === "lin" ? "linHelpUsed" : "chenHelpUsed"]: true,
        helper: who,
      },
      coworkers: { [who]: t ? t.remaining + 3 : 2 },
      assisted: true,
    },
  );
}
nodes.push(
  E(
    12,
    "hidden-chen-favor",
    "“刚欠你的，现在还”",
    "小陈把自己的表收好了。他记得你帮他核过重复行：“你要还没完，我能接一小块。”",
    [
      (s) => lateHelp(s, "chen"),
      (s) => reportWork(s, "keep-work", "不用再帮，自己做一会儿", 4, 4),
      O(
        "invite-chen",
        "活先不转，约好等会儿一起走",
        "得等两个人都收好，才算搭子",
        [2, 8, 0, 0],
        "小陈说：“行，我收完等你。”你们约了电梯，还没现在就走。",
        { facts: { partner: "chen", partnerAgreed: true } },
      ),
    ],
    (s) => !!f(s, "helpedChen") && !f(s, "chenHelpUsed"),
    { because: ["helpedChen"], hidden: true },
  ),
  E(
    12,
    "hidden-lin-favor",
    "小林还留着刚才那句话",
    "你帮过那张图，还没用掉她答应的回帮。小林看你还在：“要不现在交我一块？”",
    [
      (s) => lateHelp(s, "lin"),
      (s) => reportWork(s, "keep-work", "让她歇着，自己再补几行", 4, 4),
      O(
        "invite-lin",
        "不转任务，约好电梯见",
        "两边都得收好，不是谁替谁假下班",
        [2, 8, 0, 0],
        "小林把包拉上：“我收完就等你。”你们约好了，不用再猜。",
        { facts: { partner: "lin", partnerAgreed: true } },
      ),
    ],
    (s) =>
      (!f(s, "helpedChen") || f(s, "chenHelpUsed")) &&
      !!f(s, "helpedLin") &&
      !f(s, "linHelpUsed"),
    { because: ["helpedLin"], hidden: true },
  ),
  E(
    12,
    "own-pace",
    "这一段，自己掌握",
    "该用的人情用过了，或者今天还没攒到。窗外开始变色，桌上还是你自己的清单。",
    [
      (s) => reportWork(s, "work", "安静地收一会儿日报", 4),
      O(
        "break",
        "去茶水间躲三分钟",
        "不用每一分钟都拿来证明自己忙",
        [3, 1, 0, -11],
        "你站在饮水机旁放空了一会儿。群里没少你这一句“收到”。",
        { facts: { rested: true } },
      ),
      O(
        "invite-zhou",
        "问小周要不要一起坐电梯",
        "他踩点，你可能要等他，或者他等你",
        [2, 6, 0, 0],
        "小周说：“行，谁先收完谁吱一声，别到了楼下再喊。”",
        { facts: { partner: "zhou", partnerAgreed: true } },
      ),
    ],
    (s) =>
      (!f(s, "helpedChen") || f(s, "chenHelpUsed")) &&
      (!f(s, "helpedLin") || f(s, "linHelpUsed")),
  ),
);
const sweepChoices = [
  (s) => finishAll(s),
  (s) =>
    deferChoice(s, "all", "把剩余项列出来，商量明早交", {
      facts: { tomorrowAgreed: true },
    }),
  O(
    "leave-rest",
    "先放一边，等最后再说",
    "现在省一点，剩余工作还会在门口等你",
    [1, 0, 3, -1],
    "你把清单折到窗口后面。窗口挡住了，待办里那几行红字还在。",
    { facts: { leftTasks: true } },
  ),
];
nodes.push(
  E(
    13,
    "extra-still-open",
    "顺手接的活，还没顺手做完",
    (s) =>
      `日报之外还有${pendingTasks(s)
        .filter((t) => ["ppt", "analysis"].includes(t.id))
        .map((t) => t.title)
        .join("、")}。这些是你明确答应过的，不是群里随便提了一嘴。`,
    sweepChoices,
    (s) => !!(remaining(s, "ppt") || remaining(s, "analysis")),
  ),
  E(
    13,
    "core-still-open",
    "自己的尾巴还挂着",
    (s) =>
      `清单上还留着：${pendingTasks(s)
        .map((t) => t.title)
        .join("、")}。现在处理、协商改期，或者继续拖，都得算这一笔。`,
    sweepChoices,
    (s) =>
      !remaining(s, "ppt") &&
      !remaining(s, "analysis") &&
      pendingTasks(s).length > 0,
  ),
  E(
    13,
    "all-accounted",
    "清单上每一项，都有去处了",
    "做完的有文件，明早的有约定，交给同事的也有人明确接手。你核对完最后一行，总算能把手从鼠标上拿开一会儿。",
    [
      O(
        "check-handoff",
        "核对一下文件和交接对象",
        "别让最后一个权限问题把你喊回来",
        [2, 0, -2, 1],
        "文件、接收人和约定都对上了。你把检查结果回在交接消息下，省得一会儿再找。",
        {
          facts: { handoffChecked: true, linkChecked: true },
          tags: ["evidence"],
        },
      ),
      O(
        "thank",
        "向帮过忙的人道声谢",
        "不涨工作进度，人情也值得有个回音",
        [2, 8, 0, -1],
        "你说了声谢谢，对方摆摆手：“下次也别见外。”",
        { facts: { saidThanks: true } },
      ),
      O(
        "nothing-extra",
        "不找新活，靠一会儿椅背",
        "活都安排好了，休息不是罪过",
        [2, 0, 0, -7],
        "你把手从鼠标上拿开。群里难得安静，鼠标也能歇两分钟。",
        { facts: { rested: true } },
      ),
    ],
    (s) => pendingTasks(s).length === 0,
  ),
);
// 最后一阶段：先确认交接，再关电脑，再到门口，最后才真正离开。
const acceptedFacts = {
  handoffAccepted: true,
  unresolvedDelivery: false,
  meetingUnresolved: false,
  meetingFollowup: false,
};
nodes.push(
  E(
    14,
    "handoff-with-debt",
    "准备交接，清单还有红字",
    (s) =>
      `还有${pendingTasks(s)
        .map((t) => t.title)
        .join("、")}没处理。对方只问“好了没”，你不能替这些红字回答好了。`,
    [
      (s) =>
        O(
          "finish-handoff",
          "补齐剩余，再让对方确认",
          "多花的时间，对应清单上的实际余量",
          [units(s) + 3, 0, -4, units(s)],
          "剩余内容都补齐了。对方打开文件确认收到，这次交接算完整。",
          {
            tasks: clear(s),
            facts: {
              ...acceptedFacts,
              reportSubmitted: true,
              delivered: true,
              receipt: true,
            },
            tags: ["evidence"],
          },
        ),
      (s) =>
        deferChoice(s, "all", "逐项确认明早交，今晚交现有部分", {
          optionId: "defer-handoff",
          facts: { ...acceptedFacts, tomorrowAgreed: true },
          tags: ["evidence"],
          refusedFacts: { handoffAccepted: false, unresolvedDelivery: true },
        }),
      O(
        "skip-handoff",
        "先说我这边差不多了",
        "没交代的部分会跟到门口",
        [1, 0, 6, 0],
        "对方没说收到，你也没把清单打开。差不多，不等于真的交清了。",
        { facts: { handoffAccepted: false, unresolvedDelivery: true } },
      ),
    ],
    (s) => pendingTasks(s).length > 0,
  ),
  E(
    14,
    "handoff-proven",
    "记录齐了，差对方最后一句",
    "清单已经安排妥，版本和链接也都留着。你需要的是确认，不是再重做一遍文件。",
    [
      O(
        "confirm-handoff",
        "请对方确认文件和交接安排",
        "把这一步做完，后面不必靠猜",
        [2, 0, -3, 0],
        "对方逐项确认：做完的收到，改期的照约定。你这边没有悬空的交接。",
        { facts: { ...acceptedFacts }, tags: ["evidence"] },
      ),
      O(
        "overcheck",
        "再花一轮时间重新查权限",
        "更放心，但别人已经能打开了",
        [5, 0, -2, 2],
        "权限又查了一遍，没有发现新问题。对方确认收到。",
        { facts: { ...acceptedFacts } },
      ),
      O(
        "assume",
        "有发送记录就算了，先不等确认",
        "证据能澄清，不能保证对方已经拿到",
        [1, 0, 1, 0],
        "你保留着发送记录，没有拿到这次交接的确认。",
        { facts: { handoffAccepted: false, unresolvedDelivery: true } },
      ),
    ],
    (s) => pendingTasks(s).length === 0 && !!f(s, "receipt"),
    { because: ["receipt"] },
  ),
  E(
    14,
    "handoff-no-proof",
    "活有去处，交接还没说清",
    "任务已经做完、改期或明确交给别人，但这些信息还散在不同聊天框。汇总的人不一定都知道。",
    [
      O(
        "collect-handoff",
        "把文件、负责人和改期约定放一起",
        "整理事实，不再给自己接新活",
        [3, 0, -4, 1],
        "对方看完统一说明，确认了每一项的去处。",
        { facts: { ...acceptedFacts, receipt: true }, tags: ["evidence"] },
      ),
      O(
        "call-handoff",
        "打个电话，当面口头确认",
        "少写一条长消息，多花几分钟",
        [5, 1, -3, 2],
        "电话里把交接讲清，对方明确答应接下。",
        { facts: { ...acceptedFacts } },
      ),
      O(
        "leave-chat",
        "大家应该都懂，先不解释",
        "省时间，但你还没听到明确收到",
        [1, 0, 4, 0],
        "你关掉聊天框。对方又发来一句：“所以今晚我该找谁接？”",
        { facts: { handoffAccepted: false, unresolvedDelivery: true } },
      ),
    ],
    (s) => pendingTasks(s).length === 0 && !f(s, "receipt"),
  ),
);
const teamEligible = (s) => !!f(s, "partnerAgreed");
nodes.push(
  E(
    15,
    "shutdown-ready",
    "这次，可以关电脑了",
    "交接的人已经点头，清单也没有悬着。你把鼠标移到关机按钮，旁边有人开始拉书包拉链。",
    [
      O(
        "shut",
        "关机，拿包去门口",
        "今天的事先留在今天的清单里",
        [1, 0, 0, -1],
        "屏幕黑了。你拿着包走到门口，工位那边的屏幕已经黑了。",
        { computerOn: false, location: "door", facts: { closedClean: true } },
      ),
      O(
        "extra-check",
        "不放心，再看一遍消息再关",
        "可以更安心，也可能只是多等几分钟",
        [4, 0, -1, 2],
        "你翻完消息，没发现新的待办，才关机去门口。",
        { computerOn: false, location: "door", facts: { closedClean: true } },
      ),
      O(
        "call-partner",
        "喊约好的搭子，一起收包",
        "得真的约过，不能凭关系高就组队",
        [2, 5, 0, 0],
        "你招呼了搭子，他说收完这边就来门口会合。",
        {
          require: teamEligible,
          locked: "此前约好一起走",
          computerOn: false,
          location: "door",
          facts: { partnerReminded: true, closedClean: true },
        },
      ),
    ],
    (s) => !!f(s, "handoffAccepted"),
    { because: ["handoffAccepted"] },
  ),
  E(
    15,
    "shutdown-debt",
    "包拿起来了，清单没合上",
    (s) =>
      `你正准备关机，清单上还挂着${pendingTasks(s)
        .map((t) => t.title)
        .join("、")}。现在关，后面仍得有人把它处理掉。`,
    [
      O(
        "close-anyway",
        "先关了，看看能不能混过去",
        "关机不等于清账，门口可能要转身",
        [1, 0, 5, -1],
        "电脑关了，没交的文件还没交。你先拎包到了门口。",
        {
          computerOn: false,
          location: "door",
          facts: { unresolvedDelivery: true },
        },
      ),
      (s) =>
        O(
          "finish-before-close",
          "做完并交清，再关机拿包",
          "该花多少时间，就花多少",
          [units(s) + 3, 0, -4, units(s)],
          "你先补完清单、确认交付，才关机走向门口。",
          {
            tasks: clear(s),
            computerOn: false,
            location: "door",
            facts: {
              ...acceptedFacts,
              reportSubmitted: true,
              delivered: true,
              receipt: true,
            },
            tags: ["evidence"],
          },
        ),
      (s) =>
        deferChoice(s, "all", "关机前，商量剩余项明早处理", {
          optionId: "agree-before-close",
          computerOn: false,
          location: "door",
          facts: { ...acceptedFacts, tomorrowAgreed: true },
          refusedFacts: { unresolvedDelivery: true },
          refusedFeedback:
            "老板没同意改期。你先关机拿包到了门口，但这几项仍然欠着。",
        }),
    ],
    (s) => !f(s, "handoffAccepted") && pendingTasks(s).length > 0,
  ),
  E(
    15,
    "shutdown-unconfirmed",
    "活没欠，确认还欠一句",
    "你已经没有未安排的任务，但交接的人没明确收到。鼠标停在关机按钮上，聊天框还开着。",
    [
      O(
        "confirm-close",
        "等对方确认，关机走人",
        "多花两分钟，少留一个问号",
        [2, 0, -2, 0],
        "对方回了确认，你关掉电脑，拎包往门口走。",
        {
          computerOn: false,
          location: "door",
          facts: { ...acceptedFacts },
          tags: ["evidence"],
        },
      ),
      O(
        "close-no-ack",
        "先关机，路上再说",
        "可能顺利离开，也可能得回来补说明",
        [1, 0, 3, -1],
        "屏幕灭了，对方仍没确认。你先到了门口。",
        {
          computerOn: false,
          location: "door",
          facts: { unresolvedDelivery: true },
        },
      ),
      O(
        "send-once-more",
        "再发一条完整交接，然后等回复",
        "慢一点，这次把去处写全",
        [4, 0, -3, 1],
        "完整交接发出去，对方确认接下。你关机，包带甩上肩。",
        {
          computerOn: false,
          location: "door",
          facts: { ...acceptedFacts, receipt: true },
          tags: ["evidence"],
        },
      ),
    ],
    (s) => !f(s, "handoffAccepted") && pendingTasks(s).length === 0,
  ),
);
const looseScope = (s) =>
  !!(f(s, "meetingUnresolved") || f(s, "meetingFollowup"));
const debtAtDoor = (s) => pendingTasks(s).length > 0 || looseScope(s);
nodes.push(
  E(
    16,
    "door-debt",
    "“等下，你答应的那项呢？”",
    (s) =>
      pendingTasks(s).length
        ? `老板在门口叫住你。${pendingTasks(s)
            .map((t) => t.title)
            .join("、")}还没有完成，也没人同意替你接下。这次不是无端拦人。`
        : "你缺席会议后一直没确认范围。老板在门口问的是那条还挂着的“待本人确认”。",
    [
      (s) =>
        O(
          "return-now",
          "回工位，补完清单并说清范围",
          "电脑真的要重新开，花的时间照算",
          [units(s) + 5, 0, -4, units(s) + 2],
          "你回到工位开了电脑，把剩余项补齐，说明范围后得到确认。",
          {
            tasks: clear(s),
            computerOn: true,
            location: "desk",
            facts: {
              ...acceptedFacts,
              reportSubmitted: true,
              delivered: true,
              receipt: true,
              callback: true,
              callbackResolved: true,
              callbackReason: "在门口被追问尚未解决的任务或会议范围",
            },
          },
        ),
      (s) =>
        deferChoice(s, "all", "站在门口商量，明早交行不行", {
          optionId: "negotiate-door",
          location: "door",
          facts: { ...acceptedFacts, tomorrowAgreed: true },
        }),
      O(
        "return-voluntarily",
        "不想再绕，自己回去收尾",
        "先承认没完，下一步按余量补齐",
        [2, 0, -1, 1],
        "你把包放回椅子边，重新开机。那几行待办还在等你。",
        {
          computerOn: true,
          location: "desk",
          facts: {
            workingLate: true,
            meetingUnresolved: false,
            meetingFollowup: false,
          },
        },
      ),
      O(
        "bluff-door",
        "说都好了，试着再走两步",
        "有实际欠项，嘴硬不会把它变没",
        [1, 0, 8, 1],
        "老板把待办指给你看：“先回来处理完。”你只好把电脑重新打开。",
        {
          computerOn: true,
          location: "desk",
          facts: {
            callback: true,
            callbackReason: "带着未处理事项声称已经全部完成",
          },
        },
      ),
    ],
    debtAtDoor,
  ),
  E(
    16,
    "door-unconfirmed",
    "关机后，手机又亮了",
    "你没有欠着没安排的活，但对方还没拿到完整交接。消息写着：“你说的那份，我这边怎么找？”",
    [
      O(
        "phone-link",
        "手机上补发链接和说明",
        "不用开机也能解决的，就别回去演一遍",
        [3, 0, -2, 0],
        "对方在手机那头确认收到。你站在门口就补清了，没白开一次机。",
        { facts: { ...acceptedFacts, receipt: true }, tags: ["evidence"] },
      ),
      O(
        "reopen",
        "回去开电脑，当面确认",
        "稳妥一点，确实要多绕一趟",
        [6, 0, -3, 2],
        "你回工位开机，对方确认收到后，你又把包拿起来。",
        {
          computerOn: true,
          location: "desk",
          facts: {
            ...acceptedFacts,
            callback: true,
            callbackResolved: true,
            callbackReason: "关机后才补交付确认",
          },
        },
      ),
      O(
        "ignore-link",
        "假装没看到，先朝电梯走",
        "消息问的是具体文件，不会自动解决",
        [1, 0, 5, 0],
        "对方直接打来电话。你被叫回工位，电脑又亮了。",
        {
          computerOn: true,
          location: "desk",
          facts: {
            callback: true,
            callbackReason: "离场时没有回复具体的交接问题",
          },
        },
      ),
    ],
    (s) =>
      !debtAtDoor(s) &&
      (!f(s, "handoffAccepted") || !!f(s, "unresolvedDelivery")),
  ),
  E(
    16,
    "door-clear",
    "门口有人叫你，先别紧张",
    "老板从走廊抬头：“明天那份按说好的来就行。”你手上有交接确认，今天也没留下没人接的活。",
    [
      O(
        "goodbye",
        "回一句好，正常道别",
        "不用听到名字就自动返回工位",
        [1, 0, 0, -1],
        "老板挥挥手，没给你派新活。你往电梯走。",
        { location: "door", facts: { doorCleared: true } },
      ),
      O(
        "confirm-tomorrow",
        "再确认一下明天的时间",
        "多说两句，今晚不自动接新活",
        [2, 0, -1, 0],
        "明天的时间对齐了。今晚的清单没有因此重新打开。",
        { location: "door", facts: { doorCleared: true } },
      ),
      O(
        "linger",
        "陪领导多聊几句再走",
        "可以聊，但别把客气当免费时间",
        [5, 2, -1, 2],
        "聊了几句周末堵车，没人加新活，就是你多站了一会儿。",
        { location: "door", facts: { doorCleared: true } },
      ),
    ],
    (s) =>
      !debtAtDoor(s) &&
      !!f(s, "handoffAccepted") &&
      !f(s, "unresolvedDelivery"),
    { because: ["handoffAccepted"] },
  ),
);
const finalFacts = {
  unresolvedDelivery: false,
  meetingUnresolved: false,
  meetingFollowup: false,
};
nodes.push(
  E(
    17,
    "last-callback",
    "电脑第二次亮了",
    "这次回来有明确原因：要么任务没收尾，要么交接没说清。你已经坐回工位，最后一步得把这件事交代完。",
    [
      (s) =>
        O(
          "finish-callback",
          "补完剩余，确认后第二次出门",
          "欠多少补多少，收到确认再关机",
          [units(s) + 3, 0, -4, Math.max(1, units(s))],
          "剩余项补齐，对方确认接下。你关掉第二次打开的电脑，终于刷开门禁。",
          {
            tasks: clear(s),
            computerOn: false,
            location: "outside",
            facts: {
              ...finalFacts,
              callbackResolved: true,
              reportSubmitted: true,
              delivered: true,
            },
          },
        ),
      (s) =>
        deferChoice(s, "all", "跟老板商量，剩余项改到明早再走", {
          optionId: "defer-callback",
          computerOn: false,
          location: "outside",
          facts: {
            ...finalFacts,
            callbackResolved: true,
            tomorrowAgreed: true,
          },
          onRefused: { computerOn: true, location: "desk" },
          refusedFacts: { workingLate: true },
          refusedFeedback:
            "老板没同意改期。你留下逐项补完再走，实际余量会计入战绩的收尾清单。",
        }),
      O(
        "stay-callback",
        "不再绕，留下把这次收尾做完",
        "结算会逐项列出实际加班内容",
        [1, 0, 0, 1],
        "你把包放下，照清单留下收尾。剩多少、补什么，都会记到离开时间里。",
        { location: "desk", facts: { workingLate: true } },
      ),
    ],
    (s) => !!f(s, "callback"),
    { because: ["callback"] },
  ),
  E(
    17,
    "last-open",
    "没完的活，今天得有个交代",
    "你是自己转身回来的，不是被无端扣住。答应的事项还在清单上，现在补完或谈妥改期，才有真正的下班。",
    [
      (s) =>
        O(
          "finish-last",
          "现在补完，交清就走",
          "按清单余量花时间，不再扩大范围",
          [units(s) + 2, 0, -3, units(s)],
          "你逐项补完，对方确认接下。电脑关了，这次清单也清了。",
          {
            tasks: clear(s),
            computerOn: false,
            location: "outside",
            facts: { ...finalFacts, reportSubmitted: true, delivered: true },
          },
        ),
      (s) =>
        deferChoice(s, "all", "最后商量一次，能否明确明早交", {
          optionId: "defer-last",
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, tomorrowAgreed: true },
          onRefused: { computerOn: true, location: "desk" },
          refusedFacts: { workingLate: true },
          refusedFeedback:
            "老板说今晚要用，改期没谈成。你留下按清单补齐，实际收尾时间会逐项列出。",
        }),
      O(
        "overtime",
        "今晚不躲了，留下做到交清",
        "今天先不走了，照剩下的活算时间",
        [1, 0, 0, 1],
        "你留在工位把欠项补完。战绩会列出每一项占了多少收尾时间。",
        { location: "desk", facts: { workingLate: true } },
      ),
    ],
    (s) => !f(s, "callback") && pendingTasks(s).length > 0,
  ),
  E(
    17,
    "last-partner",
    "搭子在电梯口等你",
    "你们确实约过一起走。你的交接收好了，对方却可能还在收尾，尤其是替你接过活的时候。",
    [
      O(
        "together",
        "说好了就一起走，等他收完",
        "等待计入下班时间，排名里同分钟离开",
        [1, 7, 0, -1],
        "你给搭子发了到门口的消息，等两边都收好才一起刷门禁。",
        {
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, leaveTogether: true },
        },
      ),
      O(
        "solo",
        "跟他说一声，今天先走",
        "可以不等，别让人空等你",
        [1, -3, 0, 0],
        "你说自己先走，对方回了好。你们没有被算成同一班电梯。",
        {
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, leaveTogether: false },
        },
      ),
      O(
        "snack",
        "请搭子到楼下吃点东西，一起收工",
        "多花几分钟，人情也有来有往",
        [4, 12, 0, -2],
        "你们约好楼下碰头，等双方收完再一起离开。今晚先聊吃什么。",
        {
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, leaveTogether: true },
        },
      ),
    ],
    (s) =>
      !f(s, "callback") &&
      pendingTasks(s).length === 0 &&
      !!f(s, "partnerAgreed"),
    { because: ["partnerAgreed"] },
  ),
  E(
    17,
    "last-solo",
    "电梯门开着，这回真能走",
    "今天没有约谁一起撤。清单里的事都有去处，交接也说清了，现在不需要再找个理由证明自己很忙。",
    [
      O(
        "leave",
        "进电梯，今天到这儿",
        "正常离开，不再给自己找活",
        [1, 0, 0, -1],
        "门禁滴了一声。你走进电梯，今天的工作就留在身后。",
        { computerOn: false, location: "outside", facts: { ...finalFacts } },
      ),
      O(
        "say-thanks",
        "给今天帮过忙的人发声谢谢再走",
        "多一分钟，不影响已经收好的交接",
        [2, 5, 0, -1],
        "谢意发出去了。你把手机收进包，按下电梯按钮。",
        {
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, saidThanks: true },
        },
      ),
      O(
        "wait-empty",
        "等一班没人的电梯，独享安静",
        "没必要，但安静也挺值",
        [4, 0, 0, -5],
        "你没再回工位。等来一班空电梯，一个人安静地下楼。",
        {
          computerOn: false,
          location: "outside",
          facts: { ...finalFacts, rested: true },
        },
      ),
    ],
    (s) =>
      !f(s, "callback") &&
      pendingTasks(s).length === 0 &&
      !f(s, "partnerAgreed"),
  ),
);
const externalReport = (s) =>
  ["deferred", "delegated"].includes(task(s, "report").status) &&
  task(s, "report").remaining > 0;
const externalChoices = [
  O(
    "confirm-arrangement",
    "把已确认的交期或接手人再说明一次",
    "今晚能交的先交，没做完的不假装成品",
    [2, 0, -2, 0],
    "你转发了原约定，汇总的人确认按这个安排；日报未完成的部分仍有明确去处。",
    {
      facts: { externalReportConfirmed: true, scopeReceipt: true },
      tags: ["evidence"],
    },
  ),
  (s) =>
    O(
      "reclaim-report",
      "还是自己接回，补完这份日报",
      "撤回原安排，实际做完再交",
      [task(s, "report").remaining + 3, 0, -2, task(s, "report").remaining],
      "你把原安排说清，接回剩余内容，实际补完后发出链接并得到确认。",
      {
        tasks: [
          {
            type: "reclaim",
            id: "report",
            agreement: "玩家与原接手人或老板确认：改为自己今晚补完",
          },
          { type: "complete", id: "report" },
        ],
        facts: { reportSubmitted: true, receipt: true, delivered: true },
        tags: ["evidence"],
      },
    ),
  O(
    "partial-report",
    "先把已完成的部分标成草稿给他",
    "能看多少说多少，不宣称已经最终交付",
    [2, 0, 1, 0],
    "草稿明确标了未完成部分与原约定，对方先拿现有内容做准备；对方回：“那我先用这部分，剩下按说好的来。”",
    { facts: { draftSent: true, externalReportConfirmed: true } },
  ),
];
nodes.push(
  E(
    9,
    "report-arranged",
    "日报已另有约定，汇总人还不知道",
    (s) =>
      task(s, "report").status === "delegated"
        ? "你把日报余下的部分明确交给了同事，但汇总的人还来找你要成品。该说清是谁接手，不能把有人负责说成已经做完。"
        : "日报余下的部分已经明确约好明早交，汇总的人却还按原先的时间来问。需要同步新约定，不是再编一句马上好。",
    externalChoices,
    externalReport,
  ),
  E(
    10,
    "arrangement-question",
    "“那今晚这一格怎么填？”",
    "日报没完成的部分已有明确安排。汇总的人要知道今天先写谁、写到哪一步，你可以把事实说清，也可以接回自己补。",
    externalChoices,
    (s) => externalReport(s) && !remaining(s, "data"),
  ),
);
// 少数捷径要靠具体经历解锁；不是统一用“关系达到某数值”代替人情。
const helperAvailable = (s) =>
  (f(s, "helpedLin") && !f(s, "linHelpUsed")) ||
  (f(s, "helpedChen") && !f(s, "chenHelpUsed"));
function delegateOne(s, id) {
  const who = f(s, "helpedLin") && !f(s, "linHelpUsed") ? "lin" : "chen";
  const t = task(s, id),
    whoName = who === "lin" ? "小林" : "小陈";
  return O(
    "delegate-favor",
    `请${whoName}接手这一项`,
    "要兑现过帮忙且尚未用过回帮；对方会因此晚走",
    [3, 3, -1, 0],
    `${whoName}明确接下了${t.title}，你把源文件与交期一并交过去；这份稿由他继续做，交付时间也说清了。`,
    {
      require: helperAvailable,
      locked: "此前帮过小林或小陈，且尚未用掉回帮",
      tasks: [
        {
          type: "delegate",
          id,
          assignee: who,
          agreement: `${whoName}明确接手${t.title}并负责交付`,
        },
      ],
      facts: {
        [who === "lin" ? "linHelpUsed" : "chenHelpUsed"]: true,
        helper: who,
      },
      coworkers: { [who]: t.remaining + 3 },
    },
  );
}
for (const e of nodes) {
  if (e.node === 4)
    e.options.push((s) =>
      O(
        "delegate-ppt",
        "问小林能不能接下这几页",
        "你先帮过她，才有这个开口的底气；会占她的下班时间",
        [3, 2, -1, 0],
        "小林看过范围后明确接下。你把源文件和交期发全，这几页仍有具体的负责人。",
        {
          require: (s) => !!f(s, "helpedLin") && !f(s, "linHelpUsed"),
          locked: "此前帮过小林，且尚未用掉回帮",
          tasks: [
            add(
              "ppt",
              "老板临时追加的汇报页",
              DIFFICULTIES[s.difficulty].ppt,
              8,
            ),
            {
              type: "delegate",
              id: "ppt",
              assignee: "lin",
              agreement: "小林明确接手汇报页并负责交付",
            },
          ],
          facts: {
            pptDecision: "accepted",
            pptDelegated: true,
            linHelpUsed: true,
            helper: "lin",
          },
          coworkers: { lin: DIFFICULTIES[s.difficulty].ppt + 3 },
        },
      ),
    );
  if (e.node === 8 && e.id !== "hidden-clear")
    e.options.push((s) =>
      delegateOne(
        s,
        e.id === "ppt-due" ? "ppt" : e.id === "cache-due" ? "data" : "report",
      ),
    );
  if (e.node === 13 && e.id !== "all-accounted")
    e.options.push((s) => delegateOne(s, pendingTasks(s)[0].id));
  if (e.id === "meeting-happening")
    e.options.push((s) =>
      O(
        "chen-listens",
        "请小陈代听，只回与你有关的结论",
        "他答应过回帮，才好替你占这段会时",
        [2, 1, -1, 0],
        "小陈明确答应代听，把与你有关的范围发来；他替你占了会时，自己的收尾只能往后挪一点。",
        {
          require: (s) => !!f(s, "helpedChen") && !f(s, "chenHelpUsed"),
          locked: "此前帮过小陈，且尚未用掉回帮",
          facts: { chenHelpUsed: true, meetingSettled: true, scopeKnown: true },
          coworkers: { chen: DIFFICULTIES[s.difficulty].meeting },
        },
      ),
    );
  if (e.id === "delivery-first")
    e.options.push(
      O(
        "witness-send",
        "带上小陈确认过的口径一起发",
        "他确实确认过，才能引用那条消息",
        [2, 1, -4, 0],
        "你把小陈的口径确认和这次版本一起发出，对方明确收到。",
        {
          require: (s) => !!f(s, "dataWitness"),
          locked: "此前请小陈确认过数据口径",
          facts: { receipt: true, reportSubmitted: true, delivered: true },
          tags: ["evidence"],
        },
      ),
    );
  if (e.id === "no-receipt" || e.id === "door-unconfirmed")
    e.options.push((s) =>
      O(
        "zhou-confirms",
        "请小周试开链接，当场确认",
        "前面约过他帮查链接，才能现在直接叫人",
        [2, 1, -2, 0],
        "小周按之前说好的试开链接，对方也明确确认了位置。你没有重新打包整套文件。",
        {
          require: (s) => !!f(s, "zhouCanCheck"),
          locked: "此前约过小周帮查链接",
          facts: {
            ...(e.id === "door-unconfirmed" ? acceptedFacts : {}),
            receipt: true,
            reportSubmitted: true,
            delivered: true,
          },
          coworkers: { zhou: 2 },
          tags: ["evidence"],
        },
      ),
    );
  if (e.id === "own-pace")
    e.options.push(
      O(
        "shortcut-check",
        "用小周教的入口查最新文件",
        "这是入口捷径，不是跳过数据校验",
        [2, 1, -1, -1],
        "入口里能直接看到最新版本与权限，你把位置记好了；未完成的数据校验依旧留着。",
        {
          require: (s) => !!f(s, "zhouTip"),
          locked: "此前小周告诉过你快捷入口",
          facts: { linkChecked: true },
        },
      ),
    );
  if (e.id === "handoff-no-proof")
    e.options.push(
      O(
        "witness-handoff",
        "连口径确认一起整理交接",
        "引用真有的确认，不能拿它盖掉其他待办",
        [2, 1, -3, 0],
        "交接和小陈确认的口径放到了一起，对方确认接下。",
        {
          require: (s) => !!f(s, "dataWitness"),
          locked: "此前请小陈确认过数据口径",
          facts: { ...acceptedFacts, receipt: true },
          tags: ["evidence"],
        },
      ),
    );
}
const peopleByEvent = {
  "lin-request": ["lin"],
  "chen-request": ["chen"],
  "zhou-break": ["zhou"],
  "meeting-happening": ["lin", "zhou", "chen", "wang"],
  "meeting-skipped": ["zhou"],
  "lin-return": ["lin"],
  "chen-return": ["chen"],
  "no-return": ["lin", "chen"],
  "hidden-lin-favor": ["lin"],
  "hidden-chen-favor": ["chen"],
};
export const events = nodes.map((e) => ({
  ...e,
  people: (s) =>
    e.id === "last-partner" ? [s.facts.partner] : peopleByEvent[e.id] || [],
  reviews: (s) =>
    pendingTasks(s)
      .filter((t) => t.reviewAt === e.node)
      .map((t) => t.id),
  tags: [...(e.tags || []), ...(e.hidden ? ["hidden"] : [])],
}));

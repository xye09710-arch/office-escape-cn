import { DIFFICULTIES, coworkerTimes } from "./rules.js";
import { completion } from "./tasks.js";
export const STORY_VERSION = 3;
export const STAGES = ["收尾冲刺", "临时加戏", "下班拉锯", "最后一公里"];
export const COUNTS = [4, 5, 5, 4];
export function stageOf(turn) {
  return turn < 4 ? 0 : turn < 9 ? 1 : turn < 14 ? 2 : 3;
}
export function createState(difficulty = "normal") {
  if (!Object.hasOwn(DIFFICULTIES, difficulty)) throw new Error("未知难度");
  const tasks = [
    {
      id: "report",
      title: "今天的经营日报",
      total: 12,
      remaining: 8,
      status: "pending",
      createdAt: -1,
      source: "start",
      reviewAt: 9,
    },
  ];
  const state = {
    version: STORY_VERSION,
    runId: crypto.randomUUID(),
    difficulty,
    turn: 0,
    time: 1020,
    work: completion(tasks),
    suspicion: 15,
    relation: 45,
    fatigue: 10,
    tasks,
    facts: {},
    factSources: {},
    flags: [],
    seen: [],
    history: [],
    location: "desk",
    computerOn: true,
    coworkerLoad: { lin: 0, zhou: 0, chen: 0, wang: 0 },
  };
  state.coworkerReadyAt = Object.fromEntries(
    coworkerTimes(state).map((p) => [p.id, p.time]),
  );
  return state;
}
export const clock = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

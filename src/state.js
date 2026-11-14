import {DIFFICULTIES} from './rules.js';
export const STAGES = ['收尾冲刺', '临时加戏', '下班拉锯', '最后一公里'];
export const COUNTS = [4, 5, 5, 4];
export function stageOf(turn) { return turn < 4 ? 0 : turn < 9 ? 1 : turn < 14 ? 2 : 3; }
export function createState(difficulty = 'normal') {
  if(!DIFFICULTIES[difficulty]) throw new Error('未知难度');
  return { version: 2, runId: crypto.randomUUID(), difficulty, turn: 0, time: 1020, work: 28, suspicion: 15, relation: 45, fatigue: 10, flags: [], seen: [], history: [] };
}
export const clock = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

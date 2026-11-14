import { stageOf } from './state.js';
import { events } from './events.js';
export function availableEvents(s) { return events.filter(e => e.stage === stageOf(s.turn) && !s.seen.includes(e.id) && (!e.when || e.when(s))); }
export function currentEvent(s) { const pool=availableEvents(s); const weighted=pool.flatMap(e=>Array(e.hidden?3:e.route?2:1).fill(e)); return weighted[(s.storyKey || 0)%weighted.length]; }
export function unlocked(option,s) { return !option.require || option.require(s); }
export function choose(s,eventId,index) {
  if(s.turn >= 18) throw new Error('本局已经结束');
  const event=currentEvent(s), option=event?.options[index];
  if(!event || event.id!==eventId || !option || !unlocked(option,s)) throw new Error('当前选项不可用');
  const next=structuredClone(s);
  for(const [key,value] of Object.entries(option.effect || {})) next[key] = key==='time' ? next[key]+value : Math.max(0,Math.min(100,next[key]+value));
  next.flags=[...new Set([...next.flags,...(option.flags || [])])];
  next.storyKey=((s.storyKey||0)*31+index+1)>>>0; next.turn++; next.seen.push(event.id); next.history.push({title:event.title,choice:option.label,time:next.time});
  return next;
}

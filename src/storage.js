import {createState} from './state.js';
import {choose} from './engine.js';
import {outcome} from './rules.js';
import {cards,earnedCards} from './achievements.js';
const KEY='office-escape-v2';
const empty=()=>({version:2,session:null,cards:[],runs:0,endings:[]});
export function restoreState(raw){
 if(!raw || !Array.isArray(raw.history) || raw.history.length>18 || typeof raw.runId!=='string') throw new Error('存档格式不正确');
 let s=createState(raw.difficulty);s.runId=raw.runId;
 for(const h of raw.history)s=choose(s,h.eventId,h.index);
 if(s.turn!==raw.turn)throw new Error('存档进度不一致');
 return s;
}
export function load(storage){try{const p=JSON.parse(storage.getItem(KEY));if(!p)return {profile:empty()};if(p.version!==2||!Array.isArray(p.cards)||!Array.isArray(p.endings)||!Number.isInteger(p.runs)||p.runs<0)throw Error();const profile={...empty(),cards:p.cards.filter(id=>cards.some(c=>c.id===id)),endings:p.endings.filter(id=>typeof id==='string'),runs:p.runs,session:p.session?restoreState(p.session):null};return {profile};}catch{return {profile:empty(),warning:'本地存档无法读取，本局可重新开始。原存档尚未覆盖。'};}}
export function persist(storage,profile,state){
 const next={...profile,session:state,cards:[...profile.cards],endings:[...profile.endings]};let newly=[];
 if(state?.turn===18&&profile.session?.runId!==state.runId || state?.turn===18&&profile.session?.turn!==18){const r=outcome(state),earned=earnedCards(state,r);newly=earned.filter(id=>!next.cards.includes(id));next.cards=[...new Set([...next.cards,...earned])];next.endings=[...new Set([...next.endings,r.id])];next.runs++;}
 try{storage.setItem(KEY,JSON.stringify(next));return {profile:next,newly};}catch{return {profile:next,newly,warning:'浏览器未能保存进度，请保持此页面打开；收藏暂时只在本次页面中有效。'};}
}

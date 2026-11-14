import './style.css';
import {createState,clock,STAGES,stageOf} from './state.js';
import {currentEvent,choose,unlocked} from './engine.js';
let state=null;
const app=document.querySelector('#app');
function render(){
 if(!state){ app.innerHTML=`<main><p>打工人下班生存指南</p><h1>今天必须<br>准时下班</h1><p>电脑可以关，消息关不掉。<br>十八次选择，争取把今晚还给自己。</p><button id="start">开始今天的战斗 →</button></main>`;document.querySelector('#start').onclick=()=>{state=createState();render();};return; }
 const e=currentEvent(state);
 app.innerHTML=`<main><header><strong>${clock(state.time)}</strong><span>${STAGES[stageOf(state.turn)]} · 第 ${state.turn+1} 次决策</span></header><p>完成度 ${state.work} · 怀疑 ${state.suspicion} · 关系 ${state.relation} · 疲劳 ${state.fatigue}</p>${e?`<h1>${e.title}</h1><p>${e.text}</p><section>${e.options.map((o,i)=>`<button data-choice="${i}" ${unlocked(o,state)?'':'disabled'}>${o.label}<small>${o.hint||''}</small></button>`).join('')}</section>`:'<h1>基础引擎已就绪</h1>'}</main>`;
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{state=choose(state,e.id,Number(b.dataset.choice));render();});
}
render();

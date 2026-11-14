import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/events.js';
import {createState,stageOf} from '../src/state.js';
import {currentEvent,choose,unlocked} from '../src/engine.js';
test('事件库具有完整选项、五条主线、条件选项和隐藏事件',()=>{assert.ok(events.length>=45);assert.equal(new Set(events.filter(e=>e.route&&!e.hidden).map(e=>e.route)).size,5);assert.ok(events.filter(e=>e.hidden).length>=5);assert.ok(events.flatMap(e=>e.options).filter(o=>o.require).length>=10);for(const e of events){assert.ok(e.title&&e.text);assert.ok(e.options.length>=3&&e.options.length<=4);}});
test('多策略完整通关，所有事件实际可达',()=>{const seen=new Set();for(let seed=1;seed<=2000;seed++){let r=seed,s=createState();for(let i=0;i<18;i++){const e=currentEvent(s);assert.ok(e);assert.equal(e.stage,stageOf(i));seen.add(e.id);const opts=e.options.map((o,i)=>unlocked(o,s)?i:-1).filter(i=>i>=0);r=(r*1664525+1013904223)>>>0;s=choose(s,e.id,opts[r%opts.length]);}assert.equal(s.turn,18);assert.throws(()=>choose(s,'x',0));}assert.equal(seen.size,events.length);});

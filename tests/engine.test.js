import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,stageOf} from '../src/state.js';
import {choose,currentEvent} from '../src/engine.js';
test('四阶段边界为4、5、5、4',()=>assert.deepEqual(Array.from({length:18},(_,i)=>stageOf(i)),[0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3]));
test('决策不可变地更新状态并拒绝过期事件',()=>{const s=createState(),e=currentEvent(s),n=choose(s,e.id,0);assert.equal(s.turn,0);assert.equal(n.turn,1);assert.ok(n.work>s.work);assert.throws(()=>choose(n,e.id,0));});

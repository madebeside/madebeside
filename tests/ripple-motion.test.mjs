import test from 'node:test';
import assert from 'node:assert/strict';
import {rippleSample} from '../client/archive/ripple-motion.js';
test('pointer waves decay fully and remain bounded when several overlap',()=>{
 const waves=Array.from({length:8},()=>({x:0,y:0,time:0}));
 assert.deepEqual(rippleSample(0,0,3,waves),{displacement:0,energy:0});
 assert.deepEqual(rippleSample(0,0,-1,waves),{displacement:0,energy:0});
 for(let t=0;t<2;t+=.05){const s=rippleSample(25,25,t,waves);assert.ok(Number.isFinite(s.displacement)&&Math.abs(s.displacement)<=1);assert.ok(s.energy>=0&&s.energy<=1);}
});
test('a wave reaches points outward from the pointer before fading',()=>{
 const waves=[{x:0,y:0,time:0}];
 assert.ok(rippleSample(77.5,0,.5,waves).energy>rippleSample(77.5,0,0,waves).energy);
 assert.equal(rippleSample(77.5,0,2,waves).energy,0);
});

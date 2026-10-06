import test from 'node:test';
import assert from 'node:assert/strict';
import {coverRect,pointerForce,springStep,sceneProgress} from '../client/archive/motion.js';
import {selectWork} from '../client/archive/work-data.js';

test('cover crop fills landscape and portrait surfaces without stretching',()=>{
  assert.deepEqual(coverRect(400,200,100,100),{x:-50,y:0,w:200,h:100});
  assert.deepEqual(coverRect(100,200,200,100),{x:0,y:-150,w:200,h:400});
  assert.deepEqual(coverRect(0,0,100,100),{x:0,y:0,w:0,h:0});
});
test('pointer displacement is local, bounded, and absent after pointer leave',()=>{
  assert.deepEqual(pointerForce(120,100,100,100,80,18),{x:-13.5,y:0});
  assert.deepEqual(pointerForce(-1000,-1000,100,100,80,18),{x:0,y:0});
  assert.deepEqual(pointerForce(null,null,100,100,80,18),{x:0,y:0});
  const near=pointerForce(100.01,100.01,100,100,80,18);
  assert.ok(Math.hypot(near.x,near.y)<=18);
});
test('gallery spring settles at the target and remains finite after a long frame',()=>{
  let state={position:0,velocity:0};
  for(let i=0;i<240;i++)state=springStep(state.position,state.velocity,300,1/60);
  assert.ok(Math.abs(state.position-300)<.1);
  assert.ok(Math.abs(state.velocity)<.2);
  const resumed=springStep(0,0,300,20);
  assert.ok(Number.isFinite(resumed.position)&&resumed.position<300);
});
test('scroll scene progress reverses and stays bounded',()=>{
  assert.equal(sceneProgress(0,1000,1000,500),0);
  assert.equal(sceneProgress(1250,1000,1000,500),.5);
  assert.equal(sceneProgress(5000,1000,1000,500),1);
  assert.equal(sceneProgress(1250,1000,1000,500),.5);
});
test('public collection excludes placeholders, invalid entries and duplicate pieces',()=>{
  const pieces=selectWork([{id:'soon',placeholder:true},{id:'gallery',gallery:true},{id:'gallery',gallery:true},{id:'client',kind:'photo',src:'/media/x'},{id:'empty',title:'No media'}]);
  assert.deepEqual(pieces.map(p=>p.id),['gallery','client']);
});

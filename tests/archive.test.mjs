import test from 'node:test';
import assert from 'node:assert/strict';
import {coverRect,pointerForce,springStep,sceneProgress,finishReelDrag} from '../client/archive/motion.js';
import {selectWork,selectFeaturedWork} from '../client/archive/work-data.js';
import {subscribe} from '../client/archive/scheduler.js';
import {watchVideos} from '../client/archive/video-lifecycle.js';

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
test('homepage honors portfolio-only and featured placement before applying the limit',()=>{
  const common={kind:'photo',src:'/media/test'};
  const pieces=selectFeaturedWork([{...common,id:'portfolio',featured:false},{...common,id:'home',featured:true},{...common,id:'home2',featured:true}]);
  assert.deepEqual(pieces.map(p=>p.id),['home','home2']);
});
test('a paused short drag snaps the displayed photograph even when the index is unchanged',()=>{
  const state={position:-80,velocity:3,target:-80,stride:320,drag:true};
  assert.equal(finishReelDrag(state,7,true),0);
  assert.equal(state.position,0);assert.equal(state.velocity,0);assert.equal(state.target,0);assert.equal(state.drag,false);
});
test('a failed renderer leaves healthy subscribers running and invokes its fallback',t=>{
  const saved={window:globalThis.window,document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
  const frames=new Map();let next=0,healthy=0,fallback=false;
  globalThis.window={};globalThis.document=new EventTarget();globalThis.document.hidden=false;
  globalThis.requestAnimationFrame=callback=>{frames.set(++next,callback);return next;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
  const bad=subscribe(()=>{throw Error('Scene failure');},true,()=>{fallback=true;});
  const good=subscribe(()=>healthy++);
  t.after(()=>{bad.remove();good.remove();Object.assign(globalThis,saved);});
  const [id,draw]=frames.entries().next().value;frames.delete(id);draw(100);
  assert.equal(healthy,1);assert.equal(fallback,true);assert.equal(frames.size,1);
});
test('visible looping video resumes after backgrounding while manual playback stays paused',t=>{
  const saved={document:globalThis.document,IntersectionObserver:globalThis.IntersectionObserver};
  const doc=new EventTarget();doc.hidden=false;globalThis.document=doc;let receive;
  globalThis.IntersectionObserver=class{constructor(callback){receive=callback;}observe(){}disconnect(){}};
  const media=loop=>({paused:true,hasAttribute:name=>name==='data-loop'&&loop,pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}});
  const loop=media(true),manual=media(false),cleanup=watchVideos([loop,manual],false);
  t.after(()=>{cleanup();Object.assign(globalThis,saved);});
  receive([{target:loop,isIntersecting:true},{target:manual,isIntersecting:true}]);assert.equal(loop.paused,false);
  doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(loop.paused,true);
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(loop.paused,false);assert.equal(manual.paused,true);
});

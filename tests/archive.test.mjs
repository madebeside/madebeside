import test from 'node:test';
import assert from 'node:assert/strict';
import {coverRect,pointerForce,springStep,sceneProgress,finishReelDrag} from '../client/archive/motion.js';
import {selectWork,selectFeaturedWork} from '../client/archive/work-data.js';
import {subscribe} from '../client/archive/scheduler.js';
import {watchVideos} from '../client/archive/video-lifecycle.js';
import * as motion from '../client/archive/motion.js';
import * as work from '../client/archive/work-data.js';
import * as media from '../client/archive/video-lifecycle.js';

test('showcase playback reports pre-hydration failures and cleans up before a new source',t=>{
  assert.equal(typeof media.createShowcasePlayback,'function');
  const saved={document:globalThis.document,IntersectionObserver:globalThis.IntersectionObserver};
  const doc=new EventTarget();doc.hidden=false;globalThis.document=doc;let observe;
  globalThis.IntersectionObserver=class{constructor(callback){observe=callback;}observe(){}disconnect(){}};
  t.after(()=>Object.assign(globalThis,saved));
  const film=error=>Object.assign(new EventTarget(),{error,paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}});
  const broken=film({code:4});let failures=0;
  const old=media.createShowcasePlayback(broken,{}, {active:true,paused:false},()=>failures++);
  assert.equal(failures,1);observe([{isIntersecting:true}]);assert.equal(broken.paused,true);
  old.dispose();broken.dispatchEvent(new Event('error'));assert.equal(failures,1);
  const fresh=film(null),next=media.createShowcasePlayback(fresh,{}, {active:true,paused:false},()=>failures++);
  observe([{isIntersecting:true}]);assert.equal(fresh.paused,false);assert.equal(failures,1);
  fresh.dispatchEvent(new Event('error'));assert.equal(failures,2);assert.equal(fresh.paused,true);next.dispose();
});

test('scroll showcase selection owns automatic film playback across visibility and reduced motion',()=>{
  const video={paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
  const player=media.createProjectPlayback(video,{active:true,paused:false,visible:true,hidden:false});
  assert.equal(video.paused,false);
  player.update({active:false});assert.equal(video.paused,true);
  player.update({active:true,hidden:true});assert.equal(video.paused,true);
  player.update({hidden:false});assert.equal(video.paused,false);
  player.update({paused:true});assert.equal(video.paused,true);
  player.update({paused:false,visible:false});assert.equal(video.paused,true);
  player.dispose();player.update({visible:true});assert.equal(video.paused,true);
});

test('manual film playback supports play-pause-play while automatic motion stays paused',()=>{
  const video={paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
  const player=media.createProjectPlayback?.(video,{active:true,paused:true,visible:true,hidden:false});
  player?.toggle();assert.equal(video.paused,false);
  player.toggle();assert.equal(video.paused,true);
  player.toggle();assert.equal(video.paused,false);
  player.update({hidden:true});assert.equal(video.paused,true);
  player.update({hidden:false});assert.equal(video.paused,true);
});
test('an offscreen project stops explicit playback and a manually paused film stays paused',()=>{
  const video={paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
  const player=media.createProjectPlayback?.(video,{active:true,paused:false,visible:true,hidden:false});
  assert.equal(video.paused,false);
  player.toggle();assert.equal(video.paused,true);
  player.update({hidden:true});player.update({hidden:false});assert.equal(video.paused,true);
  player.toggle();assert.equal(video.paused,false);
  player.update({visible:false});assert.equal(video.paused,true);
});
test('a failed CMS film without a poster retains an explanation and recovery actions',async()=>{
  const {default:Failure}=await import('../client/archive/ProjectMediaFailure.js');
  const {createElement}=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');
  const html=renderToStaticMarkup(createElement(Failure,{project:{id:'published',title:'Published film',kind:'video',src:'/media/published'}}));
  assert.match(html,/couldn’t load/);assert.match(html,/<button[^>]*>Try again<\/button>/);
  assert.match(html,/href="\/media\/published"/);assert.match(html,/Open film/);
});

test('editorial work preserves published content while excluding the wedding defaults',()=>{
  const rows=work.selectEditorialWork?.([{id:'weddings',gallery:true},{id:'film',vimeoId:'1232712180'},{id:'brand',title:'A public project',kind:'photo',src:'/media/brand.jpg',featured:true}],true);
  assert.deepEqual(rows?.map(row=>row.id),['brand']);
  assert.equal(rows?.[0]?.title,'A public project');
});
test('an empty editorial collection uses explicitly identified placeholders',()=>{
  const rows=work.selectEditorialWork?.([]);
  assert.equal(rows?.length,3);
  assert.ok(rows?.every(row=>row.placeholder===true&&row.src.startsWith('/placeholders/')));
});

test('centered projects resolve to full opacity without drift',()=>{
  assert.deepEqual(motion.projectVisual?.(216,400,800,false,true),{focus:1,opacity:1,scale:1,y:0});
});
test('far projects stay bounded after large scroll jumps',()=>{
  assert.deepEqual(motion.projectVisual?.(3000,400,800),{focus:0,opacity:.225,scale:.97,y:-14});
  assert.deepEqual(motion.projectVisual?.(-3000,400,800),{focus:0,opacity:.225,scale:.97,y:14});
});
test('project focus reverses with scrolling and pauses at full readability',()=>{
  const first=motion.projectVisual?.(600,400,800,false,true);
  assert.equal(first?.opacity,1);
  assert.equal(motion.projectVisual?.(600,400,800,false,false)?.opacity,.225);
  motion.projectVisual?.(-3000,400,800);
  assert.deepEqual(motion.projectVisual?.(600,400,800,false,true),first);
  assert.deepEqual(motion.projectVisual?.(3000,400,800,true),{focus:1,opacity:1,scale:1,y:0});
});
test('the scroll owner advances before scene subscribers even when registered later',t=>{
  const saved={window:globalThis.window,document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
  const frames=new Map();let next=0,position=0,drawn;
  globalThis.window={};globalThis.document=new EventTarget();globalThis.document.hidden=false;
  globalThis.requestAnimationFrame=callback=>{frames.set(++next,callback);return next;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
  const scene=subscribe(()=>{drawn=position;});
  const scroll=subscribe(()=>{position=123;},true,undefined,-10);
  t.after(()=>{scene.remove();scroll.remove();Object.assign(globalThis,saved);});
  const [id,draw]=frames.entries().next().value;frames.delete(id);draw(100);
  assert.equal(drawn,123);
});

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

test('the shared motion clock renders every display frame for smooth scrolling',t=>{
 const saved={window:globalThis.window,document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
 const frames=new Map();let next=0;const samples=[];
 globalThis.window={};globalThis.document=new EventTarget();globalThis.document.hidden=false;
 globalThis.requestAnimationFrame=callback=>{frames.set(++next,callback);return next;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
 const scene=subscribe(time=>samples.push(time));
 t.after(()=>{scene.remove();Object.assign(globalThis,saved);});
 for(const time of [100,108.33,116.67,125,133.34,141.67,150,158.33,166.68]){
  const [id,draw]=frames.entries().next().value;frames.delete(id);draw(time);
 }
 assert.deepEqual(samples,[100,108.33,116.67,125,133.34,141.67,150,158.33,166.68]);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('a longer page continues the same river instead of stretching earlier bends',async()=>{
  const {riverNodes}=await import('../client/archive/river-geometry.js');
  const short=riverNodes(1200,4000),long=riverNodes(1200,8000);
  assert.deepEqual(long.slice(0,short.length),short);
  assert.ok(short.at(-1).y>=4000);assert.ok(long.at(-1).y>=8000);
  assert.ok(new Set(long.map(point=>point.x)).size>4);
  assert.ok(new Set(long.map(point=>point.width)).size>4);
});
test('river ribbons remain connected and finite on phones and unusual dimensions',async()=>{
  const {riverNodes,riverRibbon}=await import('../client/archive/river-geometry.js');
  for(const [width,height] of [[390,9000],[1440,6500],[0,0],[NaN,Infinity]]){
    const nodes=riverNodes(width,height),outer=riverRibbon(nodes,1.7),inner=riverRibbon(nodes,.35);
    assert.ok(nodes.length>=2);assert.ok(nodes.every(point=>Object.values(point).every(Number.isFinite)));
    assert.ok(outer.startsWith('M '));assert.ok(outer.endsWith(' Z'));
    assert.equal((outer.match(/ C /g)||[]).length,(nodes.length-1)*2);
    assert.ok(!/NaN|Infinity/.test(outer));assert.notEqual(outer,inner);
  }
});
test('cursor icons update at the exact pointer position without trailing or reappearing after leave',async()=>{
  const {createSceneCursorController}=await import('../client/archive/scene-cursor-controller.js');
  const element={style:{},dataset:{}},scene={dataset:{cursor:'▶'}};
  const target={closest:()=>scene};let hit,nativeHidden=false;
  const cursor=createSceneCursorController(element,(x,y)=>{hit=[x,y];return target;},active=>{nativeHidden=active;});
  cursor.move({clientX:210,clientY:320,target});
  assert.deepEqual(element.style,{left:'210px',top:'320px'});
  assert.equal(element.dataset.kind,'play');assert.equal(element.dataset.active,'true');
  assert.equal(nativeHidden,true);
  cursor.move({clientX:901.5,clientY:17.25,target});
  assert.deepEqual(element.style,{left:'901.5px',top:'17.25px'});
  scene.dataset.cursor='Ⅱ';cursor.refresh();assert.equal(element.dataset.kind,'pause');
  assert.deepEqual(hit,[901.5,17.25]);
  cursor.hide();cursor.refresh();assert.equal(element.dataset.active,'false');
  assert.equal(nativeHidden,false);
});
test('existing cursor actions resolve to compact icons rather than text badges',async()=>{
  const {sceneCursorKind}=await import('../client/archive/scene-cursor-controller.js');
  for(const [label,kind] of [['Move','move'],['Drag','move'],['Shift','move'],['Trim','trim'],['Pin','pin'],['Unpin','unpin'],['+','plus'],['↗','arrow'],['▶','play'],['Ⅱ','pause']])assert.equal(sceneCursorKind(label),kind);
});
test('native cursor hiding is restricted to the active custom-cursor scope',async()=>{
  const css=await readFile(new URL('../client/archive/archive.css',import.meta.url),'utf8');
  const hidingRules=[...css.matchAll(/([^{}]+)\{[^{}]*\bcursor\s*:\s*none(?:\s*!important)?[^{}]*\}/g)].map(match=>match[1].trim());
  assert.ok(hidingRules.length>0);
  assert.deepEqual(hidingRules.filter(selector=>!selector.includes('.has-scene-cursor')),[],'Inactive or CSS-hidden icons must leave the native pointer visible.');
});

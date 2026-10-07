import test from 'node:test';
import assert from 'node:assert/strict';
const scenes=await import('../client/archive/scroll-scenes.js').catch(error=>{
  if(error.code==='ERR_MODULE_NOT_FOUND')return {};throw error;
});

test('opening scales at different rates and reverses',()=>{
  assert.equal(typeof scenes.openingState,'function');
  assert.deepEqual(scenes.openingState(0),{textScale:1,backgroundScale:1,uiOpacity:1});
  const end=scenes.openingState(1);
  assert.equal(end.textScale,7);assert.equal(end.backgroundScale,1.65);
  const middle=scenes.openingState(.5);
  assert.ok(middle.textScale>middle.backgroundScale);
  scenes.openingState(1);assert.deepEqual(scenes.openingState(.5),middle);
  assert.deepEqual(scenes.openingState(.8,true),{textScale:1,backgroundScale:1,uiOpacity:1});
});
test('showcase reaches exactly three states across large jumps',()=>{
  assert.equal(typeof scenes.showcaseState,'function');
  for(const [progress,index] of [[0,0],[.5,1],[1,2],[-4,0],[30,2],[NaN,0],[Infinity,2]]){
    const state=scenes.showcaseState(progress);
    assert.equal(state.index,index);assert.ok(Object.values(state).every(Number.isFinite));
    assert.ok(state.local>=0&&state.local<=1);assert.ok(state.playhead>=0&&state.playhead<=1);
  }
  assert.equal(scenes.showcaseState(1/3).index,1);
  assert.equal(scenes.showcaseState(2/3).index,2);
  assert.equal(scenes.showcaseState(.5,1).index,0);
});
test('entrance skips deep links and restored scroll',()=>{
  assert.equal(typeof scenes.shouldEnter,'function');
  const fresh={reduced:false,hash:'',scrollY:0,seen:false};
  assert.equal(scenes.shouldEnter(fresh),true);
  for(const patch of [{reduced:true},{hash:'#project-02'},{scrollY:400},{seen:true}])assert.equal(scenes.shouldEnter({...fresh,...patch}),false);
});
test('denied storage does not prevent entrance completion',()=>{
  assert.equal(typeof scenes.readEntrance,'function');
  const denied={getItem(){throw Error('Denied');},setItem(){throw Error('Denied');}};
  assert.equal(scenes.readEntrance(denied),false);assert.doesNotThrow(()=>scenes.markEntrance(denied));
  const data=new Map(),storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
  assert.equal(scenes.readEntrance(storage),false);scenes.markEntrance(storage);
  assert.equal(scenes.readEntrance(storage),true);
  assert.equal(data.get('madebeside-entrance-v1'),'seen');
});

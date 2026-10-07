import test from 'node:test';
import assert from 'node:assert/strict';
const model=await import('../client/archive/timeline-selection.js').catch(error=>{if(error.code==='ERR_MODULE_NOT_FOUND')return {};throw error;});
test('a delayed shorter portfolio response preserves a valid timeline selection',()=>{
  assert.equal(typeof model.timelineIndex,'function');
  assert.equal(model.timelineIndex(2,3),2);
  assert.equal(model.timelineIndex(2,2),1);
  assert.equal(model.timelineIndex(2,1),0);
  assert.equal(model.timelineIndex(2,0),-1);
  assert.equal(model.timelineIndex(-1,3),-1);
  assert.equal(model.timelineIndex(NaN,3),-1);
});
test('arrow navigation follows the focused tile after hover selected a different film',()=>{
  assert.equal(typeof model.timelineStep,'function');
  assert.equal(model.timelineStep(0,1,3,1),2);
  assert.equal(model.timelineStep(2,0,3,-1),2);
  assert.equal(model.timelineStep(-1,-1,3,1),0);
  assert.equal(model.timelineStep(-1,-1,3,-1),2);
  assert.equal(model.timelineStep(1,1,0,1),-1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
const navigation=await import('../client/archive/navigation-events.js').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
test('touch and pen leave events cannot dismiss a tap-opened menu',()=>{
 assert.equal(typeof navigation.isMouseHover,'function');
 assert.equal(navigation.isMouseHover('touch',true),false);
 assert.equal(navigation.isMouseHover('pen',true),false);
 assert.equal(navigation.isMouseHover('mouse',false),false);
 assert.equal(navigation.isMouseHover('mouse',true),true);
});

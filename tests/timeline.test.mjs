import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceTimelineTime,initialTimeline,moveTimelineClip,timelineClipAt,timelineTime,timecode,TIMELINE_LENGTH} from '../client/archive/timeline-model.js';
import * as edit from '../client/archive/timeline-model.js';
import {createTimelineHistory,commitTimelineEdit,undoTimelineEdit,redoTimelineEdit} from '../client/archive/timeline-history.js';

test('time input remains finite and bounded, including failed input',()=>{
  assert.equal(TIMELINE_LENGTH,32);
  assert.equal(timelineTime(-100),0);assert.equal(timelineTime(999),32);
  assert.equal(timelineTime(NaN),0);assert.equal(timelineTime(Infinity),0);
  assert.equal(timelineTime('12.5'),12.5);
});
test('drag movement clamps both axes and does not mutate the arrangement',()=>{
  const original=initialTimeline(),before=structuredClone(original);
  const moved=moveTimelineClip(original,original[0].id,999,99);
  assert.equal(moved[0].start,24);assert.equal(moved[0].track,2);
  assert.deepEqual(original,before);
  const outside=moveTimelineClip(moved,moved[0].id,-90,-2);
  assert.equal(outside[0].start,0);assert.equal(outside[0].track,0);
});
test('overlapping clips show the higher track, and gaps show no film',()=>{
  const original=initialTimeline();
  assert.equal(timelineClipAt(original,0)?.id,original[0].id);
  assert.equal(timelineClipAt(original,8)?.id,original[1].id);
  const overlap=moveTimelineClip(original,original[1].id,0,2);
  assert.equal(timelineClipAt(overlap,4)?.id,original[1].id);
  assert.equal(timelineClipAt(overlap,12),null);
  assert.equal(timelineClipAt(overlap,32),null);
});
test('keyboard editing produces the same bounded movement as dragging',()=>{
  const original=initialTimeline(),clip=original[1];
  const moved=moveTimelineClip(original,clip.id,clip.start+.25,clip.track+1);
  assert.equal(moved[1].start,8.25);assert.equal(moved[1].track,2);
  assert.equal(moveTimelineClip(moved,clip.id,moved[1].start-1,-1)[1].start,7.25);
});
test('reset yields fresh independent clips and absent ids are harmless',()=>{
  const first=initialTimeline(),second=initialTimeline();first[0].start=20;
  assert.equal(second[0].start,0);assert.notEqual(first[0],second[0]);
  assert.deepEqual(moveTimelineClip(second,'missing',5,1),second);
});
test('timecode uses a stable 30-frame clock',()=>{
  assert.equal(timecode(0),'00:00:00');assert.equal(timecode(8.5),'00:08:15');
  assert.equal(timecode(32),'00:32:00');assert.equal(timecode(NaN),'00:00:00');
});
test('playback follows wall time at 60, 30 and 20 frames per second',()=>{
  for(const fps of [60,30,20]){
    let position=0;
    for(let frame=0;frame<fps;frame++)position=advanceTimelineTime(position,1000/fps);
    assert.ok(Math.abs(position-1)<.00001,'one wall second at '+fps+'fps advanced '+position);
  }
});
test('irregular frame gaps advance elapsed time and invalid intervals stay safe',()=>{
  let position=4;
  for(const elapsed of [16,17,50,300,17,600])position=advanceTimelineTime(position,elapsed);
  assert.equal(position,5);
  assert.equal(advanceTimelineTime(position,-500),5);
  assert.equal(advanceTimelineTime(position,NaN),5);
  assert.equal(advanceTimelineTime(31,3000),32);
});
test('trimming preserves source bounds and keeps the opposite edge fixed',()=>{
  const original=initialTimeline(),id=original[0].id;
  const left=edit.trimTimelineClip(original,id,'left',2);
  assert.deepEqual([left[0].start,left[0].duration,left[0].offset],[2,6,2]);
  const right=edit.trimTimelineClip(left,id,'right',5);
  assert.deepEqual([right[0].start,right[0].duration,right[0].offset],[2,3,2]);
  const extended=edit.trimTimelineClip(right,id,'left',0);
  assert.deepEqual([extended[0].start,extended[0].duration,extended[0].offset],[0,5,0]);
  assert.equal(edit.trimTimelineClip(left,id,'right',30)[0].duration,6);
  assert.equal(edit.trimTimelineClip(left,id,'left',30)[0].duration,.5);
  assert.equal(original[0].duration,8);
});
test('splitting joins the exact source frames and rejects tiny pieces',()=>{
  const original=initialTimeline(),id=original[0].id;
  const split=edit.splitTimelineClip(original,id,3,'split-1');
  assert.equal(split.length,4);
  assert.deepEqual([split[0].start,split[0].duration,split[0].offset],[0,3,0]);
  assert.deepEqual([split[1].start,split[1].duration,split[1].offset],[3,5,3]);
  assert.equal(timelineClipAt(split,3).id,'split-1');
  assert.equal(edit.splitTimelineClip(original,id,.1,'tiny'),original);
  assert.equal(edit.splitTimelineClip(original,id,9,'outside'),original);
});
test('adding and duplicating use independent instances of bounded real placeholder sources',()=>{
  const original=initialTimeline();
  const added=edit.addTimelineClip(original,'project-02','added',31,2);
  assert.deepEqual([added.at(-1).assetId,added.at(-1).start,added.at(-1).offset],['project-02',24,0]);
  const trimmed=edit.trimTimelineClip(original,original[0].id,'left',2);
  const duplicated=edit.duplicateTimelineClip(trimmed,original[0].id,'duplicate');
  assert.deepEqual([duplicated.at(-1).id,duplicated.at(-1).offset,duplicated.at(-1).duration],['duplicate',2,6]);
  assert.equal(edit.addTimelineClip(original,'missing','bad',0),original);
});
test('hidden layers reveal the next underlying clip and all-hidden yields a gap',()=>{
  const original=initialTimeline();const overlap=moveTimelineClip(original,original[1].id,0,2);
  assert.equal(timelineClipAt(overlap,2,[2]).id,original[0].id);
  assert.equal(timelineClipAt(overlap,2,[0,1,2]),null);
});
test('snapping can be disabled for frame-level editing and shuffle changes the cut',()=>{
  const original=initialTimeline();
  assert.equal(moveTimelineClip(original,original[0].id,.13,0,true)[0].start,.25);
  assert.ok(Math.abs(moveTimelineClip(original,original[0].id,.13,0,false)[0].start-4/30)<.00001);
  const shuffled=edit.shuffleTimelineClips(original);
  assert.notDeepEqual(shuffled,original);assert.deepEqual(shuffled.map(c=>c.id).sort(),original.map(c=>c.id).sort());
  assert.ok(shuffled.every(c=>c.start>=0&&c.start+c.duration<=32));
});
test('undo and redo restore complete edits without creating no-op history',()=>{
  const original=initialTimeline(),base=createTimelineHistory(original);
  const changed=commitTimelineEdit(base,edit.trimTimelineClip(original,original[0].id,'left',2));
  const restored=undoTimelineEdit(changed);
  assert.deepEqual(restored.present,original);
  assert.deepEqual(redoTimelineEdit(restored).present,changed.present);
  assert.equal(commitTimelineEdit(base,structuredClone(original)),base);
  const fork=commitTimelineEdit(restored,edit.shuffleTimelineClips(original));
  assert.equal(fork.future.length,0);assert.deepEqual(base.present,original);
});
test('playback speed scales elapsed time while invalid rates use normal speed',()=>{
  assert.equal(advanceTimelineTime(0,1000,.5),.5);
  assert.equal(advanceTimelineTime(0,1000,2),2);
  assert.equal(advanceTimelineTime(0,1000,NaN),1);
});
test('identical overlaps play the top visible instance and preserve every buried clip',()=>{
  let clips=edit.addTimelineClip(initialTimeline(),'project-01','brand-copy',0,2);
  clips=edit.addTimelineClip(clips,'project-03','campaign-copy',0,2);
  assert.equal(timelineClipAt(clips,0).id,'campaign-copy');
  assert.equal(edit.timelineStackOrder(clips).at(-1).id,'campaign-copy');
  assert.equal(edit.timelineStackOrder(clips).length,clips.length);
  const moved=moveTimelineClip(clips,'brand-copy',2,2);
  assert.equal(timelineClipAt(moved,3).id,'brand-copy');
  assert.equal(edit.timelineStackOrder(moved).at(-1).id,'brand-copy');
  assert.equal(timelineClipAt(clips,0,[2]).id,'project-01');
});
test('minimum-duration films use compact controls at either zoom limit',()=>{
  for(const trackWidth of [766,1586]){
    assert.equal(edit.timelineClipIsCompact({duration:.5},trackWidth),true);
    assert.equal(edit.timelineClipIsCompact({duration:8},trackWidth),false);
  }
  assert.equal(edit.timelineClipIsCompact({duration:2},766),true);
});
test('cancelling a held drag before undo or reset makes its later release inert',async()=>{
  const {takeTimelineGesture}=await import('../client/archive/timeline-gesture.js');
  const initial=initialTimeline(),edited=moveTimelineClip(initial,'project-01',2,0);
  const held={current:{latest:moveTimelineClip(edited,'project-01',4,2),moved:true}};
  let history=commitTimelineEdit(createTimelineHistory(initial),edited);
  const cancelled=takeTimelineGesture(held);
  assert.ok(cancelled.moved);
  history=undoTimelineEdit(history);
  const release=takeTimelineGesture(held);
  if(release?.moved)history=commitTimelineEdit(history,release.latest);
  assert.deepEqual(history.present,initial);
  assert.equal(history.future.length,1);
  assert.deepEqual(redoTimelineEdit(history).present,edited);
  held.current={latest:edited,moved:true};
  takeTimelineGesture(held);history=createTimelineHistory(initialTimeline());
  assert.equal(takeTimelineGesture(held),null);
  assert.deepEqual(history.present,initial);
});

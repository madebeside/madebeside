import test from 'node:test';
import assert from 'node:assert/strict';
import {initialTimeline,moveTimelineClip,timelineClipAt,timelineTime,timecode,TIMELINE_LENGTH} from '../client/archive/timeline-model.js';

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

import {projectPlaceholders} from './project-placeholders.js';

export const TIMELINE_LENGTH=32;
export const TRACK_COUNT=3;
export function timelineTime(value){
  const number=Number(value);
  return Number.isFinite(number)?Math.max(0,Math.min(TIMELINE_LENGTH,number)):0;
}
export function advanceTimelineTime(position,elapsedMilliseconds){
  const elapsed=Number(elapsedMilliseconds);
  return timelineTime(position+(Number.isFinite(elapsed)?Math.max(0,elapsed)/1000:0));
}
export function initialTimeline(){
  return projectPlaceholders.map((project,index)=>({...project,start:index*8,duration:8,track:index%2}));
}
export function moveTimelineClip(clips,id,start,track){
  return clips.map(clip=>clip.id!==id?clip:{...clip,
    start:Math.round(Math.min(TIMELINE_LENGTH-clip.duration,timelineTime(start))*4)/4,
    track:Math.max(0,Math.min(TRACK_COUNT-1,Math.round(Number(track)||0)))
  });
}
export function timelineClipAt(clips,time){
  const position=timelineTime(time);
  return clips.filter(clip=>position>=clip.start&&position<clip.start+clip.duration)
    .sort((a,b)=>b.track-a.track||b.start-a.start)[0]||null;
}
export function timecode(time){
  const frames=Math.floor(timelineTime(time)*30+.00001),seconds=Math.floor(frames/30);
  return [Math.floor(seconds/60),seconds%60,frames%30].map(value=>String(value).padStart(2,'0')).join(':');
}

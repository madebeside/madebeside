import {projectPlaceholders} from './project-placeholders.js';

export const TIMELINE_LENGTH=32;
export const TRACK_COUNT=3;
export function timelineTime(value){
  const number=Number(value);
  return Number.isFinite(number)?Math.max(0,Math.min(TIMELINE_LENGTH,number)):0;
}
export function advanceTimelineTime(position,elapsedMilliseconds,speed=1){
  const elapsed=Number(elapsedMilliseconds);
  const rate=Number.isFinite(Number(speed))?Math.max(.5,Math.min(2,Number(speed))):1;
  return timelineTime(position+(Number.isFinite(elapsed)?Math.max(0,elapsed)/1000*rate:0));
}
export function initialTimeline(){
  return projectPlaceholders.map((project,index)=>({...project,assetId:project.id,sourceDuration:8,offset:0,start:index*8,duration:8,track:index%2}));
}
function snapTime(time,snap=true){return Math.round(timelineTime(time)*(snap?4:30))/(snap?4:30);}
export function moveTimelineClip(clips,id,start,track,snap=true){
  return clips.map(clip=>clip.id!==id?clip:{...clip,
    start:Math.min(TIMELINE_LENGTH-clip.duration,snapTime(start,snap)),
    track:Math.max(0,Math.min(TRACK_COUNT-1,Math.round(Number(track)||0)))
  });
}
export function trimTimelineClip(clips,id,edge,time,snap=true){
  return clips.map(clip=>{
    if(clip.id!==id)return clip;
    const end=clip.start+clip.duration,target=snapTime(time,snap);
    if(edge==='left'){
      const start=Math.max(0,clip.start-clip.offset,Math.min(end-.5,target));
      return {...clip,start,duration:end-start,offset:clip.offset+start-clip.start};
    }
    if(edge==='right')return {...clip,duration:Math.max(.5,Math.min(TIMELINE_LENGTH,clip.start+clip.sourceDuration-clip.offset,target)-clip.start)};
    return clip;
  });
}
export function splitTimelineClip(clips,id,time,newId){
  const clip=clips.find(item=>item.id===id),position=timelineTime(time);
  if(!clip||position-clip.start<.5||clip.start+clip.duration-position<.5)return clips;
  const left=position-clip.start;
  return clips.flatMap(item=>item.id!==id?[item]:[
    {...clip,duration:left},
    {...clip,id:newId,start:position,duration:clip.duration-left,offset:clip.offset+left}
  ]);
}
export function addTimelineClip(clips,assetId,newId,time,track=2){
  const source=initialTimeline().find(clip=>clip.assetId===assetId);if(!source)return clips;
  const [added]=moveTimelineClip([{...source,id:newId}],newId,time,track);
  return [...clips,added];
}
export function duplicateTimelineClip(clips,id,newId){
  const source=clips.find(clip=>clip.id===id);if(!source)return clips;
  const [added]=moveTimelineClip([{...source,id:newId}],newId,source.start+source.duration,(source.track+1)%TRACK_COUNT);
  return [...clips,added];
}
export function shuffleTimelineClips(clips){
  if(!clips.length)return clips;
  const reordered=[...clips.slice(1),clips[0]];let cursor=0,layer=0;
  return reordered.map((clip,index)=>{
    if(cursor+clip.duration>TIMELINE_LENGTH){cursor=0;layer=(layer+1)%TRACK_COUNT;}
    const result={...clip,start:cursor,track:(layer+index)%TRACK_COUNT};cursor+=clip.duration;return result;
  });
}
export function timelineClipAt(clips,time,hiddenTracks=[]){
  const position=timelineTime(time);
  let winner=null;
  for(const clip of clips){
    if(hiddenTracks.includes(clip.track)||position<clip.start||position>=clip.start+clip.duration)continue;
    if(!winner||clip.track>winner.track||clip.track===winner.track&&clip.start>=winner.start)winner=clip;
  }
  return winner;
}
export function timelineStackOrder(clips){
  // Stable sorting puts the latest instance on top when layer and start match.
  return [...clips].sort((a,b)=>a.track-b.track||a.start-b.start);
}
export function timelineClipIsCompact(clip,trackWidth){
  return clip.duration/TIMELINE_LENGTH*trackWidth<64;
}
export function timecode(time){
  const frames=Math.floor(timelineTime(time)*30+.00001),seconds=Math.floor(frames/30);
  return [Math.floor(seconds/60),seconds%60,frames%30].map(value=>String(value).padStart(2,'0')).join(':');
}

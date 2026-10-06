import {useCallback,useEffect,useRef,useState} from 'react';
import {subscribe} from './scheduler';
import {timelineClipAt,timelineTime,timecode,TIMELINE_LENGTH} from './timeline-model';

export default function useTimelineTransport(clips,paused){
  const video=useRef(),section=useRef(),scrubber=useRef(),playhead=useRef(),timeLabel=useRef();
  const clock=useRef(),position=useRef(0),running=useRef(false),arrangement=useRef(clips),activeRef=useRef(clips[0]?.id);
  arrangement.current=clips;
  const [playing,setPlaying]=useState(false),[activeId,setActiveId]=useState(clips[0]?.id);
  const stop=useCallback(()=>{
    running.current=false;clock.current?.setActive(false);video.current?.pause();setPlaying(false);
  },[]);
  const sync=useCallback(()=>{
    const time=position.current,clip=timelineClipAt(arrangement.current,time);
    if(scrubber.current){scrubber.current.value=String(time);scrubber.current.setAttribute('aria-valuetext',timecode(time));}
    if(playhead.current)playhead.current.style.left=(time/TIMELINE_LENGTH*100)+'%';
    if(timeLabel.current)timeLabel.current.textContent=timecode(time);
    if(activeRef.current!==clip?.id){activeRef.current=clip?.id;setActiveId(clip?.id);}
    const element=video.current;
    // Wait for the newly selected source to mount before touching its media clock.
    if(!element||element.dataset.clip!==clip?.id){element?.pause();return;}
    if(element.readyState<1)return;
    const localTime=Math.min(time-clip.start,Math.max(0,element.duration-.04));
    if(Math.abs(element.currentTime-localTime)>.22)element.currentTime=localTime;
    if(running.current&&element.paused){
      const attempt=element.play();attempt?.catch(()=>{if(video.current===element&&running.current)stop();});
    }else if(!running.current&&!element.paused)element.pause();
  },[stop]);
  const seek=useCallback(value=>{position.current=timelineTime(value);sync();},[sync]);
  const toggle=useCallback(()=>{
    if(running.current){stop();return;}
    if(position.current>=TIMELINE_LENGTH)position.current=0;
    running.current=true;setPlaying(true);clock.current?.setActive(true);sync();
  },[stop,sync]);
  useEffect(()=>{
    const subscription=subscribe((time,dt)=>{
      position.current=timelineTime(position.current+dt);sync();
      if(position.current>=TIMELINE_LENGTH)stop();
    },false,stop);
    clock.current=subscription;
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();},{threshold:.05});
    observer.observe(section.current);
    const hide=()=>{if(document.hidden)stop();};
    document.addEventListener('visibilitychange',hide);sync();
    return()=>{subscription.remove();clock.current=null;observer.disconnect();document.removeEventListener('visibilitychange',hide);running.current=false;video.current?.pause();};
  },[stop,sync]);
  useEffect(()=>{sync();},[clips,sync]);
  useEffect(()=>{if(paused)stop();},[paused,stop]);
  return {video,section,scrubber,playhead,timeLabel,playing,active:clips.find(clip=>clip.id===activeId)||null,seek,toggle,stop,sync};
}

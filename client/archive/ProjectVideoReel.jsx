import React,{useEffect,useRef,useState} from 'react';
import {createReelPlayback,reelOffset} from './reel-playback';
import './project-video-reel.css';

export default function ProjectVideoReel({project,active,paused,onTime}){
 const root=useRef(),videos=useRef([]),player=useRef();
 const [focus,setFocus]=useState(0),[playing,setPlaying]=useState(null),[failed,setFailed]=useState(null);
 useEffect(()=>{
  const playback=createReelPlayback(videos.current.slice(),setPlaying,setFailed);player.current=playback;
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)playback.pauseAll();},{threshold:.15});
  const visibility=()=>{if(document.hidden)playback.pauseAll();};
  observer.observe(root.current);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);playback.dispose();player.current=null;};
 },[project.clips]);
 useEffect(()=>{if(!active||paused)player.current?.pauseAll();},[active,paused]);
 const centre=index=>{if(index!==focus)player.current?.pauseAll();setFocus(index);onTime?.(videos.current[index]?.currentTime||0,project.clips[index].duration);};
 const toggle=index=>{setFailed(null);centre(index);player.current?.toggle(index);};
 return <div ref={root} className="project-video-reel" role="group" aria-label={project.title+' video collection'}>
  <div className="reel-stage">
   {project.clips.map((clip,index)=>{
    const offset=reelOffset(index,focus,project.clips.length),centred=offset===0;
    return <figure key={clip.id} className={'reel-card'+(centred?' is-centred':'')} style={{'--reel-offset':offset,'--reel-scale':centred?1:.84}}>
     <video ref={node=>videos.current[index]=node} src={clip.src} poster={clip.poster} data-showcase-film playsInline loop preload="none" aria-label={clip.title}
      onPause={event=>{if(event.currentTarget.paused)setPlaying(value=>value===index?null:value);}} onError={()=>setFailed(index)}
      onTimeUpdate={event=>{if(index===focus)onTime?.(event.currentTarget.currentTime,event.currentTarget.duration||clip.duration);}}/>
     <button type="button" className="reel-play-control" onClick={()=>toggle(index)} aria-label={(playing===index?'Pause':'Play')+' '+clip.title} data-cursor={playing===index?'Ⅱ':'▶'}>
      <span className="reel-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{playing===index?<path d="M7 5h4v14H7zm6 0h4v14h-4z"/>:<path d="M8 4l12 8-12 8z"/>}</svg></span>
     </button>
     {failed===index&&<span className="reel-error" role="status">This video couldn’t play. Try again.</span>}
    </figure>;
   })}
  </div>
  <div className="reel-dots" aria-label="Choose the centre video">{project.clips.map((clip,index)=><button type="button" key={clip.id} aria-label={'Show '+clip.title+' in the centre'} aria-pressed={focus===index} onClick={()=>centre(index)}><span/></button>)}</div>
 </div>;
}

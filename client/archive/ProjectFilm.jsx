import React,{useEffect,useRef,useState} from 'react';
import {createProjectPlayback} from './video-lifecycle';
import ProjectMediaFailure from './ProjectMediaFailure';

export default function ProjectFilm({project,active,paused}){
  const video=useRef(),playback=useRef(),current=useRef({active,paused});
  current.current={active,paused};
  const [playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
  useEffect(()=>{
    const element=video.current;if(!element)return;
    // SSR media can fail before React attaches its error handler.
    if(element.error){setFailed(true);return;}
    const player=createProjectPlayback(element,{...current.current,hidden:document.hidden});playback.current=player;
    const observer=new IntersectionObserver(([entry])=>player.update({visible:entry.isIntersecting}),{threshold:.1});
    const visibility=()=>player.update({hidden:document.hidden});
    observer.observe(element);document.addEventListener('visibilitychange',visibility);
    return()=>{player.dispose();playback.current=null;observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
  },[failed,project.src]);
  useEffect(()=>playback.current?.update({active,paused}),[active,paused]);
  const label=playing?'Pause film':'Play film';
  function toggle(){
    playback.current?.toggle();
  }
  return <figure className="project-film">
    <div className="project-visual" data-project-visual>
      {(project.poster||project.kind==='photo')&&<img className="project-poster" src={project.kind==='photo'?project.src:project.poster} alt={project.alt||'Geometric motion placeholder for '+project.format.toLowerCase()} width="960" height="540" loading="lazy"/>}
      {project.kind==='video'&&!failed&&<video data-project-film ref={video} src={project.src} poster={project.poster} muted loop playsInline preload="metadata" controls={!project.placeholder} aria-label={project.placeholder?project.format+' placeholder':project.title} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false);}}>{project.captions&&<track src={project.captions} kind="captions" srcLang="en" label="English" default/>}</video>}
      {project.placeholder&&!failed&&<button className="project-play" onClick={toggle} aria-label={label+' — '+project.title} data-interactive data-cursor={playing?'Ⅱ':'▶'}><span className="project-play-label"><span aria-hidden="true">{playing?'Ⅱ':'▶'}</span><span>{label}</span></span></button>}
      {failed&&<ProjectMediaFailure project={project} onRetry={()=>setFailed(false)}/>}
    </div>
    <figcaption><span>{project.format}</span><span>{project.placeholder?(failed?'Placeholder poster':'Placeholder'):project.title}</span></figcaption>
  </figure>;
}

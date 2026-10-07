import React,{useEffect,useRef,useState} from 'react';
import {createProjectPlayback} from './video-lifecycle';

export default function ShowcaseFilm({project,active,paused,onTime}){
  const video=useRef(),surface=useRef(),player=useRef();
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    if(project.kind==='photo')return;
    const playback=createProjectPlayback(video.current,{active,paused,visible:false,hidden:document.hidden});
    player.current=playback;
    const observer=new IntersectionObserver(([entry])=>playback.update({visible:entry.isIntersecting}),{threshold:.15});
    observer.observe(surface.current);
    const visibility=()=>playback.update({hidden:document.hidden});
    document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);playback.dispose();player.current=null;};
  },[project.src]);
  useEffect(()=>{player.current?.update({active,paused});},[active,paused]);
  return <figure ref={surface} className={'showcase-film'+(active?' is-active':'')} aria-hidden={!active}>
    {project.kind==='photo'?<img src={project.src} alt={project.alt||project.title}/>:<>
      {project.poster&&<img className="showcase-poster" src={project.poster} alt=""/>}
      <video ref={video} src={project.src} poster={project.poster} data-showcase-film muted loop playsInline preload="metadata" aria-label={project.title} onTimeUpdate={e=>{if(active)onTime?.(e.currentTarget.currentTime);}} onError={()=>{setFailed(true);video.current?.pause();}} hidden={failed}/>
      {failed&&<p className="showcase-film-error">This preview couldn’t load.</p>}
    </>}
  </figure>;
}

import React,{useEffect,useRef,useState} from 'react';

export default function ProjectFilm({project,active,paused}){
  const video=useRef();
  const [manualPause,setManualPause]=useState(false),[playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
  useEffect(()=>{
    const element=video.current;if(!element)return;
    const apply=()=>{
      if(!active||paused||manualPause||document.hidden||failed)element.pause();
      else element.play().catch(()=>setPlaying(false));
    };
    apply();document.addEventListener('visibilitychange',apply);
    return()=>{element.pause();document.removeEventListener('visibilitychange',apply);};
  },[active,paused,manualPause,failed]);
  const label=playing?'Pause film':'Play film';
  function toggle(){
    const element=video.current;
    if(playing){element.pause();setManualPause(true);}
    else{setManualPause(false);element.play().catch(()=>setPlaying(false));}
  }
  return <figure className="project-film">
    <div className="project-visual" data-project-visual>
      {(project.poster||project.kind==='photo')&&<img className="project-poster" src={project.kind==='photo'?project.src:project.poster} alt={project.alt||'Geometric motion placeholder for '+project.format.toLowerCase()} width="960" height="540" loading="lazy"/>}
      {project.kind==='video'&&!failed&&<video ref={video} src={project.src} poster={project.poster} muted loop playsInline preload="metadata" controls={!project.placeholder} aria-label={project.placeholder?project.format+' placeholder':project.title} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false);}}>{project.captions&&<track src={project.captions} kind="captions" srcLang="en" label="English" default/>}</video>}
      {project.placeholder&&!failed&&<button className="project-play" onClick={toggle} aria-label={label+' — '+project.title} data-interactive data-cursor={playing?'Ⅱ':'▶'}><span className="project-play-label"><span aria-hidden="true">{playing?'Ⅱ':'▶'}</span><span>{label}</span></span></button>}
    </div>
    <figcaption><span>{project.format}</span><span>{project.placeholder?(failed?'Placeholder poster':'Placeholder'):project.title}</span></figcaption>
  </figure>;
}

import React,{useEffect,useRef,useState} from 'react';
import './vimeo-showcase.css';
export default function VimeoShowcase({project,active,paused,onTime}){
 const root=useRef(),frame=useRef(),[visible,setVisible]=useState(false),[playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
 const enabled=active&&visible;
 const state=useRef();state.current={enabled,paused,onTime};
 const send=(method,value)=>frame.current?.contentWindow?.postMessage({method,...(value===undefined?{}:{value})},'https://player.vimeo.com');
 const subscribe=()=>{['play','pause','timeupdate','error'].forEach(value=>send('addEventListener',value));if(state.current.enabled&&!state.current.paused)send('play');};
 useEffect(()=>{
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});observer.observe(root.current);
  const message=event=>{
   if(event.origin!=='https://player.vimeo.com'||event.source!==frame.current?.contentWindow)return;
   let data;try{data=typeof event.data==='string'?JSON.parse(event.data):event.data;}catch{return;}
   if(data?.event==='ready')subscribe();
   if(data?.event==='play')setPlaying(true);
   if(data?.event==='pause')setPlaying(false);
   if(data?.event==='error'){setFailed(true);setPlaying(false);}
   if(data?.event==='timeupdate')state.current.onTime?.(data.data.seconds,data.data.duration);
  };
  const hide=()=>{if(document.hidden){send('pause');setPlaying(false);}};
  window.addEventListener('message',message);document.addEventListener('visibilitychange',hide);
  return()=>{observer.disconnect();window.removeEventListener('message',message);document.removeEventListener('visibilitychange',hide);};
 },[]);
 useEffect(()=>{if(!enabled||paused){send('pause');setPlaying(false);}},[enabled,paused]);
 return <figure ref={root} className="vimeo-showcase">
  <img src={project.poster} alt=""/>
  {enabled&&!failed&&<iframe ref={frame} onLoad={subscribe} src={'https://player.vimeo.com/video/'+project.vimeoId+'?background=1&autoplay=0&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&badge=0&keyboard=0&dnt=1'} title={project.title} allow="autoplay" tabIndex={-1}/>}
  {enabled&&!failed&&<button className="vimeo-showcase-toggle" aria-label={(playing?'Pause ':'Play ')+project.title} onClick={()=>{if(!playing){send('setMuted',false);send('setVolume',1);}send(playing?'pause':'play');}}><span aria-hidden="true">{playing?'Ⅱ':'▶'}</span></button>}
  {failed&&<p role="status">This film couldn’t load. <a href={project.src} target="_blank" rel="noreferrer">Watch on Vimeo</a></p>}
 </figure>;
}

import React,{useEffect,useRef,useState} from 'react';

import MediaArtwork from './MediaArtwork';



export default function Work({paused,pieces,collectionError,fullPage=false}){

  const root=useRef();const [expanded,setExpanded]=useState(null);

  useEffect(()=>{const videos=[...root.current.querySelectorAll('video')];const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:.2});videos.forEach(v=>observer.observe(v));const hide=()=>{if(document.hidden)videos.forEach(v=>v.pause());};document.addEventListener('visibilitychange',hide);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);};},[pieces]);

  useEffect(()=>{const escape=e=>{if(e.key==='Escape')setExpanded(null);};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);

  return <section className="work" id="work" ref={root} tabIndex="-1" aria-label="Selected work">{!fullPage&&<div className="work-intro"><h2>See what<br/>we mean.</h2><a className="round-link" href="/portfolio/"><span>Full<br/>portfolio</span><span aria-hidden="true"></span></a></div>}

    {pieces.map((piece,i)=><article className={'work-panel '+(expanded===piece.id?'is-expanded':'')} key={piece.id} style={{zIndex:i+1}}><div className={'work-screen work-screen-'+i%3}><div className="project-heading"><h3>{piece.title}</h3><span className="project-counter">{String(i+1).padStart(2,'0')}<span> / {String(pieces.length).padStart(2,'0')}</span></span></div><div className={'project-media '+(piece.placeholder?'is-placeholder':'')}>

      {piece.placeholder?<><MediaArtwork variant={i}/><span className="placeholder-label">Coming soon · {piece.format}</span></>:piece.vimeoId?<VimeoPlayer piece={piece} paused={paused}/>:piece.kind==='video'?<video src={piece.src} controls preload="metadata" playsInline aria-label={piece.title}>{piece.captions&&<track kind="captions" src={piece.captions} srcLang="en" label="English" default/>}</video>:<button className="image-expand" onClick={()=>setExpanded(expanded===piece.id?null:piece.id)} aria-expanded={expanded===piece.id} aria-label={(expanded===piece.id?'Close expanded view of ':'Expand ')+piece.title}><img src={piece.src} alt={piece.alt||piece.title} loading="lazy"/><span className="media-action">{expanded===piece.id?'Close view ':'View image '}</span></button>}

    </div><div className="project-bottom"><p>{piece.description||(piece.placeholder?'':piece.kind==='video'?'Videography':'Photography')}</p>{!fullPage&&<a href="/portfolio/">{piece.placeholder?'Explore the portfolio':'View collection'}</a>}</div></div></article>)}

    {collectionError&&<p className="collection-error" role="status">The collection couldn’t load. <a href="/portfolio/">Try the portfolio.</a></p>}

  </section>;

}



function VimeoPlayer({piece,paused}){
 const container=useRef(),frame=useRef();
 const [visible,setVisible]=useState(false),[playing,setPlaying]=useState(false),[volume,setVolume]=useState(0),[time,setTime]=useState(0),[duration,setDuration]=useState(0),[fullscreen,setFullscreen]=useState(false),[error,setError]=useState('');
 const send=(method,value)=>frame.current?.contentWindow?.postMessage({method,...(value===undefined?{}:{value})},'https://player.vimeo.com');
 const subscribe=()=>{['play','pause','timeupdate','volumechange','loaded','error'].forEach(value=>send('addEventListener',value));send('getDuration');send('getPaused');send('getVolume');};
 useEffect(()=>{
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});observer.observe(container.current);
  const hide=()=>{if(document.hidden)send('pause');};
  document.addEventListener('visibilitychange',hide);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);};
 },[]);
 useEffect(()=>{
  if(!visible||paused){setPlaying(false);setVolume(0);setTime(0);setDuration(0);}
 },[visible,paused]);
 useEffect(()=>{
  const receive=e=>{
   if(e.origin!=='https://player.vimeo.com'||e.source!==frame.current?.contentWindow)return;
   let data=e.data;try{if(typeof data==='string')data=JSON.parse(data);}catch{return;}
   if(!data||typeof data!=='object')return;
   if(data.event==='ready'||data.event==='loaded'){subscribe();setError('');}
   if(data.event==='play')setPlaying(true);
   if(data.event==='pause')setPlaying(false);
   if(data.event==='timeupdate'){setTime(data.data.seconds);setDuration(data.data.duration);}
   if(data.event==='volumechange')setVolume(data.data.volume);
   if(data.method==='getDuration')setDuration(data.value);
   if(data.method==='getPaused')setPlaying(!data.value);
   if(data.method==='getVolume')setVolume(data.value);
   if(data.event==='error')setError('The video could not play. Please try watching on Vimeo.');
  };
  const changed=()=>setFullscreen(document.fullscreenElement===container.current);
  window.addEventListener('message',receive);document.addEventListener('fullscreenchange',changed);
  return()=>{window.removeEventListener('message',receive);document.removeEventListener('fullscreenchange',changed);};
 },[]);
 const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(container.current.requestFullscreen)await container.current.requestFullscreen();else send('requestFullscreen');}catch{setError('Fullscreen is unavailable in this browser.');}};
 const clock=n=>Math.floor((n||0)/60)+':'+String(Math.floor((n||0)%60)).padStart(2,'0');
 return <div ref={container} className="vimeo-player vimeo-container">
 {visible&&!paused?<><iframe ref={frame} onLoad={subscribe} className="vimeo-player" src={'https://player.vimeo.com/video/'+piece.vimeoId+'?background=1&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1'} title="Videography by Made Beside" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen tabIndex={-1}/>
 <div className="video-controls" role="group" aria-label="Video controls">
 <button onClick={()=>send(playing?'pause':'play')} aria-label={playing?'Pause video':'Play video'}>{playing?'Pause':'Play'}</button>
 <label className="video-seek"><span className="sr-only">Seek video</span><input type="range" min="0" max={duration||1} step=".1" value={Math.min(time,duration||1)} disabled={!duration} aria-valuetext={clock(time)+' of '+clock(duration)} onChange={e=>send('setCurrentTime',Number(e.target.value))}/></label>
 <span className="video-time">{clock(time)} / {clock(duration)}</span>
 <button onClick={()=>send('setVolume',volume?0:1)} aria-label={volume?'Mute sound':'Enable sound'}>{volume?'Mute':'Sound'}</button>
 <label className="video-volume"><span className="sr-only">Volume</span><input type="range" min="0" max="1" step=".05" value={volume} onChange={e=>send('setVolume',Number(e.target.value))}/></label>
 <button onClick={toggleFullscreen}>{fullscreen?'Exit fullscreen':'Fullscreen'}</button>
 </div>{error&&<p className="video-error" role="status">{error} <a href={piece.src} target="_blank" rel="noopener noreferrer">Watch on Vimeo</a></p>}</>:<span className="sr-only">Videography. Motion is paused.</span>}
 </div>;
}

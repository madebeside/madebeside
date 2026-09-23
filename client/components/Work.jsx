import React,{useEffect,useRef,useState} from 'react';

import MediaArtwork from './MediaArtwork';



export default function Work({paused,pieces,collectionError,fullPage=false}){

  const root=useRef();const [expanded,setExpanded]=useState(null);

  useEffect(()=>{const videos=[...root.current.querySelectorAll('video')];const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:.2});videos.forEach(v=>observer.observe(v));const hide=()=>{if(document.hidden)videos.forEach(v=>v.pause());};document.addEventListener('visibilitychange',hide);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);};},[pieces]);

  useEffect(()=>{const escape=e=>{if(e.key==='Escape')setExpanded(null);};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);

  return <section className="work" id="work" ref={root} tabIndex="-1" aria-label="Selected work">{!fullPage&&<div className="work-intro"><h2>See what<br/>we mean.</h2><a className="round-link" href="/portfolio/"><span>Full<br/>portfolio</span><span aria-hidden="true"></span></a></div>}

    {pieces.map((piece,i)=><article className={'work-panel '+(expanded===piece.id?'is-expanded':'')} key={piece.id} style={{zIndex:i+1}}><div className={'work-screen work-screen-'+i%3}><div className="project-heading"><h3>{piece.title}</h3><span className="project-counter">{String(i+1).padStart(2,'0')}<span> / {String(pieces.length).padStart(2,'0')}</span></span></div><div className={'project-media '+(piece.placeholder?'is-placeholder':'')}>

      {piece.placeholder?<><MediaArtwork variant={i}/><span className="placeholder-label">Coming soon · {piece.format}</span></>:piece.kind==='video'?<video src={piece.src} controls preload="metadata" playsInline aria-label={piece.title}>{piece.captions&&<track kind="captions" src={piece.captions} srcLang="en" label="English" default/>}</video>:<button className="image-expand" onClick={()=>setExpanded(expanded===piece.id?null:piece.id)} aria-expanded={expanded===piece.id} aria-label={(expanded===piece.id?'Close expanded view of ':'Expand ')+piece.title}><img src={piece.src} alt={piece.alt||piece.title} loading="lazy"/><span className="media-action">{expanded===piece.id?'Close view ':'View image '}</span></button>}

    </div><div className="project-bottom"><p>{piece.description||(piece.placeholder?'':piece.kind==='video'?'Videography':'Photography')}</p>{!fullPage&&<a href="/portfolio/">{piece.placeholder?'Explore the portfolio':'View collection'}</a>}</div></div></article>)}

    {collectionError&&<p className="collection-error" role="status">The collection couldn’t load. <a href="/portfolio/">Try the portfolio.</a></p>}

  </section>;

}


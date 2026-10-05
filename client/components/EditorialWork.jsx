import React,{useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {VimeoPlayer} from './Work';import FloatingPhotos from './FloatingPhotos';
import {config} from '../config';
gsap.registerPlugin(ScrollTrigger);
export default function EditorialWork({paused,pieces,collectionError}){
 const root=useRef();const film=pieces.find(p=>p.vimeoId)||config.workPlaceholders[0];
 const other=pieces.filter(p=>!p.placeholder&&!p.gallery&&!p.vimeoId);
 useLayoutEffect(()=>{if(paused)return;const ctx=gsap.context(()=>{
  gsap.utils.toArray('[data-cut-reveal]').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  gsap.from('.cut-film-media',{scale:.92,ease:'none',scrollTrigger:{trigger:'.cut-film',start:'top bottom',end:'top 20%',scrub:1}});
 },root);return()=>ctx.revert();},[paused]);
 return <section className="cut-work" id="work" ref={root} tabIndex="-1">
  <div className="cut-section-heading" data-cut-reveal><h2>The work,<br/>up close.</h2><p>A feeling, a moment, a point of view.<br/>This is what we make room for.</p></div>
  <article className="cut-film work-panel"><div className="cut-project-copy" data-cut-reveal><h3>Videography</h3><p>Stories with movement. <br/>The big moments and the details <br/>that make them yours.</p><a className="cut-text-link" href="/portfolio/">Explore the collection</a></div><div className="cut-film-media"><VimeoPlayer piece={film} paused={paused}/></div></article>
  <article className="cut-photography"><div className="cut-photo-heading" data-cut-reveal><h3>A different<br/>way of seeing.</h3><p>Photography with space for <br/>the moments in between.</p></div><div className="cut-reel"><FloatingPhotos paused={paused}/></div></article>
  {other.map(piece=><article className="cut-published" key={piece.id}><div data-cut-reveal><h3>{piece.title}</h3><p>{piece.description}</p><a href="/portfolio/" className="cut-text-link">View the collection</a></div>{piece.kind==='video'?<video src={piece.src} controls preload="metadata" playsInline aria-label={piece.title}/>:<img src={piece.src} alt={piece.alt||piece.title} loading="lazy"/>}</article>)}
  {collectionError&&<p className="collection-error" role="status">The collection couldn’t load. <a href="/portfolio/">Try the portfolio.</a></p>}
 </section>;
}

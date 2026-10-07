import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import './review-spread.css';
const notes=[
 'The words that matter most will come from the people beside us.',
 'Good work is a shared story. This space is for the other side.',
 'Every project has a point of view. We will leave this space for theirs.'
];
export function reviewRibbonOffset(progress,index){const p=Math.max(0,Math.min(900,Number.isFinite(progress)?progress:0));return -1000+p*(index%2?-1:1);}
export default function ReviewSpread({paused}){
 const section=useRef();
 useEffect(()=>{
  const host=section.current;if(!host||paused)return;
  const tracks=[...host.querySelectorAll('.ribbon-track')];
  let target=0,current=0;
  const paint=()=>tracks.forEach((track,index)=>{track.style.transform='translate3d('+reviewRibbonOffset(current,index)+'px,0,0)';});
  const clock=subscribe((time,dt)=>{current+=(target-current)*(1-Math.exp(-dt*10));paint();if(Math.abs(target-current)<.05)clock.setActive(false);},false);
  const update=()=>{const bounds=host.getBoundingClientRect();target=(innerHeight-bounds.top)*.48;clock.setActive(true);};
  const resize=()=>{update();};
  update();current=target;paint();
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',resize);
  return()=>{clock.remove();window.removeEventListener('scroll',update);window.removeEventListener('resize',resize);tracks.forEach(track=>track.style.removeProperty('transform'));};
 },[paused]);
 return <section ref={section} className={'review-spread'+(paused?' is-still':'')} id="reviews" tabIndex={-1} aria-labelledby="review-title">
  <div className="review-ribbon-heading"><h2 id="review-title">Client perspectives.</h2><span>Review placeholders</span></div>
  <div className="review-ribbons">
   {notes.map((text,index)=><article key={index} className={'review-ribbon ribbon-'+index} aria-label={'Review placeholder '+String(index+1).padStart(2,'0')}>
    <div className="ribbon-attribution"><span>Name placeholder</span><span>Company placeholder · {String(index+1).padStart(2,'0')}</span></div>
    <p className="sr-only">{text}</p>
    <div className="ribbon-track" aria-hidden="true">{[0,1].map(group=><div className="ribbon-group" key={group}>{[0,1].map(copy=><span key={copy}>{text}<i>↗</i></span>)}</div>)}</div>
   </article>)}
  </div>
 </section>;
}

import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {roomState} from './timeline-selection';
import {Kinetic} from './PageWorld';
import './made-room.css';
export function BrandShape({kind='arch',className=''}){return <span aria-hidden="true" className={'brand-form brand-form-'+kind+' '+className}/>;}
export default function MadeRoom({word,statement,paused}){
 const host=useRef(),walls=useRef();
 useEffect(()=>{
  const root=host.current,visual=walls.current;if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let top=0,travel=1,current=0,alive=true;
  const measure=()=>{top=root.getBoundingClientRect().top+scrollY;travel=Math.max(1,root.offsetHeight-innerHeight);};
  const clock=subscribe((time,dt)=>{
   const target=innerWidth<=800?0:Math.max(0,Math.min(1,(scrollY-top)/travel));current+=(target-current)*(1-Math.exp(-dt*9));
   const state=roomState(current);visual.style.transform=`translateZ(${state.depth}px) rotateZ(${state.turn}deg) scale(${state.scale})`;visual.style.opacity=state.opacity;
  },false);
  const observer=new IntersectionObserver(([e])=>clock.setActive(e.isIntersecting),{rootMargin:'100px'}),size=new ResizeObserver(measure);
  measure();observer.observe(root);size.observe(root);window.addEventListener('resize',measure);document.fonts?.ready.then(()=>{if(alive)measure();});
  return()=>{alive=false;clock.remove();observer.disconnect();size.disconnect();window.removeEventListener('resize',measure);visual.style.removeProperty('transform');visual.style.removeProperty('opacity');};
 },[paused]);
 return <header className="reference-masthead made-room" ref={host}><div className="made-room-stage"><div className="room-perspective" aria-hidden="true"><div className="room-walls" ref={walls}><div className="room-ceiling">{word}</div><div className="room-left">MADE</div><div className="room-right">BESIDE</div><div className="room-floor">TORONTO</div><BrandShape className="room-brand-arch"/><BrandShape kind="bend" className="room-brand-bend"/></div></div><div className="room-copy"><Kinetic text={statement}/><p>Good ideas. Great company.</p><a className="room-explore" href="#reference-story">Step inside <span aria-hidden="true">↓</span></a></div><p className="room-place">Toronto.<br/>Made in this room.</p></div></header>;
}

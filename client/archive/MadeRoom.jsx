import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {Kinetic} from './PageWorld';
import './made-room.css';
export default function MadeRoom({word,paused}){
 const host=useRef(),type=useRef();
 useEffect(()=>{
  if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const root=host.current,visual=type.current;
  let top=0,current=0,alive=true;
  const measure=()=>{top=root.parentElement.getBoundingClientRect().top+scrollY;};
  const clock=subscribe((time,dt)=>{const target=Math.max(0,Math.min(1,(scrollY-top)/innerHeight));current+=(target-current)*(1-Math.exp(-dt*10));visual.style.transform=`translateY(${-current*100}px) rotate(${-current*3}deg)`;visual.style.opacity=1-current*.65;},false);
  const observer=new IntersectionObserver(([e])=>clock.setActive(e.isIntersecting)),size=new ResizeObserver(measure);
  measure();observer.observe(root);size.observe(root);window.addEventListener('resize',measure);document.fonts?.ready.then(()=>{if(alive)measure();});
  return()=>{alive=false;clock.remove();observer.disconnect();size.disconnect();window.removeEventListener('resize',measure);visual.style.removeProperty('transform');visual.style.removeProperty('opacity');};
 },[paused]);
 return <header className="reference-masthead made-room" ref={host}><div className="made-room-stage"><div className="page-title-art" ref={type} style={{'--title-size':word.length>10?'11vw':word.length>7?'13vw':word.length>5?'17vw':'25vw'}}><Kinetic text={word}/><span className="page-title-accent">made beside</span></div></div></header>;
}

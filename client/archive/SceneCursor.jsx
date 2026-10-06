import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
export default function SceneCursor({paused}){
  const ref=useRef();
  useEffect(()=>{
    if(paused||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const el=ref.current;let tx=0,ty=0,x=0,y=0,active=false;
    const setScene=target=>{const scene=target?.closest?.('[data-cursor]');active=!!scene;el.dataset.active=String(active);el.firstElementChild.textContent=scene?.dataset.cursor||'';control.setActive(active);};
    const move=e=>{tx=e.clientX;ty=e.clientY;setScene(e.target);};
    const refresh=()=>setScene(document.elementFromPoint(tx,ty));
    const hide=()=>{active=false;el.dataset.active='false';control.setActive(false);};
    const control=subscribe((now,dt)=>{const amount=1-Math.exp(-dt*22);x+=(tx-x)*amount;y+=(ty-y)*amount;el.style.transform='translate3d('+x+'px,'+y+'px,0)';},false);
    document.addEventListener('pointermove',move);document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);window.addEventListener('scroll',refresh,{passive:true});
    return()=>{control.remove();hide();document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);window.removeEventListener('scroll',refresh);};
  },[paused]);
  return <div ref={ref} className="scene-cursor" aria-hidden="true" data-active="false"><span/></div>;
}

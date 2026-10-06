import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {sceneProgress} from './motion';
export default function ScrollComposition({paused,children}){
  const ref=useRef();
  useEffect(()=>{
    const el=ref.current;let top=0,height=1,visible=false;
    const measure=()=>{const r=el.getBoundingClientRect();top=r.top+scrollY;height=r.height;};
    const control=subscribe(()=>{const p=sceneProgress(scrollY,top,height,innerHeight);el.style.setProperty('--skew',(paused?0:(.5-p)*11)+'deg');el.style.setProperty('--inset',(paused?0:Math.abs(.5-p)*9)+'%');},false);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;control.setActive(visible&&!paused);});
    measure();observer.observe(el);window.addEventListener('resize',measure);
    if(paused){el.style.setProperty('--skew','0deg');el.style.setProperty('--inset','0%');}
    return()=>{control.remove();observer.disconnect();window.removeEventListener('resize',measure);};
  },[paused]);
  return <div className="scroll-composition" ref={ref}>{children}</div>;
}

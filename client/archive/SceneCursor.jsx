import React,{useEffect,useRef} from 'react';
import {createSceneCursorController} from './scene-cursor-controller';
export default function SceneCursor({paused}){
  const ref=useRef();
  useEffect(()=>{
    if(paused||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const control=createSceneCursorController(ref.current,(x,y)=>document.elementFromPoint(x,y),active=>document.documentElement.classList.toggle('has-scene-cursor',active));
    const move=event=>control.move(event),refresh=()=>control.refresh(),hide=()=>control.hide();
    const observer=new MutationObserver(refresh);observer.observe(document.getElementById('root'),{subtree:true,attributes:true,attributeFilter:['data-cursor']});
    document.addEventListener('pointermove',move);document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);window.addEventListener('scroll',refresh,{passive:true});
    return()=>{observer.disconnect();hide();document.documentElement.classList.remove('has-scene-cursor');document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);window.removeEventListener('scroll',refresh);};
  },[paused]);
  return <div ref={ref} className="scene-cursor" aria-hidden="true" data-active="false"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <g className="cursor-play"><path d="M7 6L17 12L7 18Z" fill="currentColor" stroke="none"/></g>
    <g className="cursor-pause"><path d="M8 6V18M16 6V18" strokeWidth="3"/></g>
    <g className="cursor-move"><path d="M4 12H20M12 4V20M4 12L7 9M4 12L7 15M20 12L17 9M20 12L17 15M12 4L9 7M12 4L15 7M12 20L9 17M12 20L15 17"/></g>
    <g className="cursor-trim"><path d="M7 5V19M17 5V19M3 12H21M3 12L5 10M3 12L5 14M21 12L19 10M21 12L19 14"/></g>
    <g className="cursor-pin"><path d="M8 5H16L15 10L18 13H6L9 10ZM12 13V19"/></g>
    <g className="cursor-unpin"><path d="M7 7L17 17M17 7L7 17"/></g>
    <g className="cursor-plus"><path d="M5 12H19M12 5V19"/></g>
    <g className="cursor-arrow"><path d="M7 17L17 7M7 7H17V17"/></g>
  </svg></div>;
}

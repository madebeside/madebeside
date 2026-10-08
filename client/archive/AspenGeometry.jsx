import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {rippleSample} from './ripple-motion';
export function GrainField({paused,variant=0}){
 const canvas=useRef(),cursor=useRef();
 useEffect(()=>{
  const el=canvas.current,host=el.parentElement,ctx=el.getContext('2d');if(!ctx)return;
  let width=1,height=1,last=0,phase=0,clock,pointer=null,lastWave=-1,waves=[],accent='#16db65',scrollPhase=0;
  const still=paused||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const draw=()=>{
   ctx.clearRect(0,0,width,height);let color='';
   const unit=Math.min(width,height),step=Math.max(5,width/110),shift=phase*.24+variant+scrollPhase;
   for(let y=step/2;y<height;y+=step)for(let x=step/2;x<width;x+=step){
    const u=(x-width/2)/unit,v=(y-height/2)/unit,bend=Math.sin(v*4+shift)*.13;
    const arch=Math.abs(Math.hypot((Math.abs(u-bend)-.22)*1.3,v+.02)-.36);
    const wave=(Math.sin(u*14+v*7+shift)+Math.cos(v*11-u*6-shift))*.5;
    const ripple=waves.length?rippleSample(x,y,phase,waves):{displacement:0,energy:0};
    const density=Math.max(.025,Math.min(.98,.18+Math.exp(-arch*18)*.62+wave*.1+ripple.displacement*.32));
    const next=ripple.energy>.12?accent:'#121111';if(color!==next){ctx.fillStyle=next;color=next;}
    const radius=step*.48*Math.sqrt(density);ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
   }
  };
  const measure=()=>{width=Math.max(1,Math.min(900,host.clientWidth));height=Math.max(1,Math.round(width*host.clientHeight/Math.max(1,host.clientWidth)));el.width=width;el.height=height;accent=getComputedStyle(host).getPropertyValue('--route-accent').trim()||'#16db65';draw();};
  const position=e=>{const r=host.getBoundingClientRect(),c=el.getBoundingClientRect();return {x:(e.clientX-c.left)*width/c.width,y:(e.clientY-c.top)*height/c.height,cssX:e.clientX-r.left,cssY:e.clientY-r.top};};
  const move=e=>{if(still||e.pointerType==='touch')return;pointer={...position(e),clientX:e.clientX,clientY:e.clientY};host.classList.add('has-pointer');cursor.current.style.transform=`translate(${pointer.cssX}px,${pointer.cssY}px)`;if(phase-lastWave>.09){waves.push({x:pointer.x,y:pointer.y,time:phase});waves=waves.slice(-5);lastWave=phase;}};
  const leave=()=>{pointer=null;host.classList.remove('has-pointer');};
  const press=e=>{if(still)return;const p=position(e);waves.push({x:p.x,y:p.y,time:phase});waves=waves.slice(-5);};
  const size=new ResizeObserver(measure);size.observe(host);measure();
  if(!still){host.classList.add('is-interactive');host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);host.addEventListener('pointerdown',press,{passive:true});clock=subscribe((now,dt)=>{phase+=dt;waves=waves.filter(w=>phase-w.time<1.8);const bounds=host.getBoundingClientRect();scrollPhase=(bounds.top/innerHeight)*.4;if(pointer){const inside=pointer.clientX>=bounds.left&&pointer.clientX<=bounds.right&&pointer.clientY>=bounds.top&&pointer.clientY<=bounds.bottom;host.classList.toggle('has-pointer',inside);cursor.current.style.transform=`translate(${pointer.clientX-bounds.left}px,${pointer.clientY-bounds.top}px)`;}if(now-last<1000/30)return;last=now;draw();},false);}
  const observer=new IntersectionObserver(([e])=>clock?.setActive(e.isIntersecting),{rootMargin:'50px'});observer.observe(host);
  return()=>{size.disconnect();observer.disconnect();clock?.remove();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('pointerdown',press);host.classList.remove('is-interactive','has-pointer');};
 },[paused,variant]);
 return <div className="grain-field" aria-hidden="true"><canvas ref={canvas}/><span className="field-cursor" ref={cursor}/></div>;
}
export function BrandDiagram({index=0}){
 const designs=[
  <g key="blocks" className="diagram-piece" fill="currentColor"><path d="M35 35H100V100H35Z M110 35H175V100H110Z M110 110H175V175H110Z M185 110H225V175H185Z"/><path d="M35 110H100V200H35Z" opacity=".25"/></g>,
  <g key="bend" className="diagram-piece" stroke="currentColor" strokeWidth="14"><path d="M40 175V70H125V175H215V70"/><path d="M65 45H150V150H190" opacity=".3" strokeWidth="6"/></g>,
  <g key="windows" className="diagram-piece" stroke="currentColor" strokeWidth="3"><path d="M35 35H155V155H35Z M105 90H225V210H105Z"/><path d="M35 155H105V90H155V35" strokeWidth="16"/><path d="M175 35H225V65H175Z" fill="currentColor" stroke="none"/></g>,
  <g key="joins" className="diagram-piece" stroke="currentColor" strokeWidth="18"><path d="M40 190V75Q40 40 75 40H110V175Q110 200 140 200H180V65Q180 40 220 40"/><path d="M40 115H220" opacity=".25" strokeWidth="3"/></g>
 ];
 return <svg className={'brand-diagram diagram-'+index%4} viewBox="0 0 260 230" fill="none" aria-hidden="true">{designs[index%4]}</svg>;
}

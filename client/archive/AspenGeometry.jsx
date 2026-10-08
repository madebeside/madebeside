import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {rippleSample} from './ripple-motion';
import {blobDensity,iconForTopic,scribblePaths} from './scribble-art';
export function GrainField({paused,variant=0,shape='arch'}){
 const canvas=useRef(),cursor=useRef();
 useEffect(()=>{
  const el=canvas.current,host=el.parentElement,ctx=el.getContext('2d');if(!ctx)return;
  let width=1,height=1,phase=0,clock,pointer=null,lastWave=-1,waves=[],accent='#16db65',scrollPhase=0;
  const still=paused||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const draw=()=>{
   ctx.clearRect(0,0,width,height);const ink=new Path2D(),lit=new Path2D();
   const unit=Math.min(width,height)*1.15,step=Math.max(5,width/110),shift=phase*.24+variant+scrollPhase;
   for(let y=step/2;y<height;y+=step)for(let x=step/2;x<width;x+=step){
    const u=(x-width/2)/unit,v=(y-height/2)/unit;
    const ripple=waves.length?rippleSample(x,y,phase,waves):{displacement:0,energy:0};
    const density=Math.max(.025,Math.min(.98,blobDensity(u,v,shift,shape)+ripple.displacement*.32));    const path=ripple.energy>.12?lit:ink;
    const radius=step*.48*Math.sqrt(density);path.moveTo(x+radius,y);path.arc(x,y,radius,0,Math.PI*2);
   }
   ctx.fillStyle='#121111';ctx.fill(ink);ctx.fillStyle=accent;ctx.fill(lit);
  };
  const measure=()=>{width=Math.max(1,Math.min(900,host.clientWidth));height=Math.max(1,Math.round(width*host.clientHeight/Math.max(1,host.clientWidth)));if(el.width!==width)el.width=width;if(el.height!==height)el.height=height;accent=getComputedStyle(host).getPropertyValue('--route-accent').trim()||'#16db65';if(still)draw();};
  const position=e=>{const r=host.getBoundingClientRect(),c=el.getBoundingClientRect();return {x:(e.clientX-c.left)*width/c.width,y:(e.clientY-c.top)*height/c.height,cssX:(e.clientX-r.left)*host.clientWidth/r.width,cssY:(e.clientY-r.top)*host.clientHeight/r.height};};
  const move=e=>{if(still||e.pointerType==='touch')return;pointer={...position(e),clientX:e.clientX,clientY:e.clientY};host.classList.add('has-pointer');cursor.current.style.transform=`translate(${pointer.cssX}px,${pointer.cssY}px)`;if(phase-lastWave>.09){waves.push({x:pointer.x,y:pointer.y,time:phase});waves=waves.slice(-5);lastWave=phase;}};
  const leave=()=>{pointer=null;host.classList.remove('has-pointer');};
  const press=e=>{if(still)return;const p=position(e);waves.push({x:p.x,y:p.y,time:phase});waves=waves.slice(-5);};
  const size=new ResizeObserver(measure);size.observe(host);measure();
  if(!still){host.classList.add('is-interactive');host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);host.addEventListener('pointerdown',press,{passive:true});clock=subscribe((now,dt)=>{phase+=dt;waves=waves.filter(w=>phase-w.time<1.8);const bounds=host.getBoundingClientRect();scrollPhase=(bounds.top/innerHeight)*.4;if(pointer){const inside=pointer.clientX>=bounds.left&&pointer.clientX<=bounds.right&&pointer.clientY>=bounds.top&&pointer.clientY<=bounds.bottom;host.classList.toggle('has-pointer',inside);cursor.current.style.transform=`translate(${(pointer.clientX-bounds.left)*host.clientWidth/bounds.width}px,${(pointer.clientY-bounds.top)*host.clientHeight/bounds.height}px)`;}draw();},false);}
  const observer=new IntersectionObserver(([e])=>clock?.setActive(e.isIntersecting),{rootMargin:'50px'});observer.observe(host);
  return()=>{size.disconnect();observer.disconnect();clock?.remove();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('pointerdown',press);host.classList.remove('is-interactive','has-pointer');};
 },[paused,variant,shape]);
 return <div className="grain-field" aria-hidden="true"><canvas ref={canvas}/><span className="field-cursor" ref={cursor}/></div>;
}
export function BrandDiagram({index=0,topic=''}){
 const icon=iconForTopic(topic);
 return <svg className={'brand-diagram scribble-icon diagram-'+index%4} data-scribble={icon} viewBox="0 0 260 230" fill="none" aria-hidden="true"><g className="scribble-strokes" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">{scribblePaths[icon].map((d,i)=><path key={i} d={d} pathLength="1" style={{'--stroke':i}}/>)}</g></svg>;
}
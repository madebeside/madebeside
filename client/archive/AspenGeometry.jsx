import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
export function GrainField({paused,variant=0}){
 const canvas=useRef();
 useEffect(()=>{
  const el=canvas.current,host=el.parentElement,ctx=el.getContext('2d');if(!ctx)return;
  let width=1,height=1,last=0,phase=0,clock;
  const still=paused||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const draw=()=>{
   ctx.clearRect(0,0,width,height);ctx.fillStyle='#121111';
   const unit=Math.min(width,height),step=Math.max(5,width/140),shift=phase*.24+variant;
   for(let y=step/2;y<height;y+=step)for(let x=step/2;x<width;x+=step){
    const u=(x-width/2)/unit,v=(y-height/2)/unit;
    const bend=Math.sin(v*4+shift)*.13;
    const arch=Math.abs(Math.hypot((Math.abs(u-bend)-.22)*1.3,v+.02)-.36);
    const wave=(Math.sin(u*14+v*7+shift)+Math.cos(v*11-u*6-shift))*.5;
    const density=Math.max(.06,Math.min(.92,.18+Math.exp(-arch*18)*.62+wave*.1));
    const radius=step*.48*Math.sqrt(density);ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
   }
  };
  const measure=()=>{width=Math.max(1,Math.min(900,host.clientWidth));height=Math.max(1,Math.round(width*host.clientHeight/Math.max(1,host.clientWidth)));el.width=width;el.height=height;draw();};
  const size=new ResizeObserver(measure);size.observe(host);measure();
  if(!still)clock=subscribe((now,dt)=>{phase+=dt;if(now-last<1000/30)return;last=now;draw();},false);
  const observer=new IntersectionObserver(([e])=>clock?.setActive(e.isIntersecting),{rootMargin:'50px'});observer.observe(host);
  return()=>{size.disconnect();observer.disconnect();clock?.remove();};
 },[paused,variant]);
 return <div className="grain-field" aria-hidden="true"><canvas ref={canvas}/></div>;
}
export function BrandDiagram({index=0}){
 return <svg className={'brand-diagram diagram-'+index%4} viewBox="0 0 260 230" fill="none" aria-hidden="true"><g className="diagram-orbit" stroke="currentColor" strokeWidth="1">{[0,1,2,3,4].map(i=><ellipse key={i} cx="130" cy="115" rx={35+i*16} ry="80"/>)}</g><g className="diagram-arches" stroke="currentColor" strokeWidth="2">{[0,1,2].map(i=><path key={i} d={`M ${42+i*55} 180 V 95 A 26 26 0 0 1 ${94+i*55} 95 V 180`}/>)}</g><path className="diagram-window" d="M40 30H220V200H40Z" stroke="currentColor" strokeWidth="1"/><circle cx="130" cy="115" r="6" fill="currentColor"/></svg>;
}

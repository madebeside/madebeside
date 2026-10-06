import React,{useEffect,useRef,useState} from 'react';
import PixelMedia from './PixelMedia';
import {photographs} from './work-data';
import {springStep,clamp} from './motion';
import {subscribe} from './scheduler';

export default function PhotoReel({paused}){
  const root=useRef(),track=useRef(),controller=useRef(),[active,setActive]=useState(0);
  const state=useRef({position:0,velocity:0,target:0,stride:1,drag:false,startX:0,startPosition:0});
  const index=useRef(active);index.current=active;
  useEffect(()=>{
    const el=root.current,s=state.current;
    const draw=()=>{const next=s.drag?{position:s.target,velocity:0}:springStep(s.position,s.velocity,s.target,1/60);Object.assign(s,next);track.current.style.transform='translate3d('+s.position+'px,0,0)';};
    const control=subscribe(draw,false);controller.current=control;
    const measure=()=>{s.stride=track.current.firstElementChild.getBoundingClientRect().width+20;s.target=-index.current*s.stride;if(paused){s.position=s.target;track.current.style.transform='translate3d('+s.position+'px,0,0)';}};
    const observer=new IntersectionObserver(([e])=>control.setActive(e.isIntersecting&&!paused));
    const resizer=new ResizeObserver(measure);measure();observer.observe(el);resizer.observe(el);
    return()=>{control.remove();observer.disconnect();resizer.disconnect();controller.current=null;};
  },[paused]);
  useEffect(()=>{const s=state.current;s.target=-active*s.stride;if(paused){s.position=s.target;s.velocity=0;track.current.style.transform='translate3d('+s.position+'px,0,0)';}},[active,paused]);
  function begin(e){if(e.button!==0)return;const s=state.current;s.drag=true;s.startX=e.clientX;s.startPosition=s.position;e.currentTarget.setPointerCapture(e.pointerId);}
  function move(e){const s=state.current;if(!s.drag)return;s.target=clamp(s.startPosition+e.clientX-s.startX,-(photographs.length-1)*s.stride,0);if(paused){s.position=s.target;track.current.style.transform='translate3d('+s.position+'px,0,0)';}}
  function end(){const s=state.current;if(!s.drag)return;s.drag=false;const next=clamp(Math.round(-s.target/s.stride),0,photographs.length-1);s.target=-next*s.stride;setActive(next);}
  const choose=value=>setActive(clamp(value,0,photographs.length-1));
  return <section className="photography-reel" aria-label="Photography collection"><div className="photo-reel" ref={root} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();choose(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();choose(active-1);}}} tabIndex="0" role="region" aria-label="Drag the photographs or use the arrow keys"><div className="reel-track" ref={track}>{photographs.map(photo=><div className="reel-slide" key={photo.id}><PixelMedia src={photo.src} alt={photo.alt} paused={paused} cursor="Drag"/></div>)}</div></div><div className="reel-controls"><span aria-live="polite">{String(active+1).padStart(2,'0')} / {String(photographs.length).padStart(2,'0')} — PHOTOGRAPHY</span><div><button onClick={()=>choose(active-1)} disabled={active===0} aria-label="Previous photograph">←</button><button onClick={()=>choose(active+1)} disabled={active===photographs.length-1} aria-label="Next photograph">→</button></div></div></section>;
}

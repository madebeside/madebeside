import {useEffect,useRef} from 'react';
import {subscribe} from './scheduler';

export default function useCanvasScene(ref,paused,setup){
  const control=useRef(null),pausedRef=useRef(paused);
  pausedRef.current=paused;
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const host=canvas.parentElement;
    const size={width:1,height:1,dpr:1,top:0,viewport:innerHeight};
    const pointer={x:null,y:null,tx:null,ty:null,energy:0,inside:false};
    let bounds,visible=false,alive=true,failed=false;
    const renderer=setup(canvas,size);if(!renderer)return;
    const draw=(time,dt)=>{
      if(failed)return;
      const ease=1-Math.exp(-dt*13);
      if(pointer.inside){
        pointer.x=pointer.x===null?pointer.tx:pointer.x+(pointer.tx-pointer.x)*ease;
        pointer.y=pointer.y===null?pointer.ty:pointer.y+(pointer.ty-pointer.y)*ease;
      }
      pointer.energy+=(Number(pointer.inside)-pointer.energy)*ease;
      renderer.render(time,dt,pointer,size);
    };
    const resize=()=>{
      if(!alive)return;
      const rect=host.getBoundingClientRect();bounds={left:rect.left,top:rect.top,width:rect.width,height:rect.height};size.width=Math.max(1,bounds.width);size.height=Math.max(1,bounds.height);
      size.dpr=Math.min(devicePixelRatio||1,1.5);size.top=bounds.top+scrollY;size.viewport=innerHeight;
      try{renderer.resize?.(size);draw(performance.now(),1/60);}catch{fail();}
    };
    const fail=()=>{failed=true;subscription.setActive(false);renderer.fail?.();};
    const subscription=subscribe(draw,false,fail);
    control.current={subscription,draw};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;subscription.setActive(visible&&!pausedRef.current&&!failed);if(visible){try{draw(performance.now(),1/60);}catch{fail();}}},{rootMargin:'40px'});
    const resizer=new ResizeObserver(resize);
    const move=e=>{if(e.pointerType==='touch'||pausedRef.current)return;pointer.inside=true;pointer.tx=e.clientX-bounds.left;pointer.ty=e.clientY-bounds.top;};
    const enter=()=>{const rect=host.getBoundingClientRect();bounds={left:rect.left,top:rect.top,width:rect.width,height:rect.height};};
    const leave=()=>{pointer.inside=false;};
    const hide=()=>{if(document.hidden)leave();};
    const scrolling=()=>{bounds={...bounds,top:size.top-scrollY};};
    resize();observer.observe(host);resizer.observe(host);
    host.addEventListener('pointerenter',enter);host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);
    window.addEventListener('scroll',scrolling,{passive:true});window.addEventListener('resize',resize);window.addEventListener('blur',leave);document.addEventListener('visibilitychange',hide);
    document.fonts?.ready.then(()=>{if(alive)resize();});
    renderer.onReady=()=>{if(alive)resize();};
    control.current.update=()=>{subscription.setActive(visible&&!pausedRef.current&&!failed);if(pausedRef.current){pointer.inside=false;pointer.energy=0;}try{draw(performance.now(),1/60);}catch{fail();}};
    return()=>{alive=false;subscription.remove();observer.disconnect();resizer.disconnect();renderer.dispose?.();control.current=null;host.removeEventListener('pointerenter',enter);host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scrolling);window.removeEventListener('resize',resize);window.removeEventListener('blur',leave);document.removeEventListener('visibilitychange',hide);};
  },[ref,setup]);
  useEffect(()=>control.current?.update?.(),[paused]);
}

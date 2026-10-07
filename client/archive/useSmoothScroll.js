import {useEffect} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {subscribe} from './scheduler';

export default function useSmoothScroll(disabled){
  useEffect(()=>{
    if(disabled||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const lenis=new Lenis({autoRaf:false,lerp:.165,wheelMultiplier:1,syncTouch:false,anchors:false});
    const anchorClick=event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const anchor=event.target.closest?.('a[href^="#"]');
      if(!anchor||anchor.classList.contains('skip'))return;
      const target=document.getElementById(anchor.hash.slice(1));if(!target)return;
      event.preventDefault();
      if(location.hash!==anchor.hash)history.pushState(null,'',anchor.hash);
      lenis.scrollTo(target,{offset:0,onComplete:()=>target.focus({preventScroll:true})});
    };
    document.addEventListener('click',anchorClick);
    const clock=subscribe(time=>lenis.raf(time),true,()=>lenis.destroy(),-10);
    return()=>{document.removeEventListener('click',anchorClick);clock.remove();lenis.destroy();};
  },[disabled]);
}

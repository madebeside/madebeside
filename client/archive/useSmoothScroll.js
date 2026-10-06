import {useEffect} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {subscribe} from './scheduler';

export default function useSmoothScroll(disabled){
  useEffect(()=>{
    if(disabled||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const lenis=new Lenis({autoRaf:false,lerp:.165,wheelMultiplier:1,syncTouch:false,anchors:true});
    const clock=subscribe(time=>lenis.raf(time),true,()=>lenis.destroy(),-10);
    return()=>{clock.remove();lenis.destroy();};
  },[disabled]);
}

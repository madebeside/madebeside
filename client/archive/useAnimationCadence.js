import {useEffect} from 'react';
import {subscribe} from './scheduler';

// Only hover transitions receive the sampled cadence. Scroll and arrivals stay native.
export default function useAnimationCadence(disabled){
 useEffect(()=>{
  if(disabled||matchMedia('(prefers-reduced-motion:reduce)').matches||!document.getAnimations)return;
  const managed=new Map();let last=0;
  const clock=subscribe(now=>{
   if(last&&now-last<1000/30-.25)return;last=now;
   const animations=document.getAnimations(),live=new Set(animations);
   for(const animation of managed.keys())if(!live.has(animation)||animation.playState==='idle'||animation.playState==='finished')managed.delete(animation);
   for(const animation of animations){
    if(!managed.has(animation)){
     const target=animation.effect?.target;
     if(animation.constructor.name!=='CSSTransition'||!target?.closest?.('a,button,[tabindex="0"],[data-hover-motion]'))continue;
     if(animation.playState!=='running'||typeof animation.currentTime!=='number'||animation.playbackRate<=0)continue;
     managed.set(animation,{start:now,base:animation.currentTime,rate:animation.playbackRate});animation.pause();
    }
    const state=managed.get(animation);if(!state)continue;
    const time=state.base+(now-state.start)*state.rate,end=animation.effect?.getComputedTiming().endTime;
    if(Number.isFinite(end)&&time>=end){animation.finish();managed.delete(animation);}
    else animation.currentTime=time;
   }
  },true,undefined,20);
  return()=>{clock.remove();for(const animation of managed.keys())if(animation.playState==='paused')animation.play();managed.clear();};
 },[disabled]);
}

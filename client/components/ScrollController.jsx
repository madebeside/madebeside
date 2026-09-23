import {useEffect} from 'react';import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
export default function ScrollController({paused}){
  useEffect(()=>{let lenis,tick;
    if(!paused&&matchMedia('(min-width:768px) and (pointer:fine)').matches){lenis=new Lenis({lerp:.12,anchors:false});lenis.on('scroll',ScrollTrigger.update);tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);}
    const nav=e=>{const n=document.getElementById(e.detail==='services'?'capabilities':e.detail);if(!n)return;lenis?.resize();if(lenis)lenis.scrollTo(n,{immediate:true,force:true,offset:-80});else n.scrollIntoView({behavior:'instant'});ScrollTrigger.update();};
    const visibility=()=>{document.documentElement.classList.toggle('tab-hidden',document.hidden);if(document.hidden){lenis?.stop();gsap.globalTimeline.pause();}else{lenis?.start();gsap.globalTimeline.resume();ScrollTrigger.update();}};
    let resizeTimer;
    const observer=new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{lenis?.resize();ScrollTrigger.refresh();},150);});
    observer.observe(document.querySelector('main'));
    window.addEventListener('agency:navigate',nav);document.addEventListener('visibilitychange',visibility);const frame=requestAnimationFrame(()=>{ScrollTrigger.refresh();if(location.hash)nav({detail:location.hash.slice(1)});});
    return()=>{cancelAnimationFrame(frame);clearTimeout(resizeTimer);observer.disconnect();if(tick)gsap.ticker.remove(tick);lenis?.destroy();window.removeEventListener('agency:navigate',nav);document.removeEventListener('visibilitychange',visibility);gsap.globalTimeline.resume();};
  },[paused]);return null;
}

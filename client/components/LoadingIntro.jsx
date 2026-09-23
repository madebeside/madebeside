import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';

export default function LoadingIntro({onReady}){
  const callback=useRef(onReady);callback.current=onReady;
  useEffect(()=>{
    const overlay=document.getElementById('site-intro');
    if(!overlay){callback.current();return;}
    const number=document.getElementById('intro-number'),fill=document.getElementById('intro-fill');
    const progress={value:0};let complete=false,cancelled=false,tween,exit;
    const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const markSeen=()=>{try{sessionStorage.setItem('sbm-intro-seen','1')}catch{}};
    const finish=()=>{
      if(complete||cancelled)return;complete=true;markSeen();clearTimeout(window.sbmIntroTimeout);
      callback.current();document.getElementById('intro-status').textContent='Ready.';
      exit=gsap.timeline({onComplete:()=>{overlay.remove();document.documentElement.classList.remove('intro-loading');document.getElementById('root').inert=false;window.dispatchEvent(new Event('resize'));}});
      if(reduced)exit.to(overlay,{opacity:0,duration:.18});
      else exit.to('.intro-bottom',{y:-35,opacity:0,duration:.35,ease:'power2.in'},.12).to(overlay,{yPercent:-100,duration:1.15,ease:'power3.inOut'},.2);
    };
    const update=target=>{if(cancelled||complete)return;tween?.kill();tween=gsap.to(progress,{value:target,duration:reduced?.08:target===100?.8:.6,ease:'power2.out',onUpdate:()=>{number.textContent=Math.floor(progress.value);fill.style.transform=`scaleX(${progress.value/100})`;},onComplete:target===100?finish:undefined});};
    const skipped=()=>{complete=true;markSeen();tween?.kill();exit?.kill();clearTimeout(window.sbmIntroTimeout);callback.current();};
    window.addEventListener('sbm:intro-ready',skipped);
    let loaded=15;update(loaded);
    const track=(promise,weight)=>Promise.resolve(promise).catch(()=>{}).then(()=>{loaded+=weight;update(loaded);});
    const hero=document.querySelector('.hero-visual img');
    const imageReady=hero?hero.decode():Promise.resolve();
    Promise.all([track(document.fonts.ready,25),track(imageReady,60)]).then(()=>update(100));
    return()=>{cancelled=true;tween?.kill();exit?.kill();window.removeEventListener('sbm:intro-ready',skipped);};
  },[]);
  return null;
}

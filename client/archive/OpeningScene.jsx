import React,{useEffect,useRef,useState} from 'react';
import {subscribe} from './scheduler';
import {openingState,shouldEnter,readEntrance,markEntrance} from './scroll-scenes';
import './opening-scene.css';

export default function OpeningScene({paused}){
  const root=useRef(),viewport=useRef(),headline=useRef(),gradient=useRef(),hint=useRef();
  const [entering,setEntering]=useState(false);
  useEffect(()=>{
    let storage;try{storage=sessionStorage;}catch{}
    const enter=shouldEnter({reduced:paused||matchMedia('(prefers-reduced-motion:reduce)').matches,hash:location.hash,scrollY,seen:readEntrance(storage)});
    if(!enter){setEntering(false);return;}
    markEntrance(storage);setEntering(true);
    document.documentElement.classList.add('entrance-running');
    const finish=()=>{setEntering(false);document.documentElement.classList.remove('entrance-running');};
    const timer=setTimeout(finish,1500);
    return()=>{clearTimeout(timer);document.documentElement.classList.remove('entrance-running');};
  },[paused]);
  useEffect(()=>{
    let top=0,travel=1,alive=true;
    const draw=()=>{
      const state=openingState((window.scrollY-top)/travel,paused);
      headline.current.style.transform=`scale(${state.textScale})`;
      gradient.current.style.transform=`scale(${state.backgroundScale})`;
      hint.current.style.opacity=state.uiOpacity;
    };
    // Read the stable parent offset, rather than the moving nested sticky surface.
    const measure=()=>{top=root.current.parentElement.getBoundingClientRect().top+scrollY;travel=Math.max(1,root.current.offsetHeight-viewport.current.offsetHeight);draw();};
    const clock=subscribe(draw,false);
    const observer=new IntersectionObserver(([entry])=>{clock.setActive(entry.isIntersecting&&!paused);draw();});
    observer.observe(root.current);
    const sizes=new ResizeObserver(measure);sizes.observe(root.current);
    const scroll=()=>{if(paused)draw();};
    window.addEventListener('resize',measure);window.addEventListener('scroll',scroll,{passive:true});
    measure();document.fonts?.ready.then(()=>{if(alive)measure();});
    return()=>{alive=false;clock.remove();observer.disconnect();sizes.disconnect();window.removeEventListener('resize',measure);window.removeEventListener('scroll',scroll);};
  },[paused]);
  return <section ref={root} className={'opening-scene'+(paused?' is-still':'')+(entering?' is-entering':'')} aria-labelledby="home-title">
    <div ref={viewport} className="opening-viewport">
      <div ref={gradient} className="opening-gradient" aria-hidden="true"/>
      <div ref={headline} className="opening-scale">
        <h1 id="home-title" className="elastic-headline">
          <span className="headline-line"><span style={{'--word':0}}>The</span>{' '}<span style={{'--word':1}}>best</span>{' '}<span style={{'--word':2}}>things,</span></span>{' '}
          <span className="headline-line"><span style={{'--word':3}}>are</span>{' '}<span style={{'--word':4}}>made</span>{' '}<span style={{'--word':5}}>beside</span>{' '}<span style={{'--word':6}}>you.</span></span>
        </h1>
      </div>
      <a ref={hint} className="opening-scroll-hint" href="#selected-work">Scroll to discover<span aria-hidden="true">↓</span></a>
    </div>
  </section>;
}

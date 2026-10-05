import React,{useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const endings=['worth sharing.','one of a kind.','just beginning.','made to connect.','ready to be seen.'];

export default function Hero({paused,ready=true}){
 const root=useRef();
 useLayoutEffect(()=>{
  if(paused||!ready)return;
  let rotation,inView=true;
  const ctx=gsap.context(()=>{
   const letters=gsap.utils.toArray('.story-ending').map(word=>[...word.querySelectorAll('.story-char')]);
   gsap.set(letters.flat(),{y:0,yPercent:120,rotation:8});
   gsap.set(letters[0],{yPercent:0,rotation:0});
   rotation=gsap.timeline({repeat:-1});
   letters.forEach((chars,i)=>{
    const at=i*5.05+3,next=letters[(i+1)%letters.length];
    rotation.to(chars,{yPercent:-125,rotation:-8,duration:.55,stagger:{amount:.42},ease:'power2.in'},at)
     .fromTo(next,{y:0,yPercent:120,rotation:8},{yPercent:0,rotation:0,duration:.68,stagger:{amount:.4},ease:'power3.out',immediateRender:false},at+.95);
   });
   gsap.from('.white-hero h1 .opening-line>span',{yPercent:110,duration:1,ease:'power3.out'});
   gsap.from('.white-hero-bottom',{y:24,opacity:0,duration:.8,delay:.25});
  },root);
  const sync=()=>rotation?.paused(document.hidden||!inView);
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.05});
  observer.observe(root.current);document.addEventListener('visibilitychange',sync);sync();
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);ctx.revert();};
 },[paused,ready]);
 useLayoutEffect(()=>{
  if(paused||!ready)return;
  const mm=gsap.matchMedia();
  mm.add('(min-width:768px)',()=>{
   const ctx=gsap.context(()=>{
    gsap.to('.hero-photo:first-child',{xPercent:-18,yPercent:12,rotation:-7,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.hero-photo:last-child',{xPercent:18,yPercent:-9,rotation:7,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:1}});
   },root);return()=>ctx.revert();
  });return()=>mm.revert();
 },[paused,ready]);
 return <section id="top" className="white-hero" ref={root} tabIndex="-1">
  <h1 aria-label="Your story is worth sharing."><span className="opening-line" aria-hidden="true"><span>Your story is</span></span><span className="rotating-line" aria-hidden="true">{endings.map((ending,i)=><span className={'story-ending '+(i===0?'is-first':'')} key={ending}>{[...ending].map((char,j)=><span className="story-char" key={j}>{char===' '?'\u00a0':char}</span>)}</span>)}</span></h1>
  <div className="white-hero-bottom"><div className="hero-positioning"><h2>The creative<br/>marketing agency<br/>beside your team.</h2><p>Content with character.<br/>Social with a point of view.<br/>Made with you, from the start.</p></div><div className="hero-photo-pair" aria-label="A glimpse of our photography"><figure className="hero-photo"><img src="/photography/DSC04363-480.webp" width="480" height="640" fetchPriority="high" alt="Friends celebrating around a couple in a garden."/></figure><figure className="hero-photo"><img src="/photography/DSC03607-480.webp" width="480" height="640" alt="A couple kissing beneath an ornate garden arch."/></figure></div></div>
 </section>;
}

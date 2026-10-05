import React,{useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const frames=[['Z62_4867','A couple moving through the garden between portraits.'],['DSC04363','Friends celebrating around a couple in a garden.'],['Z62_4859','A kiss on the cheek beside white blossoms.']];
export default function Hero({paused,ready=true}){
 const root=useRef();
 useLayoutEffect(()=>{
  if(paused||!ready)return;
  let cycle;
  const ctx=gsap.context(()=>{
   gsap.from('.cut-hero-line>span',{yPercent:110,rotation:2,duration:1.1,stagger:.12,ease:'power4.out'});
   gsap.from('.cut-hero-summary',{y:20,opacity:0,duration:.9,delay:.5,ease:'power3.out'});
   const images=gsap.utils.toArray('.cut-inline-media img');
   gsap.set(images,{opacity:0});gsap.set(images[0],{opacity:1});
   cycle=gsap.timeline({repeat:-1});
   images.forEach((img,i)=>{cycle.to(img,{opacity:0,duration:.6},i*3.8+3.2).to(images[(i+1)%images.length],{opacity:1,duration:.6},i*3.8+3.2);});
   gsap.to('.cut-inline-media',{rotation:-4,yPercent:12,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:1}});
  },root);
  let inView=true;const sync=()=>cycle?.paused(document.hidden||!inView);
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();});
  observer.observe(root.current);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);ctx.revert();};
 },[paused,ready]);
 return <section className="cut-hero" id="top" ref={root} tabIndex="-1">
  <h1 aria-label="We make your story mean something."><span className="cut-hero-line"><span>We make</span></span><span className="cut-hero-line cut-media-line"><span>your <span className="cut-inline-media" aria-hidden="true">{frames.map(([id,alt],i)=><img key={id} src={'/photography/'+id+'-480.webp'} width="480" height="640" alt={alt} fetchPriority={i===0?'high':'auto'}/>)}</span> story</span></span><span className="cut-hero-line"><span>mean something.</span></span></h1>
  <div className="cut-hero-summary"><h2>The creative marketing agency beside your team.</h2><p>Content, social and campaign creative.<br/>Made with you in Toronto &amp; the GTA.</p></div>
 </section>;
}

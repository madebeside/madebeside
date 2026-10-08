import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import {Kinetic} from './PageWorld';
import {GrainField,BrandDiagram} from './AspenGeometry';
import './made-room.css';
import './aspen-pages.css';
const descriptions={WORK:'A shared point of view, from the first conversation to the final frame.',CAPABILITIES:'Strategy, creative and production. Connected around your business.',APPROACH:'Your knowledge. Our perspective. We make the work together.',CONTACT:'Tell us where you are and what you have in mind. We’ll find the next step together.',CONTENT:'Photography, film and social content, from the shared brief to the final edit.',SOCIAL:'A social presence that feels like your business. Planned, made and managed beside you.',STRATEGY:'A clear direction for what to say, where to say it and what to make first.',CAMPAIGNS:'Campaign strategy and creative. One story, brought together across the right formats.'};
const titles={WORK:'Work',CAPABILITIES:'What we do',APPROACH:'Our approach',CONTACT:'Get in touch',CONTENT:'Content production',SOCIAL:'Social media',STRATEGY:'Content strategy',CAMPAIGNS:'Digital marketing'};
const forms={WORK:['frame','bend'],CAPABILITIES:['joined','spark'],APPROACH:['bend','joined'],CONTACT:['conversation','arch'],CONTENT:['aperture','frame'],SOCIAL:['arch','conversation'],STRATEGY:['spark','bend'],CAMPAIGNS:['arrow','aperture']};
export default function MadeRoom({word,paused}){
 const root=useRef();
 useEffect(()=>{
  if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const el=root.current,tiles=Array.from(el.children).map((tile,i)=>({el:tile,top:0,height:1,value:1,delay:[0,.07,.18,.1,.22][i]}));let top=0,value=0;
  const measure=()=>{top=el.getBoundingClientRect().top+scrollY;tiles.forEach(t=>{t.top=top+t.el.offsetTop;t.height=t.el.offsetHeight;});};
  const clock=subscribe((time,dt)=>{const target=Math.max(0,Math.min(1,(scrollY-top)/el.offsetHeight));value+=(target-value)*(1-Math.exp(-dt*9));el.style.setProperty('--hero-progress',value);tiles.forEach(t=>{const entry=Math.max(0,Math.min(1,(scrollY+innerHeight-t.top)/(innerHeight*.7)-t.delay));t.value+=(entry-t.value)*(1-Math.exp(-dt*8));t.el.style.setProperty('--tile-arrival',t.value);t.el.style.setProperty('--tile-exit',Math.max(0,Math.min(1,(value-t.delay)*1.35)));});},false);
  const observer=new IntersectionObserver(([e])=>clock.setActive(e.isIntersecting),{rootMargin:'150px'}),size=new ResizeObserver(measure);measure();size.observe(el);observer.observe(el);
  return()=>{clock.remove();size.disconnect();observer.disconnect();el.style.removeProperty('--hero-progress');tiles.forEach(t=>{t.el.style.removeProperty('--tile-arrival');t.el.style.removeProperty('--tile-exit');});};
 },[paused]);
 const [first,second]=forms[word]||forms.WORK; return <header ref={root} data-composition={word.toLowerCase()} className="aspen-opening reference-masthead"><div className="aspen-title-cell"><Kinetic text={titles[word]||word}/></div><div className="aspen-grain-top"><GrainField paused={paused} shape={first}/></div><div className="aspen-grain-bottom"><GrainField paused={paused} variant={2} shape={second}/></div><div className="aspen-intro-cell"><p>{descriptions[word]}</p><a href="/contact/">Start a conversation <span aria-hidden="true">↗</span></a></div><div className="aspen-brand-cell"><span>made</span><span>beside.</span><BrandDiagram topic={titles[word]} index={2}/></div></header>;
}

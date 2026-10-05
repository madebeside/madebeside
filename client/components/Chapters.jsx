import React,{useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Footer from './Footer';import Work from './Work';import Contact from './Contact';import {config} from '../config';
gsap.registerPlugin(ScrollTrigger);
const servicePaths=['content-production','social-media-management','content-strategy','digital-marketing'];
export default function Chapters({paused,pieces,collectionError}){
 const root=useRef();
 useLayoutEffect(()=>{if(paused)return;const ctx=gsap.context(()=>{
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:32,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  gsap.from('.beside-shape',{rotation:-20,scale:.85,ease:'none',scrollTrigger:{trigger:'.approach',start:'top bottom',end:'bottom top',scrub:1}});
 },root);return()=>ctx.revert();},[paused]);
 return <div ref={root}><Work paused={paused} pieces={pieces} collectionError={collectionError}/>
 <section className="capabilities" id="capabilities" tabIndex="-1"><div className="section-intro reveal"><h2>Good ideas.<br/>In good company.</h2><p>Social media management, content strategy and digital marketing creative. Based in Toronto. Working beside teams across the GTA.</p></div><div className="service-list">{config.services.map((s,i)=><details className="service" key={s.title} open={i===0}><summary><span className="service-name">{s.title}</span><span className="service-toggle" aria-hidden="true">+</span></summary><div className="service-content"><p>{s.body}</p><div><ul>{s.deliverables.map(d=><li key={d}>{d}</li>)}</ul><a className="service-more" href={'/services/'+servicePaths[i]+'/'} aria-label={'Explore '+s.title.replace('.','').toLowerCase()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg></a></div></div></details>)}</div></section>
 <section className="approach" id="approach" tabIndex="-1"><div className="beside-title"><h2>Good work<br/>starts<br/>beside you.</h2><div className="beside-shape" aria-hidden="true"><span/><span/></div></div><div className="approach-notes">{config.strengths.map(s=><div className="approach-note reveal" key={s.title}><h3>{s.title}</h3><p>{s.body}</p></div>)}<a className="line-link" href="/approach/">Get to know our approach</a></div></section>
 <Contact/><Footer/></div>;
}

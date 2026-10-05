import React,{useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Footer from './Footer';import EditorialWork from './EditorialWork';import Contact from './Contact';
gsap.registerPlugin(ScrollTrigger);
const services=[
 {name:'Content creation',line:'A story worth stopping for.',body:'Videography, photography and editing. We plan with you, capture what matters and shape the final pieces around where they will be seen.',href:'content-production',items:['Videography','Brand photography','Editing & cutdowns']},
 {name:'Social media',line:'Your voice. Out in the world.',body:'A recognisable voice and a plan you can build on. Content, publishing, scheduling, comments, messages and reporting, with your team part of the conversation.',href:'social-media-management',items:['Content & publishing','Community management','Reporting']},
 {name:'Content strategy',line:'Find your thread.',body:'We get to know your business and audience, then bring the message, themes and creative direction together before production begins.',href:'content-strategy',items:['Audience & messaging','Content planning','Creative direction']},
 {name:'Campaign creative',line:'Make the pieces belong together.',body:'Digital marketing strategy and creative that connect across channels. We build the plan and assets beside you, ready for your team or media partner to distribute.',href:'digital-marketing',items:['Campaign strategy','Channel planning','Campaign assets']}
];
export default function Chapters({paused,pieces,collectionError}){
 const root=useRef();
 useLayoutEffect(()=>{if(paused)return;const ctx=gsap.context(()=>{
  gsap.utils.toArray('.cut-arrive').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  gsap.utils.toArray('.cut-service-row').forEach(row=>gsap.from(row.querySelector('.cut-service-title'),{xPercent:-8,ease:'none',scrollTrigger:{trigger:row,start:'top bottom',end:'top 25%',scrub:1}}));
  gsap.to('.cut-process-track',{xPercent:-6,ease:'none',scrollTrigger:{trigger:'.cut-process',start:'top bottom',end:'bottom top',scrub:1}});
 },root);return()=>ctx.revert();},[paused]);
 return <div className="cut-chapters" ref={root}><EditorialWork paused={paused} pieces={pieces} collectionError={collectionError}/>
 <section className="cut-services" id="capabilities" tabIndex="-1"><div className="cut-section-heading cut-arrive"><h2>From an idea<br/>to out there.</h2><p>Social media management, content strategy<br/>and digital marketing creative.<br/>Made beside your team.</p></div><div className="cut-service-rows">{services.map((service,i)=><article className="cut-service-row" key={service.href}><div className="cut-service-title"><h3>{service.name}<span aria-hidden="true">.</span></h3></div><div className="cut-service-detail cut-arrive"><h4>{service.line}</h4><p>{service.body}</p><ul>{service.items.map(item=><li key={item}>{item}</li>)}</ul><a className="cut-plus" href={'/services/'+service.href+'/'} aria-label={'Explore '+service.name.toLowerCase()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></a></div></article>)}</div></section>
 <section className="cut-process" id="approach" tabIndex="-1"><div className="cut-process-heading cut-arrive"><h2>Beside you.<br/>All the way.</h2><p>Your knowledge. Our craft.<br/>One shared direction.</p></div><div className="cut-process-viewport"><div className="cut-process-track">{[['Listen','We start with your business, your people and what you want to say.'],['Make','A shared brief becomes a creative direction, then content shaped with your input.'],['Refine','We work through the details together and prepare the final pieces for their audience.']].map(([title,body],i)=><article className="cut-process-card" key={title}><span className="cut-step" aria-hidden="true">0{i+1}</span><h3>{title}<span>.</span></h3><p>{body}</p></article>)}</div></div><a className="cut-text-link" href="/approach/">How we work together</a></section>
 <div className="cut-inquiry"><Contact/></div><Footer/></div>;
}

import React,{useEffect,useRef} from 'react';
import {Kinetic,Photo} from './PageWorld';
import {subscribe} from './scheduler';
import MadeRoom from './MadeRoom';
const photos=['/identity/creative-hands.webp','/placeholders/project-02.jpg','/placeholders/project-01.jpg','/placeholders/project-02.jpg','/placeholders/project-03.jpg'];
export function ReferenceHero(props){return <MadeRoom {...props}/>;}
export function ReferenceImage(){return <section className="reference-wide-image" id="reference-story"><Photo src="/identity/creative-hands.webp"/></section>;}
export function ReferenceStatement({children}){return <section className="reference-statement" data-reveal><p>{children}</p></section>;}
function PlaybookChapter({item,index,prefix,paused}){
 const root=useRef(),origin=useRef();
 useEffect(()=>{
  const el=root.current;if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let top=0,current=0;
  const measure=()=>{top=origin.current.getBoundingClientRect().top+scrollY;};
  const clock=subscribe((time,dt)=>{const target=Math.max(0,Math.min(1,(scrollY+innerHeight-top)/(innerHeight*.85)));current+=(target-current)*(1-Math.exp(-dt*10));el.style.setProperty('--arrival',current);},false);
  const observer=new IntersectionObserver(([e])=>clock.setActive(e.isIntersecting),{rootMargin:'100px'}),size=new ResizeObserver(measure);
  measure();observer.observe(el);size.observe(el);window.addEventListener('resize',measure);
  return()=>{clock.remove();observer.disconnect();size.disconnect();window.removeEventListener('resize',measure);el.style.removeProperty('--arrival');};
 },[paused]);
 const [name,body,href]=item;
 return <><span className="chapter-origin" ref={origin} aria-hidden="true"/><article className={'playbook-chapter chapter-'+index} id={prefix+'-'+(index+1)} ref={root} style={{'--chapter':index}}><div className="chapter-media"><Photo src={photos[index%photos.length]}/><span className="chapter-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span></div><div className="chapter-copy">{href?<a href={href}><Kinetic as="h3" text={name}/></a>:<Kinetic as="h3" text={name}/>}<p>{body}</p>{href&&<a className="chapter-service-link" href={href}>Explore {name}<span aria-hidden="true">↗</span></a>}<span className="chapter-signature">made beside / {String(index+1).padStart(2,'0')}</span></div></article></>;
}
export function ReferencePlaybook({items,title='Our playbook.',prefix='playbook',paused}){
 return <section className="reference-playbook"><h2 className="playbook-heading">{title}</h2><div className="playbook-chapters">{items.map((item,index)=><PlaybookChapter item={item} index={index} prefix={prefix} paused={paused} key={item[0]}/>)}</div></section>;
}

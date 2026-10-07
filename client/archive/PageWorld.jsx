import React,{useEffect,useRef} from 'react';
import {subscribe} from './scheduler';
import './page-worlds.css';
export function World({name,paused,children}){
 const root=useRef();
 useEffect(()=>{
  const host=root.current;if(paused)return;
  host.classList.add('world-motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('has-arrived');observer.unobserve(e.target);}}),{threshold:.12});
  host.querySelectorAll('[data-reveal]').forEach(e=>observer.observe(e));
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return()=>{observer.disconnect();host.classList.remove('world-motion-ready');};
  const scenes=Array.from(host.querySelectorAll('.reference-wide-image,.reference-contact-sheet,.reference-statement,.world-answers,.world-process')).map(el=>({el,top:0,value:0,visible:false}));
  let alive=true;
  const measure=()=>scenes.forEach(s=>{s.top=s.el.getBoundingClientRect().top+scrollY;});
  const clock=subscribe((time,dt)=>scenes.forEach(s=>{if(!s.visible)return;const target=Math.max(0,Math.min(1,(scrollY+innerHeight-s.top)/(innerHeight*.8)));s.value+=(target-s.value)*(1-Math.exp(-dt*10));s.el.style.setProperty('--section-progress',s.value);}),false);
  const sceneObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=scenes.find(s=>s.el===e.target);if(s)s.visible=e.isIntersecting;});clock.setActive(scenes.some(s=>s.visible));},{rootMargin:'100px'});
  const size=new ResizeObserver(measure);measure();size.observe(host);scenes.forEach(s=>sceneObserver.observe(s.el));window.addEventListener('resize',measure);document.fonts?.ready.then(()=>{if(alive)measure();});
  return()=>{alive=false;clock.remove();sceneObserver.disconnect();size.disconnect();window.removeEventListener('resize',measure);scenes.forEach(s=>s.el.style.removeProperty('--section-progress'));observer.disconnect();host.classList.remove('world-motion-ready');};
 },[paused]);
 const sections=React.Children.toArray(children);
 return <div ref={root} data-page-world={name} className={'page-world world-'+name+(paused?' world-still':'')}>{sections[0]}<div className="world-content-cover">{sections.slice(1)}</div></div>;
}
export function Kinetic({text,as:Tag='h1',className=''}){
 return <Tag className={'kinetic-type '+className} data-kinetic>{text.split(' ').map((word,i)=><React.Fragment key={i}><span className="word-window"><span style={{'--word':i}}>{word}</span></span>{' '}</React.Fragment>)}</Tag>;
}
export function Photo({src='/identity/studio.webp',className=''}){
 return <figure className={'world-photo '+className} data-hover-motion onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',((e.clientX-b.left)/b.width-.5)*10+'deg');e.currentTarget.style.setProperty('--my',((e.clientY-b.top)/b.height-.5)*-10+'deg');}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--mx','0deg');e.currentTarget.style.setProperty('--my','0deg');}}>
  <img src={src} alt="Placeholder image of a creative studio" loading="lazy"/><figcaption>Placeholder image</figcaption>
 </figure>;
}
export function Ticker({text}){return <div className="world-ticker" aria-label={text}><div aria-hidden="true">{[0,1,2,3].map(i=><span key={i}>{text} <i>↗</i> </span>)}</div></div>;}
export function WorldLink({children='Let’s make it together',href='/contact/'}){return <a className="world-link" href={href}>{children}<span aria-hidden="true">↗</span></a>;}

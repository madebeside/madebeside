import React,{useEffect,useRef} from 'react';
import './page-worlds.css';
export function World({name,paused,children}){
 const root=useRef();
 useEffect(()=>{
  const host=root.current;if(paused)return;
  host.classList.add('world-motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('has-arrived');observer.unobserve(e.target);}}),{threshold:.12});
  host.querySelectorAll('[data-reveal]').forEach(e=>observer.observe(e));
  return()=>{observer.disconnect();host.classList.remove('world-motion-ready');};
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

import React,{useEffect,useRef} from 'react';
import {Kinetic} from './PageWorld';
import {subscribe} from './scheduler';
import {BrandDiagram} from './AspenGeometry';
import MadeRoom from './MadeRoom';
export function ReferenceHero(props){return <MadeRoom {...props}/>;}
export function ReferenceStatement({children}){const words=String(children).split(' ');return <section className="reference-statement" id="reference-story"><h2>Beside the work.</h2><p>{words.map((word,i)=><React.Fragment key={i}><span className="statement-word" style={{'--word-ratio':i/Math.max(1,words.length-1)}}>{word}</span>{' '}</React.Fragment>)}</p></section>;}
function PlaybookChapter({item,index,prefix,paused}){
 const root=useRef();
 useEffect(()=>{
  const el=root.current;if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let top=0,current=0,alive=true;
  const measure=()=>{top=el.getBoundingClientRect().top+scrollY;};
  const clock=subscribe((time,dt)=>{const target=Math.max(0,Math.min(1,(scrollY+innerHeight-top)/(innerHeight*.65)));current+=(target-current)*(1-Math.exp(-dt*10));el.style.setProperty('--arrival',current);},false);
  const observer=new IntersectionObserver(([e])=>{clock.setActive(e.isIntersecting);el.classList.toggle('chapter-visible',e.isIntersecting);},{rootMargin:'100px'}),size=new ResizeObserver(measure);
  measure();observer.observe(el);size.observe(el);window.addEventListener('resize',measure);document.fonts?.ready.then(()=>{if(alive)measure();});
  return()=>{alive=false;clock.remove();observer.disconnect();size.disconnect();window.removeEventListener('resize',measure);el.style.removeProperty('--arrival');el.classList.remove('chapter-visible');};
 },[paused]);
 const [name,body,href]=item;
 return <article className={'playbook-chapter chapter-'+index} id={prefix+'-'+(index+1)} ref={root}><div className="chapter-heading"><span className="chapter-number">{String(index+1).padStart(2,'0')}</span>{href?<a href={href}><Kinetic as="h3" text={name}/></a>:<Kinetic as="h3" text={name}/>}<BrandDiagram index={index}/></div><div className="chapter-copy"><p>{body}</p>{href&&<a className="chapter-service-link" href={href}>Explore {name}<span aria-hidden="true">↗</span></a>}</div></article>;
}
export function ReferencePlaybook({items,title='Our playbook.',prefix='playbook',paused}){
 return <section className="reference-playbook"><div className="aspen-playbook-intro"><h2 className="playbook-heading">{title}</h2><div className="playbook-intro-bottom"><p>{items.length} connected parts.<br/>One shared direction.</p><a href="/contact/">Start a conversation <span aria-hidden="true">↗</span></a></div></div><div className="playbook-chapters">{items.map((item,index)=><PlaybookChapter item={item} index={index} prefix={prefix} paused={paused} key={item[0]}/>)}</div></section>;
}

import React,{useEffect,useMemo,useRef,useState} from 'react';
import {selectEditorialWork} from './work-data';
import ShowcaseFilm from './ShowcaseFilm';
import {timelineIndex,timelineStep,sampleProjectMetrics} from './timeline-selection';
import './editing-showcase.css';
const timecode=seconds=>{const n=Math.floor(Math.max(0,seconds||0)*30);return [Math.floor(n/1800),Math.floor(n/30)%60,n%30].map(v=>String(v).padStart(2,'0')).join(':');};
export default function EditingShowcase({paused,pieces}){
 const section=useRef();
 const projects=useMemo(()=>selectEditorialWork(pieces,true).slice(0,3),[pieces]);
 const [selection,setActive]=useState(-1),[time,setTime]=useState(0);
 const active=timelineIndex(selection,projects.length),total=String(projects.length).padStart(2,'0');
 const rail=useRef(),buttons=useRef([]),lastPointer=useRef({x:null,y:null}),hoverUntil=useRef(0);
 useEffect(()=>{
  const el=section.current;if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  el.classList.add('showcase-motion-ready');
  const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){el.classList.add('showcase-arrived');observer.disconnect();}},{threshold:.12});observer.observe(el);
  return()=>{observer.disconnect();el.classList.remove('showcase-motion-ready','showcase-arrived');};
 },[paused]);
 const select=index=>{if(index!==active){if(document.activeElement===buttons.current[index])rail.current.focus({preventScroll:true});hoverUntil.current=performance.now()+650;setActive(index);setTime(0);}};
 const key=event=>{
  if(event.key==='Escape'){setActive(-1);rail.current.focus();return;}
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();
  const index=timelineStep(active,buttons.current.indexOf(document.activeElement),projects.length,event.key==='ArrowRight'?1:-1);
  buttons.current[index]?.focus();
  select(index);
 };
 return <section ref={section} className="editing-showcase" id="selected-work" aria-labelledby="showcase-title" tabIndex={-1}>
  <div className="timeline-heading"><h2 id="showcase-title">Selected work.</h2><span>{projects.some(p=>p.placeholder)?'Placeholder projects':''}</span></div>
  <div className={'hover-timeline'+(active>=0?' has-expanded':'')} ref={rail} tabIndex={-1} onKeyDown={key}>
   <div className="timeline-meta"><span className="timeline-signature"><span className="timeline-mb"><img src="/identity/made-beside-symbol.webp" alt=""/></span><span>made beside</span></span><span className="timeline-time">{timecode(time)} <span>/ 00:08:00</span></span><span className="timeline-status">{active>=0?projects[active].format:total+' films'}</span></div>
   <div className="timeline-stage" data-hover-motion onPointerMove={event=>{
    if(active>=0||event.pointerType!=='mouse')return;
    const rect=event.currentTarget.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const small=innerWidth<=800,width=rect.width*(small?1:.64);
    if(y>=(small?85:80)&&y<(small?305:rect.height)&&x>=0&&x<width)select(Math.min(projects.length-1,Math.floor(x/width*projects.length)));
   }}>
    <div className="timeline-ruler" aria-hidden="true">{Array.from({length:9},(_,index)=><span key={index}>{index}s</span>)}</div>
    <div className="timeline-selectors" style={{'--count':projects.length,'--active':active}}>
     {projects.map((project,index)=><button key={project.id} className={'timeline-selector'+(active===index?' is-selected':'')} ref={node=>buttons.current[index]=node} aria-label={'Expand '+project.title} disabled={active===index} aria-hidden={active===index?true:undefined} tabIndex={active===index?-1:0} aria-expanded={active===index} aria-controls={project.id+'-preview'} onPointerMove={event=>{if(event.pointerType!=='mouse')return;const p=lastPointer.current,moved=p.x!==event.clientX||p.y!==event.clientY;lastPointer.current={x:event.clientX,y:event.clientY};if(moved&&performance.now()>=hoverUntil.current)select(index);}} onClick={()=>select(index)}>
      <img src={project.poster||project.src} alt=""/><span>{project.title}</span><i aria-hidden="true">↗</i>
     </button>)}
    </div>
    {projects.map((project,index)=><article id={project.id} key={project.id} style={{'--slot':index,'--count':projects.length}} className={'timeline-clip'+(active===index?' is-expanded':'')+(active>=0&&active!==index?' is-masked':'')}>
     <img className="timeline-thumbnail" src={project.poster||project.src} alt=""/>
     <div id={project.id+'-preview'} className="timeline-preview"><ShowcaseFilm project={project} active={active===index} paused={paused} exposed onTime={active===index?setTime:undefined}/></div>
     <span className="clip-caption" aria-hidden="true"><span>{project.title}</span></span>
    </article>)}
    <div className="project-details" aria-live="polite">
     {projects.map((project,index)=><div key={project.id} className={'project-detail'+(active===index||(active<0&&index===0)?' is-current':'')} hidden={active>=0&&active!==index}>
      <span className="project-format">{project.format}</span><h3 tabIndex={0}>{project.title}</h3><p tabIndex={0}>{project.description||'A shared idea, brought to life.'}</p>
      <div className="metric-label">Sample metrics · illustrative only</div><dl>{sampleProjectMetrics(index).map(([label,value])=><div tabIndex={0} key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
     </div>)}
    </div>
   </div>
   <div className="timeline-bottom"><span>{active>=0?projects[active].title:''}</span><span>{active>=0?String(active+1).padStart(2,'0'):'—'} / {total}</span></div>
  </div>
 </section>;
}

import React,{useMemo,useRef,useState} from 'react';
import {selectEditorialWork} from './work-data';
import ShowcaseFilm from './ShowcaseFilm';
import {timelineIndex,timelineStep} from './timeline-selection';
import './editing-showcase.css';

const timecode=seconds=>{const n=Math.floor(Math.max(0,seconds||0)*30);return [Math.floor(n/1800),Math.floor(n/30)%60,n%30].map(v=>String(v).padStart(2,'0')).join(':');};
export default function EditingShowcase({paused,pieces}){
  const projects=useMemo(()=>selectEditorialWork(pieces,true).slice(0,3),[pieces]);
  const [selection,setActive]=useState(-1),[time,setTime]=useState(0);
  const active=timelineIndex(selection,projects.length),total=String(projects.length).padStart(2,'0');
  const rail=useRef(),buttons=useRef([]);
  const select=index=>{setActive(index);setTime(0);};
  const key=event=>{
    if(event.key==='Escape'){setActive(-1);rail.current.focus();return;}
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    const focused=buttons.current.indexOf(document.activeElement);
    const index=timelineStep(active,focused,projects.length,event.key==='ArrowRight'?1:-1);
    buttons.current[index]?.focus();
  };
  return <section className="editing-showcase" id="selected-work" aria-labelledby="showcase-title" tabIndex={-1}>
    <div className="timeline-heading"><h2 id="showcase-title">Selected work.</h2><span>{projects.some(project=>project.placeholder)?'Placeholder projects':''}</span></div>
    <div className={'hover-timeline'+(active>=0?' has-expanded':'')} ref={rail} tabIndex={-1} onKeyDown={key}
      onPointerLeave={()=>{if(!rail.current.contains(document.activeElement)){setActive(-1);setTime(0);}}}
      onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget)){setActive(-1);setTime(0);}}}>
      <div className="timeline-meta"><span className="timeline-signature"><i aria-hidden="true"/><span>made beside</span></span><span className="timeline-time">{timecode(time)} <span>/ 00:08:00</span></span><span className="timeline-status">{active>=0?projects[active].format:total+' films'}</span></div>
      <div className="timeline-ruler" aria-hidden="true" style={{'--segment':Math.max(0,active)*100/projects.length+'%'}}><i className="timeline-selection"/>{Array.from({length:9},(_,index)=><span key={index}>{index}s</span>)}</div>
      <div className="timeline-clips">
        {projects.map((project,index)=><article id={project.id} key={project.id} className={'timeline-clip'+(active===index?' is-expanded':'')+(active>=0&&active!==index?' is-masked':'')}
          onPointerEnter={event=>{if(event.pointerType==='mouse')select(index);}}>
          <img className="timeline-thumbnail" src={project.poster||project.src} alt=""/>
          <div id={project.id+'-preview'} className="timeline-preview"><ShowcaseFilm project={project} active={active===index} paused={paused} exposed onTime={setTime}/></div>
          <button className="timeline-clip-target" ref={node=>buttons.current[index]=node} aria-label={'Expand '+project.title} aria-expanded={active===index} aria-controls={project.id+'-preview'}
            onFocus={()=>select(index)} onClick={()=>select(index)}><span className="clip-caption"><span>{project.title}</span><i aria-hidden="true">↗</i></span></button>
        </article>)}
      </div>
      <div className="timeline-bottom"><span>Hover to watch · tap on mobile</span><span>{active>=0?String(active+1).padStart(2,'0'):'—'} / {total}</span></div>
    </div>
  </section>;
}

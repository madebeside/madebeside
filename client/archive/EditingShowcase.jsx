import React,{useEffect,useMemo,useRef,useState} from 'react';
import {subscribe} from './scheduler';
import {showcaseState} from './scroll-scenes';
import {selectEditorialWork} from './work-data';
import ShowcaseFilm from './ShowcaseFilm';
import RiverSurface from './RiverSurface';
import './editing-showcase.css';

const timecode=seconds=>{const n=Math.floor(Math.max(0,seconds||0)*30);return [Math.floor(n/108000),Math.floor(n/1800)%60,Math.floor(n/30)%60,n%30].map(v=>String(v).padStart(2,'0')).join(':');};
const number=index=>String(index+1).padStart(2,'0');

export default function EditingShowcase({paused,pieces}){
  const projects=useMemo(()=>selectEditorialWork(pieces,true).slice(0,3),[pieces]);
  const root=useRef(),stage=useRef(),workspace=useRef(),head=useRef();
  const [active,setActive]=useState(0),[time,setTime]=useState(0);
  useEffect(()=>{
    if(paused||!root.current)return;
    const scene=root.current;
    let top=0,travel=1,viewport=1,current=-1,alive=true;
    const draw=()=>{
      const state=showcaseState((scrollY-top)/travel,projects.length);
      if(current!==state.index){current=state.index;setActive(current);setTime(0);}
      head.current?.style.setProperty('--playhead',state.playhead*100+'%');
      const exit=paused?0:Math.max(0,Math.min(1,(scrollY-top-travel)/viewport));
      workspace.current.style.transform=paused?'none':`translate3d(${-exit*6}%,${exit*24}%,0) rotate(${-exit*3}deg)`;
      root.current.parentElement.style.setProperty('--review-entry',exit);
    };
    const measure=()=>{
      top=root.current.getBoundingClientRect().top+scrollY;
      viewport=stage.current.offsetHeight;
      travel=Math.max(1,root.current.offsetHeight-viewport);draw();
    };
    const clock=subscribe(draw,false);
    const observer=new IntersectionObserver(([entry])=>{clock.setActive(entry.isIntersecting&&!paused);draw();});observer.observe(root.current);
    const resize=new ResizeObserver(measure);resize.observe(root.current);
    const scroll=()=>{if(paused)draw();};
    window.addEventListener('resize',measure);window.addEventListener('scroll',scroll,{passive:true});
    measure();document.fonts?.ready.then(()=>{if(alive)measure();});
    return()=>{alive=false;clock.remove();observer.disconnect();resize.disconnect();window.removeEventListener('resize',measure);window.removeEventListener('scroll',scroll);scene.parentElement.style.removeProperty('--review-entry');};
  },[paused,projects]);
  const project=projects[active]||projects[0];
  if(paused)return <section className="showcase-stacked" id="selected-work" tabIndex={-1} aria-label="Selected work">
    {projects.map(item=><article key={item.id} id={item.id}><h2>{item.title}</h2><ShowcaseFilm project={item} active={false} paused/><p>{item.format}{item.placeholder?' · Placeholder project':''}</p></article>)}
  </section>;
  return <section ref={root} className="editing-showcase" id="selected-work" tabIndex={-1} aria-labelledby="showcase-title" style={{'--project-count':projects.length}}>
    <RiverSurface/>
    <div className="showcase-anchors" aria-hidden="true">{projects.map(item=><div id={item.id} key={item.id} tabIndex={-1}/>)}</div>
    <div className="showcase-stage" ref={stage}>
      <div className="showcase-title-row"><h2 id="showcase-title">Selected work.</h2><span aria-live="polite">{number(active)}<span> / {number(projects.length-1)}</span></span></div>
      <div className="editing-workspace" ref={workspace}>
        <div className="workspace-topbar"><span className="workspace-brand">made beside<span aria-hidden="true"> ↗</span></span><span>{project.title}.sequence</span><span className="workspace-status"><i/>Preview</span></div>
        <aside className="workspace-bin" aria-label="Project media">
          <div className="workspace-panel-title">Media<span>{number(projects.length-1)}</span></div>
          <ol>{projects.map((item,index)=><li key={item.id} className={index===active?'is-current':''}>
            <span className="bin-index">{number(index)}</span><img src={item.poster||item.src} alt=""/><div><span>{item.title}</span><small>{item.format}</small></div><span className="bin-dot" aria-hidden="true"/>
          </li>)}</ol>
          <div className="bin-project-copy"><h3>{project.title}</h3><p>{project.description}</p>{project.placeholder&&<span className="placeholder-disclosure">Placeholder project</span>}</div>
        </aside>
        <div className="workspace-program">
          <div className="workspace-panel-title">Program<span>{project.format}</span></div>
          <div className="program-screen">{projects.map((item,index)=><ShowcaseFilm key={item.id} project={item} active={index===active} paused={paused} onTime={setTime}/>)}</div>
          <div className="program-readout"><span>{timecode(time)}</span><span aria-hidden="true" className="readout-meter"><i/><i/><i/><i/><i/><i/><i/></span><span>1920 × 1080</span></div>
        </div>
        <div className="workspace-sequence" ref={head}>
          <div className="sequence-labels"><span>Sequence</span>{projects.map((item,index)=><span key={item.id}>V{index+1}</span>)}<span className="sequence-audio-label">A1</span></div>
          <div className="sequence-grid">
            <div className="sequence-ruler" aria-hidden="true">{['00:00','00:08','00:16','00:24','00:32'].map(label=><span key={label}>{label}</span>)}</div>
            {projects.map((item,index)=><div className="sequence-track" key={item.id}><div className={'sequence-clip clip-'+index+(index===active?' is-selected':'')}><img src={item.poster||item.src} alt=""/><div><span>{item.title}.mp4</span><small>{item.format}</small></div><i aria-hidden="true"/></div></div>)}
            <div className="sequence-waveform" aria-hidden="true">{Array.from({length:88},(_,index)=><i key={index} style={{height:(14+Math.abs(Math.sin(index*.72)*Math.cos(index*.27))*70)+'%'}}/>)}</div>
            <div className="sequence-playhead" aria-hidden="true"><i/><span/></div>
          </div>
        </div>
        <div className="workspace-bottom"><span>{number(active)} / {number(projects.length-1)}</span><span>Scroll through the sequence <span aria-hidden="true">↓</span></span><span>Made Beside</span></div>
      </div>
    </div>
  </section>;
}

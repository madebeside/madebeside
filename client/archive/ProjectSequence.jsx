import React,{useEffect,useMemo,useRef,useState} from 'react';
import {subscribe} from './scheduler';
import {projectVisual} from './motion';
import {selectEditorialWork} from './work-data';
import ProjectFilm from './ProjectFilm';

export default function ProjectSequence({paused,pieces,featuredOnly=false}){
  const projects=useMemo(()=>selectEditorialWork(pieces,featuredOnly),[pieces,featuredOnly]);
  const container=useRef(),[active,setActive]=useState(-1);
  useEffect(()=>{
    const root=container.current;
    const rows=[...root.querySelectorAll('[data-project-row]')].map(row=>({row,visual:row.querySelector('[data-project-visual]'),copy:row.querySelector('.project-copy')}));
    let positions=[],viewport=innerHeight,current=-1,alive=true;
    function draw(){
      let nearest=-1,distance=Infinity;
      const scroll=window.scrollY;
      positions.forEach((pos,index)=>{
        const top=pos.top-scroll,delta=Math.abs(top+pos.height/2-viewport*.52);
        if(top<viewport&&top+pos.height>0&&delta<distance){distance=delta;nearest=index;}
      });
      rows.forEach((item,index)=>{
        const pos=positions[index];if(!pos)return;
        const top=pos.top-scroll,state=projectVisual(top,pos.height,viewport,paused,nearest===index);
        item.visual.style.opacity=state.opacity;
        item.visual.style.scale=state.scale;
        item.visual.style.transform=paused?'none':`translate3d(0,${state.y}px,0)`;
        item.copy.style.opacity=.85+.15*state.focus;
      });
      if(nearest!==current){current=nearest;setActive(nearest);rows.forEach((item,i)=>item.row.classList.toggle('is-focused',i===nearest));}
    }
    function measure(){
      viewport=innerHeight;
      positions=rows.map(({row,visual})=>({top:row.getBoundingClientRect().top+scrollY+visual.offsetTop,height:visual.offsetHeight}));
      draw();
    }
    const clock=subscribe(draw,false);
    const observer=new IntersectionObserver(([entry])=>{clock.setActive(entry.isIntersecting&&!paused);draw();},{rootMargin:'100px'});
    const resize=new ResizeObserver(measure);
    measure();observer.observe(root);resize.observe(root);
    const scroll=()=>{if(paused)draw();};
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);
    document.fonts?.ready.then(()=>{if(alive)measure();});
    return()=>{alive=false;clock.remove();observer.disconnect();resize.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);};
  },[paused,projects]);
  return <section className="project-sequence" aria-label="Selected projects" id="selected-work" ref={container} tabIndex={-1}>
    {projects.map((project,i)=><article className="project-row" data-project-row key={project.id} id={project.id} aria-labelledby={project.id+'-title'} tabIndex={-1}>
      <div className="project-copy"><h2 id={project.id+'-title'}>{project.title}</h2><p>{project.description}</p><a className="project-next" href={'#'+(projects[i+1]?.id||'project-invitation')}>{i<projects.length-1?'Next project':'Make something together'}<span aria-hidden="true">↘</span></a></div>
      <ProjectFilm key={project.src} project={project} active={active===i} paused={paused}/>
    </article>)}
  </section>;
}

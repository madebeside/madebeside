import React,{useState,useEffect,useCallback} from 'react';
import {config} from './config';
import {services} from './services';
import ArchiveNav from './archive/ArchiveNav';
import ArchiveHome from './archive/ArchiveHome';
import ArchiveFooter from './archive/ArchiveFooter';
import SceneCursor from './archive/SceneCursor';
import {PortfolioPage,CapabilitiesPage,ApproachPage,ContactPage,ServicePage} from './archive/ArchivePages';
import {selectWork} from './archive/work-data';

const staticPieces=config.workPlaceholders.filter(p=>!p.placeholder);
export default function App({pathname='/',initialPieces=config.workPlaceholders}){
  const [paused,setPaused]=useState(false),[open,setOpen]=useState(false);
  const [pieces,setPieces]=useState(()=>selectWork([...initialPieces,...staticPieces]));
  const [collectionError,setCollectionError]=useState(false);
  const closeMenu=useCallback(()=>setOpen(false),[]);
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/portfolio',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>setPieces(selectWork([...(data.items||[]),...staticPieces]))).catch(e=>{if(e.name!=='AbortError')setCollectionError(true);});
    const media=matchMedia('(prefers-reduced-motion:reduce)');setPaused(media.matches);
    const change=e=>setPaused(e.matches);media.addEventListener('change',change);
    return()=>{controller.abort();media.removeEventListener('change',change);};
  },[]);
  useEffect(()=>{document.documentElement.classList.toggle('motion-off',paused);},[paused]);
  useEffect(()=>{
    const videos=[...document.querySelectorAll('video')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const video=entry.target;if(paused||!entry.isIntersecting)video.pause();else if(video.hasAttribute('data-loop'))video.play().catch(()=>{});}),{threshold:.1});
    videos.forEach(video=>{if(paused)video.pause();observer.observe(video);});
    const hide=()=>{if(document.hidden)videos.forEach(video=>video.pause());};document.addEventListener('visibilitychange',hide);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);};
  },[paused,pieces]);
  const route=pathname.replace(/\/$/,''),service=services.find(s=>route==='/services/'+s.slug);
  const Page=({'/portfolio':PortfolioPage,'/capabilities':CapabilitiesPage,'/approach':ApproachPage,'/contact':ContactPage})[route];
  return <><a className="skip" href="#main">Skip to content</a><ArchiveNav open={open} onToggle={()=>setOpen(!open)} onClose={closeMenu} pathname={pathname}/><main id="main" tabIndex="-1" aria-hidden={open?true:undefined}>{service?<ServicePage service={service} paused={paused}/>:Page?<Page paused={paused} pieces={pieces} collectionError={collectionError}/>:<ArchiveHome paused={paused} pieces={pieces} collectionError={collectionError}/>}</main><div aria-hidden={open?true:undefined}><ArchiveFooter paused={paused} invite={route!=='/contact'}/></div><button className="motion-control" aria-pressed={paused} onClick={()=>setPaused(!paused)} hidden={open}>{paused?'Resume motion':'Pause motion'}</button><SceneCursor paused={paused||open}/></>;
}

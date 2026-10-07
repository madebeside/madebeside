import React,{useState,useEffect} from 'react';
import {config} from './config';
import {services} from './services';
import ArchiveNav from './archive/ArchiveNav';
import ArchiveHome from './archive/ArchiveHome';
import ArchiveFooter from './archive/ArchiveFooter';
import SceneCursor from './archive/SceneCursor';
import RiverAtmosphere from './archive/RiverAtmosphere';
import {PortfolioPage,CapabilitiesPage,ApproachPage,ContactPage,ServicePage} from './archive/ArchivePages';
import {selectWork} from './archive/work-data';
import {watchVideos} from './archive/video-lifecycle';
import useSmoothScroll from './archive/useSmoothScroll';
import './archive/atmosphere.css';

const staticPieces=config.workPlaceholders.filter(p=>!p.placeholder);
export default function App({pathname='/',initialPieces=config.workPlaceholders}){
  const [paused,setPaused]=useState(false);
  const [pieces,setPieces]=useState(()=>selectWork([...initialPieces,...staticPieces]));
  const [collectionError,setCollectionError]=useState(false);
  useSmoothScroll(paused);
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/portfolio',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>setPieces(selectWork([...(data.items||[]),...staticPieces]))).catch(e=>{if(e.name!=='AbortError')setCollectionError(true);});
    const media=matchMedia('(prefers-reduced-motion:reduce)');
    setPaused(media.matches);
    const change=e=>setPaused(e.matches);media.addEventListener('change',change);
    return()=>{controller.abort();media.removeEventListener('change',change);};
  },[]);
  useEffect(()=>{document.documentElement.classList.toggle('motion-off',paused);},[paused]);
  useEffect(()=>{
    const videos=[...document.querySelectorAll('video:not([data-project-film]):not([data-timeline-film]):not([data-showcase-film])')];
    return watchVideos(videos,paused);
  },[paused,pieces]);
  const route=pathname.replace(/\/$/,''),service=services.find(s=>route==='/services/'+s.slug);
  const Page=({'/portfolio':PortfolioPage,'/capabilities':CapabilitiesPage,'/approach':ApproachPage,'/contact':ContactPage})[route];
  return <><RiverAtmosphere/><a className="skip" href="#main">Skip to content</a><ArchiveNav pathname={pathname}/><main id="main" tabIndex="-1">{service?<ServicePage service={service} paused={paused}/>:Page?<Page paused={paused} pieces={pieces} collectionError={collectionError}/>:<ArchiveHome paused={paused} pieces={pieces} collectionError={collectionError}/>}</main><ArchiveFooter paused={paused} invite={route!=='/contact'}/><SceneCursor paused={paused}/></>;
}

import React,{useState,useEffect} from 'react';



import {config} from './config';

import Nav from './components/SiteNav';
import ServicePage from './components/ServicePage';
import {services} from './services';
import LoadingIntro from './components/LoadingIntro';

import TextTransfer from './components/Hero';

import Chapters from './components/Chapters';

import ScrollController from './components/ScrollController';

import {PortfolioPage,CapabilitiesPage,ApproachPage,ContactPage} from './components/Pages';





export default function App({pathname="/",initialPieces=config.workPlaceholders}){
  const [introReady,setIntroReady]=useState(false);

  const [paused,setPaused]=useState(false);

  const [pieces,setPieces]=useState([...config.workPlaceholders.filter(p=>p.vimeoId||p.gallery),...initialPieces.filter(p=>!p.vimeoId&&!p.gallery)]);

  const [collectionError,setCollectionError]=useState(false);

  useEffect(()=>{

    const abort=new AbortController();

    fetch('/api/portfolio',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error();return r.json();})

      .then(data=>{if(data.items?.length)setPieces([...config.workPlaceholders.filter(p=>p.vimeoId||p.gallery),...data.items]);})

      .catch(e=>{if(e.name!=='AbortError')setCollectionError(true);});

    const media=matchMedia('(prefers-reduced-motion:reduce)');setPaused(media.matches);

    const change=e=>setPaused(e.matches);media.addEventListener('change',change);

    return()=>{abort.abort();media.removeEventListener('change',change);};

  },[]);

  useEffect(()=>{document.documentElement.classList.toggle('motion-off',paused);},[paused]);

  function navigate(e,id){e.preventDefault();history.replaceState(null,'','#'+id);window.dispatchEvent(new CustomEvent('agency:navigate',{detail:id}));requestAnimationFrame(()=>document.getElementById(id)?.focus({preventScroll:true}));}

  const route=pathname.replace(/\/$/,'');

  const service=services.find(s=>route==='/services/'+s.slug);
  const Page=({'/portfolio':PortfolioPage,'/capabilities':CapabilitiesPage,'/approach':ApproachPage,'/contact':ContactPage})[route];

  return <><LoadingIntro onReady={()=>setIntroReady(true)}/><a className="skip" href="#main">Skip to content</a><Nav pathname={pathname}/><main id="main" tabIndex="-1">{service?<ServicePage service={service} paused={paused}/>:Page?<Page paused={paused} pieces={pieces} collectionError={collectionError}/>:<><TextTransfer paused={paused} ready={introReady}/><Chapters paused={paused} pieces={pieces.some(p=>!p.placeholder)?(pieces.filter(p=>p.featured).length?[...pieces.filter(p=>p.featured).slice(0,6),...config.workPlaceholders.filter(p=>p.placeholder)]:config.workPlaceholders):pieces} collectionError={collectionError} onNavigate={navigate}/></>}</main><ScrollController paused={paused}/><button className="motion-button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button></>;



}


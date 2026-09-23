import React,{useState,useEffect} from 'react';

import {createRoot} from 'react-dom/client';

import {config} from './config';

import Nav from './components/SiteNav';
import LoadingIntro from './components/LoadingIntro';

import TextTransfer from './components/Hero';

import Chapters from './components/Chapters';

import ScrollController from './components/ScrollController';

import {PortfolioPage,CapabilitiesPage,ApproachPage,ContactPage} from './components/Pages';

import './identity.css';

import './welcoming.css';

function App(){
  const [introReady,setIntroReady]=useState(()=>!document.documentElement.classList.contains('intro-loading'));

  const [paused,setPaused]=useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);

  const [pieces,setPieces]=useState(config.workPlaceholders);

  const [collectionError,setCollectionError]=useState(false);

  useEffect(()=>{

    const abort=new AbortController();

    fetch('/api/portfolio',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error();return r.json();})

      .then(data=>{if(data.items?.length)setPieces(data.items);})

      .catch(e=>{if(e.name!=='AbortError')setCollectionError(true);});

    const media=matchMedia('(prefers-reduced-motion:reduce)');

    const change=e=>setPaused(e.matches);media.addEventListener('change',change);

    return()=>{abort.abort();media.removeEventListener('change',change);};

  },[]);

  useEffect(()=>{document.documentElement.classList.toggle('motion-off',paused);},[paused]);

  function navigate(e,id){e.preventDefault();history.replaceState(null,'','#'+id);window.dispatchEvent(new CustomEvent('agency:navigate',{detail:id}));requestAnimationFrame(()=>document.getElementById(id)?.focus({preventScroll:true}));}

  const route=location.pathname.replace(/\/$/,'');

  const Page=({'/portfolio':PortfolioPage,'/capabilities':CapabilitiesPage,'/approach':ApproachPage,'/contact':ContactPage})[route];

  return <><LoadingIntro onReady={()=>setIntroReady(true)}/><a className="skip" href="#main">Skip to content</a><Nav/><main id="main" tabIndex="-1">{Page?<Page paused={paused} pieces={pieces} collectionError={collectionError}/>:<><TextTransfer paused={paused} ready={introReady}/><Chapters paused={paused} pieces={pieces.some(p=>!p.placeholder)?(pieces.filter(p=>p.featured).length?pieces.filter(p=>p.featured).slice(0,6):config.workPlaceholders):pieces} collectionError={collectionError} onNavigate={navigate}/></>}</main><ScrollController paused={paused}/><button className="motion-button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button></>;



}

document.documentElement.style.setProperty('--green',config.accent);

createRoot(document.getElementById('root')).render(<App/>);


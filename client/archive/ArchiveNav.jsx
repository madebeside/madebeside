import React,{useEffect,useRef} from 'react';
const links=[['Work','/portfolio/'],['Services','/capabilities/'],['About','/approach/'],['Start a project','/contact/']];
export default function ArchiveNav({open,onToggle,onClose,pathname}){
  const menu=useRef(),button=useRef();
  useEffect(()=>{
    if(!open)return;
    const before=document.body.style.overflow;document.body.style.overflow='hidden';
    const focusables=()=>[button.current,...menu.current.querySelectorAll('a[href]')];
    menu.current.querySelector('a')?.focus();
    const key=e=>{
      if(e.key==='Escape'){e.preventDefault();onClose();}
      if(e.key==='Tab'){
        const all=focusables(),index=all.indexOf(document.activeElement);
        const next=(index+(e.shiftKey?-1:1)+all.length)%all.length;
        e.preventDefault();all[next].focus();
      }
    };
    document.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=before;document.removeEventListener('keydown',key);button.current?.focus();};
  },[open,onClose]);
  return <>
    <header className={'archive-nav '+(open?'menu-is-open':'')}><a className="nav-wordmark" href="/" aria-label="Made Beside home"><img src="/identity/wordmark-source.png" width="2010" height="562" alt="Made Beside"/></a><button ref={button} className="menu-toggle" onClick={onToggle} aria-expanded={open} aria-controls="archive-menu"><span aria-hidden="true">{open?'×':':/'}</span>{open?'Close':'Menu'}</button></header>
    {open&&<nav id="archive-menu" className="archive-menu" aria-label="Main navigation" ref={menu}><div className="menu-scan" aria-hidden="true">+</div><div className="menu-list">{links.map(([name,url],i)=><a key={url} href={url} aria-current={pathname===url?'page':undefined}><span>{name}</span><span className="menu-arrow" aria-hidden="true">↗</span></a>)}</div><div className="menu-bottom"><a href="mailto:hello@madebeside.com">hello@madebeside.com ↗</a><p>Good things,<br/>made beside.</p></div></nav>}
  </>;
}

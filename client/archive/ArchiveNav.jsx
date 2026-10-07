import React,{useEffect,useRef,useState} from 'react';
import './circle-menu.css';
const links=[['Work','/portfolio/'],['About','/approach/'],['Start a project','/contact/']];
export default function ArchiveNav({pathname}){
  const [open,setOpen]=useState(false),root=useRef(),button=useRef();
  useEffect(()=>{
    const outside=e=>{if(!root.current.contains(e.target))setOpen(false);};
    const key=e=>{if(e.key==='Escape'&&root.current.contains(document.activeElement)){button.current.focus();setOpen(false);}};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);};
  },[]);
  return <nav ref={root} data-hover-motion className={'circle-navigation'+(open?' is-open':'')} aria-label="Main navigation"
    onPointerEnter={e=>{if(e.pointerType==='mouse')setOpen(true);}}
    onPointerLeave={()=>{if(!root.current.contains(document.activeElement))setOpen(false);}}
    onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
    <button ref={button} className="circle-menu-trigger" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="circle-menu-links" onClick={()=>setOpen(value=>!value)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))setOpen(true);}}>
      <span aria-hidden="true"><i/><i/><i/></span>
    </button>
    <div id="circle-menu-links" className="circle-menu-links" inert={!open?true:undefined}>
      {links.map(([label,url],index)=><a key={url} href={url} style={{'--menu-order':index}} aria-current={pathname===url?'page':undefined}><span>{label}</span><i aria-hidden="true"/></a>)}
    </div>
  </nav>;
}

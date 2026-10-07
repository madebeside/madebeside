import React,{useEffect,useMemo,useState} from 'react';
import {riverNodes,riverRibbon} from './river-geometry';

export default function RiverAtmosphere(){
  const [size,setSize]=useState({width:1440,height:6000});
  useEffect(()=>{
    const root=document.getElementById('root');
    const measure=()=>{
      const box=root.getBoundingClientRect(),next={width:Math.max(1,Math.round(box.width)),height:Math.max(1,Math.round(box.height))};
      setSize(current=>current.width===next.width&&current.height===next.height?current:next);
    };
    const observer=new ResizeObserver(measure);observer.observe(root);measure();
    return()=>observer.disconnect();
  },[]);
  const ribbons=useMemo(()=>{
    const nodes=riverNodes(size.width,size.height);
    // Sub-pixel color increments feather both banks without a page-sized blur buffer.
    return Array.from({length:96},(_,index)=>riverRibbon(nodes,2.3-index/95*2.22));
  },[size.width,size.height]);
  return <div className="river-atmosphere" aria-hidden="true">
    <svg className="river-current" viewBox={'0 0 '+size.width+' '+size.height} preserveAspectRatio="none" data-gradient-river>
      <defs><linearGradient id="river-colours" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size.width*.22} y2="2900" spreadMethod="reflect">
        <stop offset="0" stopColor="#86efac"/><stop offset=".28" stopColor="#bcc6ff"/><stop offset=".56" stopColor="#ffd5bb"/><stop offset=".82" stopColor="#86efac"/><stop offset="1" stopColor="#bcc6ff"/>
      </linearGradient></defs>
      <g id="river-artwork">{ribbons.map((path,index)=><path key={index} d={path} fill="url(#river-colours)" opacity=".0093"/>)}</g>
    </svg>
  </div>;
}

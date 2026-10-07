import React,{useEffect,useMemo,useState} from 'react';
import {riverNodes,riverRibbon} from './river-geometry';

export default function RiverAtmosphere({home}){
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
    // Nested translucent ribbons feather the banks without a full-page blur filter.
    return Array.from({length:24},(_,index)=>riverRibbon(nodes,1.8-index/23*1.45));
  },[size.width,size.height]);
  return <div className="river-atmosphere" aria-hidden="true">
    <svg className="river-current" viewBox={'0 0 '+size.width+' '+size.height} preserveAspectRatio="none" data-gradient-river>
      <defs><linearGradient id="river-colours" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size.width*.22} y2="2900" spreadMethod="reflect">
        <stop offset="0" stopColor="#a2e9bb"/><stop offset=".28" stopColor="#cbd0e5"/><stop offset=".56" stopColor="#f0d7c8"/><stop offset=".82" stopColor="#a2e9bb"/><stop offset="1" stopColor="#cbd0e5"/>
      </linearGradient></defs>
      {ribbons.map((path,index)=><path key={index} d={path} fill="url(#river-colours)" opacity=".03"/>)}
    </svg>
    {home&&<div className="intro-atmosphere"/>}
  </div>;
}

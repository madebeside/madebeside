import React,{useEffect,useRef,useState} from 'react';

// Opaque covering scenes reuse the same river at its document coordinates.
export default function RiverSurface(){
  const element=useRef(),[box,setBox]=useState({width:1440,height:4000,top:2400});
  useEffect(()=>{
    const surface=element.current.parentElement,root=document.getElementById('root');
    const measure=()=>{
      let top=0,node=surface;while(node&&node!==root){top+=node.offsetTop;node=node.offsetParent;}
      const next={width:surface.offsetWidth,height:surface.offsetHeight,top};
      setBox(current=>Object.keys(next).every(key=>current[key]===next[key])?current:next);
    };
    const observer=new ResizeObserver(measure);observer.observe(root);observer.observe(surface);measure();
    return()=>observer.disconnect();
  },[]);
  return <svg ref={element} className="river-surface" viewBox={`0 ${box.top} ${Math.max(1,box.width)} ${Math.max(1,box.height)}`} preserveAspectRatio="none" aria-hidden="true"><use href="#river-artwork"/></svg>;
}

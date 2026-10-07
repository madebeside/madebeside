import React,{useEffect,useRef,useState} from 'react';
export default function ElasticWordmark({paused}){
  const root=useRef(),[seen,setSeen]=useState(false);
  useEffect(()=>{
    if(paused){setSeen(true);return;}
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);observer.disconnect();}},{threshold:.18});
    observer.observe(root.current);return()=>observer.disconnect();
  },[paused]);
  return <span ref={root} className={'elastic-wordmark'+(seen?' is-revealed':'')+(paused?' is-still':'')}><img src="/identity/wordmark-source.png" width="2010" height="562" alt="Made Beside"/></span>;
}

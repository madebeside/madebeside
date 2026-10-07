import React,{useEffect,useRef,useState} from 'react';
import './review-spread.css';
import RiverSurface from './RiverSurface';

// These are editorial placeholders, never attributed client endorsements.
const notes=[
  {style:'letter',text:<>The words that matter most will come from the <em>people beside us.</em></>,context:'A real client perspective belongs here.'},
  {style:'margin',text:<>Good work is a shared story. This space is for <em>the other side.</em></>,context:'Their experience, in their own words.'},
  {style:'fold',text:<>Every project has a point of view. We’ll leave this space <em>for theirs.</em></>,context:'A few honest words about making things together.'}
];

export default function ReviewSpread({paused}){
  const [active,setActive]=useState(0),[mobile,setMobile]=useState(false),panels=useRef();
  useEffect(()=>{
    const media=matchMedia('(max-width:1000px)');
    const change=()=>{setMobile(media.matches);setActive(media.matches?-1:0);};
    change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change);
  },[]);
  const hover=(event,index)=>{
    if(mobile||event.pointerType!=='mouse')return;
    const focused=panels.current.querySelector(':focus-visible');
    if(!focused||event.currentTarget.contains(focused))setActive(index);
  };
  return <section className={'review-spread'+(paused?' is-still':'')} id="reviews" tabIndex={-1} aria-labelledby="review-title">
    <RiverSurface/>
    <div className="review-spread-heading"><h2 id="review-title">Beside<br/>us.</h2><span>Client perspectives.<br/>Placeholder reviews for now.</span></div>
    <ol className="bookmark-panels" ref={panels} onPointerLeave={()=>{if(!mobile&&!panels.current.contains(document.activeElement))setActive(0);}}>{notes.map((note,index)=>{
      const number=String(index+1).padStart(2,'0'),expanded=active===index;
      return <li key={number} className={'review-bookmark bookmark-'+index+(expanded?' is-expanded':'')} onPointerEnter={event=>hover(event,index)}>
        <button className="bookmark-spine" aria-expanded={expanded} aria-controls={'review-body-'+number} onClick={()=>setActive(value=>mobile&&value===index?-1:index)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))setActive(index);}}>
          <span>Review {number}</span><span className="bookmark-number" aria-hidden="true">{number}</span><i aria-hidden="true">↗</i>
        </button>
        <div className="bookmark-body" id={'review-body-'+number} aria-hidden={!expanded} inert={!expanded?true:undefined}>
          <h3>Review placeholder {number}</h3><p className="bookmark-quote">{note.text}</p><span className="bookmark-context">{note.context}</span>
        </div>
      </li>;
    })}</ol>
  </section>;
}

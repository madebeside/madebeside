import React,{useRef,useState} from 'react';
import './closing.css';

// Editorial sample slots. Replace only with approved, attributed client words.
const reviews=[
  {text:'The words that matter most will come from the people beside us.',context:'A real client perspective belongs here.'},
  {text:'Good work is a shared story. This space is for the other side.',context:'Their experience, in their own words.'},
  {text:'Every project has a point of view. We’ll leave this space for theirs.',context:'A few honest words about making things together.'}
];
export default function ReviewCarousel({paused}){
  const [index,setIndex]=useState(0),touch=useRef();
  const select=next=>setIndex((next+reviews.length)%reviews.length);
  const review=reviews[index];
  return <section className={'review-section'+(paused?' is-still':'')} id="reviews" tabIndex={-1} aria-labelledby="review-title" aria-roledescription="carousel">
    <div className="review-heading"><h2 id="review-title">Their side<br/>of the story.</h2><p>Good things are made together.<br/>The people beside us get the last word.</p></div>
    <div className="review-layout">
      <div className="review-selector" aria-label="Choose a review">{reviews.map((item,position)=><button key={position} onClick={()=>select(position)} aria-label={'Show review placeholder '+(position+1)} aria-pressed={position===index}><span>{String(position+1).padStart(2,'0')}</span><span className="review-selector-line" aria-hidden="true"/><span aria-hidden="true">{position===index?'−':'+'}</span></button>)}</div>
      <div className="review-stage" onPointerDown={event=>{if(event.button!==0||event.target.closest('button'))return;touch.current={x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);}} onPointerUp={event=>{const point=touch.current;touch.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(!point)return;const dx=event.clientX-point.x,dy=event.clientY-point.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))select(index+(dx<0?1:-1));}} onPointerCancel={()=>{touch.current=null;}}>
        <div aria-live="polite" aria-atomic="true"><div className="review-slide" key={index}>
          <p className="review-placeholder-label">Review placeholder {String(index+1).padStart(2,'0')}</p>
          <blockquote data-interactive data-cursor="↔"><span className="review-quote" aria-hidden="true">“</span><p>{review.text}</p></blockquote>
          <p className="review-context">{review.context}</p>
        </div></div>
        <div className="review-controls"><span>{String(index+1).padStart(2,'0')} <span>/ 03</span></span><div><button onClick={()=>select(index-1)} aria-label="Previous review"><span aria-hidden="true">←</span></button><button onClick={()=>select(index+1)} aria-label="Next review"><span aria-hidden="true">→</span></button></div></div>
      </div>
    </div>
  </section>;
}

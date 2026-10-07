import React from 'react';
import './review-spread.css';
const notes=[
  'The words that matter most will come from the people beside us.',
  'Good work is a shared story. This space is for the other side.',
  'Every project has a point of view. We will leave this space for theirs.'
];
export default function ReviewSpread({paused}){
  return <section className={'review-spread'+(paused?' is-still':'')} id="reviews" tabIndex={-1} aria-labelledby="review-title">
    <div className="review-ribbon-heading"><h2 id="review-title">Client perspectives.</h2><span>Review placeholders</span></div>
    <div className="review-ribbons">
      {notes.map((text,index)=><article key={index} className={'review-ribbon ribbon-'+index} aria-label={'Review placeholder '+String(index+1).padStart(2,'0')}>
        <p className="sr-only">{text}</p>
        <div className="ribbon-track" aria-hidden="true">{[0,1].map(group=><div className="ribbon-group" key={group}>{[0,1].map(copy=><span key={copy}>{text}<i>↗</i></span>)}</div>)}</div>
      </article>)}
    </div>
  </section>;
}
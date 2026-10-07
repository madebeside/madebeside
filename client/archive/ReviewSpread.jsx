import React from 'react';
import './review-spread.css';
const notes=[
 'The words that matter most will come from the people beside us.',
 'Good work is a shared story. This space is for the other side.',
 'Every project has a point of view. We will leave this space for theirs.'
];
export default function ReviewSpread(){
 return <section className="review-spread" id="reviews" tabIndex={-1} aria-labelledby="review-title">
  <div className="review-heading"><h2 id="review-title">Client perspectives.</h2><p>Review placeholders · real client words coming soon.</p></div>
  <div className="review-layout">
   {notes.map((text,index)=><article key={index} className={'review-quote review-'+index} tabIndex={0} data-hover-motion aria-label={'Review placeholder '+String(index+1).padStart(2,'0')}>
    <div className="review-topline"><span>{String(index+1).padStart(2,'0')}</span><span className="review-quote-mark" aria-hidden="true">“</span></div>
    <blockquote><p>{text}</p></blockquote>
    <div className="review-attribution"><span className="review-avatar" aria-hidden="true"><i/><i/></span><div><span>Name placeholder</span><span>Company placeholder</span></div></div>
   </article>)}
  </div>
 </section>;
}

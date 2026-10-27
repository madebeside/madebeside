import React from 'react';
import './review-spread.css';
const notes=[
 {name:'Peter A Jaciw',role:'Talent & Executive Producer',paragraphs:[
  'Working with Spencer and Danny @ Made Beside can be an absolute game-changer for your brand.',
  "MADE BESIDE don’t just ‘manage’ social media. I observed them truly embed themselves naturally, as an extension of the client, bringing to life their client’s vision.",
  'It was intentional, and tailored exactly as they were required to.',
  'As an EP, the most impressive detail was the fact that they observed a complicated ‘timeline’ with precision and came in UNDER!!!'
 ]},
 {placeholder:true,paragraphs:['Good work is a shared story. This space is for the other side.']},
 {placeholder:true,paragraphs:['Every project has a point of view. We will leave this space for theirs.']}
];
export default function ReviewSpread(){
 return <section className="review-spread" id="reviews" tabIndex={-1} aria-labelledby="review-title">
  <div className="review-heading"><h2 id="review-title">Client perspectives.</h2><p>Reviews 02 and 03 are placeholders.</p></div>
  <div className="review-layout">
   {notes.map((review,index)=><article key={index} className={'review-quote review-'+index+(!review.placeholder?' review-published':'')} tabIndex={0} data-hover-motion aria-label={review.placeholder?'Review placeholder '+String(index+1).padStart(2,'0'):'Review by '+review.name}>
    <div className="review-topline"><span>{String(index+1).padStart(2,'0')}{!review.placeholder?' · Excerpt':''}</span><span className="review-quote-mark" aria-hidden="true">“</span></div>
    <blockquote>{review.paragraphs.map(text=><p key={text}>{text}</p>)}</blockquote>
    <div className="review-attribution"><span className="review-avatar" aria-hidden="true"><i/><i/></span><div><span>{review.name||'Name placeholder'}</span><span>{review.role||'Company placeholder'}</span></div></div>
   </article>)}
  </div>
 </section>;
}

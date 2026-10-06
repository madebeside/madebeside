import React,{useState} from 'react';
import './review-spread.css';

// These are editorial placeholders, never attributed client endorsements.
const notes=[
  {style:'letter',text:<>The words that matter most will come from the <em>people beside us.</em></>,context:'A real client perspective belongs here.'},
  {style:'margin',text:<>Good work is a shared story. This space is for <em>the other side.</em></>,context:'Their experience, in their own words.'},
  {style:'fold',text:<>Every project has a point of view. We’ll leave this space <em>for theirs.</em></>,context:'A few honest words about making things together.'}
];

export default function ReviewSpread({paused}){
  const [pinned,setPinned]=useState([]);
  function tilt(event){
    if(paused||event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--note-x',((event.clientY-box.top)/box.height-.5)*-4+'deg');
    event.currentTarget.style.setProperty('--note-y',((event.clientX-box.left)/box.width-.5)*4+'deg');
  }
  function settle(event){event.currentTarget.style.setProperty('--note-x','0deg');event.currentTarget.style.setProperty('--note-y','0deg');}
  return <section className={'review-spread'+(paused?' is-still':'')} id="reviews" tabIndex={-1} aria-labelledby="review-title">
    <div className="review-spread-heading"><h2 id="review-title">Their side<br/>of the story.</h2><p>Good things are made together.<br/>The people beside us get the last word.</p></div>
    <ol className="review-notes">{notes.map((note,index)=>{
      const number=String(index+1).padStart(2,'0'),isPinned=pinned.includes(index);
      return <li key={number} className={'review-note note-'+note.style+(isPinned?' is-pinned':'')} onPointerMove={tilt} onPointerLeave={settle}>
        <article aria-label={'Review placeholder '+number}>
          <div className="note-top"><span>Review placeholder {number}</span><button className="note-pin" onClick={()=>setPinned(current=>current.includes(index)?current.filter(value=>value!==index):[...current,index])} aria-label={'Pin review placeholder '+number} aria-pressed={isPinned} data-interactive data-cursor={isPinned?'Unpin':'Pin'}><span aria-hidden="true">{isPinned?'●':'↗'}</span></button></div>
          <span className="note-quote" aria-hidden="true">“</span>
          <blockquote><p>{note.text}</p></blockquote>
          <div className="note-bottom"><p>{note.context}</p><span className="note-number" aria-hidden="true">{number}</span></div>
          <span className="note-pin-status" aria-live="polite">{isPinned?'Pinned here':''}</span>
        </article>
      </li>;
    })}</ol>
    <div className="review-spread-foot"><span>Different perspectives. Shared ground.</span><span aria-hidden="true">↖ &nbsp; A few words worth keeping.</span></div>
  </section>;
}

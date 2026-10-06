import React from 'react';
import AsciiWordmark from './AsciiWordmark';
import ProjectSequence from './ProjectSequence';
import EditingTimeline from './EditingTimeline';
import ReviewCarousel from './ReviewCarousel';
import './editorial.css';

export default function ArchiveHome({paused,pieces}){
  return <div className="editorial-home">
    <div className="intro-atmosphere" aria-hidden="true"/>
    <section className="beside-opening" aria-labelledby="home-title">
      <h1 id="home-title" className="sr-only">The best things, are made beside you.</h1>
      <AsciiWordmark paused={paused} text={'The best things,\nare made beside you.'} className="intro-headline"/>
      <a className="opening-work-link" href="#selected-work">Discover the work<span aria-hidden="true">↓</span></a>
    </section>
    <ProjectSequence paused={paused} pieces={pieces} featuredOnly/>
    <EditingTimeline paused={paused}/>
    <ReviewCarousel paused={paused}/>
  </div>;
}

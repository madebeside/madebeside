import React from 'react';
import AsciiWordmark from './AsciiWordmark';
import ProjectSequence from './ProjectSequence';
import './editorial.css';

export default function ArchiveHome({paused,pieces}){
  return <div className="editorial-home">
    <div className="intro-atmosphere" aria-hidden="true"/>
    <section className="beside-opening" aria-labelledby="home-title">
      <h1 id="home-title" className="sr-only">Good things, made beside.</h1>
      <AsciiWordmark paused={paused} text={'Good things,\nmade beside.'} className="intro-headline"/>
      <a className="opening-work-link" href="#selected-work">Discover the work<span aria-hidden="true">↓</span></a>
    </section>
    <ProjectSequence paused={paused} pieces={pieces} featuredOnly/>
  </div>;
}

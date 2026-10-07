import React from 'react';
import AsciiWordmark from './AsciiWordmark';
import './opening-scene.css';
export default function OpeningScene({paused}){
  return <section className="opening-scene" aria-labelledby="home-title">
    <div className="opening-gradient" aria-hidden="true"/>
    <h1 id="home-title" className="sr-only">The best things, are made beside you.</h1>
    <AsciiWordmark paused={paused} text={'The best things,\nare made beside you.'} className="intro-headline"/>
    <a className="opening-scroll-hint" href="#selected-work">Scroll to discover<span aria-hidden="true">↓</span></a>
  </section>;
}
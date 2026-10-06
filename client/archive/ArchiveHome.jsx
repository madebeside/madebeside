import React from 'react';
import AsciiWordmark from './AsciiWordmark';
import BrandField from './BrandField';
import PixelMedia from './PixelMedia';
import ScrollComposition from './ScrollComposition';
import {photographs,selectFeaturedWork} from './work-data';
import {services} from '../services';

export default function ArchiveHome({paused,pieces,collectionError}){
  const uploaded=selectFeaturedWork(pieces);
  return <>
    <section className="archive-hero" aria-labelledby="home-title"><h1 id="home-title" className="sr-only">Made Beside — good things, made beside.</h1><AsciiWordmark paused={paused} className="hero-wordmark"/><div className="hero-baseline"><p>GOOD THINGS.<br/>MADE BESIDE.</p><p>CREATIVE PRODUCTION, SOCIAL & STRATEGY.<br/>WORKING BESIDE BUSINESS OWNERS AND GROWING BRANDS.</p></div></section>
    <section className="feature-scene brand-feature" aria-label="Made Beside motion study" id="selected-work"><BrandField paused={paused}/><div className="media-reticle" aria-hidden="true"><span>+</span><span>+</span><span>+</span></div><div className="scene-caption"><h2>CONNECTION.</h2><p>MADE BESIDE<br/>MOTION STUDY</p><a href="/approach/">OUR APPROACH ↗</a></div></section>
    {uploaded.map((piece,i)=><section className="feature-scene" key={piece.id} aria-label={piece.title}>{piece.kind==='video'?<video data-loop className="feature-video" src={piece.src} muted loop playsInline autoPlay={!paused} controls preload="metadata" aria-label={piece.title}>{piece.captions&&<track src={piece.captions} kind="captions" srcLang="en" label="English" default/>}</video>:<PixelMedia src={piece.src} alt={piece.alt||piece.title} paused={paused}/>}<div className="scene-caption"><h2>{piece.title}</h2><p>{piece.kind==='video'?'VIDEOGRAPHY':'PHOTOGRAPHY'}</p><a href="/portfolio/">VIEW WORK ↗</a></div></section>)}
    <section className="feature-scene photo-feature" aria-label="Made Beside photography"><PixelMedia src={photographs[1].src} alt={photographs[1].alt} paused={paused} priority/><div className="scene-caption"><h2>IN THE MOMENT.</h2><p>PHOTOGRAPHY<br/>MADE BESIDE</p><a href="/portfolio/">VIEW COLLECTION ↗</a></div></section>
    <a className="all-work-strip" href="/portfolio/"><span>EXPLORE THE WORK</span><span aria-hidden="true">↗</span></a>
    {collectionError&&<p className="collection-note">The live collection is unavailable. The photography collection is still here. <a href="/portfolio/">Open Work ↗</a></p>}
    <section className="identity-composition"><h2>GOOD THINGS.</h2><ScrollComposition paused={paused}><PixelMedia src={photographs[0].src} alt={photographs[0].alt} paused={paused}/></ScrollComposition><h2 className="identity-last">MADE BESIDE.</h2><div className="identity-note"><span aria-hidden="true">+</span><p>Your knowledge of the business.<br/>Our creative perspective.<br/>A shared direction, from idea to delivery.</p><a href="/approach/">MEET MADE BESIDE ↗</a></div></section>
    <section className="home-services"><h2>WE THINK.<br/>WE MAKE.<br/><span>WE STAY CLOSE.</span></h2><div className="service-index">{services.map((service,i)=><a key={service.slug} href={'/services/'+service.slug+'/'}><span className="service-index-title">{service.name}</span><span className="service-index-number">({String(i+1).padStart(2,'0')})</span><span className="service-index-arrow" aria-hidden="true">↗</span></a>)}</div><a className="text-link" href="/capabilities/">ALL SERVICES ↗</a></section>
  </>;
}

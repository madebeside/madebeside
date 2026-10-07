import React from 'react';
import OpeningScene from './OpeningScene';
import EditingShowcase from './EditingShowcase';
import ReviewSpread from './ReviewSpread';
import './editorial.css';

export default function ArchiveHome({paused,pieces}){
  return <div className="editorial-home">
    <OpeningScene paused={paused}/>
    <EditingShowcase paused={paused} pieces={pieces}/>
    <ReviewSpread paused={paused}/>
  </div>;
}

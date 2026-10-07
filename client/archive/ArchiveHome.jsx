import React from 'react';
import OpeningScene from './OpeningScene';
import ProjectSequence from './ProjectSequence';
import EditingTimeline from './EditingTimeline';
import ReviewSpread from './ReviewSpread';
import './editorial.css';

export default function ArchiveHome({paused,pieces}){
  return <div className="editorial-home">
    <OpeningScene paused={paused}/>
    <ProjectSequence paused={paused} pieces={pieces} featuredOnly/>
    <EditingTimeline paused={paused}/>
    <ReviewSpread paused={paused}/>
  </div>;
}

import React from 'react';
import {Kinetic} from './PageWorld';
import {GrainField} from './AspenGeometry';
import './made-room.css';
import './aspen-pages.css';
const descriptions={WORK:'A shared point of view, from the first conversation to the final frame.',CAPABILITIES:'Strategy, creative and production. Connected around your business.',APPROACH:'Your knowledge. Our perspective. We make the work together.',CONTACT:'Tell us where you are and what you have in mind. We’ll find the next step together.',CONTENT:'Photography, film and social content, from the shared brief to the final edit.',SOCIAL:'A social presence that feels like your business. Planned, made and managed beside you.',STRATEGY:'A clear direction for what to say, where to say it and what to make first.',CAMPAIGNS:'Campaign strategy and creative. One story, brought together across the right formats.'};
const titles={WORK:'Work',CAPABILITIES:'What we do',APPROACH:'Our approach',CONTACT:'Get in touch',CONTENT:'Content production',SOCIAL:'Social media',STRATEGY:'Content strategy',CAMPAIGNS:'Digital marketing'};
export default function MadeRoom({word,paused}){
 return <header className="aspen-opening reference-masthead"><div className="aspen-title-cell"><Kinetic text={titles[word]||word}/></div><div className="aspen-grain-top"><GrainField paused={paused}/></div><div className="aspen-grain-bottom"><GrainField paused={paused} variant={2}/></div><div className="aspen-intro-cell"><p>{descriptions[word]}</p><a href="/contact/">Start a conversation <span aria-hidden="true">↗</span></a></div><div className="aspen-brand-cell"><span>made</span><span>beside.</span><div className="aspen-joined-bars" aria-hidden="true"><i/><i/></div></div></header>;
}

import React from 'react';
import {services} from '../services';
import Contact from '../components/Contact';
import ProjectSequence from './ProjectSequence';
import {World,WorldLink} from './PageWorld';
import {ReferenceHero,ReferenceImage,ReferenceStatement,ReferencePlaybook} from './ReferenceLayout';

export function PortfolioPage({paused,pieces}){
 return <World name="portfolio" paused={paused}><ReferenceHero paused={paused} word="WORK"/><ReferenceImage/><ReferenceStatement>Ideas, shaped into something you can see. A shared point of view, from the first conversation to the final frame.</ReferenceStatement><div className="world-work-sequence"><ProjectSequence paused={paused} pieces={pieces}/></div></World>;
}
export function CapabilitiesPage({paused}){
 return <World name="capabilities" paused={paused}><ReferenceHero paused={paused} word="CAPABILITIES"/><ReferenceImage/><ReferenceStatement>A good idea is a beginning. We bring the strategy, the creative and the production together, beside your team in Toronto and the GTA.</ReferenceStatement><ReferencePlaybook paused={paused} title="What we make." prefix="capability" items={services.map(s=>[s.name,s.intro,'/services/'+s.slug+'/'])}/><div className="reference-cta"><WorldLink>Tell us what you’re building</WorldLink></div></World>;
}
export function ApproachPage({paused}){
 const steps=[['First, we listen.','Tell us what you’re building, what feels right and what’s been getting in the way. We’ll ask questions and get to know the people you want to reach.'],['Find a direction.','We turn the conversation into a shared brief, a clear scope and a creative direction everyone understands.'],['Make it together.','We plan, capture and edit with the final use in mind, keeping you beside the work through agreed checkpoints.'],['Make the details count.','We review the work together and refine the pacing, wording and small details within the agreed project scope.'],['Share it. Learn from it.','We deliver the agreed assets and, where it is part of the project, use the response to inform what comes next.']];
 return <World name="approach" paused={paused}><ReferenceHero paused={paused} word="APPROACH"/><ReferenceImage/><ReferenceStatement>Made Beside means working beside you throughout the creative process. We bring recommendations, welcome honest feedback and make the work together.</ReferenceStatement><ReferencePlaybook paused={paused} items={steps}/></World>;
}
export function ContactPage({paused}){
 return <World name="contact" paused={paused}><ReferenceHero paused={paused} word="CONTACT"/><div id="reference-story" className="reference-contact-sheet"><Contact/></div><section className="world-answers"><h2>Before we begin.</h2><div>{[['Do we need a finished brief?','No. A little context about your business and what you hope to do is a useful place to start. We can work through the rest together.'],['Can we start with one project?','Yes. We can discuss one piece of content, a campaign or a broader creative partnership. Scope and terms are agreed before starting.'],['Is this a confirmed booking?','The form sends a call request. A time still needs to be agreed; it does not book a calendar appointment.'],['Where are you based?','Made Beside is based in Toronto and serves Toronto and the Greater Toronto Area. Tell us where your project is happening.']].map(([q,a])=><details className="plain-answer" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><div className="answer-content"><p>{a}</p></div></details>)}</div></section></World>;
}
const words={'content-production':'CONTENT','social-media-management':'SOCIAL','content-strategy':'STRATEGY','digital-marketing':'CAMPAIGNS'};
export function ServicePage({service,paused}){
 return <World name={service.slug} paused={paused}><ReferenceHero paused={paused} word={words[service.slug]}/><ReferenceImage/><ReferenceStatement>{service.intro}</ReferenceStatement><section className="reference-audience" data-reveal><h2>{service.name}.</h2><p>{service.audience}</p><WorldLink>Discuss your project</WorldLink></section><ReferencePlaybook paused={paused} items={service.deliverables} title="What we can make." prefix="deliverable"/><section className="world-process">{service.steps.map(([name,body],i)=><article key={name} data-reveal><span>0{i+1}</span><h2>{name}</h2><p>{body}</p></article>)}</section><section className="world-answers"><h2>A few questions.</h2><div>{service.faqs.map(([q,a])=><details className="plain-answer" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><div className="answer-content"><p>{a}</p></div></details>)}</div></section></World>;
}

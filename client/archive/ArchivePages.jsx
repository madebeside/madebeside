import React from 'react';
import {services} from '../services';
import Contact from '../components/Contact';
import AsciiWordmark from './AsciiWordmark';
import Services from './Services';
import ProjectSequence from './ProjectSequence';

export function PortfolioPage({paused,pieces}){
  return <div className="archive-page editorial-work"><header className="page-heading"><h1>Work.</h1></header><ProjectSequence paused={paused} pieces={pieces}/></div>;
}
export function CapabilitiesPage({paused}){
  return <div className="archive-page"><header className="page-heading"><h1>MAKE IT<br/><span>MATTER.</span></h1><div className="page-heading-bottom"><p>Content, social, strategy and campaigns.<br/>Made beside your team in Toronto and the GTA.</p><a className="text-link" href="/contact/">TELL US WHAT YOU’RE BUILDING ↗</a></div></header><Services/></div>;
}
export function ApproachPage({paused}){
  const steps=[['First, we listen.','Tell us what you’re building, what feels right and what’s been getting in the way. We’ll ask questions and get to know the people you want to reach.'],['Find a direction.','We turn the conversation into a shared brief, a clear scope and a creative direction everyone understands.'],['Make it together.','We plan, capture and edit with the final use in mind, keeping you beside the work through agreed checkpoints.'],['Make the details count.','We review the work together and refine the pacing, wording and small details within the agreed project scope.'],['Share it. Learn from it.','We deliver the agreed assets and, where it is part of the project, use the response to inform what comes next.']];
  return <div className="archive-page"><header className="about-heading"><h1 className="sr-only">Made through connection.</h1><AsciiWordmark paused={paused}/><div className="page-heading-bottom"><p>A CREATIVE TEAM BESIDE YOURS.<br/>FROM CONVERSATION TO FINAL DELIVERY.</p><a className="text-link" href="/contact/">START A CONVERSATION ↗</a></div></header><section className="approach-intro"><h2>YOUR KNOWLEDGE.<br/>OUR PERSPECTIVE.<br/><span>A SHARED DIRECTION.</span></h2><p>Made Beside means working beside you throughout the creative process. We bring recommendations, welcome honest feedback and make the work together.</p></section><div className="approach-steps">{steps.map(([name,body],i)=><section className="approach-step" key={name}><span className="step-number">({String(i+1).padStart(2,'0')})</span><h2>{name}</h2><p>{body}</p></section>)}</div></div>;
}
export function ContactPage(){
  return <div className="archive-page archive-contact"><Contact standalone/><div className="contact-faq"><h2>BEFORE<br/>WE BEGIN.</h2><div>{[['Do we need a finished brief?','No. A little context about your business and what you hope to do is a useful place to start. We can work through the rest together.'],['Can we start with one project?','Yes. We can discuss one piece of content, a campaign or a broader creative partnership. Scope and terms are agreed before work begins.'],['Is this a confirmed booking?','The form sends a call request. A time still needs to be agreed; it does not book a calendar appointment.'],['Where are you based?','Made Beside is based in Toronto and serves Toronto and the Greater Toronto Area. Tell us where your project is happening.']].map(([q,a])=><article className="plain-answer" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></div>;
}
export function ServicePage({service,paused}){
  return <div className="archive-page service-page"><header className="page-heading"><h1>{service.lines.map(line=><span key={line}>{line.toUpperCase()}</span>)}</h1><div className="page-heading-bottom"><p>{service.intro}</p><a className="text-link" href="/contact/">DISCUSS YOUR PROJECT ↗</a></div></header><section className="service-audience"><h2>{service.name.toUpperCase()}.</h2><p>{service.audience}</p></section><section className="deliverables"><h2>WHAT WE<br/>CAN MAKE.</h2><div>{service.deliverables.map(([name,body])=><article className="plain-answer" key={name}><h3>{name}</h3><p>{body}</p></article>)}</div></section><section className="service-process-steps">{service.steps.map(([name,body],i)=><article key={name}><span>({String(i+1).padStart(2,'0')})</span><h2>{name}</h2><p>{body}</p></article>)}</section><div className="service-faq"><h2>A FEW<br/>QUESTIONS.</h2><div>{service.faqs.map(([q,a])=><article className="plain-answer" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></div>;
}

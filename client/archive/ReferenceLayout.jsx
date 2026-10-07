import React from 'react';
import {Kinetic,Photo} from './PageWorld';
const photos=['/identity/studio.webp','/identity/creative-hands.webp','/placeholders/project-01.jpg','/placeholders/project-02.jpg','/placeholders/project-03.jpg'];
export function ReferenceHero({word,statement}){
 return <header className="reference-masthead"><h1 className="sr-only">{statement}</h1><svg className="reference-word" viewBox="0 0 1000 300" aria-hidden="true"><text x="0" y="268" textLength="1000" lengthAdjust="spacingAndGlyphs">{word}</text></svg><Kinetic as="h2" text={statement} className="reference-tagline"/><a className="reference-down" href="#reference-story" aria-label="Explore this page">↓</a></header>;
}
export function ReferenceImage(){return <section className="reference-wide-image" id="reference-story"><Photo src="/identity/creative-hands.webp"/></section>;}
export function ReferenceStatement({children}){return <section className="reference-statement" data-reveal><p>{children}</p></section>;}
export function ReferencePlaybook({items,title='Our playbook.',prefix='playbook'}){
 return <section className="reference-playbook"><div className="reference-image-wall" aria-label="Placeholder image collection">{photos.map((src,i)=><Photo key={src} src={src} className={'wall-image wall-image-'+i}/>)}</div><div className="reference-playbook-copy"><h2 className="playbook-label">{title}</h2>{items.map(([name,body,href],i)=><article key={name} id={prefix+'-'+(i+1)} data-reveal><span className="reference-step-number">{String(i+1).padStart(2,'0')}</span>{href?<a href={href}><Kinetic as="h3" text={name}/></a>:<Kinetic as="h3" text={name}/>}<p>{body}</p></article>)}</div><nav className="reference-image-index" aria-label={title+' section navigation'}>{items.map(([name],i)=><a href={'#'+prefix+'-'+(i+1)} key={name} aria-label={'Jump to '+name}><img src={photos[i%photos.length]} alt=""/><span>{String(i+1).padStart(2,'0')}</span></a>)}</nav></section>;
}

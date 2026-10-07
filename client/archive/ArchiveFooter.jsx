import React from 'react';
import ElasticWordmark from './ElasticWordmark';
import './closing.css';

export default function ArchiveFooter({paused,invite=true}){
  return <footer className="archive-footer editorial-footer">
    <div className="footer-top">
      <section className="footer-invitation" id="project-invitation" tabIndex={-1} aria-labelledby="footer-invitation-title">
        <h2 id="footer-invitation-title">{invite?<>Let’s make<br/>your next<br/>good thing.</>:<>A good place<br/>to start.</>}</h2>
        {invite&&<a className="footer-project-link" href="/contact/"><span className="project-link-label">Start a project</span><span className="project-link-arrow" aria-hidden="true">↗</span></a>}
        <a className="footer-email" href="mailto:hello@madebeside.com">hello@madebeside.com</a>
      </section>
      <nav className="footer-column" aria-label="Footer navigation"><h3>Explore</h3>{[['Home','/'],['Work','/portfolio/'],['What we do','/capabilities/'],['Our approach','/approach/'],['Get in touch','/contact/']].map(([label,href])=><a href={href} key={href}>{label}</a>)}</nav>
      <nav className="footer-column" aria-label="Social profiles"><h3>Find us</h3><a href="https://www.instagram.com/MadeBeside/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/company/made-beside" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.tiktok.com/@MadeBeside" target="_blank" rel="noreferrer">TikTok ↗</a></nav>
    </div>
    <a className="footer-logo" href="/" aria-label="Made Beside home"><ElasticWordmark paused={paused}/></a>
    <div className="footer-bottom"><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:paused?'instant':'smooth'})}>Back to top ↑</button><span>© {new Date().getFullYear()} Made Beside</span><div>{[['Privacy','privacy'],['Terms','terms'],['Cookies','cookies'],['Refunds','refunds'],['Accessibility','accessibility']].map(([title,slug])=><a href={'/'+slug+'/'} key={slug}>{title}</a>)}</div></div>
  </footer>;
}

import React from 'react';
export default function ArchiveFooter({paused,invite=true}){
  return <footer className="archive-footer">
    {invite&&<section className="project-invitation" id="project-invitation" tabIndex={-1}><h2>Your next<br/>good thing.</h2><a className="invitation-link" href="/contact/"><span>Let’s make it together</span><span aria-hidden="true">↗</span></a></section>}
    <div className="footer-info"><p>MADE BESIDE<br/>TORONTO, CANADA</p><div><a href="mailto:hello@madebeside.com">HELLO@MADEBESIDE.COM ↗</a><a href="/contact/">GET IN TOUCH ↗</a></div><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:paused?'instant':'smooth'})}>↑ BACK TO TOP</button></div>
    <a className="footer-logo" href="/" aria-label="Made Beside home"><img src="/identity/wordmark-source.png" width="2010" height="562" alt="Made Beside"/></a>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} MADE BESIDE</span><div>{[['Privacy','privacy'],['Terms','terms'],['Cookies','cookies'],['Refunds','refunds'],['Accessibility','accessibility']].map(([title,slug])=><a href={'/'+slug+'/'} key={slug}>{title}</a>)}</div></div>
  </footer>;
}

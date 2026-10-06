import React from 'react';
import AsciiWordmark from './AsciiWordmark';
export default function ArchiveFooter({paused,invite=true}){
  return <footer className="archive-footer">
    {invite&&<section className="project-invitation"><h2>LET’S MAKE<br/><span>IT HAPPEN.</span></h2><a className="invitation-link" href="/contact/"><span>Start a project</span><span aria-hidden="true">↗</span></a></section>}
    <div className="footer-info"><p>MADE BESIDE<br/>TORONTO, CANADA</p><div><a href="mailto:hello@madebeside.com">HELLO@MADEBESIDE.COM ↗</a><a href="/contact/">GET IN TOUCH ↗</a></div><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:paused?'instant':'smooth'})}>↑ BACK TO TOP</button></div>
    <AsciiWordmark paused={paused} className="footer-wordmark"/>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} MADE BESIDE</span><div>{[['Privacy','privacy'],['Terms','terms'],['Cookies','cookies'],['Refunds','refunds'],['Accessibility','accessibility']].map(([title,slug])=><a href={'/'+slug+'/'} key={slug}>{title}</a>)}</div></div>
  </footer>;
}

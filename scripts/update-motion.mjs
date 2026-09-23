import fs from 'node:fs/promises';
const old=await fs.readFile('web/script.js','utf8');
const form=old.slice(old.indexOf("const form=document.getElementById('contact-form')"),old.indexOf("document.querySelectorAll('#year')"));
await fs.writeFile('web/script.js',`const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('.motion-toggle');
const envelope=document.querySelector('.envelope');
const chapters=[...document.querySelectorAll('.chapter')];
let motionPaused=motionMedia.matches,framePending=false;
const clamp=n=>Math.max(0,Math.min(1,n));
function updateScroll(){
 if(envelope&&!motionPaused){
  const mobile=innerWidth<=700;
  const anchor=innerHeight*(mobile?.75:.65);
  chapters.forEach((chapter,i)=>{const progress=clamp((anchor-chapter.getBoundingClientRect().top)/(innerHeight*(mobile?.48:.55)));envelope.style.setProperty(['--one','--two','--three'][i],progress.toFixed(3));});
  const opening=clamp((innerHeight-chapters[0].getBoundingClientRect().top)/(innerHeight*.45));
  envelope.style.setProperty('--open',opening.toFixed(3));
 }
 framePending=false;
}
function applyMotion(){document.body.classList.toggle('motion-paused',motionPaused);document.documentElement.classList.toggle('motion-paused',motionPaused);if(motionButton){motionButton.setAttribute('aria-pressed',String(motionPaused));motionButton.textContent=motionPaused?'Resume motion':'Pause motion';}updateScroll();}
motionButton?.addEventListener('click',()=>{motionPaused=!motionPaused;applyMotion();});
motionMedia.addEventListener('change',e=>{motionPaused=e.matches;applyMotion();});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
function schedule(){if(!framePending){framePending=true;requestAnimationFrame(updateScroll);}}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});}
`+form.replace('so we can reply','so I can reply').replace('email us directly','email me directly').replace('Keep an eye on your inbox for a personal reply.','It is saved for Spencer to review.')+'\napplyMotion();\n');

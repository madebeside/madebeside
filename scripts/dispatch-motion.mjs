import fs from 'node:fs/promises';
const prior=await fs.readFile('web/script.js','utf8');
const form=prior.slice(prior.indexOf("const form=document.getElementById('contact-form')"),prior.lastIndexOf('applyMotion();'));
await fs.writeFile('web/script.js',`const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('.motion-toggle');
const hero=document.querySelector('.hero');
const heroStage=document.querySelector('.hero-stage');
const scene=document.querySelector('.dispatch-scene');
const props=[...document.querySelectorAll('.scene-prop')];
const notes=[...document.querySelectorAll('.dispatch-note')];
const personal=document.querySelector('.personal');
let motionPaused=motionMedia.matches,framePending=false;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function updateScroll(){
 if(!motionPaused){
  if(hero){const r=hero.getBoundingClientRect();const p=clamp(-r.top/r.height);hero.style.setProperty('--foreground-shift',p*-180+'px');heroStage.style.setProperty('--drift',p*60+'px');heroStage.style.setProperty('--spread',p*80+'px');hero.classList.toggle('offscreen',r.bottom<0);}
  if(scene&&notes.length){const mobile=innerWidth<=700;const anchor=innerHeight*(mobile?.76:.52);const first=notes[0].getBoundingClientRect();const phase=clamp((anchor-first.top-first.height*.5)/first.height,0,2);props.forEach((prop,i)=>{const d=i-phase;const visible=clamp(1-Math.abs(d));prop.style.opacity=visible.toFixed(3);prop.style.transform='translate('+d*(mobile?90:170)+'px,'+Math.abs(d)*(mobile?50:85)+'px) rotate('+([-12,-6,9][i]+d*18)+'deg) scale('+(1-Math.abs(d)*.2)+')';});}
  if(personal){const r=personal.getBoundingClientRect();personal.style.setProperty('--personal-drift',clamp((innerHeight-r.top)/(innerHeight+r.height))*-65+'px');}
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
`+form+'\napplyMotion();\n');

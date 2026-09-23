const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
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
const form=document.getElementById('contact-form');let submissionId=crypto.randomUUID();
form?.addEventListener('submit',async event=>{event.preventDefault();const fields={email:form.elements.email,message:form.elements.message,consent:form.elements.consent};const status=document.getElementById('form-status');const errors=[];for(const [key,input] of Object.entries(fields)){input.removeAttribute('aria-invalid');document.getElementById(key+'-error').textContent='';}const email=fields.email.value.trim(),message=fields.message.value.trim();if(!email||!fields.email.validity.valid)errors.push(['email','Enter a valid email address so I can reply.']);if(message.length<10||message.length>2500)errors.push(['message','Please write between 10 and 2,500 characters.']);if(!fields.consent.checked)errors.push(['consent','Please agree to the use of your details for this inquiry.']);if(errors.length){for(const [key,text] of errors){fields[key].setAttribute('aria-invalid','true');document.getElementById(key+'-error').textContent=text;}status.textContent='Please check the highlighted fields.';fields[errors[0][0]].focus();return;}const submit=form.querySelector('[type=submit]');const submitLabel=submit.textContent;submit.disabled=true;submit.textContent='Sending your note…';status.textContent='';try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:submissionId,name:form.elements.name.value.trim(),email,message,consent:true,website:form.elements.website.value})});const result=await response.json();if(!response.ok)throw new Error(result.message||'Your note could not be sent. Please try again or email me directly.');form.reset();submissionId=crypto.randomUUID();status.textContent='Your note has been received. Thanks for getting in touch. It is saved for our team to review.';status.focus();}catch(error){status.textContent=error.message==='Failed to fetch'?'We could not connect. Your note is still here—try again, or email hello@madebeside.com.':error.message;status.focus();}finally{submit.disabled=false;submit.textContent=submitLabel;}});


applyMotion();

for(const heading of document.querySelectorAll('.rolling-words')){
 const words=heading.dataset.words.split('|');let index=0;let visible=true;
 const paint=()=>{heading.replaceChildren();for(const [i,char] of [...words[index]].entries()){const span=document.createElement('span');span.className='rolling-char';span.style.setProperty('--i',i);span.textContent=char===' '?'\u00a0':char;heading.append(span);}};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(heading);paint();
 setInterval(()=>{if(motionPaused||document.hidden||!visible)return;heading.classList.add('leaving');setTimeout(()=>{index=(index+1)%words.length;heading.classList.remove('leaving');paint();},850);},4200);
}

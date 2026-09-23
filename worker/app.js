import { inquiryStore } from './store.js';
import { portfolioRoute } from './portfolio.js';
export const CONSENT_VERSION='2026-09-18-inquiry-v1';
const RETENTION_MS=90*24*60*60*1000;
const SECURITY={'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.site",'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()'};
function json(status,body){return new Response(JSON.stringify(body),{status,headers:{...SECURITY,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});}
function validUUID(value){return typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
export function createWorker(assets){
  let lastCleanup=0;let submissions=[];
  return {async fetch(request,env,ctx){
    const url=new URL(request.url);const now=Date.now();
    const portfolioResponse=await portfolioRoute(request,env);if(portfolioResponse)return portfolioResponse;
    if(env.DB&&now-lastCleanup>3600000){lastCleanup=now;const cleanup=inquiryStore(env).purge(now).catch(()=>{lastCleanup=0;console.error('Inquiry retention cleanup failed');});if(ctx?.waitUntil)ctx.waitUntil(cleanup);else await cleanup;}
    if(url.pathname==='/api/contact'){
      if(request.method!=='POST')return json(405,{message:'Use the contact form to send an inquiry.'});
      if(request.headers.get('Origin')!==url.origin)return json(403,{message:'Please submit your note from this website.'});
      if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return json(415,{message:'Please use the contact form, or email us directly.'});
      if(Number(request.headers.get('Content-Length'))>16000)return json(413,{message:'This note is too long. Please keep it under 2,500 characters.'});
      let data;try{const reader=request.body?.getReader();if(!reader)return json(400,{message:'Please complete the contact form.'});let size=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16000){await reader.cancel();return json(413,{message:'This note is too long.'});}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}data=JSON.parse(new TextDecoder().decode(bytes));}catch{return json(400,{message:'Please check your note and try again.'});}
      if(!data||typeof data!=='object'||Array.isArray(data))return json(400,{message:'Please complete the contact form.'});
      if(typeof data.website==='string'&&data.website.trim())return json(400,{message:'This submission could not be accepted. Please email us directly.'});
      const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
      const message=typeof data.message==='string'?data.message.trim():'';
      const name=typeof data.name==='string'?data.name.trim():'';
      if(!validUUID(data.id)||!email||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10||message.length>2500||name.length>100||data.consent!==true)return json(422,{message:'Enter a valid email, a message of 10–2,500 characters, and agree to the use of your details for this inquiry.'});
      submissions=submissions.filter(time=>now-time<60000);if(submissions.length>=30)return json(429,{message:'We are receiving a lot of notes. Please try again in a few minutes, or email us directly.'});
      try{const store=inquiryStore(env);const existing=await store.find(data.id);if(existing){if(existing.email!==email||existing.message!==message||existing.name!==(name||null))return json(409,{message:'Please refresh the page before starting a different inquiry.'});return json(200,{ok:true});}const recent=await store.recent(email,now-600000);if(Number(recent?.count)>=3)return json(429,{message:'You have sent several notes recently. Please wait a few minutes before sending another.'});await store.save({id:data.id,name,email,message,receivedAt:now,expiresAt:now+RETENTION_MS,consentVersion:CONSENT_VERSION});submissions.push(now);return json(201,{ok:true});}catch{console.error('Contact form storage unavailable');return json(503,{message:'Your note was not saved. Please try again later or email hello@madebeside.com. Your text is still here.'});}
    }
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:SECURITY});
    let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Invalid URL',{status:400,headers:SECURITY});}
    if(!pathname.endsWith('/')&&assets[pathname+'/index.html'])return new Response(null,{status:308,headers:{...SECURITY,Location:pathname+'/'}});
    const key=pathname.endsWith('/')?pathname+'index.html':pathname;
    const asset=assets[key]||assets['/404.html'];const status=assets[key]?200:404;
    if(!asset)return new Response('Not found',{status:404,headers:SECURITY});
    const body=request.method==='HEAD'?null:Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));
    return new Response(body,{status,headers:{...SECURITY,'Content-Type':asset.type,'Cache-Control':(asset.type.startsWith('text/html')||asset.type.startsWith('text/css'))?'no-cache':'public, max-age=3600'}});
  }};
}

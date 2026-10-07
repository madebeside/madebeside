import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';

const root=fileURLToPath(new URL('../',import.meta.url));
const server=await createServer({configFile:false,root,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
after(()=>server.close());
const {default:Home}=await server.ssrLoadModule('/client/archive/ArchiveHome.jsx');
const render=paused=>renderToStaticMarkup(React.createElement(Home,{paused,pieces:[]}));

test('the visible opening headline preserves the exact sentence across line breaks',()=>{
  const html=render(false),text=html.match(/<h1[^>]*id="home-title"[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g,'');
  assert.equal(text,'The best things, are made beside you.');
});
test('every visible reduced-motion preview remains exposed to assistive technology',()=>{
  const figures=[...render(true).matchAll(/<figure[^>]*class="showcase-film[^>]*>/g)].map(match=>match[0]);
  assert.equal(figures.length,3);assert.ok(figures.every(figure=>!figure.includes('aria-hidden="true"')));
});
test('the simplified showcase has three accessible expand controls and honest placeholder disclosure',()=>{
  const html=render(false);
  assert.equal([...html.matchAll(/aria-label="Expand Project 0[123]"/g)].length,3);
  assert.match(html,/Placeholder projects/);
  assert.doesNotMatch(html,/workspace-program|sequence-playhead|type="range"/);
});
test('project fragments remain present without an obsolete header inset',async()=>{
  const css=await readFile(new URL('../client/archive/archive.css',import.meta.url),'utf8');
  const padding=parseFloat(css.match(/scroll-padding-top:([^;}]+)/)[1]);
  assert.equal(padding,0);
  for(const id of ['project-01','project-02','project-03'])assert.match(render(false),new RegExp('id="'+id+'"'));
});
test('opening retains the canvas text treatment and reviews are readable without moving ribbons',()=>{
  const html=render(false);
  assert.match(html,/ascii-wordmark/);assert.match(html,/<canvas/);
  assert.match(html,/review-quote/);assert.doesNotMatch(html,/bookmark-panels|ribbon-track/);
});

test('project descriptions and sample metrics accompany the preview without the hover instruction',()=>{
 const html=render(false);
 assert.match(html,/Sample metrics/);assert.match(html,/Leads generated/);
 assert.doesNotMatch(html,/Hover to watch|tap on mobile/i);
});
test('each stationary review identifies its placeholder author and company',()=>{
 const html=render(false);
 assert.equal([...html.matchAll(/class="review-attribution"/g)].length,3);
 assert.match(html,/Name placeholder/);assert.match(html,/Company placeholder/);
});


test('project selection targets remain outside the animated video layers',()=>{
 const html=render(false),articles=[...html.matchAll(/<article id="project-0[123]"[\s\S]*?<\/article>/g)];
 assert.equal(articles.length,3);
 for(const article of articles)assert.doesNotMatch(article[0],/<button/);
 assert.match(html,/class="timeline-selectors"/);
});
test('supporting routes retain useful content while using distinct page worlds',async()=>{
 const pages=await server.ssrLoadModule('/client/archive/ArchivePages.jsx');
 const {services}=await server.ssrLoadModule('/client/services.js');
 const worlds=[];
 for(const service of services){
  const html=renderToStaticMarkup(React.createElement(pages.ServicePage,{service,paused:true}));
  assert.match(html,new RegExp('world-'+service.slug));
  assert.match(html,/data-kinetic/);assert.match(html,/Placeholder image/);
  for(const [name] of [...service.deliverables,...service.steps,...service.faqs])assert.ok(html.includes(name));
  assert.equal((html.match(/<h1/g)||[]).length,1);
  worlds.push(html.match(/data-page-world="([^"]+)"/)?.[1]);
 }
 assert.equal(new Set(worlds).size,4);
});

test('supporting pages use the reference masthead and three-column playbook rather than service cards',async()=>{
 const pages=await server.ssrLoadModule('/client/archive/ArchivePages.jsx');
 const {services}=await server.ssrLoadModule('/client/services.js');
 const html=renderToStaticMarkup(React.createElement(pages.ServicePage,{service:services[1],paused:true}));
 assert.match(html,/reference-masthead/);assert.match(html,/reference-image-wall/);assert.match(html,/reference-playbook/);
 assert.doesNotMatch(html,/social-posters|class="world-deliverables"/);
});

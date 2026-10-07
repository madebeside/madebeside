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
test('opening restores the canvas text treatment and reviews use ribbons rather than bookmarks',()=>{
  const html=render(false);
  assert.match(html,/ascii-wordmark/);assert.match(html,/<canvas/);
  assert.match(html,/review-ribbon/);assert.doesNotMatch(html,/bookmark-panels/);
});

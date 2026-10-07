import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {showcaseState} from '../client/archive/scroll-scenes.js';

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
test('the mobile-visible program header discloses placeholder projects',()=>{
  const program=render(false).split('class="workspace-program"')[1];
  const header=program.match(/class="workspace-panel-title"[^>]*>([\s\S]*?)<\/div>/)[1];
  assert.match(header,/Placeholder project/);
});
test('native project fragment alignment selects its own project without an obsolete header inset',async()=>{
  const css=await readFile(new URL('../client/archive/archive.css',import.meta.url),'utf8');
  const padding=parseFloat(css.match(/scroll-padding-top:([^;}]+)/)[1]);
  const viewport=800;
  for(const index of [1,2])assert.equal(showcaseState((index*viewport-padding)/(3*viewport)).index,index);
});

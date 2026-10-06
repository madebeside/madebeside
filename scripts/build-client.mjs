import {build} from 'vite';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {pages} from './seo.config.mjs';
// Static policy and studio pages share the computational edition's dark identity.
for(const route of ['privacy','terms','cookies','refunds','accessibility','studio']){
 const file='web/'+route+'/index.html';
 const html=await readFile(file,'utf8');
 if(!html.includes('href="/archive-static.css"'))await writeFile(file,html.replace('</head>','<link rel="stylesheet" href="/archive-static.css"></head>'));
}
const notFound=await readFile('web/404.html','utf8');
if(!notFound.includes('href="/archive-static.css"'))await writeFile('web/404.html',notFound.replace('</head>','<link rel="stylesheet" href="/archive-static.css"></head>'));
await build();
await build({configFile:false,root:'client',ssr:{noExternal:true,target:'webworker'},define:{'process.env.NODE_ENV':'"production"'},build:{ssr:'entry-server.jsx',outDir:'../.sites-runtime/ssr',emptyOutDir:true,minify:true,rollupOptions:{output:{entryFileNames:'render.mjs',inlineDynamicImports:true}}}});
const {renderPage}=await import(pathToFileURL(resolve('.sites-runtime/ssr/render.mjs')));
const template=(await readFile('web/market/index.html','utf8')).replace(/<noscript>[\s\S]*?<\/noscript>/,'');
for(const route of Object.keys(pages)){
 if(['/privacy/','/terms/','/cookies/','/refunds/','/accessibility/'].includes(route))continue;
 await mkdir('web'+route,{recursive:true});
 const markup=renderPage(route);
 await writeFile('web'+route+'index.html',template.replace('<div id="root"></div>','<div id="root"><!--app-start-->'+markup+'<!--app-end--></div>'));
}
const {applySeo}=await import('./seo.mjs');await applySeo();

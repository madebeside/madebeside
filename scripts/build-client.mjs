import {build} from 'vite';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {pages} from './seo.config.mjs';
// Static policy and studio pages share the editorial edition's light identity.
for(const route of ['privacy','terms','cookies','refunds','accessibility','studio']){
 const file='web/'+route+'/index.html';
 let html=await readFile(file,'utf8');
 html=html.replace(/<link rel="icon"[^>]*>/g,'<link rel="icon" href="/favicon.png?v=mb2">');
 await writeFile(file,html);
 if(!html.includes('href="/archive-static.css"'))await writeFile(file,html.replace('</head>','<link rel="stylesheet" href="/archive-static.css"></head>'));
}
const notFound=await readFile('web/404.html','utf8');
if(!notFound.includes('href="/archive-static.css"'))await writeFile('web/404.html',notFound.replace('</head>','<link rel="stylesheet" href="/archive-static.css"></head>'));
await build();
await build({configFile:false,root:'client',ssr:{noExternal:true,target:'webworker'},define:{'process.env.NODE_ENV':'"production"'},build:{ssr:'entry-server.jsx',outDir:'../.sites-runtime/ssr',emptyOutDir:true,minify:true,rollupOptions:{output:{entryFileNames:'render.mjs',inlineDynamicImports:true}}}});
const {renderPage,renderFooter}=await import(pathToFileURL(resolve('.sites-runtime/ssr/render.mjs')));
// Native policy pages use the same footer component as the React pages.
await writeFile('web/archive-footer.css',await readFile('client/archive/closing.css','utf8')+`
body.policy-dark .archive-footer.editorial-footer{background:#ededed!important;color:#121111!important;border-top:0;box-sizing:border-box;--gutter:clamp(20px,2.7vw,54px);--ink:#121111;--green:#16db65}
.archive-footer *{box-sizing:border-box}.archive-footer a{text-decoration:none}.archive-footer h2,.archive-footer h3,.archive-footer p{margin:0}.archive-footer .footer-column h3{margin-bottom:24px}.archive-footer .footer-logo img{width:100%;height:auto}
@media(max-width:600px){.archive-footer .footer-column h3{margin-bottom:10px}}
`);
for(const route of ['privacy','terms','cookies','refunds','accessibility']){
 const file='web/'+route+'/index.html';let html=await readFile(file,'utf8');
 html=html.replace(/<footer[\s\S]*?<\/footer>/,()=>renderFooter()).replace(/<button class="motion-toggle"[^>]*>[^<]*<\/button>/g,'').replace(/<link rel="stylesheet" href="\/(?:footer-links|footer-socials)\.css[^"]*">/g,'');
 if(!html.includes('href="/archive-footer.css"'))html=html.replace('</head>','<link rel="stylesheet" href="/archive-footer.css"></head>');
 await writeFile(file,html);
}
const template=(await readFile('web/market/index.html','utf8')).replace(/<noscript>[\s\S]*?<\/noscript>/,'');
for(const route of Object.keys(pages)){
 if(['/privacy/','/terms/','/cookies/','/refunds/','/accessibility/'].includes(route))continue;
 await mkdir('web'+route,{recursive:true});
 const markup=renderPage(route);
 await writeFile('web'+route+'index.html',template.replace('<div id="root"></div>','<div id="root"><!--app-start-->'+markup+'<!--app-end--></div>'));
}
const {applySeo}=await import('./seo.mjs');await applySeo();

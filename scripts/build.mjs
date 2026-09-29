import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();const out=path.resolve(root,'dist');
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Unsafe build path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const assets={};
async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())await walk(file);else if(item.isFile()){const key='/'+path.relative(path.join(root,'web'),file).replaceAll('\\','/');assets[key]={type:types[path.extname(file)]||'application/octet-stream',body:(await fs.readFile(file)).toString('base64')};}}}
await walk(path.join(root,'web'));
await fs.rm(out,{recursive:true,force:true});await fs.mkdir(path.join(out,'server'),{recursive:true});await fs.mkdir(path.join(out,'.openai'),{recursive:true});
for(const name of ['app.js','store.js','portfolio.js'])await fs.copyFile('worker/'+name,path.join(out,'server',name));
await fs.copyFile('.sites-runtime/ssr/render.mjs',path.join(out,'server/render.mjs'));
await fs.writeFile(path.join(out,'server/index.js'),"import {createWorker} from './app.js';\nimport {renderPage} from './render.mjs';\nconst assets="+JSON.stringify(assets)+";\nexport default createWorker(assets,renderPage);\n");
await fs.copyFile('.openai/hosting.json',path.join(out,'.openai/hosting.json'));
await fs.cp('drizzle',path.join(out,'.openai/drizzle'),{recursive:true});
console.log(`Built ${Object.keys(assets).length} self-hosted assets and inquiry Worker.`);

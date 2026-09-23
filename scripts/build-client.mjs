import {build} from 'vite';import{readFile,writeFile,mkdir}from'node:fs/promises';
await build();const html=await readFile('web/market/index.html','utf8');await writeFile('web/index.html',html);
for(const [route,title] of Object.entries({portfolio:'Our work',capabilities:'What we do',approach:'Our approach',contact:'Say hello'})){await mkdir('web/'+route,{recursive:true});await writeFile('web/'+route+'/index.html',html.replace(/<title>.*?<\/title>/,'<title>'+title+' — Made Beside</title>'));}

import fs from 'node:fs/promises';
for(const file of ['web/index.html','web/postal.css']){let s=await fs.readFile(file,'utf8');s=s.replace(/\/postal\/([\w-]+)\.png/g,'/postal/$1.webp');await fs.writeFile(file,s);}
for(const file of ['scripts/build.mjs','serve.mjs']){let s=await fs.readFile(file,'utf8');s=s.replace("'.png':'image/png'","'.webp':'image/webp','.png':'image/png'");await fs.writeFile(file,s);}
let html=await fs.readFile('web/index.html','utf8');html=html.replace('<div class="route-manifest">','<div class="stamp-passport" aria-hidden="true">'+Array.from({length:5},(_,i)=>`<img src="/postal/postage-stamps.webp" width="60" height="50" alt="" data-collect="${i}">`).join('')+'</div><div class="route-manifest">');await fs.writeFile('web/index.html',html);

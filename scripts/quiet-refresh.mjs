import fs from 'node:fs/promises';
let h=await fs.readFile('web/index.html','utf8');
h=h.replace(/<p class="eyebrow">[\s\S]*?<\/p>/g,'').replace(/<p class="eyebrow reveal">[\s\S]*?<\/p>/g,'').replace(/<span class="scene-caption">[\s\S]*?<\/span>/,'').replace(/<p class="footer-note">[\s\S]*?<\/p>/,'');
h=h.replace('<h1>Good ideas.<br><span>Special delivery.</span></h1>','<h1 aria-label="Good ideas. Special delivery.">Good ideas.<br><span class="rolling-words" data-words="Special delivery.|Worth opening.|Made to move." aria-hidden="true">Special delivery.</span></h1>');
h=h.replace('Original Spencer B Media packaging and creative tools','Creative packaging and tools').replace('Spencer B Media parcel with a letter reading Good Ideas Inside','A parcel with a letter reading Good Ideas Inside');
await fs.writeFile('web/index.html',h);
for(const slug of ['privacy','terms','cookies','refunds','accessibility']){const f='web/'+slug+'/index.html';let x=await fs.readFile(f,'utf8');x=x.replace(/<p class="footer-note">[\s\S]*?<\/p>/,'');await fs.writeFile(f,x);}

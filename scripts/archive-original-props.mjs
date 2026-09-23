import fs from 'node:fs/promises';
await fs.mkdir('assets-unused/original-public-props',{recursive:true});for(const name of ['parcel','content','stamp'])await fs.rename('web/props/'+name+'.png','assets-unused/original-public-props/'+name+'.png');await fs.copyFile('../quiet-props/prompts.md','assets-unused/quiet-props-prompts.md');

import fs from 'node:fs/promises';
await fs.mkdir('web/iterations/refined',{recursive:true});
for(const name of ['style.css','script.js','portfolio.css','portfolio.js','enhancements.css','enhancements.js'])await fs.copyFile('web/'+name,'web/iterations/refined/'+name);
let html=await fs.readFile('web/index.html','utf8');for(const name of ['style.css','script.js','portfolio.css','portfolio.js','enhancements.css','enhancements.js'])html=html.replaceAll('/'+name,'/iterations/refined/'+name);await fs.writeFile('web/iterations/refined/index.html',html);

import fs from 'node:fs/promises';
const original=await fs.readFile('web/index.html','utf8');
await fs.mkdir('web/iterations/original',{recursive:true});
for(const name of ['style.css','script.js','portfolio.css','portfolio.js'])await fs.copyFile('web/'+name,'web/iterations/original/'+name);
let archive=original.replaceAll('href="/style.css','href="/iterations/original/style.css').replaceAll('src="/script.js','src="/iterations/original/script.js').replaceAll('href="/portfolio.css','href="/iterations/original/portfolio.css').replaceAll('src="/portfolio.js','src="/iterations/original/portfolio.js');
await fs.writeFile('web/iterations/original/index.html',archive);
let home=original.replace('aria-label="Good ideas. Special delivery."','aria-label="Good ideas are worth opening."').replace('>Good ideas.<br>','>Good ideas are<br>').replace('data-words="Special delivery.|Worth opening.|Made to move."','data-words="worth opening.|made to connect.|anything but ordinary.|ready for the world."').replace('>Special delivery.</span>','>worth opening.</span>').replace('Films, photos and content with a pulse.','Videography, photography and content with a pulse.');
home=home.replace('</head>','<link rel="stylesheet" href="/enhancements.css?v=1"><script src="/enhancements.js?v=1" defer></script></head>');
await fs.writeFile('web/index.html',home);
for(const file of ['web/portfolio/index.html','web/portfolio.js']){let s=await fs.readFile(file,'utf8');s=s.replaceAll('Film. Photography.','Videography. Photography.').replaceAll('>Film</button>','>Videography</button>').replaceAll("'Film · Play ↗'","'Videography · Play ↗'");await fs.writeFile(file,s);}

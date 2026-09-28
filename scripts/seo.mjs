import {readFile,writeFile,readdir} from 'node:fs/promises';
import {origin,pages} from './seo.config.mjs';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export async function applySeo(){
 for(const [route,[title,description]] of Object.entries(pages)){
  const file='web'+route+'index.html'; let html=await readFile(file,'utf8');
  html=html.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+escape(title)+'</title>')
   .replace(/<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/gi,'')
   .replace(/<link\s+rel="canonical"[^>]*>/gi,'')
   .replace(/<script type="application\/ld\+json" data-seo>[\s\S]*?<\/script>/g,'');
  const url=origin+route;
  const meta='<meta name="description" content="'+escape(description)+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+url+'">'+
    '<meta property="og:type" content="website"><meta property="og:site_name" content="Made Beside"><meta property="og:locale" content="en_CA"><meta property="og:title" content="'+escape(title)+'"><meta property="og:description" content="'+escape(description)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="'+origin+'/identity/creative-hands.webp"><meta property="og:image:alt" content="Hands reviewing photographic contact sheets in a creative studio"><meta name="twitter:card" content="summary_large_image">';
  const graph=[{'@type':'Organization','@id':origin+'/#organization',name:'Made Beside',url:origin+'/',email:'hello@madebeside.com',logo:origin+'/identity/made-beside-transparent.png',sameAs:['https://www.instagram.com/MadeBeside/','https://www.tiktok.com/@MadeBeside','https://www.linkedin.com/company/made-beside','https://www.facebook.com/MadeBeside/']},{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Made Beside',publisher:{'@id':origin+'/#organization'}},{'@type':route==='/contact/'?'ContactPage':route==='/approach/'?'AboutPage':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:'en-CA',isPartOf:{'@id':origin+'/#website'}}];
  if(route!=='/')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:title.split('|')[0].trim(),item:url}]});
  html=html.replace('</head>',meta+'<script type="application/ld+json" data-seo>'+JSON.stringify({'@context':'https://schema.org','@graph':graph})+'</script></head>');
  if(html.includes('<noscript>'))html=html.replace(/<noscript>[\s\S]*?<\/noscript>/,'<noscript><main style="padding:8%;font:20px sans-serif"><h1>'+escape(title.split('|')[0].trim())+'</h1><p>'+escape(description)+'</p><nav><a href="/">Home</a> · <a href="/capabilities/">Content creation and social media services</a> · <a href="/portfolio/">Portfolio</a> · <a href="/approach/">Our approach</a> · <a href="/contact/">Contact</a></nav><p><a href="mailto:hello@madebeside.com">hello@madebeside.com</a></p></main></noscript>');
  await writeFile(file,html);
 }
 async function mark(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())await mark(file);else if(entry.name.endsWith('.html')){let html=await readFile(file,'utf8');html=html.replace(/<meta name="robots"[^>]*>/gi,'').replace('</head>','<meta name="robots" content="noindex,follow"></head>');await writeFile(file,html);}}}
 for(const dir of ['web/iterations','web/postal','web/studio'])await mark(dir);
 let market=await readFile('web/market/index.html','utf8');market=market.replace('</head>','<meta name="robots" content="noindex,follow"></head>');await writeFile('web/market/index.html',market);
 await writeFile('web/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(route=>'<url><loc>'+origin+route+'</loc></url>').join('')+'</urlset>\n');
 await writeFile('web/robots.txt','User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+origin+'/sitemap.xml\n');
}

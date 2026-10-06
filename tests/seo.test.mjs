import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages,origin} from '../scripts/seo.config.mjs';
import builtWorker from '../dist/server/index.js';
import {localAssets} from '../worker/local-assets.js';
const ASSETS=localAssets('dist/assets');
const worker={fetch:(request,env)=>builtWorker.fetch(request,{ASSETS,...env})};
test('public pages have unique server-delivered metadata and valid structured data',async()=>{
 const titles=new Set(), descriptions=new Set();
 for(const [route,[title,description]] of Object.entries(pages)){
  const response=await worker.fetch(new Request(origin+route),{});assert.equal(response.status,200);
  const html=await response.text();assert.equal((html.match(/<title>/g)||[]).length,1);assert.equal((html.match(/name="description"/g)||[]).length,1);assert.ok(html.includes('rel="canonical" href="'+origin+route+'"'));assert.ok(!html.includes('content="noindex'));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json" data-seo>([\s\S]*?)<\/script>/)[1]);assert.equal(schema['@context'],'https://schema.org');titles.add(title);descriptions.add(description);
 }
 assert.equal(titles.size,Object.keys(pages).length);assert.equal(descriptions.size,Object.keys(pages).length);
});
test('sitemap, crawler controls, archived pages and URL normalization',async()=>{
 const sitemap=await worker.fetch(new Request(origin+'/sitemap.xml'),{});assert.equal(sitemap.status,200);assert.match(sitemap.headers.get('content-type'),/application\/xml/);const xml=await sitemap.text();assert.equal((xml.match(/<loc>/g)||[]).length,Object.keys(pages).length);
 for(const route of Object.keys(pages))assert.ok(xml.includes('<loc>'+origin+route+'</loc>'));
 const robots=await worker.fetch(new Request(origin+'/robots.txt'),{});assert.equal(robots.status,200);assert.ok((await robots.text()).includes('Sitemap: '+origin+'/sitemap.xml'));
 for(const route of ['/studio/','/iterations/original/','/market/','/not-a-page/']){const r=await worker.fetch(new Request(origin+route),{});assert.match(r.headers.get('x-robots-tag'),/noindex/);}
 const redirect=await worker.fetch(new Request(origin+'/capabilities/index.html'),{});assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/capabilities/');
});

test('production domain and path redirects preserve query strings',async()=>{
 for(const host of ['http://madebeside.com','http://www.madebeside.com','https://www.madebeside.com']){
  const r=await worker.fetch(new Request(host+'/services/content-strategy/?source=a%20b&x=1'),{});
  assert.equal(r.status,308);assert.equal(r.headers.get('location'),origin+'/services/content-strategy/?source=a%20b&x=1');
 }
 for(const path of ['/capabilities','/capabilities/index.html']){
  const r=await worker.fetch(new Request(origin+path+'?source=test'),{});
  assert.equal(r.status,308);assert.equal(r.headers.get('location'),'/capabilities/?source=test');
 }
 assert.equal((await worker.fetch(new Request(origin+'/missing-seo-test/'),{})).status,404);
});

test('initial HTML includes headings, service content, navigation and inquiry fields',async()=>{
 for(const route of Object.keys(pages)){
  const html=await(await worker.fetch(new Request(origin+route),{})).text();
  assert.match(html,/<h1[ >]/);assert.match(html,/href="\/contact\//);
  if(route.startsWith('/services/')){assert.match(html,/Toronto/);assert.match(html,/class="plain-answer"/);assert.match(html,/<h3>/);assert.match(html,/service-process-steps/);assert.ok(!html.includes('<details>'));}
  if(route==='/contact/')assert.match(html,/<form/);
 }
});

test('published project content is rendered safely; private drafts stay private',async()=>{
 const {DatabaseSync}=await import('node:sqlite');const {sqliteBinding}=await import('../worker/local-db.js');const fs=await import('node:fs/promises');
 const db=new DatabaseSync(':memory:');
 try{
  for(const file of (await fs.readdir('drizzle')).filter(n=>n.endsWith('.sql')).sort())db.exec(await fs.readFile('drizzle/'+file,'utf8'));
  const insert=db.prepare('INSERT INTO portfolio (id,title,description,alt,kind,mime,asset_key,status,featured,sort_order,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  const title='Public $& </script> project';
  insert.run('public',title,'Published description','Photo description','photo','image/jpeg','public.jpg','published',1,0,1);
  insert.run('private','PRIVATE DRAFT SECRET','Private description','Photo','photo','image/jpeg','private.jpg','draft',0,1,1);
  for(const path of ['/','/portfolio/']){
   const html=await(await worker.fetch(new Request(origin+path),{DB:sqliteBinding(db)})).text();
   assert.ok(html.includes('Public $&amp; &lt;/script&gt; project'));assert.ok(!html.includes('PRIVATE DRAFT SECRET'));
   const data=html.match(/<script type="application\/json" id="initial-portfolio">([\s\S]*?)<\/script>/)[1];
   assert.equal(JSON.parse(data)[0].title,title);assert.ok(!data.includes('</script>'));
  }
 }finally{db.close();}
});

test('native static asset delivery preserves bytes and HEAD avoids reading assets',async()=>{
 const route='/identity/creative-hands.webp';
 const response=await worker.fetch(new Request(origin+route),{});
 assert.equal(response.status,200);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('dist/assets'+route));
 const head=await worker.fetch(new Request(origin+route,{method:'HEAD'}),{ASSETS:{fetch(){throw new Error('HEAD must not read asset');}}});
 assert.equal(head.status,200);
 assert.equal(await head.text(),'');
 const unavailable=await worker.fetch(new Request(origin+route),{ASSETS:{fetch:async()=>new Response(null,{status:404})}});
 assert.equal(unavailable.status,503);
 assert.ok(unavailable.headers.get('Content-Security-Policy'));
});

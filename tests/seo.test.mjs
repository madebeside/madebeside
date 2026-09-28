import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages,origin} from '../scripts/seo.config.mjs';
import worker from '../dist/server/index.js';
test('public pages have unique server-delivered metadata and valid structured data',async()=>{
 const titles=new Set(), descriptions=new Set();
 for(const [route,[title,description]] of Object.entries(pages)){
  const response=await worker.fetch(new Request(origin+route),{});assert.equal(response.status,200);
  const html=await response.text();assert.equal((html.match(/<title>/g)||[]).length,1);assert.equal((html.match(/name="description"/g)||[]).length,1);assert.ok(html.includes('rel="canonical" href="'+origin+route+'"'));assert.ok(!html.includes('content="noindex'));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json" data-seo>([\s\S]*?)<\/script>/)[1]);assert.equal(schema['@context'],'https://schema.org');titles.add(title);descriptions.add(description);
 }
 assert.equal(titles.size,10);assert.equal(descriptions.size,10);
});
test('sitemap, crawler controls, archived pages and URL normalization',async()=>{
 const sitemap=await worker.fetch(new Request(origin+'/sitemap.xml'),{});assert.equal(sitemap.status,200);assert.match(sitemap.headers.get('content-type'),/application\/xml/);const xml=await sitemap.text();assert.equal((xml.match(/<loc>/g)||[]).length,10);
 for(const route of Object.keys(pages))assert.ok(xml.includes('<loc>'+origin+route+'</loc>'));
 const robots=await worker.fetch(new Request(origin+'/robots.txt'),{});assert.equal(robots.status,200);assert.ok((await robots.text()).includes('Sitemap: '+origin+'/sitemap.xml'));
 for(const route of ['/studio/','/iterations/original/','/market/','/not-a-page/']){const r=await worker.fetch(new Request(origin+route),{});assert.match(r.headers.get('x-robots-tag'),/noindex/);}
 const redirect=await worker.fetch(new Request(origin+'/capabilities/index.html'),{});assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/capabilities/');
});

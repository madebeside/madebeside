import http from 'node:http';
import fs from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import worker from './dist/server/index.js';
import {localAssets} from './worker/local-assets.js';
import {localBucket} from './worker/local-bucket.js';
import {sqliteBinding} from './worker/local-db.js';
await fs.mkdir('.sites-runtime',{recursive:true});
const sqlite=new DatabaseSync('.sites-runtime/preview.sqlite');
sqlite.exec('CREATE TABLE IF NOT EXISTS _local_migrations (name TEXT PRIMARY KEY)');
for(const name of (await fs.readdir('drizzle')).filter(n=>n.endsWith('.sql')).sort()){
 if(!sqlite.prepare('SELECT name FROM _local_migrations WHERE name=?').get(name)){
  sqlite.exec('BEGIN');try{sqlite.exec(await fs.readFile('drizzle/'+name,'utf8'));sqlite.prepare('INSERT INTO _local_migrations VALUES (?)').run(name);sqlite.exec('COMMIT');}catch(error){sqlite.exec('ROLLBACK');throw error;}
 }
}
const env={ASSETS:localAssets('dist/assets'),DB:sqliteBinding(sqlite),BUCKET:localBucket('.sites-runtime/media'),PORTFOLIO_OWNER_EMAIL:'preview-owner@local.invalid'};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:4188');
 let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>(url.pathname==='/api/portfolio'?21*1024*1024:16000)){res.writeHead(413);res.end('Too large');return;}chunks.push(chunk);}
 const response=await worker.fetch(new Request(url,{method:req.method,headers:{...req.headers,'oai-authenticated-user-id':'local-preview','oai-authenticated-user-email':'preview-owner@local.invalid'},body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),env,{waitUntil:p=>p.catch(()=>{})});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview unavailable');}
}).listen(4188,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4188'));

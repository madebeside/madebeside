const MEDIA_LIMIT=20*1024*1024;
function portfolioOwner(request,env){return !!env.PORTFOLIO_OWNER_EMAIL&&request.headers.get('oai-authenticated-user-email')?.toLowerCase()===env.PORTFOLIO_OWNER_EMAIL.toLowerCase()&&!!request.headers.get('oai-authenticated-user-id');}
function portfolioStore(env){return {
 async list(all=false){return (await env.DB.prepare(all?'SELECT * FROM portfolio ORDER BY sort_order, created_at DESC':'SELECT * FROM portfolio WHERE status = ? ORDER BY sort_order, created_at DESC').bind(...(all?[]:['published'])).all()).results;},
 async get(id){return env.DB.prepare('SELECT * FROM portfolio WHERE id = ?').bind(id).first();},
 async create(p){return env.DB.prepare('INSERT INTO portfolio (id,title,description,alt,kind,mime,asset_key,caption_key,status,featured,sort_order,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(p.id,p.title,p.description,p.alt,p.kind,p.mime,p.assetKey,p.captionKey,'draft',0,0,Date.now()).run();},
 async update(id,p){return env.DB.prepare('UPDATE portfolio SET title=?,description=?,alt=?,status=?,featured=?,sort_order=? WHERE id=?').bind(p.title,p.description,p.alt,p.status,p.featured?1:0,p.order,id).run();}
};}
function workView(p){return {id:p.id,title:p.title,description:p.description,alt:p.alt,kind:p.kind,status:p.status,featured:!!p.featured,order:p.sort_order,src:'/media/'+p.id,captions:p.caption_key?'/media/'+p.id+'/captions':null};}
function mediaType(bytes){if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';if(bytes.slice(0,8).join(',')==='137,80,78,71,13,10,26,10')return 'image/png';const t=new TextDecoder().decode(bytes.slice(0,16));if(t.startsWith('RIFF')&&t.slice(8,12)==='WEBP')return 'image/webp';if(t.slice(4,8)==='ftyp')return 'video/mp4';if(bytes.slice(0,4).join(',')==='26,69,223,163')return 'video/webm';return null;}
export async function portfolioRoute(request,env){
 const url=new URL(request.url),owner=portfolioOwner(request,env);
 const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 if(url.pathname==='/api/portfolio/session')return reply(200,{canManage:owner});
 if(!url.pathname.startsWith('/api/portfolio')&&!url.pathname.startsWith('/media/'))return null;
 try{
 const store=portfolioStore(env);
 if(url.pathname.startsWith('/media/')){
  if(!['GET','HEAD'].includes(request.method))return reply(405,{message:'Method not allowed.'});
  const parts=url.pathname.split('/'),p=await store.get(parts[2]);if(!p||(p.status!=='published'&&!owner))return reply(404,{message:'Not found.'});
  const caption=parts[3]==='captions';if(parts.length>(caption?4:3)||parts[3]&&!caption)return reply(404,{message:'Not found.'});
  const key=caption?p.caption_key:p.asset_key;if(!key)return reply(404,{message:'Not found.'});
  const obj=await env.BUCKET.get(key,{range:request.headers});if(!obj)return reply(404,{message:'Not found.'});
  const headers={'Content-Type':caption?'text/vtt; charset=utf-8':p.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Content-Length':String(obj.range?.length??obj.size)};
  if(obj.range)headers['Content-Range']=`bytes ${obj.range.offset}-${obj.range.offset+obj.range.length-1}/${obj.size}`;
  return new Response(request.method==='HEAD'?null:obj.body,{status:obj.range?206:200,headers});
 }
 if(request.method==='GET'&&url.pathname==='/api/portfolio'){
  const all=url.searchParams.get('all')==='1';if(all&&!owner)return reply(403,{message:'Sign in as the site owner.'});return reply(200,{items:(await store.list(all)).map(workView)});
 }
 if(!owner)return reply(403,{message:'Sign in as the site owner to manage the portfolio.'});
 if(request.headers.get('Origin')!==url.origin)return reply(403,{message:'Use the studio on this website.'});
 if(request.method==='POST'&&url.pathname==='/api/portfolio'){
  if(!request.headers.get('Content-Type')?.startsWith('multipart/form-data'))return reply(415,{message:'Choose a photo or video.'});
  const limit=MEDIA_LIMIT+512*1024;let size=0;const chunks=[];const reader=request.body.getReader();while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>limit){await reader.cancel();return reply(413,{message:'Please use a file under 20 MB.'});}chunks.push(part.value);}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}const form=await new Response(bytes,{headers:{'Content-Type':request.headers.get('Content-Type')}}).formData();
  const file=form.get('file'),caption=form.get('captions');const title=String(form.get('title')||'').trim(),description=String(form.get('description')||'').trim(),alt=String(form.get('alt')||'').trim();
  if(!file||typeof file.arrayBuffer!=='function'||!file.size||file.size>MEDIA_LIMIT)return reply(422,{message:'Choose a photo or video under 20 MB.'});
  if(!title||title.length>120||description.length>2500||alt.length>500)return reply(422,{message:'Add a title (up to 120 characters) and keep the description under 2,500 characters.'});
  const content=new Uint8Array(await file.arrayBuffer()),mime=mediaType(content);if(!mime)return reply(415,{message:'Use JPG, PNG, WebP, MP4 or WebM.'});const kind=mime.startsWith('video')?'video':'photo';
  if(kind==='photo'&&!alt)return reply(422,{message:'Describe the photo for visitors using screen readers.'});
  if(kind==='video'&&!description)return reply(422,{message:'Add a description or transcript for the video.'});
  let captionText=null;if(caption?.size){if(caption.size>100000)return reply(422,{message:'Caption files must be under 100 KB.'});captionText=await caption.text();if(!captionText.trimStart().startsWith('WEBVTT'))return reply(422,{message:'Use a WebVTT (.vtt) caption file.'});}
  if(kind==='video'&&form.get('hasSpeech')==='yes'&&!captionText)return reply(422,{message:'Add a .vtt caption file for a video with speech.'});
  const id=crypto.randomUUID(),assetKey='portfolio/'+id,captionKey=captionText?assetKey+'.vtt':null;
  try{await env.BUCKET.put(assetKey,content,{httpMetadata:{contentType:mime}});if(captionText)await env.BUCKET.put(captionKey,captionText,{httpMetadata:{contentType:'text/vtt'}});await store.create({id,title,description,alt,kind,mime,assetKey,captionKey});}catch(e){await env.BUCKET.delete(assetKey).catch(()=>{});if(captionKey)await env.BUCKET.delete(captionKey).catch(()=>{});throw e;}
  return reply(201,{item:workView(await store.get(id))});
 }
 if(request.method==='PATCH'&&/^\/api\/portfolio\/[\w-]+$/.test(url.pathname)){
  if(Number(request.headers.get('Content-Length'))>12000)return reply(413,{message:'The update is too large.'});const text=await request.text();if(text.length>12000)return reply(413,{message:'The update is too large.'});let p;try{p=JSON.parse(text);}catch{return reply(400,{message:'Invalid update.'});}
  if(typeof p.title!=='string'||!p.title.trim()||p.title.length>120||typeof p.description!=='string'||p.description.length>2500||typeof p.alt!=='string'||p.alt.length>500||!['draft','published','archived'].includes(p.status)||typeof p.featured!=='boolean'||!Number.isInteger(p.order)||Math.abs(p.order)>10000)return reply(422,{message:'Check the title, description and display order.'});
  const id=url.pathname.split('/').pop(),existing=await store.get(id);if(!existing)return reply(404,{message:'Piece not found.'});if(existing.kind==='photo'&&!p.alt.trim())return reply(422,{message:'Add a photo description.'});if(existing.kind==='video'&&!p.description.trim())return reply(422,{message:'Add a video description or transcript.'});await store.update(id,p);return reply(200,{item:workView(await store.get(id))});
 }
 return reply(405,{message:'Method not allowed.'});
 }catch{console.error('Portfolio operation unavailable');return reply(503,{message:'The portfolio is temporarily unavailable. Your changes were not confirmed; please try again.'});}
}

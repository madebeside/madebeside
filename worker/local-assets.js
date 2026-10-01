import {readFile} from 'node:fs/promises';
import path from 'node:path';
export function localAssets(directory){const root=path.resolve(directory);return {async fetch(request){const file=path.resolve(root,'.'+decodeURIComponent(new URL(request.url).pathname));if(!file.startsWith(root+path.sep))return new Response('Not found',{status:404});try{return new Response(await readFile(file));}catch{return new Response('Not found',{status:404});}}};}

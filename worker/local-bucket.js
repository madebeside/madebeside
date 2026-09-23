import fs from 'node:fs/promises';
import path from 'node:path';
export function localBucket(root){
 const file=key=>{if(!/^portfolio\/[\w-]+(?:\.vtt)?$/.test(key))throw Error('Invalid media key');return path.join(root,key);};
 return {async put(key,value){const target=file(key);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,typeof value==='string'?value:Buffer.from(value));},async delete(key){await fs.rm(file(key),{force:true});},async get(key,options){let body;try{body=await fs.readFile(file(key));}catch{return null;}const size=body.length;const header=options?.range?.get('range');let range;if(header){const match=/^bytes=(\d+)-(\d*)$/.exec(header);if(match){const offset=Number(match[1]),end=Math.min(size-1,match[2]?Number(match[2]):size-1);range={offset,length:Math.max(0,end-offset+1)};body=body.subarray(offset,end+1);}}return {body,size,range};}};
}

export const photographs=[
  ['Z62_4909','A couple standing together outside a garden venue'],
  ['DSC04363','A wedding party celebrating around a couple'],
  ['Z62_4867','A photograph from the Made Beside wedding collection'],
  ['DSC04499','A photograph from the Made Beside wedding collection'],
  ['Z62_4567','A photograph from the Made Beside wedding collection'],
  ['DSC03607','A photograph from the Made Beside wedding collection'],
  ['Z62_4859','A photograph from the Made Beside wedding collection']
].map(([id,alt])=>({id,alt,src:'/photography/'+id+'-1200.webp'}));
export function selectWork(items=[]){
  const seen=new Set();
  return items.filter(piece=>{
    if(!piece||piece.placeholder||!piece.id||seen.has(piece.id))return false;
    if(!piece.gallery&&!piece.vimeoId&&!(['photo','video'].includes(piece.kind)&&typeof piece.src==='string'&&piece.src))return false;
    seen.add(piece.id);return true;
  });
}
export function selectFeaturedWork(items,limit=2){return selectWork(items).filter(p=>p.featured&&!p.gallery&&!p.vimeoId).slice(0,limit);}
import {projectPlaceholders} from './project-placeholders.js';
export function selectEditorialWork(items=[],featuredOnly=false){
  const projects=selectWork(items).filter(p=>!p.gallery&&!p.vimeoId&&(!featuredOnly||p.featured));
  return projects.length?projects.map(p=>({...p,placeholder:false,format:p.format||(p.kind==='photo'?'Photography':'Film')})):projectPlaceholders;
}
export function selectShowcaseWork(items=[]){
 const projects=selectEditorialWork(items,true);
 const groups=projects.filter(p=>p.clips?.length);
 if(!groups.length)return projects.slice(0,3);
 const ordered=[...groups,...projects.filter(p=>!p.clips?.length)];
 const ids=new Set(ordered.map(p=>p.id));
 return [...ordered,...projectPlaceholders.slice(1).filter(p=>!ids.has(p.id))].slice(0,3);
}

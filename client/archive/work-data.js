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

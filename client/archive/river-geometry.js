const bends=[.24,.78,.31,.69,.17,.82,.43,.72,.26];
const widths=[.72,.49,.84,.57,.77,.51,.89,.61,.79];
const dimension=(value,fallback)=>Number.isFinite(value)&&value>0?value:fallback;

export function riverNodes(width,height){
  const w=dimension(width,1440),h=dimension(height,6000);
  const step=Math.max(620,Math.min(980,w*.75));
  return Array.from({length:Math.ceil(h/step)+2},(_,index)=>({
    x:w*bends[index%bends.length],y:index*step,width:w*widths[index%widths.length]
  }));
}
export function riverRibbon(nodes,scale=1){
  if(nodes.length<2)return '';
  const side=direction=>nodes.map(point=>({x:point.x+direction*point.width*scale/2,y:point.y}));
  const left=side(-1),right=side(1).reverse(),number=value=>Number(value.toFixed(2));
  const curve=(points)=>points.slice(1).map((point,index)=>{
    const previous=points[index],middle=number((previous.y+point.y)/2);
    return ' C '+number(previous.x)+' '+middle+' '+number(point.x)+' '+middle+' '+number(point.x)+' '+number(point.y);
  }).join('');
  return 'M '+number(left[0].x)+' '+number(left[0].y)+curve(left)+' L '+number(right[0].x)+' '+number(right[0].y)+curve(right)+' Z';
}

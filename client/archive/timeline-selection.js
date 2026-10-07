export function timelineIndex(index,count){
  const length=Number.isFinite(count)?Math.max(0,Math.floor(count)):0;
  return Math.max(-1,Math.min(length-1,Number.isFinite(index)?Math.floor(index):-1));
}
export function timelineStep(active,focused,count,direction){
  if(count<=0)return -1;
  const current=timelineIndex(focused>=0?focused:active,count);
  return current<0?(direction<0?count-1:0):(current+direction+count)%count;
}

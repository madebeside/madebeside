export function timelineIndex(index,count){
  const length=Number.isFinite(count)?Math.max(0,Math.floor(count)):0;
  return Math.max(-1,Math.min(length-1,Number.isFinite(index)?Math.floor(index):-1));
}
export function timelineStep(active,focused,count,direction){
  if(count<=0)return -1;
  const current=timelineIndex(focused>=0?focused:active,count);
  return current<0?(direction<0?count-1:0):(current+direction+count)%count;
}
export function sampleProjectMetrics(index){
 const rows=[['128K','240K','6.8%','84'],['94K','186K','5.4%','57'],['212K','395K','8.1%','126']];
 return ['Views','Impressions','Engagement','Leads generated'].map((label,i)=>[label,rows[Math.max(0,Math.min(2,Math.floor(index)||0))][i]]);
}
export function roomState(progress,reduced=false){const p=reduced?0:Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));return {depth:p*240,turn:p?p*-12:0,scale:1+p*.3,opacity:1-p*.75};}

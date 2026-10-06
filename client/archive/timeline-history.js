export function createTimelineHistory(clips){return {past:[],present:clips,future:[]};}
export function commitTimelineEdit(history,clips){
  if(JSON.stringify(history.present)===JSON.stringify(clips))return history;
  return {past:[...history.past,history.present].slice(-40),present:clips,future:[]};
}
export function undoTimelineEdit(history){
  if(!history.past.length)return history;
  return {past:history.past.slice(0,-1),present:history.past.at(-1),future:[history.present,...history.future]};
}
export function redoTimelineEdit(history){
  if(!history.future.length)return history;
  return {past:[...history.past,history.present].slice(-40),present:history.future[0],future:history.future.slice(1)};
}

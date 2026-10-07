const unit=value=>Number.isNaN(Number(value))?0:Math.max(0,Math.min(1,Number(value)||0));
export function openingState(progress,reduced=false){
  const p=reduced?0:unit(progress),curve=p*p*(3-2*p);
  return {textScale:1+6*curve,backgroundScale:1+.65*p,uiOpacity:Math.max(0,1-p*5)};
}
export function showcaseState(progress,count=3){
  const p=unit(progress),length=Math.max(1,Math.floor(Number(count)||1)),position=p*length;
  const index=Math.min(length-1,Math.floor(position));
  return {index,local:Math.min(1,position-index),playhead:p};
}
export function shouldEnter({reduced=false,hash='',scrollY=0,seen=false}){
  return !reduced&&!hash&&scrollY<10&&!seen;
}
export function readEntrance(storage){try{return storage?.getItem('madebeside-entrance-v1')==='seen';}catch{return false;}}
export function markEntrance(storage){try{storage?.setItem('madebeside-entrance-v1','seen');}catch{}}

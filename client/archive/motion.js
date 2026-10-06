export const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function coverRect(sw,sh,cw,ch){
  if(!(sw>0&&sh>0&&cw>0&&ch>0))return {x:0,y:0,w:0,h:0};
  const scale=Math.max(cw/sw,ch/sh),w=sw*scale,h=sh*scale;
  return {x:(cw-w)/2,y:(ch-h)/2,w,h};
}
export function pointerForce(px,py,x,y,radius,max){
  if(px===null||py===null||!Number.isFinite(px)||!Number.isFinite(py))return {x:0,y:0};
  const dx=x-px,dy=y-py,distance=Math.hypot(dx,dy);
  if(distance===0||distance>=radius)return {x:0,y:0};
  const force=(1-distance/radius)*max;
  return {x:dx/distance*force,y:dy/distance*force};
}
export function springStep(position,velocity,target,dt){
  const step=clamp(Number.isFinite(dt)?dt:0,0,.032);
  const nextVelocity=velocity+((target-position)*180-velocity*26)*step;
  return {position:position+nextVelocity*step,velocity:nextVelocity};
}
export function sceneProgress(scrollY,top,height,viewportHeight){
  return clamp((scrollY-top+viewportHeight)/(height+viewportHeight),0,1);
}
export function finishReelDrag(state,total,paused){
  state.drag=false;const next=clamp(Math.round(-state.target/state.stride),0,total-1);state.target=next?-next*state.stride:0;
  if(paused){state.position=state.target;state.velocity=0;}
  return next;
}
// Focus is a function of position, so the same scroll position is reversible.
export function projectVisual(top,height,viewport,paused=false,focused=false){
  if(paused||viewport<=0)return {focus:1,opacity:1,scale:1,y:0};
  const focus=Number(focused);
  return {focus,opacity:.225+.775*focus,scale:.97+.03*focus,y:clamp((viewport*.52-top-height/2)*.035,-14,14)};
}

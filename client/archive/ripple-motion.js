export function rippleSample(x,y,time,waves){
 let displacement=0,energy=0;
 for(const wave of waves){const age=time-wave.time;if(age<0||age>1.8)continue;const distance=Math.hypot(x-wave.x,y-wave.y),front=age*155;const envelope=Math.exp(-Math.pow((distance-front)/28,2))*Math.exp(-age*1.7);displacement+=Math.sin((distance-front)*.16)*envelope;energy+=envelope;}
 return {displacement:Math.max(-1,Math.min(1,displacement)),energy:Math.min(1,energy)};
}

const entries=new Set();
let frame=0,last=0,watching=false;
let ordered=[];
function wake(){
  if(typeof window==='undefined'||frame||document.hidden||![...entries].some(e=>e.active))return;
  frame=requestAnimationFrame(tick);
}
function tick(now){
  frame=0;
  if(last&&now-last<1000/30-.25){wake();return;}
  const dt=Math.min((now-last)/1000||1/30,.05);last=now;
  for(const entry of ordered)if(entry.active){try{entry.draw(now,dt);}catch(error){entry.active=false;try{entry.onError?.(error);}catch{}}}
  wake();
}
export function subscribe(draw,active=true,onError,priority=0){
  const entry={draw,active,onError,priority};entries.add(entry);
  ordered=[...entries].sort((a,b)=>a.priority-b.priority);
  if(!watching){document.addEventListener('visibilitychange',wake);watching=true;}
  wake();
  return {
    setActive(value){entry.active=value;wake();},
    remove(){entries.delete(entry);ordered=[...entries].sort((a,b)=>a.priority-b.priority);if(!entries.size){cancelAnimationFrame(frame);frame=0;last=0;document.removeEventListener('visibilitychange',wake);watching=false;}}
  };
}

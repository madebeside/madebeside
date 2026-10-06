const entries=new Set();
let frame=0,last=0,watching=false;
function wake(){
  if(typeof window==='undefined'||frame||document.hidden||![...entries].some(e=>e.active))return;
  frame=requestAnimationFrame(tick);
}
function tick(now){
  frame=0;
  const dt=Math.min((now-last)/1000||1/60,.032);last=now;
  for(const entry of entries)if(entry.active)entry.draw(now,dt);
  wake();
}
export function subscribe(draw,active=true){
  const entry={draw,active};entries.add(entry);
  if(!watching){document.addEventListener('visibilitychange',wake);watching=true;}
  wake();
  return {
    setActive(value){entry.active=value;wake();},
    remove(){entries.delete(entry);if(!entries.size){cancelAnimationFrame(frame);frame=0;last=0;document.removeEventListener('visibilitychange',wake);watching=false;}}
  };
}

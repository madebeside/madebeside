export function watchVideos(videos,paused){
  const visible=new Set();
  const apply=video=>{if(paused||document.hidden||!visible.has(video))video.pause();else if(video.hasAttribute('data-loop'))video.play().catch(()=>{});};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);apply(entry.target);}),{threshold:.1});
  videos.forEach(video=>{if(paused)video.pause();observer.observe(video);});
  const change=()=>videos.forEach(apply);document.addEventListener('visibilitychange',change);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',change);visible.clear();};
}
export function createProjectPlayback(video,initial){
  let state={active:false,paused:false,visible:false,hidden:false,...initial},intent='auto',disposed=false;
  function apply(){
    if(disposed)return;
    const play=state.visible&&!state.hidden&&(intent==='play'||(intent==='auto'&&state.active&&!state.paused));
    if(play)video.play().catch(()=>{});else video.pause();
  }
  apply();
  return {
    update(next){
      if(disposed)return;
      if(intent==='play'&&((next.paused&&!state.paused)||next.hidden||next.visible===false))intent='auto';
      state={...state,...next};apply();
    },
    toggle(){if(disposed)return;intent=video.paused?'play':'pause';apply();},
    dispose(){disposed=true;video.pause();}
  };
}

export function createShowcasePlayback(video,surface,initial,onFailure){
  let failed=false;
  const player=createProjectPlayback(video,{...initial,visible:false,hidden:document.hidden});
  const fail=()=>{failed=true;player.update({active:false,visible:false});onFailure?.();};
  const observer=new IntersectionObserver(([entry])=>player.update({visible:!failed&&entry.isIntersecting}),{threshold:.15});
  const visibility=()=>player.update({hidden:document.hidden});
  video.addEventListener('error',fail);document.addEventListener('visibilitychange',visibility);
  observer.observe(surface);
  if(video.error)fail();
  return {
    update(next){player.update(failed?{...next,active:false,visible:false}:next);},
    dispose(){observer.disconnect();video.removeEventListener('error',fail);document.removeEventListener('visibilitychange',visibility);player.dispose();}
  };
}

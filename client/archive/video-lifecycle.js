export function watchVideos(videos,paused){
  const visible=new Set();
  const apply=video=>{if(paused||document.hidden||!visible.has(video))video.pause();else if(video.hasAttribute('data-loop'))video.play().catch(()=>{});};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);apply(entry.target);}),{threshold:.1});
  videos.forEach(video=>{if(paused)video.pause();observer.observe(video);});
  const change=()=>videos.forEach(apply);document.addEventListener('visibilitychange',change);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',change);visible.clear();};
}

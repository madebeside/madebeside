export function reelOffset(index,focus,count){
 const offset=(index-focus+count)%count;
 return offset>count/2?offset-count:offset;
}
export function createReelPlayback(videos,onPlaying=()=>{},onFailure=()=>{}){
 let generation=0,disposed=false,desired=null;
 function pauseAll(){
  generation++;desired=null;
  videos.forEach(video=>video?.pause());
  if(!disposed)onPlaying(null);
 }
 return {
  pauseAll,
  async toggle(index){
   const video=videos[index];if(disposed||!video)return false;
   if(video.error)video.load();
   const wasPlaying=!video.paused;pauseAll();if(wasPlaying)return false;
   const request=generation;desired=index;
   try{
    const pending=video.play();onPlaying(index);await pending;
    if(disposed||request!==generation){if(disposed||desired!==index)video.pause();return false;}
    onPlaying(index);return true;
   }catch{
    if(!disposed&&request===generation){desired=null;video.pause();onPlaying(null);onFailure(index);}
    return false;
   }
  },
  dispose(){disposed=true;pauseAll();}
 };
}

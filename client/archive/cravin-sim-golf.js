const clips=[53.166667,18.966667,18.566667].map((duration,index)=>({
 id:'cravin-video-'+(index+1),title:'Cravin Sim Golf video '+(index+1),duration,
 src:'/projects/cravin-sim-golf/video-'+(index+1)+'.mp4',
 poster:'/projects/cravin-sim-golf/video-'+(index+1)+'.webp'
}));
export const cravinSimGolf={
 id:'cravin-sim-golf',title:'Cravin Sim Golf',kind:'video',featured:true,
 format:'Social Media Content',description:'Three social videos, made for Cravin Sim Golf.',
 src:clips[0].src,poster:clips[0].poster,clips
};

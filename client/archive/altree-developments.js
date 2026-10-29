const clips=[
 {id:'altree-video-1',title:'Altree Developments video 1',vimeoId:'1240534189',duration:26,poster:'/projects/altree-developments/video-1.jpg'},
 {id:'altree-video-2',title:'Altree Developments video 2',vimeoId:'1240563241',duration:28,poster:'/projects/altree-developments/video-2.jpg'},
 {id:'altree-video-3',title:'Altree Developments video 3',vimeoId:'1240565683',poster:'/projects/altree-developments/video-3.svg'}
].map(clip=>({...clip,src:'https://vimeo.com/'+clip.vimeoId}));
export const altreeDevelopments={id:'altree-developments',title:'Altree Developments',kind:'video',featured:true,format:'Social Media Content',description:'Altree Developments builds residential communities with a focus on architecture and design. We create social media videos that bring its spaces, details and everyday living into focus.',src:clips[0].src,poster:clips[0].poster,clips,facts:[['INCREASE IN IMPRESSIONS','82.3%'],['INCREASE IN REACTIONS','29.2%']]};

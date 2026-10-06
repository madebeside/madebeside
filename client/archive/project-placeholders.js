// Temporary presentation assets, not commissioned client work.
export const projectPlaceholders=[
  {id:'project-01',title:'Project 01',format:'Brand film',description:'A story worth spending time with.',src:'/placeholders/project-01.mp4',poster:'/placeholders/project-01.jpg'},
  {id:'project-02',title:'Project 02',format:'Social series',description:'Small moments. A shared point of view.',src:'/placeholders/project-02.mp4',poster:'/placeholders/project-02.jpg'},
  {id:'project-03',title:'Project 03',format:'Campaign film',description:'An idea, made to move.',src:'/placeholders/project-03.mp4',poster:'/placeholders/project-03.jpg'}
].map(project=>({...project,placeholder:true,kind:'video'}));

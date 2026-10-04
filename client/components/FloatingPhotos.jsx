import React,{useEffect,useRef,useState} from 'react';
export const photos=[
 ['DSC03607','Under the arch','A kiss framed by carved stone, with the garden opening up behind the couple.'],
 ['DSC04363','All together','Friends gather around the couple for a celebration full of movement and colour.'],
 ['DSC04499','A quiet gesture','A hand kissed in the garden. A small moment, given room to breathe.'],
 ['Z62_4567','Room for the setting','The couple beneath a garden arch, surrounded by greenery and bright flowers.'],
 ['Z62_4859','Close beside','A kiss on the cheek against white blossoms and a colourful garden.'],
 ['Z62_4867','Between the portraits','The bride lifts her dress as the couple moves through the garden.'],
 ['Z62_4909','The evening settles','A garden portrait with warm lights glowing in the building behind the couple.']
];
export default function FloatingPhotos({paused}){
 const [selected,setSelected]=useState(0),[sheet,setSheet]=useState(false);const root=useRef();
 const choose=i=>{setSelected(i);setSheet(false);};
 const move=direction=>setSelected(i=>(i+direction+photos.length)%photos.length);
 const [id,title,description]=photos[selected];
 return <div ref={root} className={'photo-editorial'+(sheet?' is-contact-sheet':'')+(paused?' still':'')} onKeyDown={e=>{if(e.target.tagName==='INPUT')return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
 <div className="photo-editorial-toolbar"><span>Photography</span><button aria-pressed={sheet} onClick={()=>setSheet(!sheet)}>{sheet?'Focus view':'Contact sheet'}</button></div>
 {sheet?<div className="photo-contact-sheet">{photos.map(([file,name,alt],i)=><button key={file} onClick={()=>choose(i)} aria-label={'View '+name}><img src={'/photography/'+file+'-480.webp'} alt={alt} width="480" height="640" loading="lazy"/><span>{String(i+1).padStart(2,'0')} / {name}</span></button>)}</div>:<div className="photo-focus-layout">
 <div className="photo-focus-image" key={id}><img src={'/photography/'+id+'-1200.webp'} srcSet={'/photography/'+id+'-480.webp 480w, /photography/'+id+'-1200.webp 1200w'} sizes="(max-width:767px) 80vw, 45vw" alt={description} width="1200" height="1600" loading="lazy"/></div>
 <div className="photo-focus-caption"><span className="photo-count">{String(selected+1).padStart(2,'0')} / 07</span><h4>{title}</h4><p>{description}</p><div className="photo-focus-navigation"><button onClick={()=>move(-1)}>Previous</button><button onClick={()=>move(1)}>Next photo</button></div></div>
 </div>}
 <div className="photo-thumbnail-strip" aria-label="Choose a photograph">{photos.map(([file,name,alt],i)=><button key={file} aria-label={'View '+name} aria-pressed={i===selected&&!sheet} onClick={()=>choose(i)}><img src={'/photography/'+file+'-480.webp'} width="480" height="640" alt="" loading="lazy"/></button>)}</div>
 <p className="sr-only" aria-live="polite">{title}, photo {selected+1} of 7</p>
 </div>;
}

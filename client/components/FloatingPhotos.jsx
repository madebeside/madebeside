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
 const [selected,setSelected]=useState(null),[hidden,setHidden]=useState(false);const dialog=useRef(),trigger=useRef();
 useEffect(()=>{const update=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 const open=(i,e)=>{trigger.current=e.currentTarget;setSelected(i);dialog.current.showModal();};
 const close=()=>{dialog.current.close();setSelected(null);trigger.current?.focus();};
 return <div className={'floating-photos'+(paused||hidden?' photos-paused':'')}>
 {photos.map(([id,title,description],i)=><div className="floating-photo" key={id} style={{'--x':(i%4)*24+2+'%','--y':i<4?'5%':'49%','--size':(17+(i*7%5))+'%','--tilt':(i*13%11-5)+'deg','--duration':(7+i*.9)+'s','--delay':(-i*1.3)+'s'}}><button onClick={e=>open(i,e)} aria-label={'Open photo: '+title}><img src={'/photography/'+id+'-480.webp'} width="480" height="640" alt={description} loading="lazy"/></button></div>)}
 <dialog ref={dialog} className="photo-detail" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
 {selected!==null&&<div className="photo-detail-layout"><img src={'/photography/'+photos[selected][0]+'-1200.webp'} alt={photos[selected][2]} width="1200" height="1600"/><div className="photo-detail-copy"><button className="photo-close" onClick={close} autoFocus>Close photo</button><h4>{photos[selected][1]}</h4><p>{photos[selected][2]}</p><div className="photo-nav"><button onClick={()=>setSelected((selected+6)%7)}>Previous</button><button onClick={()=>setSelected((selected+1)%7)}>Next photo</button></div><p className="sr-only" aria-live="polite">{selected+1} of 7</p></div></div>}
 </dialog></div>;
}

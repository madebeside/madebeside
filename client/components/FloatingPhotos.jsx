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
 const [selected,setSelected]=useState(0);const root=useRef(),gesture=useRef({amount:0,last:0}),touch=useRef(null);
 const move=direction=>setSelected(i=>(i+direction+photos.length)%photos.length);
 useEffect(()=>{
 const reel=root.current;
 const wheel=e=>{
 if(e.ctrlKey||!e.target.closest('.photo-reel-strip-hitbox,.photo-reel-photo,.photo-reel-numbers'))return;
 e.preventDefault();const now=performance.now();if(now-gesture.current.last<450)return;
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 gesture.current.amount+=delta;if(Math.abs(gesture.current.amount)<45)return;
 move(gesture.current.amount>0?1:-1);gesture.current={amount:0,last:now};
 };
 reel.addEventListener('wheel',wheel,{passive:false});return()=>reel.removeEventListener('wheel',wheel);
 },[]);
 const slot=i=>{let d=(i-selected+photos.length)%photos.length;if(d>3)d-=photos.length;return d;};
 return <div className={'photo-reel'+(paused?' still':'')} ref={root} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>
 <div className="photo-reel-stage" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);touch.current=null;}}>
 <div className="photo-reel-strip-hitbox" data-lenis-prevent-wheel aria-hidden="true"/>
 {photos.map(([id,title,description],i)=>{const d=slot(i);return <button key={id} className="photo-reel-photo" data-lenis-prevent-wheel style={{'--slot':d,'--scale':d===0?1:Math.abs(d)===1?.84:.72,opacity:Math.abs(d)>2?0:d===0?1:.55,zIndex:4-Math.abs(d)}} tabIndex={Math.abs(d)>2?-1:0} aria-hidden={Math.abs(d)>2||undefined} aria-label={'Show '+title} aria-pressed={d===0} onClick={()=>setSelected(i)}><img src={'/photography/'+id+'-1200.webp'} srcSet={'/photography/'+id+'-480.webp 480w, /photography/'+id+'-1200.webp 1200w'} sizes="(max-width:767px) 42vw, 23vw" alt={description} width="1200" height="1600" loading="lazy"/></button>;})}
 </div>
 <div className="photo-reel-numbers" data-lenis-prevent-wheel aria-label="Choose photograph">{photos.map(([id,title],i)=>{const d=slot(i);return <button key={id} className="photo-reel-number" data-lenis-prevent-wheel style={{'--slot':d,opacity:Math.abs(d)>2?0:d===0?1:.45}} tabIndex={Math.abs(d)>2?-1:0} aria-hidden={Math.abs(d)>2||undefined} aria-label={'Photo '+(i+1)+': '+title} aria-current={d===0?'true':undefined} onClick={()=>setSelected(i)}>{String(i+1).padStart(2,'0')}</button>;})}</div>
 <p className="sr-only" aria-live="polite">{photos[selected][1]}, photo {selected+1} of 7</p>
 </div>;
}

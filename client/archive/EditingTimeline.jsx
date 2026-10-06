import React,{useEffect,useRef,useState} from 'react';
import {initialTimeline,moveTimelineClip,timecode,TIMELINE_LENGTH,TRACK_COUNT} from './timeline-model';
import useTimelineTransport from './useTimelineTransport';
import ProjectMediaFailure from './ProjectMediaFailure';
import './timeline.css';

function TimelinePreview({clip,transport}){
  const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{if(transport.video.current?.error){transport.stop();setFailed(true);}},[attempt,transport.video,transport.stop]);
  if(!clip)return <div className="timeline-empty"><span aria-hidden="true">+</span><p>A little room<br/>between ideas.</p><span>Move a clip here, or keep scrubbing.</span></div>;
  return <>
    {!failed&&<video key={attempt} ref={transport.video} data-timeline-film data-clip={clip.id} src={clip.src} poster={clip.poster} muted playsInline preload="metadata" aria-label={clip.format+' — motion placeholder'} onLoadedMetadata={()=>transport.sync(true)} onError={()=>{transport.stop();setFailed(true);}}/>}
    {failed&&<ProjectMediaFailure project={clip} onRetry={()=>{setFailed(false);setAttempt(value=>value+1);}}/>}
  </>;
}

export default function EditingTimeline({paused}){
  const [clips,setClips]=useState(initialTimeline),[selected,setSelected]=useState('project-01'),[dragging,setDragging]=useState(null),[notice,setNotice]=useState('');
  const tracks=useRef(),drag=useRef(),suppressClick=useRef(false);
  const transport=useTimelineTransport(clips,paused);
  const choose=clip=>{setSelected(clip.id);transport.seek(clip.start);};
  function begin(event,clip){
    if(event.button!==0)return;
    transport.stop();choose(clip);
    const bounds=tracks.current.getBoundingClientRect();
    drag.current={id:clip.id,x:event.clientX,y:event.clientY,start:clip.start,track:clip.track,width:bounds.width,moved:false};
    suppressClick.current=false;event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event){
    const origin=drag.current;if(!origin)return;
    const dx=event.clientX-origin.x,dy=event.clientY-origin.y;
    if(Math.abs(dx)+Math.abs(dy)<5&&!origin.moved)return;
    origin.moved=true;suppressClick.current=true;setDragging(origin.id);
    setClips(current=>moveTimelineClip(current,origin.id,origin.start+dx/origin.width*TIMELINE_LENGTH,origin.track-Math.round(dy/92)));
  }
  function end(event){
    const origin=drag.current;if(!origin)return;
    drag.current=null;setDragging(null);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(origin.moved){const clip=clips.find(item=>item.id===origin.id);choose(clip);setNotice(clip.title+' moved to track '+(clip.track+1)+', '+timecode(clip.start)+'.');}
  }
  function key(event,clip){
    const step=event.shiftKey?1:.25;
    const delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[event.key];
    if(!delta)return;
    event.preventDefault();transport.stop();
    const updated=moveTimelineClip(clips,clip.id,clip.start+delta[0],clip.track+delta[1]);
    const moved=updated.find(item=>item.id===clip.id);
    setClips(updated);choose(moved);setNotice(moved.title+' moved to track '+(moved.track+1)+', '+timecode(moved.start)+'.');
  }
  function reset(){transport.stop();setClips(initialTimeline());setSelected('project-01');transport.seek(0);setNotice('Timeline reset.');}
  return <section className="editing-section" ref={transport.section} id="editing-room" tabIndex={-1} aria-labelledby="editing-title">
    <div className="editing-intro">
      <div className="editing-copy"><h2 id="editing-title">Good things.<br/><span>In motion.</span></h2><p>A few films. An open timeline.<br/>Make yourself at home.</p></div>
      <figure className="timeline-preview">
        <div className="timeline-monitor"><TimelinePreview key={transport.active?.id||'gap'} clip={transport.active} transport={transport}/></div>
        <figcaption><span>{transport.active?.format||'Between clips'}</span><span>Motion placeholder</span></figcaption>
      </figure>
    </div>
    <div className="timeline-toolbar">
      <div className="timeline-transport"><button className="transport-play" onClick={transport.toggle} aria-label={transport.playing?'Pause timeline':'Play timeline'} data-interactive data-cursor={transport.playing?'Ⅱ':'▶'}><span aria-hidden="true">{transport.playing?'Ⅱ':'▶'}</span>{transport.playing?'Pause':'Play'}</button><output ref={transport.timeLabel} aria-label="Timeline position">00:00:00</output><span className="timeline-length">/ 00:32:00</span></div>
      <button className="timeline-reset" onClick={reset}>Reset timeline <span aria-hidden="true">↺</span></button>
    </div>
    <div className="timeline-scroll" data-lenis-prevent-wheel>
      <div className="timeline-editor">
        <div className="track-labels" aria-hidden="true"><span>V3</span><span>V2</span><span>V1</span></div>
        <div className="timeline-content">
          <div className="timeline-ruler" aria-hidden="true">{Array.from({length:9},(_,index)=><span key={index} style={{left:index/8*100+'%'}}>{String(index*4).padStart(2,'0')}s</span>)}</div>
          <input ref={transport.scrubber} className="timeline-scrubber" type="range" min="0" max={TIMELINE_LENGTH} step=".05" defaultValue="0" aria-label="Scrub timeline" onInput={event=>transport.seek(event.currentTarget.value)}/>
          <div className="timeline-tracks" ref={tracks}>
            {Array.from({length:TRACK_COUNT},(_,index)=><div className="timeline-track" key={index} aria-hidden="true"/>)}
            {clips.map((clip,index)=><button key={clip.id} className={'timeline-clip clip-'+index+(selected===clip.id?' is-selected':'')+(dragging===clip.id?' is-dragging':'')} style={{left:clip.start/TIMELINE_LENGTH*100+'%',width:clip.duration/TIMELINE_LENGTH*100+'%',top:(TRACK_COUNT-1-clip.track)*92+12+'px'}} aria-label={'Select '+clip.format+' placeholder. Track '+(clip.track+1)+', starts '+timecode(clip.start)} aria-pressed={selected===clip.id} aria-describedby="timeline-help" data-clip-id={clip.id} data-start={clip.start} data-track={clip.track} onPointerDown={event=>begin(event,clip)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={()=>{drag.current=null;setDragging(null);}} onKeyDown={event=>key(event,clip)} onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}choose(clip);}}>
              <span className="clip-name">{clip.format.replaceAll(' ','-').toLowerCase()}.mp4</span><div className="clip-strip">{[0,1,2,3].map(frame=><img key={frame} src={clip.poster} alt="" draggable="false" width="96" height="54" loading="lazy"/>)}</div><span className="clip-edge" aria-hidden="true"/>
            </button>)}
            <div className="timeline-playhead" ref={transport.playhead} aria-hidden="true"><span/></div>
          </div>
        </div>
      </div>
    </div>
    <div className="timeline-notes"><p id="timeline-help">Choose a clip. Drag to rearrange. Scrub to explore.<span> Use arrow keys to move a focused clip; hold Shift for larger steps.</span></p><span>Three placeholders. Endless possibilities.</span></div>
    <p className="sr-only" role="status">{notice}</p>
  </section>;
}

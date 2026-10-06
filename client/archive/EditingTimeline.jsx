import React,{useEffect,useRef,useState} from 'react';
import {initialTimeline,moveTimelineClip,trimTimelineClip,splitTimelineClip,addTimelineClip,duplicateTimelineClip,shuffleTimelineClips,timecode,TIMELINE_LENGTH,TRACK_COUNT} from './timeline-model';
import {createTimelineHistory,commitTimelineEdit,undoTimelineEdit,redoTimelineEdit} from './timeline-history';
import {projectPlaceholders} from './project-placeholders';
import useTimelineTransport from './useTimelineTransport';
import ProjectMediaFailure from './ProjectMediaFailure';
import './timeline.css';

const TRACK_HEIGHT=108;
function TimelinePreview({clip,transport}){
  const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{if(transport.video.current?.error){transport.stop();setFailed(true);}},[attempt,transport.video,transport.stop]);
  if(!clip)return <div className="timeline-empty"><span aria-hidden="true">+</span><p>A little room<br/>for a new idea.</p><span>Add a film, move a clip, or show a layer.</span></div>;
  return <>
    {!failed&&<><video key={attempt} ref={transport.video} data-timeline-film data-clip={clip.id} src={clip.src} poster={clip.poster} muted playsInline preload="metadata" aria-label={clip.format+' — motion placeholder'} onLoadedMetadata={()=>transport.sync(true)} onError={()=>{transport.stop();setFailed(true);}}/><button className="monitor-play" onClick={transport.toggle} aria-label={transport.playing?'Pause preview':'Play preview'} data-interactive data-cursor={transport.playing?'Ⅱ':'▶'}><span aria-hidden="true">{transport.playing?'Ⅱ':'▶'}</span></button></>}
    {failed&&<ProjectMediaFailure project={clip} onRetry={()=>{setFailed(false);setAttempt(value=>value+1);}}/>}
  </>;
}

export default function EditingTimeline({paused}){
  const [history,setHistory]=useState(()=>createTimelineHistory(initialTimeline())),[draft,setDraft]=useState(null);
  const [selected,setSelected]=useState('project-01'),[dragging,setDragging]=useState(null),[notice,setNotice]=useState('');
  const [hiddenTracks,setHiddenTracks]=useState([]),[snap,setSnap]=useState(true),[zoom,setZoom]=useState(1),[speed,setSpeed]=useState(1);
  const tracks=useRef(),drag=useRef(),serial=useRef(0),suppressClick=useRef(false);
  const clips=draft||history.present,selectedClip=clips.find(clip=>clip.id===selected);
  const transport=useTimelineTransport(clips,paused,{hiddenTracks,speed});
  const nextId=asset=>asset+'-edit-'+(++serial.current);
  const choose=(clip,time=clip?.start||0)=>{setSelected(clip?.id||null);transport.seek(time);};
  function commit(next,selection=selected,message='Cut updated.',time){
    transport.stop();setHistory(current=>commitTimelineEdit(current,next));setDraft(null);
    const clip=next.find(item=>item.id===selection)||next[0];choose(clip,time??clip?.start??0);setNotice(message);
  }
  function restore(direction){
    const next=direction==='undo'?undoTimelineEdit(history):redoTimelineEdit(history);
    transport.stop();setDraft(null);setHistory(next);choose(next.present.find(clip=>clip.id===selected)||next.present[0]);setNotice(direction==='undo'?'Edit undone.':'Edit restored.');
  }
  function begin(event,clip,mode='move'){
    if(event.button!==0)return;
    transport.stop();choose(clip);suppressClick.current=false;
    const bounds=tracks.current.getBoundingClientRect();
    drag.current={id:clip.id,mode,x:event.clientX,y:event.clientY,clip,base:history.present,width:bounds.width,moved:false,latest:history.present,target:event.currentTarget,pointerId:event.pointerId};
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event){
    const origin=drag.current;if(!origin)return;
    const dx=event.clientX-origin.x,dy=event.clientY-origin.y;
    if(Math.abs(dx)+Math.abs(dy)<4&&!origin.moved)return;
    origin.moved=true;suppressClick.current=true;setDragging(origin.id);
    const delta=dx/origin.width*TIMELINE_LENGTH;
    const next=origin.mode==='move'?moveTimelineClip(origin.base,origin.id,origin.clip.start+delta,origin.clip.track-Math.round(dy/TRACK_HEIGHT),snap):trimTimelineClip(origin.base,origin.id,origin.mode,(origin.mode==='left'?origin.clip.start:origin.clip.start+origin.clip.duration)+delta,snap);
    origin.latest=next;setDraft(next);
    const clip=next.find(item=>item.id===origin.id);transport.seek(origin.mode==='right'?clip.start+clip.duration-.05:clip.start);
  }
  function end(event,cancelled=false){
    const origin=drag.current;if(!origin)return;
    drag.current=null;setDragging(null);
    if(origin.target.hasPointerCapture(origin.pointerId))origin.target.releasePointerCapture(origin.pointerId);
    if(cancelled){setDraft(null);choose(origin.clip);setNotice('Edit cancelled.');return;}
    if(origin.moved)commit(origin.latest,origin.id,origin.mode==='move'?'Clip moved.':'Clip trimmed.');
  }
  function lost(){if(drag.current){const origin=drag.current;drag.current=null;setDraft(null);choose(origin.clip);setDragging(null);}}
  function remove(){if(selectedClip)commit(clips.filter(clip=>clip.id!==selected),null,'Clip removed.');}
  function split(clip=selectedClip){
    if(!clip)return;
    const id=nextId(clip.assetId),time=transport.getTime(),next=splitTimelineClip(clips,clip.id,time,id);
    if(next===clips){setNotice('Scrub inside the selected clip to split it.');return;}
    commit(next,id,'Clip split. Source frames stay together.',time);
  }
  function duplicate(){if(selectedClip){const id=nextId(selectedClip.assetId);commit(duplicateTimelineClip(clips,selected,id),id,'Clip duplicated.');}}
  function add(asset){const id=nextId(asset.id);commit(addTimelineClip(clips,asset.id,id,transport.getTime()),id,'Film added to layer 3.');}
  function preview(asset){const existing=clips.find(clip=>clip.assetId===asset.id);if(existing)choose(existing);else add(asset);}
  function reset(){transport.stop();setHistory(createTimelineHistory(initialTimeline()));setDraft(null);setHiddenTracks([]);setSpeed(1);choose(initialTimeline()[0]);setNotice('A fresh timeline.');}
  function key(event,clip,edge){
    if(event.key==='Escape'){if(drag.current){event.preventDefault();end(event,true);}return;}
    if(!edge&&(event.key==='Delete'||event.key==='Backspace')){event.preventDefault();setSelected(clip.id);commit(clips.filter(item=>item.id!==clip.id),null,'Clip removed.');return;}
    if(!edge&&event.key.toLowerCase()==='s'&&!event.ctrlKey&&!event.metaKey){event.preventDefault();split(clip);return;}
    if(!edge&&event.key===' '){event.preventDefault();transport.toggle();return;}
    const step=event.shiftKey ? 1 : snap ? .25 : 1/30,delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[event.key];
    if(!delta||edge&&delta[1])return;
    event.preventDefault();
    const next=edge?trimTimelineClip(clips,clip.id,edge,(edge==='left'?clip.start:clip.start+clip.duration)+delta[0],snap):moveTimelineClip(clips,clip.id,clip.start+delta[0],clip.track+delta[1],snap);
    commit(next,clip.id,edge?'Clip trimmed.':'Clip moved.');
  }
  function scrub(event){
    const bounds=tracks.current.getBoundingClientRect();transport.seek((event.clientX-bounds.left)/bounds.width*TIMELINE_LENGTH);
  }
  function shortcuts(event){
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();restore(event.shiftKey?'redo':'undo');}
  }
  const dragHandlers=(clip,mode)=>({onPointerDown:event=>begin(event,clip,mode),onPointerMove:move,onPointerUp:event=>end(event),onPointerCancel:event=>end(event,true),onLostPointerCapture:lost});
  return <section className="editing-section film-table" ref={transport.section} id="editing-room" tabIndex={-1} aria-labelledby="editing-title" onKeyDown={shortcuts}>
    <header className="editing-title-row"><h2 id="editing-title">Make a little <span>scene.</span></h2><p>The same films.<br/>A thousand ways to see them.</p></header>
    <div className="editing-workbench">
      <div className="media-shelf"><h3>Clips on the table</h3>{projectPlaceholders.map((asset,index)=><div className="shelf-film" key={asset.id}>
        <button className="shelf-preview" onClick={()=>preview(asset)} aria-label={'Preview '+asset.format+' placeholder'}><img src={asset.poster} alt="" width="160" height="90" loading="lazy"/><span><span className="shelf-number">0{index+1}</span><strong>{asset.format}</strong><small>8 seconds · placeholder</small></span></button>
        <button className="shelf-add" onClick={()=>add(asset)} aria-label={'Add '+asset.format+' to timeline'}><span aria-hidden="true">+</span></button>
      </div>)}<p className="shelf-note">Pick a film to preview.<br/>Add another to change the story.</p></div>
      <figure className="timeline-preview">
        <div className="monitor-label"><span>{transport.active?.format||'Open canvas'}</span><span aria-hidden="true">↗</span></div>
        <div className="timeline-monitor"><TimelinePreview key={transport.active?.id||'gap'} clip={transport.active} transport={transport}/><i className="monitor-corner corner-one" aria-hidden="true"/><i className="monitor-corner corner-two" aria-hidden="true"/></div>
        <figcaption><span>Motion placeholders</span><span>Your cut. Your point of view.</span></figcaption>
      </figure>
    </div>
    <div className="cut-toolbar">
      <div className="timeline-transport"><button className="transport-play" onClick={transport.toggle} aria-label={transport.playing?'Pause timeline':'Play timeline'} data-interactive data-cursor={transport.playing?'Ⅱ':'▶'}><span aria-hidden="true">{transport.playing?'Ⅱ':'▶'}</span>{transport.playing?'Pause':'Play'}</button><output ref={transport.timeLabel} aria-label="Timeline position">00:00:00</output><button className="speed-control" onClick={()=>setSpeed(value=>value===2 ? .5 : value===.5 ? 1 : 2)} aria-label={'Playback speed '+speed+'x. Change speed.'}>{speed}×</button></div>
      <div className="cut-history"><button onClick={()=>restore('undo')} disabled={!history.past.length} aria-label="Undo edit">↶</button><button onClick={()=>restore('redo')} disabled={!history.future.length} aria-label="Redo edit">↷</button></div>
      <div className="cut-actions"><button onClick={()=>split()} disabled={!selectedClip}>Split <span aria-hidden="true">╱</span></button><button onClick={duplicate} disabled={!selectedClip}>Duplicate <span aria-hidden="true">⧉</span></button><button onClick={remove} disabled={!selectedClip}>Remove <span aria-hidden="true">−</span></button></div>
      <button className="shuffle-cut" onClick={()=>commit(shuffleTimelineClips(clips),selected,'A different point of view.',0)}>Shuffle the cut <span aria-hidden="true">⇄</span></button>
    </div>
    <div className="timeline-scroll" data-lenis-prevent-wheel>
      <div className="timeline-editor" style={{minWidth:820*zoom+'px'}}>
        <div className="track-labels">{[2,1,0].map(track=><button key={track} onClick={()=>setHiddenTracks(current=>current.includes(track)?current.filter(value=>value!==track):[...current,track])} aria-label={(hiddenTracks.includes(track)?'Show':'Hide')+' layer '+(track+1)} aria-pressed={!hiddenTracks.includes(track)}><span className={'layer-dot layer-'+track}/><span>0{track+1}</span><span aria-hidden="true">{hiddenTracks.includes(track)?'−':'◉'}</span></button>)}</div>
        <div className="timeline-content">
          <div className="timeline-ruler" aria-hidden="true">{Array.from({length:9},(_,index)=><span key={index} style={{left:index/8*100+'%'}}>{String(index*4).padStart(2,'0')}s</span>)}</div>
          <input ref={transport.scrubber} className="timeline-scrubber" type="range" min="0" max={TIMELINE_LENGTH} step={snap?'.05':1/30} defaultValue="0" aria-label="Scrub timeline" onInput={event=>transport.seek(event.currentTarget.value)}/>
          <div className="timeline-tracks" ref={tracks}>
            {[2,1,0].map(track=><div className={'timeline-track'+(hiddenTracks.includes(track)?' is-hidden':'')} key={track} aria-hidden="true"/>)}
            {clips.map(clip=><div key={clip.id} className={'timeline-clip layer-'+clip.track+(selected===clip.id?' is-selected':'')+(dragging===clip.id?' is-dragging':'')+(hiddenTracks.includes(clip.track)?' is-muted':'')} style={{left:clip.start/TIMELINE_LENGTH*100+'%',width:clip.duration/TIMELINE_LENGTH*100+'%',top:(TRACK_COUNT-1-clip.track)*TRACK_HEIGHT+12+'px'}} data-clip-id={clip.id} data-start={clip.start} data-track={clip.track} data-duration={clip.duration} data-offset={clip.offset}>
              <button className="timeline-clip-body" {...dragHandlers(clip,'move')} aria-label={'Select '+clip.format+' clip. Layer '+(clip.track+1)+', starts '+timecode(clip.start)+', length '+clip.duration+' seconds'} aria-pressed={selected===clip.id} aria-describedby="timeline-help" onKeyDown={event=>key(event,clip)} onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}choose(clip);}} data-interactive data-cursor="Move">
                <span className="clip-name">{clip.format}</span><span className="clip-strip">{[0,1,2,3].map(frame=><img key={frame} src={clip.poster} alt="" draggable="false" width="96" height="54" loading="lazy"/>)}</span>
              </button>
              {['left','right'].map(edge=><button key={edge} className={'trim-handle trim-'+edge} {...dragHandlers(clip,edge)} onClick={event=>event.stopPropagation()} onKeyDown={event=>key(event,clip,edge)} aria-label={'Trim '+(edge==='left'?'start':'end')+' of '+clip.format} data-interactive data-cursor="Trim"><span aria-hidden="true"/></button>)}
            </div>)}
            <div className="timeline-playhead" ref={transport.playhead}><button className="playhead-grip" aria-label="Move playhead" onPointerDown={event=>{transport.stop();event.currentTarget.setPointerCapture(event.pointerId);scrub(event);}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))scrub(event);}} onPointerUp={event=>event.currentTarget.releasePointerCapture(event.pointerId)} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();transport.seek(transport.getTime()+(event.key==='ArrowLeft'?-.25:.25));}}}/></div>
          </div>
        </div>
      </div>
    </div>
    <div className="cut-bottom"><div className="selected-film"><span className="selected-film-marker" aria-hidden="true"/><span>{selectedClip?selectedClip.format+' · '+timecode(selectedClip.offset)+' → '+timecode(selectedClip.offset+selectedClip.duration):'An open timeline'}</span></div><div className="cut-view"><button aria-pressed={snap} onClick={()=>setSnap(value=>!value)}>Snap {snap?'on':'off'}</button><button onClick={()=>setZoom(value=>Math.max(1,value-.5))} disabled={zoom===1} aria-label="Zoom timeline out">−</button><span>{zoom*100}%</span><button onClick={()=>setZoom(value=>Math.min(2,value+.5))} disabled={zoom===2} aria-label="Zoom timeline in">+</button><button className="timeline-reset" onClick={reset}>Reset ↺</button></div></div>
    <p id="timeline-help" className="timeline-help">Move a film. Pull its edges. Make a cut.<span>Arrows move or trim. S splits. Delete removes. Space plays. Ctrl / ⌘ Z brings it back.</span></p>
    <p className="cut-notice" role="status">{notice||'Nothing precious. Everything can be undone.'}</p>
  </section>;
}

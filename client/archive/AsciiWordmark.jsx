import React,{useCallback,useRef,useState} from 'react';
import useCanvasScene from './useCanvasScene';
import {pointerForce,clamp} from './motion';

const source='/identity/wordmark-source.png';
const glyphs='A4R+:8;X*#=012MB';
export default function AsciiWordmark({paused,className='',text}){
  const canvas=useRef(),[ready,setReady]=useState(false);
  const setup=useCallback((element,size)=>{
    const ctx=element.getContext('2d');if(!ctx)return null;
    const mask=document.createElement('canvas'),base=document.createElement('canvas');
    const maskCtx=mask.getContext('2d',{willReadFrequently:true}),baseCtx=base.getContext('2d');
    const image=new Image();let points=[],cell=7,loaded=false,alive=true;
    const renderer={
      resize({width,height,dpr}){
        element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
        mask.width=base.width=Math.round(width);mask.height=base.height=Math.round(height);
        if(!loaded)return;
        maskCtx.clearRect(0,0,width,height);
        if(text){
          let fontSize=Math.min(52,Math.max(28,innerWidth*.033));
          const lines=text.split('\n');
          maskCtx.font='500 '+fontSize+'px "DM", Arial, sans-serif';maskCtx.letterSpacing=(-fontSize*.055)+'px';
          fontSize*=Math.min(1,(width-32)/Math.max(...lines.map(line=>maskCtx.measureText(line).width)));
          const lineHeight=fontSize*1.08;
          maskCtx.font='500 '+fontSize+'px "DM", Arial, sans-serif';maskCtx.textAlign='center';maskCtx.textBaseline='middle';maskCtx.fillStyle='#121111';maskCtx.letterSpacing=(-fontSize*.055)+'px';
          lines.forEach((line,i)=>maskCtx.fillText(line,width/2,height/2+(i-(lines.length-1)/2)*lineHeight));
        }else{
          const logoWidth=width*.93,logoHeight=logoWidth*image.height/image.width;
          maskCtx.drawImage(image,(width-logoWidth)/2,(height-logoHeight)/2,logoWidth,logoHeight);
        }
        const pixels=maskCtx.getImageData(0,0,mask.width,mask.height).data;
        cell=text?2:Math.max(5,Math.round(width/172));points=[];
        baseCtx.clearRect(0,0,width,height);
        if(text)baseCtx.drawImage(mask,0,0);
        baseCtx.font='600 '+(cell*1.25)+'px DM';baseCtx.textAlign='center';baseCtx.textBaseline='middle';
        for(let y=cell/2;y<height;y+=cell)for(let x=cell/2;x<width;x+=cell){
          const index=(Math.floor(y)*mask.width+Math.floor(x))*4;
          if(pixels[index+3]<100)continue;
          const seed=(Math.floor(x)*13+Math.floor(y)*7)%glyphs.length;
          const point={x,y,char:glyphs[seed],seed};points.push(point);
          if(!text){baseCtx.fillStyle='#121111';baseCtx.fillText(point.char,x,y);}
        }
        setReady(true);
      },
      render(time,dt,pointer,{width,height}){
        if(!loaded)return;
        ctx.clearRect(0,0,width,height);ctx.drawImage(base,0,0,width,height);
        ctx.font='600 '+(cell*1.25)+'px DM';ctx.textAlign='center';ctx.textBaseline='middle';
        for(let n=0;n<24&&points.length;n++){
          const p=points[(Math.floor(time/150)*37+n*79)%points.length];
          ctx.clearRect(p.x-cell/2,p.y-cell/2,cell,cell);
          ctx.fillStyle='#121111';ctx.fillText(glyphs[(p.seed+Math.floor(time/150))%glyphs.length],p.x,p.y);
        }
        if(pointer.energy<.01)return;
        for(const p of points){
          const force=pointerForce(pointer.x,pointer.y,p.x,p.y,text?44:110,(text?14:30)*pointer.energy);
          if(Math.abs(force.x)+Math.abs(force.y)<.02)continue;
          ctx.clearRect(p.x-cell/2,p.y-cell/2,cell,cell);
          ctx.fillStyle=p.seed%7===0?'#16db65':'#121111';
          ctx.fillText(glyphs[(p.seed+Math.floor(time/105))%glyphs.length],p.x+force.x,p.y+force.y);
        }
      },
      fail(){setReady(false);},
      dispose(){alive=false;image.onload=null;}
    };
    if(text){document.fonts.load('500 52px "DM"').then(()=>{if(alive){loaded=true;renderer.onReady?.();}}).catch(()=>{if(alive)setReady(false);});}
    else{image.onload=()=>{if(!alive)return;loaded=true;renderer.onReady?.();};image.src=source;}
    return renderer;
  },[text]);
  useCanvasScene(canvas,paused,setup);
  return <div className={'ascii-wordmark '+className+(ready?' is-ready':'')} data-interactive data-cursor="+">{text?<span className="headline-fallback" aria-hidden="true">{text.split('\n').map(line=><span key={line}>{line}</span>)}</span>:<img className="wordmark-fallback" src={source} alt="Made Beside" width="2010" height="562"/>}<canvas ref={canvas} aria-hidden="true"/></div>;
}

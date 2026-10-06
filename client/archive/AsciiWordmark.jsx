import React,{useCallback,useRef,useState} from 'react';
import useCanvasScene from './useCanvasScene';
import {pointerForce,clamp} from './motion';

const source='/identity/wordmark-source.png';
const glyphs='A4R+:8;X*#=012MB';
export default function AsciiWordmark({paused,className=''}){
  const canvas=useRef(),[ready,setReady]=useState(false);
  const setup=useCallback((element,size)=>{
    const ctx=element.getContext('2d');if(!ctx)return null;
    const mask=document.createElement('canvas'),base=document.createElement('canvas');
    const maskCtx=mask.getContext('2d',{willReadFrequently:true}),baseCtx=base.getContext('2d');
    const image=new Image();let points=[],cell=7,started=0,loaded=false,alive=true;
    const renderer={
      resize({width,height,dpr}){
        element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
        mask.width=base.width=Math.round(width);mask.height=base.height=Math.round(height);
        if(!loaded)return;
        const logoWidth=width*.93,logoHeight=logoWidth*image.height/image.width;
        maskCtx.clearRect(0,0,width,height);maskCtx.drawImage(image,(width-logoWidth)/2,(height-logoHeight)/2,logoWidth,logoHeight);
        const pixels=maskCtx.getImageData(0,0,mask.width,mask.height).data;
        cell=Math.max(5,Math.round(width/172));points=[];
        baseCtx.font='600 '+Math.round(cell*.98)+'px DM';baseCtx.textAlign='center';baseCtx.textBaseline='middle';
        for(let y=cell/2;y<height;y+=cell)for(let x=cell/2;x<width;x+=cell){
          const index=(Math.floor(y)*mask.width+Math.floor(x))*4;
          if(pixels[index+3]<100)continue;
          const seed=(Math.floor(x)*13+Math.floor(y)*7)%glyphs.length;
          const point={x,y,char:glyphs[seed],seed};points.push(point);
          baseCtx.fillStyle='#f5f5f0';baseCtx.fillText(point.char,x,y);
        }
        if(!started)started=performance.now()-1800;
        setReady(true);
      },
      render(time,dt,pointer,{width,height}){
        if(!loaded)return;
        ctx.clearRect(0,0,width,height);ctx.drawImage(base,0,0,width,height);
        ctx.font='600 '+Math.round(cell*.98)+'px DM';ctx.textAlign='center';ctx.textBaseline='middle';
        for(let n=0;n<24&&points.length;n++){
          const p=points[(Math.floor(time/150)*37+n*79)%points.length];
          ctx.fillStyle='#121111';ctx.fillRect(p.x-cell/2-1,p.y-cell/2-1,cell+2,cell+2);
          ctx.fillStyle='#f5f5f0';ctx.fillText(glyphs[(p.seed+Math.floor(time/150))%glyphs.length],p.x,p.y);
        }
        if(pointer.energy<.01)return;
        for(const p of points){
          const force=pointerForce(pointer.x,pointer.y,p.x,p.y,110,30*pointer.energy);
          if(Math.abs(force.x)+Math.abs(force.y)<.02)continue;
          ctx.fillStyle='#121111';ctx.fillRect(p.x-cell/2-1,p.y-cell/2-1,cell+2,cell+2);
          ctx.fillStyle=p.seed%7===0?'#16db65':'#f5f5f0';
          ctx.fillText(glyphs[(p.seed+Math.floor(time/105))%glyphs.length],p.x+force.x,p.y+force.y);
        }
      },
      fail(){setReady(false);},
      dispose(){alive=false;image.onload=null;}
    };
    image.onload=()=>{if(!alive)return;loaded=true;renderer.onReady?.();};image.src=source;
    return renderer;
  },[]);
  useCanvasScene(canvas,paused,setup);
  return <div className={'ascii-wordmark '+className+(ready?' is-ready':'')} data-interactive data-cursor="+"><img className="wordmark-fallback" src={source} alt="Made Beside" width="2010" height="562"/><canvas ref={canvas} aria-hidden="true"/></div>;
}

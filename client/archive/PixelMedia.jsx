import React,{useCallback,useRef,useState} from 'react';
import useCanvasScene from './useCanvasScene';
import {coverRect} from './motion';

export default function PixelMedia({src,alt,paused,className='',priority=false,cursor='View'}){
  const canvas=useRef(),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const setup=useCallback((element,size)=>{
    const ctx=element.getContext('2d');if(!ctx)return null;
    const base=document.createElement('canvas'),low=document.createElement('canvas');
    const baseCtx=base.getContext('2d'),lowCtx=low.getContext('2d');
    const image=new Image(),tiles=new Map();let loaded=false,alive=true,lastX=0,lastY=0;
    const renderer={
      resize({width,height,dpr}){
        element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
        base.width=Math.round(width);base.height=Math.round(height);
        low.width=Math.max(1,Math.ceil(width/14));low.height=Math.max(1,Math.ceil(height/14));
        if(!loaded)return;
        const rect=coverRect(image.width,image.height,width,height);
        baseCtx.drawImage(image,rect.x,rect.y,rect.w,rect.h);lowCtx.drawImage(base,0,0,low.width,low.height);
        tiles.clear();setReady(true);
      },
      render(time,dt,pointer,{width,height}){
        if(!loaded)return;
        ctx.clearRect(0,0,width,height);ctx.drawImage(base,0,0,width,height);
        const tile=28,radius=95,px=pointer.x,py=pointer.y;
        if(pointer.inside&&pointer.energy>.1){
          const vx=Math.max(-35,Math.min(35,(px-lastX)*3)),vy=Math.max(-25,Math.min(25,(py-lastY)*3));
          for(let y=Math.floor((py-radius)/tile)*tile;y<py+radius;y+=tile)for(let x=Math.floor((px-radius)/tile)*tile;x<px+radius;x+=tile){
            const distance=Math.hypot(x+tile/2-px,y+tile/2-py);
            if(distance>radius||x<0||y<0||x>width-tile||y>height-tile)continue;
            const power=(1-distance/radius)*pointer.energy;
            tiles.set(x+':'+y,{x,y,life:.8,power,dx:vx+Math.sin(y*.2+time*.001)*22,dy:vy});
          }
          lastX=px;lastY=py;
        }
        ctx.imageSmoothingEnabled=false;
        for(const [key,p] of tiles){
          p.life-=dt;if(p.life<=0||pointer.energy<.002){tiles.delete(key);continue;}
          const fade=p.life/.8,dx=p.dx*p.power*fade,dy=p.dy*p.power*fade;
          ctx.drawImage(low,p.x/width*low.width,p.y/height*low.height,tile/width*low.width,tile/height*low.height,p.x+dx,p.y+dy,tile,tile);
          if((p.x+p.y)%112===0){ctx.fillStyle='rgba(22,219,101,'+(.18*p.power*fade)+')';ctx.fillRect(p.x,p.y,28,3);}
        }
        ctx.imageSmoothingEnabled=true;
      },
      fail(){setReady(false);},
      dispose(){alive=false;image.onload=null;tiles.clear();}
    };
    image.onload=()=>{if(!alive)return;loaded=true;renderer.onReady?.();};image.src=src;
    return renderer;
  },[src]);
  useCanvasScene(canvas,paused,setup);
  return <div className={'pixel-media '+className+(ready?' is-ready':'')} data-interactive data-cursor={cursor}><img src={src} alt={alt} loading={priority?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/><canvas ref={canvas} aria-hidden="true"/>{failed&&<span className="media-failure">Image unavailable</span>}</div>;
}

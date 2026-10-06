import React,{useCallback,useRef,useState} from 'react';
import useCanvasScene from './useCanvasScene';

const vertex='attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}';
const fragment=`precision highp float;
uniform vec2 u_resolution;uniform vec2 u_pointer;uniform float u_time;uniform float u_energy;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float arch(vec3 p){float r=length(vec2(p.x,max(p.y,0.)))-.66;return max(max(abs(r)-.19,abs(p.z)-.22),-p.y-.7);}
float scene(vec3 p){p.xz=rot(.45+sin(u_time*.17)*.28+u_pointer.x*u_energy*.16)*p.xz;p.yz=rot(-.16+u_pointer.y*u_energy*.1)*p.yz;float a=arch(p-vec3(-.7,0.,0.));float b=arch(p-vec3(.7,0.,0.));return min(a,b);}
vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec2 uv=(gl_FragCoord.xy*2.-u_resolution)/u_resolution.y;vec3 ro=vec3(0.,.05,3.7);vec3 rd=normalize(vec3(uv*.82,-2.));float travel=0.;bool hit=false;for(int i=0;i<48;i++){float d=scene(ro+rd*travel);if(d<.0015){hit=true;break;}travel+=d*.85;if(travel>7.)break;}vec3 color=vec3(.036,.041,.036);color+=vec3(.012,.028,.017)/(1.+length(uv));if(hit){vec3 p=ro+rd*travel,n=normal(p);vec3 light=normalize(vec3(-1.2,1.8,2.));float diffuse=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,-rd),0.),2.);float shine=pow(max(dot(reflect(-light,n),-rd),0.),36.);color=vec3(.035,.7,.255)*(.19+diffuse*.9)+vec3(.56,1.,.7)*shine*.85+vec3(.15,.6,.25)*rim*.7;}float grain=(hash(gl_FragCoord.xy+floor(u_time*18.))-.5)*.048;color+=grain;gl_FragColor=vec4(color,1.);}`;

export default function BrandField({paused,className=''}){
  const ref=useRef(),[ready,setReady]=useState(false);
  const setup=useCallback((canvas,size)=>{
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return null;
    function shader(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);return null;}return sh;}
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return null;
    const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
    gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const attr=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
    const resolution=gl.getUniformLocation(program,'u_resolution'),pointer=gl.getUniformLocation(program,'u_pointer'),time=gl.getUniformLocation(program,'u_time'),energy=gl.getUniformLocation(program,'u_energy');
    let elapsed=0,lost=false;
    const contextLost=e=>{e.preventDefault();lost=true;setReady(false);};canvas.addEventListener('webglcontextlost',contextLost);
    setReady(true);
    return {
      resize({width,height,dpr}){const ratio=Math.min(dpr,width<700?.85:1.15,1300/width);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);gl.viewport(0,0,canvas.width,canvas.height);},
      render(now,dt,p,{width,height}){if(lost)return;elapsed+=dt;gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(pointer,(p.x??width/2)/width-.5,.5-(p.y??height/2)/height);gl.uniform1f(time,elapsed);gl.uniform1f(energy,p.energy);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);},
      dispose(){canvas.removeEventListener('webglcontextlost',contextLost);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);}
    };
  },[]);
  useCanvasScene(ref,paused,setup);
  return <div className={'brand-field '+className+(ready?' is-ready':'')} data-interactive data-cursor="Shift"><div className="brand-field-fallback" aria-hidden="true"><i/><i/></div><canvas ref={ref} aria-hidden="true"/></div>;
}

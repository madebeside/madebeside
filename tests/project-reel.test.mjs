import test from 'node:test';
import assert from 'node:assert/strict';
const reel=await import('../client/archive/reel-playback.js').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});

const film=()=>({paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}});
test('only one reel video plays, with an explicit second click pausing it',async()=>{
 assert.equal(typeof reel.createReelPlayback,'function');
 const videos=[film(),film(),film()],states=[];
 const player=reel.createReelPlayback(videos,index=>states.push(index));
 assert.ok(videos.every(v=>v.paused));
 await player.toggle(0);assert.deepEqual(videos.map(v=>v.paused),[false,true,true]);
 await player.toggle(1);assert.deepEqual(videos.map(v=>v.paused),[true,false,true]);
 assert.equal(states.at(-1),1);
 await player.toggle(1);assert.ok(videos.every(v=>v.paused));assert.equal(states.at(-1),null);
 player.dispose();await player.toggle(2);assert.ok(videos.every(v=>v.paused));
});
test('leaving the project cancels an in-flight play request and never resumes audio',async()=>{
 assert.equal(typeof reel.createReelPlayback,'function');
 let resolve;const video=film();video.play=()=>new Promise(done=>{resolve=()=>{video.paused=false;done();};});
 const states=[],player=reel.createReelPlayback([video],value=>states.push(value));
 const pending=player.toggle(0);assert.equal(states.at(-1),0);player.pauseAll();resolve();await pending;
 assert.equal(video.paused,true);assert.equal(states.at(-1),null);
 player.dispose();
});
test('failed playback leaves the play control usable and reports the affected video',async()=>{
 assert.equal(typeof reel.createReelPlayback,'function');
 const video=film();video.play=()=>Promise.reject(Error('unavailable'));
 const failures=[],player=reel.createReelPlayback([video],()=>{},index=>failures.push(index));
 assert.equal(await player.toggle(0),false);assert.equal(video.paused,true);assert.deepEqual(failures,[0]);
 player.dispose();
});
test('an older play request cannot stop a newer request for the same video',async()=>{
 assert.equal(typeof reel.createReelPlayback,'function');
 const video=film(),requests=[];
 video.play=()=>{video.paused=false;return new Promise(resolve=>requests.push(resolve));};
 const player=reel.createReelPlayback([video]);
 const old=player.toggle(0);await player.toggle(0);const current=player.toggle(0);
 requests[0]();await old;assert.equal(video.paused,false);
 requests[1]();assert.equal(await current,true);assert.equal(video.paused,false);
 player.dispose();
});
test('the same play control can recover after a native media error',async()=>{
 assert.equal(typeof reel.createReelPlayback,'function');
 const video=film();video.error={code:4};let loads=0;
 video.load=()=>{loads++;video.error=null;};
 video.play=()=>{if(video.error)return Promise.reject(Error('media error'));video.paused=false;return Promise.resolve();};
 const player=reel.createReelPlayback([video]);
 assert.equal(await player.toggle(0),true);assert.equal(loads,1);assert.equal(video.paused,false);
 player.dispose();
});
test('reel positions wrap so the focused video has one neighbour on either side',()=>{
 assert.equal(typeof reel.reelOffset,'function');
 assert.deepEqual([0,1,2].map(i=>reel.reelOffset(i,0,3)),[0,1,-1]);
 assert.deepEqual([0,1,2].map(i=>reel.reelOffset(i,2,3)),[1,-1,0]);
});
test('Cravin is the first project with three films, preserving its label and marking remaining studies',async()=>{
 const {cravinSimGolf}=await import('../client/archive/cravin-sim-golf.js');
 const {selectShowcaseWork}=await import('../client/archive/work-data.js');
 const rows=selectShowcaseWork([cravinSimGolf]);
 assert.deepEqual(rows.map(row=>row.id),['cravin-sim-golf','project-02','project-03']);
 assert.equal(rows[0].title,'Cravin Sim Golf');assert.equal(rows[0].format,'Social Media Content');
 assert.equal(rows[0].placeholder,false);assert.equal(rows[0].clips.length,3);
 assert.ok(rows.slice(1).every(row=>row.placeholder));
 assert.equal(new Set(rows[0].clips.map(clip=>clip.src)).size,3);
});

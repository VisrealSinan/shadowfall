/* Compile the existing artwork with articulated rig poses into actual action
   sheets. This is an animation asset build, not a new character-art generator. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');let C;
try{C=require('@napi-rs/canvas');}catch{C=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const Rig=require('../assets/motion-rig.js');
const images=new Map(),stats=[],journalPath='artifacts/motion88-compile-cache.json',journal=fs.existsSync(journalPath)?JSON.parse(fs.readFileSync(journalPath,'utf8')):{},buildHash=crypto.createHash('sha256').update(fs.readFileSync(__filename)).update(fs.readFileSync('assets/motion-rig.js')).digest('hex');
async function image(src){if(!images.has(src))images.set(src,await C.loadImage(src));return images.get(src);}
function normalize(im,rect,size){const c=C.createCanvas(size,size),g=c.getContext('2d'),k=size*.60/Math.max(rect[2],rect[3]);g.drawImage(im,...rect,(size-rect[2]*k)/2,size*.90-rect[3]*k,rect[2]*k,rect[3]*k);return c;}
function bounds(im){const c=C.createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let l=c.width,t=c.height,r=0,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>40){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}if(r<l)throw Error('empty input');return [l,t,r-l+1,b-t+1];}
async function compile(group,key,base,kind,actions,size,seed=0){
 const cacheKey=group+'/'+key,stamp=crypto.createHash('sha256').update(buildHash).update(JSON.stringify({kind,actions,size,seed})).update(base.toBuffer('image/png')).digest('hex'),cached=journal[cacheKey];
 if(cached&&cached.stamp===stamp&&fs.existsSync(cached.result.src)){stats.push(cached.stats);return cached.result;}
 const sheet=C.createCanvas(size*8,size*actions.length),g=sheet.getContext('2d'),animations={},fingerprints={},all=[];let l=size,t=size,r=0,b=0;
 const timing={idle:160,run:82,walk:100,windup:85,attack:85,casting:95,dodge:65,hurt:45,death:155,ultimate:120,spawn:110,greet:115,trade:120,work:105};
 for(const [row,action]of actions.entries()){
  animations[action]={row,frames:8,frame_duration_ms:timing[action],loop:['idle','run','walk','work'].includes(action)};const hashes=[];
  for(let i=0;i<8;i++){
   const f=C.createCanvas(size,size),fg=f.getContext('2d'),p=animations[action].loop?i/8:i/7,pad=size/4,raw=C.createCanvas(size*1.5,size*1.5),rg=raw.getContext('2d');
   // Author into overscan first, then pin the lowest foot/root to the shared
   // floor. Wide weapons and a collapsing body must never be clipped by a cell.
   rg.translate(pad,pad);Rig.draw(rg,base,kind,action,p,seed,8);
   const rd=rg.getImageData(0,0,raw.width,raw.height).data;let rl=raw.width,rr=0,rb=0;
   for(let y=0;y<raw.height;y++)for(let x=0;x<raw.width;x++)if(rd[(y*raw.width+x)*4+3]>8){rl=Math.min(rl,x);rr=Math.max(rr,x);rb=Math.max(rb,y);}
   const floating=['hover','winged'].includes(kind),dy=rb>0?Math.min(0,size*(floating?.96:.90)-(rb-pad)):0,dx=Math.max(0,size*.03-(rl-pad))-Math.max(0,(rr-pad)-size*.97);
   fg.drawImage(raw,dx-pad,dy-pad);const d=fg.getImageData(0,0,size,size).data;hashes.push(crypto.createHash('sha256').update(d).digest('hex'));
   let pixels=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(d[(y*size+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);pixels++;}
   // Loop frames and all poses before a completed dissolve must contain art.
   if(!pixels&&action!=='death'&&!(action==='spawn'&&i===0))throw Error('Empty '+key+' '+action+' '+i);
   g.drawImage(f,i*size,row*size,size,size);
  }
  fingerprints[action]=new Set(hashes).size;if(fingerprints[action]<4)throw Error('Insufficient distinct poses '+key+' '+action);all.push(...hashes);
 }
 const src='assets/motion88-'+group+'-'+key.replaceAll('/','-')+'.png';fs.writeFileSync(src,sheet.toBuffer('image/png'));
 const result={src,cell_width:size,cell_height:size,columns:8,rows:actions.length,anchor:[size/2,size*.90],bounds:[l,t,r+1,b+1],animations,compiled86:true,rig:kind};
 const record={group,key,src,width:sheet.width,height:sheet.height,uniqueFrames:fingerprints,bytes:fs.statSync(src).size};stats.push(record);journal[cacheKey]={stamp,result,stats:record};fs.writeFileSync(journalPath,JSON.stringify(journal));return result;
}
async function collect(){await new Promise(resolve=>setImmediate(resolve));if(global.gc)global.gc();}
(async()=>{
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('assets/actor-animation-manifest.js','utf8')+';this.actors=ACTOR_ANIMATION_MANIFEST.variants;',context);
 const actors=context.actors, result={};
 for(const [key,v] of Object.entries(actors)){
  if(v.atlas||v.legacyAtlas)continue;
  const actions=['hurt','death','ultimate'].filter(a=>!v.animations[a]);if(!actions.length)continue;
  const im=await image(v.src),cell=C.createCanvas(v.cell_width,v.cell_height),g=cell.getContext('2d');
  g.drawImage(im,0,v.animations.idle.row*v.cell_height,v.cell_width,v.cell_height,0,0,v.cell_width,v.cell_height);
  const rect=bounds(cell),base=normalize(cell,rect,256),kind=key.startsWith('bearlina/')?'heavy':Rig.kind(key.split('/')[0]);
  const sheet=await compile('actors',key,base,kind,actions,256,0);
  const displayScale=(v.display_scale||1)*Math.max(rect[2],rect[3])/(256*.60);
  result[key]={...sheet,display_scale:displayScale,source:v.src};
  console.log(Object.keys(result).length+' '+key);images.delete(v.src);await collect();
 }
 fs.writeFileSync('assets/motion88-manifest.js','/* Missing action supplements; original painted animations retain their sources. */\nconst MOTION88 = '+JSON.stringify(result)+';\n');
 fs.writeFileSync('artifacts/motion88-build-report.json',JSON.stringify({sheets:stats.length,frames:stats.reduce((n,s)=>n+Object.keys(s.uniqueFrames).length*8,0),entries:stats},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});

/* Compile the existing artwork with articulated rig poses into actual action
   sheets. This is an animation asset build, not a new character-art generator. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');let C;
try{C=require('@napi-rs/canvas');}catch{C=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const Rig=require('../assets/motion-rig.js'),{run}=require('./smoke-game.cjs');
const audit=JSON.parse(run(`JSON.stringify({actors:Object.entries(ACTOR_ANIMATION_MANIFEST.variants).filter(([k,v])=>v.atlas||v.legacyAtlas).map(([key,v])=>({key,...v})),forms:Object.entries(ACTOR_ANIMATION_MANIFEST.forms).map(([key,v])=>({key,...v})),enemies:Object.keys(ENEMY_ART_MANIFEST).filter(k=>!ETYPES[k]?.artBase&&k!=="myers_hunter"&&(!ENEMY_ART_MANIFEST[k].action_sheet||ENEMY_ART_MANIFEST[k].action_sheet.compiled86)).map(k=>({key:k,src:ENEMY_ART_MANIFEST[k].src,profile:EnemyArtwork.profile(k)})),art:ART_V85})`));
const output={actors:{},forms:{},enemies:{},summons:{},vendors:{},compiler:'articulated-rig-v1',frames:8};
const images=new Map(),stats=[],journalPath='artifacts/motion86-compile-cache.json',journal=fs.existsSync(journalPath)?JSON.parse(fs.readFileSync(journalPath,'utf8')):{},buildHash=crypto.createHash('sha256').update(fs.readFileSync(__filename)).update(fs.readFileSync('assets/motion-rig.js')).digest('hex');
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
 const src='assets/motion86-'+group+'-'+key.replaceAll('/','-')+'.png';fs.writeFileSync(src,sheet.toBuffer('image/png'));
 const result={src,cell_width:size,cell_height:size,columns:8,rows:actions.length,anchor:[size/2,size*.90],bounds:[l,t,r+1,b+1],animations,compiled86:true,rig:kind};
 const record={group,key,src,width:sheet.width,height:sheet.height,uniqueFrames:fingerprints,bytes:fs.statSync(src).size};stats.push(record);journal[cacheKey]={stamp,result,stats:record};fs.writeFileSync(journalPath,JSON.stringify(journal));return result;
}
async function collect(){await new Promise(resolve=>setImmediate(resolve));if(global.gc)global.gc();}
(async()=>{
 for(const [group,entries]of [['actors',audit.actors],['forms',audit.forms]])for(const [i,v]of entries.entries()){
  const atlas=v.atlas||v.legacyAtlas,a=audit.art.atlases[atlas],im=await image(a.src),base=normalize(im,a.regions[v.atlasIndex],256),kind=v.rig==='cat'?'quadruped':v.rig==='tree'?'rooted':v.rig;
  const sheet=await compile(group,v.key,base,kind,['idle','run','attack','casting','dodge','hurt','death','ultimate'],256,v.seed);
  output[group][v.key]={...sheet,display_scale:(v.displayHeight||84)/(76*.60),legacyAtlas:atlas,atlasIndex:v.atlasIndex,seed:v.seed,displayHeight:v.displayHeight,key:v.key,coverage:'compiled-action-sheet'};
  console.log(group+' '+(i+1)+'/'+entries.length+' '+v.key);
  await collect();
 }
 for(const [i,e]of audit.enemies.entries()){
  const im=await image(e.src),base=normalize(im,bounds(im),128),kind=Rig.kind(e.key,e.profile);
  output.enemies[e.key]=await compile('enemy',e.key,base,kind,['idle','walk','windup','attack','hurt','death'],128,i*7);console.log('enemies '+(i+1)+'/'+audit.enemies.length+' '+e.key);await collect();
 }
 for(const [group,atlas,ids]of [['summons','summons',audit.art.summons],['vendors','vendors',audit.art.vendors]])for(const [i,key]of ids.entries()){
  const a=audit.art.atlases[atlas],im=await image(a.src),base=normalize(im,a.regions[i],192),kind=Rig.kind(key,key==='brute'||key==='colossus'?'heavy':key==='imp'||key==='shade'?'hover':'walker');
  const actions=group==='summons'?['idle','walk','attack','casting','hurt','death','spawn']:['idle','walk','greet','trade','work'];
  output[group][key]=await compile(group,key,base,kind,actions,192,i*13);console.log(group+' '+key);await collect();
 }
 output.coverage={newActorSheets:Object.keys(output.actors).length,newFormSheets:Object.keys(output.forms).length,newEnemySheets:Object.keys(output.enemies).length,summonSheets:6,vendorSheets:5,totalSheets:stats.length,frames:stats.reduce((a,s)=>a+Object.keys(s.uniqueFrames).length*8,0),bytes:stats.reduce((a,s)=>a+s.bytes,0)};
 fs.writeFileSync('assets/motion86-manifest.js','/* Compiled action sheets from existing art and the shared animation rig. */\nconst MOTION86 = '+JSON.stringify(output)+';\n');
 fs.writeFileSync('artifacts/motion86-build-report.json',JSON.stringify({coverage:output.coverage,sheets:stats},null,2));console.log(JSON.stringify(output.coverage));
})().catch(e=>{console.error(e);process.exitCode=1;});

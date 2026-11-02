/* v86: dedicated action sheets, continuous secondary motion, and event-driven
   summon/vendor states. All state here is visual and stays out of save files. */
const MotionCompletion=(()=>{
 const images=new Map(),minionStates=new WeakMap(),vendorStates=new WeakMap(),portraits=new Map(),rigBases=new WeakMap(),rigFrames=new Map(),ambientFrames=new Map(),sourceIds=new WeakMap();let nextSource=1,lastPortrait=-Infinity;
 const reduced=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function sourceId(im){if(!sourceIds.has(im))sourceIds.set(im,nextSource++);return sourceIds.get(im);}
 function image(src){if(images.has(src)){const im=images.get(src);images.delete(src);images.set(src,im);return im;}const im=new Image();images.set(src,im);while(images.size>20)images.delete(images.keys().next().value);im.src=src;return im;}
 function sample(sheet,action,time,seed=0){const a=sheet.animations[action]||sheet.animations.idle,d=a.frames*a.frame_duration_ms/1000,phase=a.loop?((time/d+seed*.071)%1+1)%1:MotionRig.clamp(time/d);return {action:sheet.animations[action]?action:'idle',row:a.row,column:Math.min(a.frames-1,Math.floor(phase*a.frames+1e-8)),phase,duration:d};}
 function drawSheet(g,sheet,action,time,height,seed=0){
  const im=image(sheet.src);if(!im.complete||!im.naturalWidth)return false;const f=sample(sheet,action,time,seed),k=height/(sheet.cell_height*.60),m=MotionRig.secondary(sheet.rig,action,time,seed);
  g.save();g.translate(m.x,m.y);g.rotate(m.angle);g.scale(1,m.sy);g.imageSmoothingEnabled=true;g.drawImage(im,f.column*sheet.cell_width,f.row*sheet.cell_height,sheet.cell_width,sheet.cell_height,-sheet.anchor[0]*k,18-sheet.anchor[1]*k,sheet.cell_width*k,sheet.cell_height*k);g.restore();return true;
 }
 function init(){
  Object.assign(ACTOR_ANIMATION_MANIFEST.variants,MOTION86.actors);Object.assign(ACTOR_ANIMATION_MANIFEST.forms,MOTION86.forms);
  for(const [key,sheet]of Object.entries(MOTION88)){
   const v=ACTOR_ANIMATION_MANIFEST.variants[key];
   for(const [action,a]of Object.entries(sheet.animations))if(!v.animations[action])v.animations[action]={...a,sheet};
  }
  for(const [key,sheet]of Object.entries(MOTION86.enemies))ENEMY_ART_MANIFEST[key].action_sheet=sheet;
  for(const [key,d]of Object.entries(ETYPES))if(d.artBase&&ENEMY_ART_MANIFEST[d.artBase]){
   ENEMY_ART_MANIFEST[key]={...ENEMY_ART_MANIFEST[d.artBase],filter:key==='lost_cinder'?'hue-rotate(300deg)':d.lostShadow||key==='lost_sovereign'?'hue-rotate(70deg) saturate(.65)':'hue-rotate(18deg)',aliasOf:d.artBase};
  }
  const grave=MOTION86.actors['myers/shade/male'];
  ENEMY_ART_MANIFEST.myers_hunter={src:ART_V85.atlases.graveshade.src,action_sheet:{...grave,animations:{idle:grave.animations.idle,walk:grave.animations.run,windup:grave.animations.casting,attack:grave.animations.attack,hurt:grave.animations.hurt,death:grave.animations.death}},aliasOf:'myers/shade/male'};
  ACTOR_ANIMATION_MANIFEST.coverage={total_variants:Object.keys(ACTOR_ANIMATION_MANIFEST.variants).length,full_action_sets:Object.keys(ACTOR_ANIMATION_MANIFEST.variants).length,rigged_action_sets:0,form_variants:Object.keys(ACTOR_ANIMATION_MANIFEST.forms).length,compiled_action_sets:64};
  const oldMinion=RebirthArt.minion,oldVendor=RebirthArt.vendor,oldPortrait=RebirthArt.vendorPortrait;
  RebirthArt.minion=m=>drawMinion(m)||(!m.dead&&oldMinion(m));
  RebirthArt.vendor=(g,type,t,height,n)=>drawVendor(g,type,t,height,n)||oldVendor(g,type,t,height);
  RebirthArt.vendorPortrait=(cv,type)=>vendorPortrait(cv,type)||oldPortrait(cv,type);
  const originalPortrait=heroPortrait;heroPortrait=function(cv,...args){if(cv){portraits.set(cv,args);while(portraits.size>80)portraits.delete(portraits.keys().next().value);}return originalPortrait(cv,...args);};
  portraitDraw=originalPortrait;
 }
 let portraitDraw=null;
 const worldTime=()=>G&&Number.isFinite(G.t)?G.t:gtime;
 function minionState(m){let a=minionStates.get(m);if(!a){a={attack:-Infinity,hurt:-Infinity,spawn:-Infinity,death:-Infinity,x:m.x,y:m.y,lastAtk:0,lastFlash:0,moving:false};minionStates.set(m,a);}return a;}
 function minionDied(m){minionState(m).death=worldTime();}
 function minionRevived(m){const a=minionState(m);a.spawn=worldTime();a.death=-Infinity;}
 function trackMinion(m){const a=minionState(m),t=worldTime();a.moving=Math.hypot(m.x-a.x,m.y-a.y)>.05;a.x=m.x;a.y=m.y;if(m.atk>a.lastAtk+.15)a.attack=t;if(m.flash>a.lastFlash+.03)a.hurt=t;a.lastAtk=m.atk;a.lastFlash=m.flash;}
 function minionPose(m){const a=minionState(m),t=worldTime(),s=MOTION86.summons[m.type];if(!s)return null;
  const lasting=(action,at)=>Number.isFinite(at)&&t-at>=0&&t-at<s.animations[action].frames*s.animations[action].frame_duration_ms/1000;
  if(m.dead)return lasting('death',a.death)?{action:'death',time:t-a.death}:null;
  if(lasting('hurt',a.hurt))return {action:'hurt',time:t-a.hurt};
  if(lasting('spawn',a.spawn))return {action:'spawn',time:t-a.spawn};
  const attack=m.type==='imp'?'casting':'attack';if(lasting(attack,a.attack))return {action:attack,time:t-a.attack};
  return {action:a.moving?'walk':'idle',time:t};
 }
 function minionVisible(m){return !m.dead||!!minionPose(m);}
 function playerDeath(){
  const v=ActorAnimations.variant({cls:G.cls,race:G.race,form:G.form});if(!v||!v.animations.death)return false;
  const phase=MotionRig.clamp(1-G.dyingT/1.36),time=phase*v.animations.death.frames*v.animations.death.frame_duration_ms/1000;
  ctx.save();ctx.translate(P.x,P.y);ctx.scale(P.facing||1,1);ActorAnimations.draw(ctx,{cls:G.cls,race:G.race,form:G.form,t:gtime,action:'death',actionTime:time,cos:heroCos(G.cls,G.race),outfit:G.outfit,gear:G.gear});ctx.restore();return true;
 }
 function drawMinion(m){const s=MOTION86.summons[m.type],p=minionPose(m);if(!s||!p)return false;const size=MDEF[m.type].size*m.sc;if(!inView(m.x,m.y,size))return true;
  ctx.save();ctx.translate(m.x,m.y);ctx.scale(m.face<0?-1:1,1);if(m.flash>0)ctx.filter='brightness(1.8)';const drawn=drawSheet(ctx,s,p.action,p.time,size*.9,m.seed);ctx.restore();if(!drawn)return false;
  if(!m.dead&&m.hp<m.maxHp*.99){const w=Math.max(18,size*.55);ctx.fillStyle='#10201de0';ctx.fillRect(m.x-w/2,m.y+22,w,3);ctx.fillStyle='#a3c5a1';ctx.fillRect(m.x-w/2,m.y+22,w*Math.max(0,m.hp/m.maxHp),3);}return true;
 }
 function vendorPose(type,t,n){let a=n&&vendorStates.get(n);if(n&&!a){a={near:false,greet:-Infinity};vendorStates.set(n,a);}if(a){if(n.near&&!a.near)a.greet=t;a.near=!!n.near;if(t-a.greet<.92)return {action:'greet',time:t-a.greet};if(state==='npc'&&npcCur===n)return {action:'trade',time:t%1.6};if(n.mv)return {action:'walk',time:t};}
  return {action:type==='smith'||type==='shrine'?'work':'idle',time:t};
 }
 function drawVendor(g,type,t=0,height=68,n){const s=MOTION86.vendors[type];if(!s)return false;const p=vendorPose(type,t,n);return drawSheet(g,s,p.action,p.time,height,n?n.id:0);}
 function vendorPortrait(cv,type){const s=MOTION86.vendors[type];if(!s)return false;const im=image(s.src);if(!im.complete||!im.naturalWidth)return false;const d=Math.min(2,window.devicePixelRatio||1),w=(cv.clientWidth||120)*d,h=(cv.clientHeight||120)*d;
  if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}const g=cv.getContext('2d'),p=vendorPose(type,gtime,npcCur),f=sample(s,p.action,p.time),cw=s.cell_width,ch=s.cell_height;g.clearRect(0,0,w,h);g.drawImage(im,f.column*cw+cw*.13,f.row*ch+ch*.16,cw*.74,ch*.72,0,0,w,h);return true;
 }
 function liveRig(g,base,kind,action,phase,seed,height){
  let n=rigBases.get(base);if(!n){n=document.createElement('canvas');n.width=n.height=256;const k=.60/(226/256),ng=n.getContext('2d');ng.drawImage(base,(256-256*k)/2,230-244*k,256*k,256*k);rigBases.set(base,n);}
  const actual=kind==='cat'?'quadruped':kind==='tree'?'rooted':kind,key=[sourceId(base),actual,action,Math.round(phase*23)].join(':'),f=rigFrames.get(key)||document.createElement('canvas');
  if(!rigFrames.has(key)){f.width=f.height=256;MotionRig.draw(f.getContext('2d'),n,actual,action,Math.round(phase*23)/23,seed);rigFrames.set(key,f);while(rigFrames.size>48)rigFrames.delete(rigFrames.keys().next().value);}
  const k=height/(256*.60);g.drawImage(f,-128*k,18-230*k,256*k,256*k);return true;
 }
 function propKind(k){if(/tree|bush|corn|scare|gourdroot/.test(k))return 'foliage';if(/banner|vquest|tent|gibbet|rope/.test(k))return 'cloth';if(/lamp|lantern|candle|brazier|jack|hkey|hbell/.test(k))return 'light';if(/^nf|hclock|cpipe|forge|nnsign|nnslot/.test(k))return 'machine';return '';}
 function propFrame(im,o){const kind=propKind(o.k);if(!kind||reduced())return im;const phase=((gtime*.45+(o.id||0)*.137)%1+1)%1,frame=Math.floor(phase*12),key=[sourceId(im),kind,frame].join(':'),found=ambientFrames.get(key);if(found){ambientFrames.delete(key);ambientFrames.set(key,found);return found;}
  const c=document.createElement('canvas'),scale=Math.min(1,256/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*scale)),h=Math.max(1,Math.round(im.height*scale)),pad=Math.max(2,Math.ceil(w*.05));c.width=w+pad*2;c.height=h+pad*2;c.px=im.px;c.k=im.k;const g=c.getContext('2d'),t=frame/12*Math.PI*2;g.translate(pad,pad);
  if(kind==='foliage'||kind==='cloth'){
   for(let i=0;i<16;i++){const y=i*h/16,sy=i*im.height/16,root=Math.max(0,1-y/h),wind=Math.sin(t+i*.22)*root*root*(kind==='foliage'?w*.014:w*.023);g.drawImage(im,0,sy,im.width,im.height/16,wind,y,w,h/16+.35);}
  }else{g.drawImage(im,0,0,w,h);g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.06+.06*Math.sin(t);g.fillStyle=kind==='light'?'#ffdc99':'#77dcca';g.fillRect(0,0,w,h);g.restore();if(kind==='machine'){g.save();g.globalCompositeOperation='source-atop';g.strokeStyle='#9cf0d366';g.lineWidth=1;g.beginPath();g.ellipse(w*.53,h*.58,w*.055,h*.025,t,0,Math.PI*2);g.stroke();g.restore();}}
  ambientFrames.set(key,c);while(ambientFrames.size>96)ambientFrames.delete(ambientFrames.keys().next().value);return c;
 }
 function tick(){
  if(state==='npc'&&npcCur)vendorPortrait($('npcArt'),npcCur.nt);
  if(gtime-lastPortrait<1/12||reduced())return;lastPortrait=gtime;
  for(const [cv,args]of portraits){if(cv.isConnected===false){portraits.delete(cv);continue;}if(typeof cv.getClientRects==='function'&&!cv.getClientRects().length)continue;if(portraitDraw){const [cls,outfit,scale,race,gear]=args;portraitDraw(cv,cls,outfit,scale,race,gear,gtime);}}
 }
 function summary(){return {actorVariants:Object.keys(ACTOR_ANIMATION_MANIFEST.variants).length,formVariants:Object.keys(ACTOR_ANIMATION_MANIFEST.forms).length,enemies:Object.keys(ETYPES).length,enemySheets:Object.keys(ETYPES).filter(k=>ENEMY_ART_MANIFEST[k]&&ENEMY_ART_MANIFEST[k].action_sheet).length,summons:Object.keys(MOTION86.summons).length,vendors:Object.keys(MOTION86.vendors).length,rigFrameCache:rigFrames.size,ambientFrameCache:ambientFrames.size};}
 return {init,sample,secondary:MotionRig.secondary,drawSheet,liveRig,minionDied,minionRevived,trackMinion,minionPose,minionVisible,playerDeath,vendorPose,propKind,propFrame,tick,summary};
})();

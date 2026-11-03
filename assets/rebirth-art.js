/* Generated cut-out art with live rigs for the previously missing actors/forms.
   Completed hand-drawn action sheets retain priority for all other actors. */
const RebirthArt=(()=>{
 const images=new Map(),cells=new Map(),previews=new Map(),materials=new Map();
 function refresh(){
  if(typeof state==='undefined')return;
  if(state==='maps')renderMaps();else if(state==='prep')renderRunPrep();else if(state==='talents')renderTalents();else if(state==='select')renderSelect();else if(state==='race')renderRace();else if(state==='npc')renderNpc();else if(state==='ach')renderAch();else if(state==='ward')renderWard();else if(state==='over')refreshEndingArt85();
 }
 function load(src){if(images.has(src)){const im=images.get(src);images.delete(src);images.set(src,im);return im;}const im=new Image();images.set(src,im);while(images.size>40)images.delete(images.keys().next().value);im.onload=refresh;im.src=src;return im;}
 function cell(atlas,index){
  const a=ART_V85.atlases[atlas],im=load(a.src);if(!im.complete||!im.naturalWidth)return null;const key=atlas+':'+index;
  if(cells.has(key))return cells.get(key);const r=a.regions[index],c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),k=226/Math.max(r[2],r[3]);g.imageSmoothingEnabled=true;g.drawImage(im,...r,(256-r[2]*k)/2,244-r[3]*k,r[2]*k,r[3]*k);cells.set(key,c);return c;
 }
 function drawRig(g,base,kind,action,phase,seed,height=80){
  if(typeof MotionCompletion!=='undefined')return MotionCompletion.liveRig(g,base,kind,action,phase,seed,height);
  const m=RebirthRules.motion(kind,action,phase,seed),k=height/226;g.save();g.translate(m.x,18+m.y);g.rotate(m.angle);g.scale(k*m.sx,k*m.sy);
  if(action==='run'||action==='dodge'){
   // A stable upper body and independent alternating foot/tail bands create a
   // gait from the generated cutout, without moving the gameplay collision body.
   g.drawImage(base,0,0,256,176,-128,-244,256,176);
   g.drawImage(base,0,176,128,80,-128+m.stride,-68-Math.max(0,m.stride)*.35,128,80);
   g.drawImage(base,128,176,128,80,-m.stride,-68-Math.max(0,-m.stride)*.35,128,80);
  }else g.drawImage(base,-128,-244,256,256);
  g.restore();
  if(m.glow>0){g.save();g.globalAlpha*=m.glow*.55;g.strokeStyle=kind==='graveshade'?'#9ccbc1':kind==='cat'||kind==='tree'?'#b3d798':'#c3b2e4';g.lineWidth=1.6;g.beginPath();if(action==='attack')g.arc(8,-16,22,-1.2+phase,.7+phase);else g.ellipse(0,14,24,7,phase*.2,0,Math.PI*2);g.stroke();g.restore();}
 }
 function actor(g,o,v,f){
  let base=cell(v.atlas,v.atlasIndex);if(!base){g.save();g.fillStyle='#b5c3b0';g.font='11px system-ui';g.textAlign='center';g.fillText('…',0,-15);g.restore();return true;}
  const cos=o.cos||heroCos(o.cls,raceOf(o.race||save.race)),armor=ARMOR_BY_ID[cos.armor];
  if(armor)base=ActorOutfits.frame(base,{...v,src:v.src+'|'+v.key,cell_width:256,cell_height:256,animations:{idle:{row:0}}},{row:0,column:0},armor);
  g.save();if(cos.aura)drawAura(g,cos.aura,o.t||0,false);if(!armor&&o.outfit==='ashen')g.filter='grayscale(.75)';else if(!armor&&o.outfit==='midnight')g.filter='hue-rotate(135deg) saturate(.8)';
  drawRig(g,base,v.rig,f.action,f.phase||0,v.seed,v.displayHeight);g.restore();if(cos.aura)drawAura(g,cos.aura,o.t||0,true);return true;
 }
 function registerActors(){
  const variants=ACTOR_ANIMATION_MANIFEST.variants,forms=ACTOR_ANIMATION_MANIFEST.forms||(ACTOR_ANIMATION_MANIFEST.forms={}),A={idle:160,run:95,attack:100,casting:120,dodge:85};
  for(const cls of ['myers','tibopoteto'])for(const [ri,race]of ART_V85.races.entries())for(const [si,sex]of ['male','female'].entries()){
   const key=[cls,race,sex].join('/'),atlas=cls==='myers'?'graveshade':'paired';variants[key]={key,src:ART_V85.atlases[atlas].src,atlas,atlasIndex:ri*2+si,rig:cls==='myers'?'graveshade':'paired',seed:ri*13+si,displayHeight:(cls==='myers'?84:86)*(race==='dwarf'?.84:race==='ogre'?1.09:1),cell_width:256,cell_height:256,anchor:[128,244],coverage:'rigged-actions',animations:Object.fromEntries(Object.entries(A).map(([action,ms],row)=>[action,{row,frames:6,frame_duration_ms:ms,loop:['idle','run'].includes(action)}]))};
  }
  for(const [fi,form]of ['cat','tree'].entries())for(const [ri,race]of ART_V85.races.entries())for(const [si,sex]of ['male','female'].entries()){
   const key=['druid',race,sex,form].join('/');forms[key]={key,src:ART_V85.atlases.forms.src,atlas:'forms',atlasIndex:fi*8+ri,rig:form,seed:100+ri*17+si,displayHeight:form==='cat'?80:99,cell_width:256,cell_height:256,anchor:[128,244],coverage:'rigged-actions',animations:Object.fromEntries(Object.entries(A).map(([action,ms],row)=>[action,{row,frames:6,frame_duration_ms:ms*(form==='tree'?1.15:.9),loop:['idle','run'].includes(action)}]))};
  }
  ACTOR_ANIMATION_MANIFEST.coverage={total_variants:Object.keys(variants).length,full_action_sets:Object.values(variants).filter(v=>v.coverage!=='rigged-actions').length,rigged_action_sets:64,form_variants:Object.keys(forms).length};
  for(const key of ['vistas','ground','vendors','summons','props'])load(ART_V85.atlases[key].src);
 }
 function minion(m){
  const index=ART_V85.summons.indexOf(m.type);if(index<0)return false;const base=cell('summons',index);if(!base)return false;
  const def=MDEF[m.type],size=def.size*m.sc;if(!inView(m.x,m.y,size))return true;ctx.save();ctx.translate(m.x,m.y);ctx.scale(m.face<0?-1:1,1);if(m.flash>0)ctx.filter='brightness(2.3)';
  const action=m.atk>.2?'attack':m.tgt?'run':'idle',phase=action==='attack'?Math.max(0,1-m.atk):((gtime*(m.type==='colossus'?.65:1.1)+m.seed)%1);drawRig(ctx,base,m.type,action,phase,m.seed,size*.9);ctx.restore();
  if(m.hp<m.maxHp*.99){const w=Math.max(18,size*.55);ctx.fillStyle='#10201de0';ctx.fillRect(m.x-w/2,m.y+22,w,3);ctx.fillStyle='#a3c5a1';ctx.fillRect(m.x-w/2,m.y+22,w*Math.max(0,m.hp/m.maxHp),3);}return true;
 }
 function vendor(g,type,t=0,height=68){const i=ART_V85.vendors.indexOf(type);if(i<0)return false;const base=cell('vendors',i);if(!base)return false;drawRig(g,base,type,'idle',((t%2.8)+2.8)%2.8/2.8,i*7,height);return true;}
 function vendorPortrait(cv,type){const i=ART_V85.vendors.indexOf(type);if(i<0)return false;const base=cell('vendors',i);if(!base)return false;const d=Math.min(2,window.devicePixelRatio||1);cv.width=cv.height=120*d;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=true;g.drawImage(base,0,0,256,256,cv.width*.06,cv.height*.06,cv.width*.88,cv.height*.88);return true;}
 // Keep each prop's existing world origin, collision radius, and canopy fade.
 // Functional props (fires, breakable containers) retain their stateful art.
 function prop(kind){
  const kinds={oldtree:1,rock:11,boulder:11,pillar:2,menhir:2,cpillar:3,statue:3,hpillar:10,hclock:10,cskulls:4,cpedestal:4,crypt:4,vbanner:5,glstatue:6,gldoor:6,nnlamp:7,nnsign:7,hwtree:8,mpgrave:9,mpcross:9,mpjack:9,nfpillar:10,nfarm:10,nfcore:10};
  const index=kind==='tree'||kind==='eldertree'?(G.map==='hollow'?8:G.map==='moonpatch'?1:0):kinds[kind];
  return index===undefined?null:cell('props',index);
 }
 function vista(map,w=640,h=300){
  const i=ART_V85.maps.indexOf(map),a=ART_V85.atlases.vistas,im=load(a.src);if(i<0||!im.complete||!im.naturalWidth)return '';const key='map:'+map+':'+w+':'+h;if(previews.has(key))return previews.get(key);
  const r=a.regions[i],c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),k=Math.max(w/r[2],h/r[3]);g.drawImage(im,...r,(w-r[2]*k)/2,(h-r[3]*k)/2,r[2]*k,r[3]*k);const url=c.toDataURL('image/png');previews.set(key,url);while(previews.size>48)previews.delete(previews.keys().next().value);return url;
 }
 function groundTile(map){const i=ART_V85.maps.indexOf(map),a=ART_V85.atlases.ground,im=load(a.src);if(i<0||!im.complete||!im.naturalWidth)return null;if(materials.has(map))return materials.get(map);const r=a.regions[i],c=document.createElement('canvas');c.width=c.height=384;const g=c.getContext('2d');g.drawImage(im,...r,0,0,384,384);materials.set(map,c);return c;}
 function worldGround(cx,cy){
  const tile=groundTile(G.map);if(!tile)return false;const size=224,vw=W/ZOOM,vh=H/ZOOM,x0=Math.floor((cx-vw/2)/size)*size,y0=Math.floor((cy-vh/2)/size)*size;ctx.save();ctx.imageSmoothingEnabled=true;
  for(let x=x0;x<cx+vw/2;x+=size)for(let y=y0;y<cy+vh/2;y+=size){ctx.save();ctx.translate(x+size/2,y+size/2);ctx.scale((Math.floor(x/size)&1)?-1:1,(Math.floor(y/size)&1)?-1:1);ctx.drawImage(tile,-size/2,-size/2,size+.6,size+.6);ctx.restore();}ctx.restore();return true;
 }
 function actorPortrait(cls,race,form=''){const v=ActorAnimations.variant({cls,race,form});if(!v)return '';const key='actor:'+v.key+':'+v.src;if(previews.has(key))return previews.get(key);let base=v.atlas?cell(v.atlas,v.atlasIndex):null;
  if(!base){const im=load(v.src);if(!im.complete||!im.naturalWidth)return '';base=document.createElement('canvas');base.width=base.height=256;base.getContext('2d').drawImage(im,0,0,v.cell_width,v.cell_height,0,0,256,256);}
  const url=base.toDataURL('image/png');previews.set(key,url);return url;
 }
 return {actor,registerActors,minion,vendor,vendorPortrait,vista,worldGround,prop,actorPortrait,drawRig,cell,refresh};
})();

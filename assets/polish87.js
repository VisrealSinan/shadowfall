const Polish87=(()=>{
 const images=new Map(),sprites=new Map();
 function image(src){if(!images.has(src)){const im=new Image();images.set(src,im);im.src=src;}return images.get(src);}
 function sprite(group,index){const a=ART_V87.atlases[group],im=image(a.src);if(!im.complete||!im.naturalWidth)return null;const key=group+':'+index;if(sprites.has(key))return sprites.get(key);const r=a.regions[index],cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d'),k=216/Math.max(r[2],r[3]);g.drawImage(im,...r,(256-r[2]*k)/2,240-r[3]*k,r[2]*k,r[3]*k);sprites.set(key,cv);return cv;}
 function prop(kind){const map={tree:0,eldertree:0,gltree:0,oldtree:1,mptree:1,pillar:2,menhir:2,cpillar:2,statue:3,crypt:4,cskulls:4,cpedestal:4,vbanner:5,banner:5,glstatue:6,gldoor:6,nnlamp:7,nnsign:7,hwtree:8,mpgrave:9,mpcross:9,mpjack:9,nfpillar:10,nfarm:10,nfcore:10,hclock:10,rock:11,boulder:11};const i=map[kind];if(i===undefined)return null;return sprite('props'+Math.floor(i/4),i%4);}
 function portraitLayout(w,h,v,cls='myers'){
  const k=(cls==='bearlina'?88:76)/v.cell_height*(v.display_scale||1),b=v.bounds||[0,0,v.cell_width,v.cell_height],left=(b[0]-v.anchor[0])*k,right=(b[2]-v.anchor[0])*k,top=18+(b[1]-v.anchor[1])*k,bottom=18+(b[3]-v.anchor[1])*k,pad=Math.max(3,Math.min(w,h)*.07),scale=Math.min((w-pad*2)/Math.max(1,right-left),(h-pad*2)/Math.max(1,bottom-top));return {scale,x:w/2-(left+right)/2*scale,y:h/2-(top+bottom)/2*scale,bounds:[left,top,right,bottom],pad};
 }
 function portrait(cv,o){if(!['myers','tibopoteto','shaman'].includes(o.cls)&&!['goose','undead'].includes(o.race))return false;const v=ActorAnimations.variant(o);if(!v)return false;const d=Math.min(2,window.devicePixelRatio||1),w=cv.clientWidth||64,h=cv.clientHeight||64;if(cv.width!==w*d||cv.height!==h*d){cv.width=w*d;cv.height=h*d;}const g=cv.getContext('2d'),p=portraitLayout(w,h,v,o.cls);g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);g.translate(p.x,p.y);g.scale(p.scale,p.scale);drawHero(g,o);return true;}
 function shop(d){if(!d.stall)return false;const type=['merchant','gambler','smith','stranger'].indexOf(d.stall);if(type<0)return false;const theme=G.town?.theme||G.map,col=['heart','neural'].includes(theme)?2:['castle','cellar','inferno'].includes(theme)?1:0,base=sprite('shops',type*3+col);if(!base)return false;const h=158*(d.sc||1);ctx.drawImage(base,d.x-h/2,d.y-h*.88,h,h);return true;}
 function bossMarkers(){
  if(!G||G.town||state==='dying')return;const L=FIELD_LAYOUT||FieldHUD.layout(W,H,SAFE),top=L.stats.y+L.stats.h+24,bottom=L.dock.y-20,seen=[];
  for(const e of enemies){
   if(e.dead||!(e.boss||e.mini||ETYPES[e.type]?.lostShadow))continue;
   const p=FieldHUD.edgeMarker((e.x-QCX)*ZOOM+W/2,(e.y-QCY)*ZOOM+H/2,W,H,{top,bottom,left:27,right:W-27});if(!p)continue;
   let y=p.y;for(const q of seen)if(Math.hypot(p.x-q.x,y-q.y)<38)y=Math.max(top,Math.min(bottom,y+39));seen.push({x:p.x,y});
   const col=ETYPES[e.type]?.lostShadow?'#c9a2de':'#df9b7a';ctx.save();ctx.translate(p.x,y);ctx.fillStyle='#101c1cf0';ctx.strokeStyle=col;ctx.lineWidth=1.6;
   ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.fill();ctx.stroke();ctx.rotate(p.angle);ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(14,-6);ctx.lineTo(14,6);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.rotate(-p.angle);
   fieldText('♛',0,0,14,col,'center');const name=ETYPES[e.type].name.replace('Lost Shadow: ','');fieldText(name.length>17?name.slice(0,16)+'…':name,Math.max(70,Math.min(W-70,p.x))-p.x,25,8,col,'center');ctx.restore();if(seen.length>=6)break;
  }
 }
 function init(){const old=RebirthArt.prop;RebirthArt.prop=k=>prop(k)||old(k);for(const group of Object.keys(ART_V87.atlases))image(ART_V87.atlases[group].src);}
 return {init,portrait,portraitLayout,shop,bossMarkers,prop,sprite};
})();

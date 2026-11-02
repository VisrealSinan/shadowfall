/* Shared geometry keeps scaled canvas tiles, pointers and HTML controls aligned. */
const FieldHUD=(()=>{
 function layout(w,h,safe={},skills=6,passives=6,boss=false){
  const compact=w<900,pad=compact?12:16,l=(safe.l||0)+pad,r=w-(safe.r||0)-pad,t=(safe.t||0)+12,available=r-l,control=compact?42:92;
  const cw=compact?Math.max(76,Math.min(120,w*.27)):158;
  const hero={x:l,y:t,w:compact?Math.min(200,available-control-cw-16):248,h:66};
  const clock={x:compact?hero.x+hero.w+8:(l+r)/2-cw/2,y:t,w:cw,h:66};
  const sw=compact?available:Math.min(260,available/2-cw/2-control-24);
  const stats={x:compact?l:r-control-12-sw,y:compact?t+74:t,w:sw,h:compact?28:66};
  const base=compact?136:108,n=Math.max(6,skills,passives),size=Math.min(compact?28:34,Math.floor((available-68-(n-1)*4)/n));
  const dw=Math.min(available,68+n*size+(n-1)*4),dh=size*2+29;
  return {compact,hero,clock,stats,xp:{x:l,y:(safe.t||0)+(compact?126:96),w:available,h:4},
   boss:{x:compact?l:w/2-Math.min(400,w*.4)/2,y:(safe.t||0)+base+8,w:compact?available-112:Math.min(400,w*.4),h:36},
   hudBottom:base+(boss?48:0),dock:{x:(l+r-dw)/2,y:h-(safe.b||0)-12-dh,w:dw,h:dh,size,gap:4},control};
 }
 function pointer(x,y,rect,width,height,scale=1){return {x:(x-rect.left)*width/rect.width/scale,y:(y-rect.top)*height/rect.height/scale};}
 return {layout,pointer};
})();
if(typeof module!=='undefined')module.exports=FieldHUD;
let FIELD_LAYOUT=null;
function fieldPanel(x,y,w,h,edge='#9caa9d44'){
 ctx.fillStyle='rgba(12,20,24,.91)';rr(x,y,w,h,5);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1;ctx.stroke();
}
function fieldText(text,x,y,size=11,color='#dfe1ce',align='left',maxWidth=0,serif=false){
 ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;
 let font=size;ctx.font=(serif?'400 ':'500 ')+font+'px '+(serif?'Georgia,serif':'system-ui,sans-serif');text=String(text);
 if(maxWidth){while(font>8&&ctx.measureText(text).width>maxWidth){font--;ctx.font=(serif?'400 ':'500 ')+font+'px '+(serif?'Georgia,serif':'system-ui,sans-serif');}}
 ctx.fillText(text,x,y);
}
function fieldMeter(x,y,w,h,f,col){ctx.fillStyle='#ffffff12';rr(x,y,w,h,Math.min(3,h/2));ctx.fill();if(f>0){ctx.fillStyle=col;rr(x,y,Math.max(h,Math.min(w,w*f)),h,Math.min(3,h/2));ctx.fill();}}
function drawFieldHUD(){
 const boss=G.boss&&!G.boss.dead,L=FIELD_LAYOUT=FieldHUD.layout(W,H,SAFE,G.weapons.length,Object.keys(G.passives).length,!!boss),a=L.hero,b=L.clock,c=L.stats;
 const mode=L.compact?'compact':'wide';if(document.body.dataset.fieldLayout!==mode)document.body.dataset.fieldLayout=mode;
 const clearance=Math.round((SAFE.b+L.dock.h+24)*UIS)+'px';if(document.body.dataset.fieldClear!==clearance){document.body.dataset.fieldClear=clearance;document.body.style.setProperty('--field-dock-clear',clearance);}
 ctx.save();
 fieldPanel(a.x,a.y,a.w,a.h,P.hp/P.maxHp<.3?'#dc847a99':undefined);
 fieldText(CLASSES[G.cls].name,a.x+12,a.y+17,L.compact?14:17,'#ece6d2','left',a.w-24,true);
 fieldText(L.compact?'VITALITY':RACES[raceOf(G.race)].name,a.x+12,a.y+37,8,'#91aaa2');
 const hp=clamp(P.hp/P.maxHp,0,1);fieldText(Math.ceil(Math.max(0,P.hp))+' / '+Math.round(P.maxHp),a.x+a.w-12,a.y+37,11,hp<.3?'#f1a293':'#d7dfbf','right');
 fieldMeter(a.x+12,a.y+50,a.w-24,5,hp,hp<.3?'#d77a70':'#aabd90');
 fieldPanel(b.x,b.y,b.w,b.h);fieldText(G.town?'SANCTUARY':isNight(G.t)?'NIGHTFALL':'THE HUNT',b.x+b.w/2,b.y+11,7,'#92a59c','center');
 fieldText(fmtTime(G.t),b.x+b.w/2,b.y+34,L.compact?27:31,'#ece6d2','center',b.w-12,true);
 fieldText((L.compact?'LV '+G.level:MAPNAME36[G.map])+(G.mods&&G.mods.length?' · '+(G.challengeDate?'◇ ':'')+G.mods.map(k=>MODS50[k]?MODS50[k].ic:'').join(''):''),b.x+b.w/2,b.y+56,8,'#adb7a3','center',b.w-15);
 if(!L.compact){ctx.save();ctx.translate(b.x+b.w-14,b.y+12);ctx.scale(.65,.65);drawSunMoon(0,0,G.t);ctx.restore();}
 fieldPanel(c.x,c.y,c.w,c.h);
 const values=[['FOES',fmtK(G.kills),'#d4dbce'],['SHARDS',fmtK(G.shardsPicked+G.salvage),'#c6b0d4'],['GOLD',fmtK(G.gold||0),'#d5c08c']];
 values.forEach(([label,value,col],i)=>{const x=c.x+c.w*(i+.5)/3;if(L.compact)fieldText((i===0?'☠ ':i===1?'◆ ':'● ')+value,x,c.y+14,11,col,'center');else{fieldText(label,x,c.y+13,7,'#8f9e97','center');fieldText(value,x,c.y+33,20,col,'center',c.w/3-8,true);}});
 const dg=dangerAt(G.t),stage=STAGES[stageAt(G.t)];
 if(!L.compact){fieldText('THREAT '+stage.n,c.x+11,c.y+54,8,dg>=7?'#e69583':'#a6ac96');for(let i=0;i<10;i++){ctx.fillStyle=i<dg?(dg>=7?'#cf8b72':'#b7b488'):'#ffffff13';ctx.fillRect(c.x+c.w-89+i*7.5,c.y+51,5,5);}}
 const f=clamp(G.xp/G.xpNext,0,1),q=L.xp;
 fieldText('LEVEL '+G.level+'  ·  '+Math.floor(f*100)+'% TO NEXT',q.x,q.y-9,8,'#c6cbb8');
 const buffs=[['bufE','EDGE'],['bufH','HASTE'],['bufA','WARD']].filter(([k])=>G[k]>0).map(([k,n])=>n+' '+Math.ceil(G[k])+'s').join(' · ');
 fieldText((L.compact?'THREAT '+stage.n+' · ':'')+(buffs||('DIFFICULTY '+((G.expansion&&G.expansion.difficulty)||1))),q.x+q.w,q.y-9,8,dg>=7?'#e69583':'#b3b59d','right',q.w*.48);
 fieldMeter(q.x,q.y,q.w,q.h,f,'#b6a2c9');
 HUD_BOT=L.hudBottom;
 const qt=QT_EL||(QT_EL=$('qTrack')),tp=HUD_BOT+10+'px';if(qt&&qt._top!==tp){qt._top=tp;qt.style.top='calc(env(safe-area-inset-top,0px) + '+tp+')';}
 if(boss){const z=L.boss,bf=clamp(G.boss.hp/G.boss.maxHp,0,1);fieldPanel(z.x-8,z.y-5,z.w+16,z.h+6,'#c68c7266');fieldText(ETYPES[G.boss.type].name,z.x,z.y+4,L.compact?10:13,'#e4bd9c','left',z.w-45,true);fieldText(Math.ceil(bf*100)+'%',z.x+z.w,z.y+4,9,'#e0b49c','right');fieldMeter(z.x,z.y+19,z.w,5,bf,'#c6846d');}
 ctx.restore();
}
function drawFieldDock(){
 const [ws,ps]=loItems(),L=FIELD_LAYOUT||FieldHUD.layout(W,H,SAFE,ws.length,ps.length),d=L.dock,S=d.size;LO_RECTS=[];ctx.save();fieldPanel(d.x,d.y,d.w,d.h);
 [[ws,'SKILLS'],[ps,'PASSIVES']].forEach(([items,label],row)=>{
  const y=d.y+10+row*(S+9);fieldText(label,d.x+10,y+S/2,7,'#9ba99c');
  for(let i=0;i<Math.max(6,ws.length,ps.length);i++){
   const it=items[i],x=d.x+58+i*(S+d.gap);ctx.fillStyle=it?'#273135':'#ffffff04';rr(x,y,S,S,3);ctx.fill();ctx.strokeStyle=it?(it.evo?'#d9bd85':it.max?'#babb90':'#9aa99b50'):'#a2b09b20';ctx.lineWidth=it&&it.evo?1.5:1;ctx.stroke();
   if(!it)continue;ctx.fillStyle=it.col;ctx.fillRect(x+3,y+4,2,S-12);fieldText(it.ic+'\uFE0E',x+S/2,y+S*.45,Math.floor(S*.6),'#e7e6db','center');
   fieldText(it.lv,x+S-3,y+S-7,8,it.max?'#e6ce92':'#d6decf','right');
   if(row===0){const w=G.weapons[i],f=!WFIRE[w.id]||w.wait||!w.cdMax?1:clamp(1-w.t/w.cdMax,0,1);fieldMeter(x+3,y+S-3,S-6,2,f,it.evo?'#d9bd85':f>=1?'#bbcc9a':'#9caec5');}
   LO_RECTS.push([x,y,S,S,it]);
  }
 });ctx.restore();
}
function drawPauseHero(){
 if(!G||state!=='paused'||!$('pause').classList.contains('on'))return;const cv=$('pauseHero'),w=cv.clientWidth||260,h=cv.clientHeight||310,d=Math.min(2,window.devicePixelRatio||1);
 if(cv.width!==w*d||cv.height!==h*d){cv.width=w*d;cv.height=h*d;}const g=cv.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);g.translate(w/2,h*.79);g.scale(Math.min(w/95,h/105),Math.min(w/95,h/105));
 drawHero(g,{cls:G.cls,race:G.race,outfit:G.outfit||save.outfit,gear:G.gear,gearOver:save.gearOver,form:G.form,t:gtime,atk:0});
}
function renderPauseScene(){
 const cls=CLASSES[G.cls],race=RACES[raceOf(G.race)],gear=GSLOTS.filter(k=>G.gear[k]),minionCount=minions.filter(m=>!m.dead).length;
 $('pauseHeroName').textContent=cls.name;$('pauseHeroRace').textContent=race.name;$('pauseHeroRole').textContent=cls.role;
 $('pauseDestination').textContent=MAPNAME36[G.map];$('pauseMode').textContent=G.challengeDate?'Daily Challenge · '+G.challengeDate:'Difficulty '+((G.expansion&&G.expansion.difficulty)||1)+' · '+(G.expansion&&G.expansion.endless?'Endless hunt':'Normal hunt');
 $('pauseTwists').textContent=(G.mods||[]).map(k=>MODS50[k]?MODS50[k].n:'').filter(Boolean).join(' · ');
 $('pauseRunStats').innerHTML=[['SURVIVED',fmtTime(G.t)],['FOES BANISHED',fmtK(G.kills)],['RUN LEVEL',G.level],['GOLD',fmtK(G.gold||0)]].map(([label,v])=>'<div><small>'+label+'</small><b>'+v+'</b></div>').join('');
 renderLoadoutDom($('loadoutP'),true);const first=loItems()[0][0];if(first){$('loadoutP').querySelector('.lodet').innerHTML=loDetail(first);const tile=$('loadoutP').querySelector('button.lot');if(tile)tile.classList.add('sel');}
 $('buildInfo').innerHTML='<div class="pause-stat-grid">'+[['Vitality',Math.ceil(Math.max(0,P.hp))+' / '+Math.round(P.maxHp)],['Damage','×'+P.dmg.toFixed(2)],['Critical chance',Math.round(P.crit*100)+'%'],['Armour',P.armor],['Evasion',Math.round(P.dodge*100)+'%'],['Companions',minionCount]].map(([label,v])=>'<div><span>'+label+'</span><b>'+v+'</b></div>').join('')+'</div><div class="pause-passive"><small>SIGNATURE PASSIVE</small><b>'+cls.passive+'</b><p>'+cls.pdesc+'</p></div><div class="pause-gear"><small>EQUIPMENT · '+gear.length+' / '+GSLOTS.length+'</small><p>'+(gear.length?gear.slice().sort((a,b)=>G.gear[b].r-G.gear[a].r).slice(0,3).map(k=>'<span style="color:'+GRAR[G.gear[k].r].c+'">'+G.gear[k].name+'</span>').join(' · '):'No equipment collected yet.')+'</p></div>';
 drawPauseHero();
}

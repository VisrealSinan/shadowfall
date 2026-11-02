/* Optional Gloomwood ritual. All encounter timers and positions live in the run snapshot. */
const HollowBell93=(()=>{
 const stalk='bell_stalker93',boss='bell_keeper93',col='#a5e5d6';
 const eligible=()=>G&&G.map==='forest'&&!G.daily&&!G.challengeDate&&!G.ended&&!G.town;
 function register(){
  for(const c of Object.keys(CLASSES)){
   const a=AS('bellbound93_'+c,'Bellbound Vestments','#31545b','#101c2a','#c9b378','runes','#9de4db');a.cls=c;ARMOR_SETS[c].push(a);ARMOR_BY_ID[a.id]=a;
  }
  const h={id:'hollow_bell93',cat:'gen',name:'Silence the Hollow Bell',ic:'♧',desc:'Awaken three shrines in Gloomwood and defeat the Bellkeeper.',goal:1,k:'g_bell93',un:'Bellbound Vestments for every calling',secret:true};ACH.push(h);ACH_BY_ID[h.id]=h;
  ETYPES[stalk]={name:'The Unheard',hp:230,spd:46,dmg:16,r:13,xp:12,t0:1e9,size:54,ai:'chase',map:'forest',puff:col};
  ETYPES[boss]={name:'The Hollow Bellkeeper',hp:1300,spd:29,dmg:23,r:22,xp:80,t0:1e9,size:88,ai:'chase',map:'forest',mini:true,heavy:true,puff:col};
  ENEMY_ART_MANIFEST[stalk]={...ENEMY_ART_MANIFEST.bellshade};ENEMY_ART_MANIFEST[boss]={...ENEMY_ART_MANIFEST.hwraith};
  for(const k of [stalk,boss])EDRAW[k]=(g,a)=>{g.save();g.scale(k===boss?1.35:1,k===boss?1.35:1);g.fillStyle='#152731';g.beginPath();g.moveTo(0,-37);g.lineTo(17,10);g.lineTo(0,5);g.lineTo(-17,10);g.closePath();g.fill();g.strokeStyle='#baa775';g.lineWidth=3;g.beginPath();g.arc(0,-23,10,Math.PI,0);g.lineTo(14,-11);g.lineTo(-14,-11);g.closePath();g.stroke();g.fillStyle=col;g.fillRect(-5,-23,3,3);g.fillRect(3,-23,3,3);g.restore();};
 }
 function place(x,y){const a={x,y,r:18};obResolve(a,a.r);return a;}
 function tick(dt){
  if(state!=='play'||!eligible()||P.hp<=0||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.1,dt);let e=G.hollowBell93;
  if(!e){if(G.t<300)return;e=G.hollowBell93={phase:'calling',shrines:[place(P.x+180,P.y+30)],lit:0,charge:0,clock:0,pulse:5};toast('A hollow bell sounds through Gloomwood…',col,5);Snd.play('chest');}
  if(e.phase==='complete')return;e.clock+=dt;
  if(e.phase==='calling'||e.phase==='ritual'){
   const a=e.shrines[e.lit],near=Math.hypot(P.x-a.x,P.y-a.y)<52;
   if(e.phase==='calling'&&near){e.phase='ritual';toast('The Hollow Bell · linger by each shrine to awaken it',col,5);}
   if(e.phase==='ritual'){
    e.charge=near?Math.min(3,e.charge+dt):0;
    if(e.charge>=3-1e-7){a.lit=true;e.lit++;e.charge=0;Snd.play('chest');if(e.lit<3){const ang=e.lit===1?2.15:4.3;e.shrines.push(place(a.x+Math.cos(ang)*380,a.y+Math.sin(ang)*380));toast('Shrine '+e.lit+'/3 · follow the spectral footprints',col,4);}else{e.phase='boss';e.arena=place(a.x+110,a.y);const b=spawnEnemy(boss,e.arena);e.bossHp=b.hp;e.bossMax=b.maxHp;toast('THE HOLLOW BELLKEEPER · evade the marked toll',col,5);}}
    if(e.phase==='ritual'&&!enemies.some(a=>a.type===stalk&&!a.dead)&&e.clock>5){spawnEnemy(stalk);e.clock=-15;}
   }
  }
  if(e.phase==='ritual'){const a=e.shrines[e.lit];for(const n of enemies)if(!n.dead&&n.type!==stalk&&Math.hypot(n.x-a.x,n.y-a.y)<220){const d=Math.hypot(n.x-a.x,n.y-a.y)||1;n.x+=(a.x-n.x)/d*8*dt;n.y+=(a.y-n.y)/d*8*dt;}}
  if(e.phase==='boss'){
   let b=enemies.find(n=>n.type===boss&&!n.dead);if(!b){b=spawnEnemy(boss,e.arena);b.hp=e.bossHp||b.hp;b.maxHp=e.bossMax||b.maxHp;}e.bossHp=b.hp;e.bossMax=b.maxHp;
   if(e.warning){e.warning.left-=dt;if(e.warning.left<=0){if(Math.hypot(P.x-e.warning.x,P.y-e.warning.y)<e.warning.r+P.r)hurtPlayer(b.dmg,b);burst(e.warning.x,e.warning.y,col,22,130,3,.5);e.warning=null;}}
   else if((e.pulse-=dt)<=0){e.pulse=b.hp<b.maxHp*.5?3:5;e.warning={x:P.x,y:P.y,r:76,left:1.5};}
  }
 }
 function killed(n){const e=G&&G.hollowBell93;if(!e||e.phase!=='boss'||n.type!==boss||!eligible())return;e.phase='complete';e.warning=null;for(const a of enemies)if(a.type===stalk)a.dead=true;save.ach.p.g_bell93=1;for(const c of Object.keys(CLASSES))ShadowExpansion.profile(save).looks['bellbound93_'+c]=true;achCheck(false);persist();toast('The bell falls silent · Bellbound Vestments unlocked for every calling',col,6);}
 function actors(){const e=G&&G.hollowBell93;if(!e||G.town)return [];return e.shrines.map((a,i)=>({...a,bell93:true,index:i})).concat(e.warning?[{...e.warning,bell93:true,warning:true}]:[]);}
 function draw(a){if(!inView(a.x,a.y,140))return;ctx.save();ctx.translate(a.x,a.y);
  if(a.warning){ctx.fillStyle='#b8e6de22';ctx.strokeStyle='#ffb99a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,a.r,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,0,a.r*(1-a.left/1.5),0,TAU);ctx.stroke();ctx.restore();return;}
  ctx.fillStyle='#10232dcc';ctx.beginPath();ctx.ellipse(0,9,37,15,0,0,TAU);ctx.fill();ctx.fillStyle='#35434b';ctx.fillRect(-19,-10,38,22);ctx.fillStyle='#59656b';ctx.fillRect(-24,-14,48,8);ctx.fillRect(-16,-43,8,30);ctx.fillRect(8,-43,8,30);ctx.fillRect(-20,-47,40,7);ctx.strokeStyle=a.lit?col:'#9a8666';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-29,8,Math.PI,0);ctx.lineTo(11,-18);ctx.lineTo(-11,-18);ctx.closePath();ctx.stroke();ctx.fillStyle=a.lit?col:'#baa775';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText(a.lit?'Awakened':'Lost shrine',0,-57);
  const e=G.hollowBell93;if(e.lit===a.index&&e.charge>0){ctx.strokeStyle=col;ctx.beginPath();ctx.arc(0,0,32,-Math.PI/2,-Math.PI/2+TAU*e.charge/3);ctx.stroke();}if(a.lit){ctx.strokeStyle=col;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(Math.sin(i*9)*24,-30-i*10+Math.sin(gtime*2+i)*3,2,0,TAU);ctx.stroke();}}ctx.restore();
 }
 function marker(){const e=G&&G.hollowBell93;if(!e||!eligible())return;const a=e.phase==='boss'?enemies.find(n=>n.type===boss&&!n.dead):e.shrines[e.lit];if(!a)return;qArrow(a.x,a.y-35,col,e.phase==='boss'?'♜':'♧');if(e.phase==='ritual'){ctx.save();ctx.fillStyle='#a5e5d655';const dx=a.x-P.x,dy=a.y-P.y,d=Math.hypot(dx,dy)||1;for(let i=35;i<Math.min(d,220);i+=25){ctx.beginPath();ctx.ellipse(P.x+dx/d*i-dy/d*(i%50?4:-4),P.y+dy/d*i+dx/d*(i%50?4:-4),2,5,Math.atan2(dy,dx),0,TAU);ctx.fill();}ctx.restore();}}
 function hud(){let el=$('hollowBell93');if(!el){el=document.createElement('div');el.id='hollowBell93';Object.assign(el.style,{position:'fixed',bottom:'155px',left:'50%',transform:'translateX(-50%)',maxWidth:'85vw',padding:'8px 14px',border:'1px solid #9de4db66',borderRadius:'8px',background:'#101c2aeb',color:col,font:'12px system-ui',textAlign:'center',pointerEvents:'none',zIndex:4});document.body.appendChild(el);}const e=G&&G.hollowBell93;el.style.display=state==='play'&&eligible()&&e&&e.phase!=='complete'?'block':'none';if(!e)return;el.textContent=e.phase==='calling'?'A hollow bell calls · approach the lost shrine':e.phase==='ritual'?'The Hollow Bell · '+e.lit+'/3 shrines · linger nearby for 3 seconds':e.phase==='boss'?'The Bellkeeper · '+Math.ceil(100*e.bossHp/e.bossMax)+'% · evade the marked toll':'';}
 function codex(){return save.ach.done.hollow_bell93?'<div class="cdx seen"><div class="ce"><b>The Hollow Bell · Gloomwood</b></div><div class="cd">Three lost shrines awakened. The Unheard followed their toll, and the Bellkeeper rose to claim it. You silenced the bell. Bellbound Vestments earned for every calling.</div></div>':'';}
 return {register,tick,killed,actors,draw,marker,hud,codex};
})();

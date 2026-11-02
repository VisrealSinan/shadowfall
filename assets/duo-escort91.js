/* One lost companion, sixty seconds of walking, then a reunion in any direction. */
const DuoEscort91=(()=>{
 const eligible=()=>G&&!G.ended&&!G.daily&&!G.challengeDate&&!G.town&&!save.classes.tibopoteto;
 function tick(dt){
  if(state!=='play'||!eligible()||!P||P.hp<=0)return;
  dt=Math.max(0,Math.min(.1,dt));if(!dt)return;
  let e=G.duoEscort91;
  if(!e){if(G.t<600)return;const first=(G.obSeed||0)%2?'poteto':'tibo';e=G.duoEscort91={phase:'waiting',first,x:P.x+85,y:P.y+18,r:10,walked:0,lastX:P.x,lastY:P.y,face:-1};obResolve(e,e.r);toast('A lost traveler calls from nearby…','#a2dfd2',4);}
  const dx=P.x-e.lastX,dy=P.y-e.lastY,moved=Math.hypot(dx,dy);e.lastX=P.x;e.lastY=P.y;e.moving=false;
  const name=e.first==='tibo'?'Tibo':'Poteto',other=e.first==='tibo'?'Poteto':'Tibo';
  if(e.phase==='waiting'){
   if(Math.hypot(P.x-e.x,P.y-e.y)>54)return;
   e.phase='following';toast(name+' is following. Keep walking to find '+other+'.','#a2dfd2',5);return;
  }
  if(e.phase==='following'||e.phase==='reunion'){
   let d=Math.hypot(P.x-e.x,P.y-e.y);
   if(d>260){e.x=P.x-38*(P.facing||1);e.y=P.y+12;d=40;} // Regroup after a teleport; never credit it as walking.
   if(d>32){const step=Math.min(d-32,Math.max(130,P.spdPx*1.4)*dt);e.x+=(P.x-e.x)/d*step;e.y+=(P.y-e.y)/d*step;e.moving=step>.05;e.face=P.x<e.x?-1:1;obResolve(e,e.r);}
   if(e.phase==='following'&&P.moving&&moved>.05&&moved<=Math.max(25,P.spdPx*dt*3)&&d<160)e.walked=Math.min(60,e.walked+dt);
   if(e.phase==='following'&&e.walked>=60-1e-7){e.walked=60;e.phase='reunion';e.other={x:P.x+70*(P.facing||1),y:P.y,r:10};obResolve(e.other,10);toast(other+' found! Walk over to reunite them.','#d6b2ec',5);}
   if(e.phase==='reunion'&&Math.hypot(P.x-e.other.x,P.y-e.other.y)<=54&&Math.hypot(P.x-e.x,P.y-e.y)<160){e.phase='reunited';e.reunitedAt=G.t;e.x=e.other.x-18;e.y=e.other.y;G.achRun=G.achRun||{};G.achRun.g_duo_trial90=1;achCheck(false);persist();Snd.play('chest');toast('Together again · Tibo & Poteto unlocked!','#a2dfd2',5);saveRun();}
  }
 }
 function actors(){const e=G&&G.duoEscort91;if(!e||G.town||e.phase==='reunited'&&G.t-e.reunitedAt>8)return [];const list=[{...e,escort91:true,person:e.first}];if(e.other)list.push({...e.other,escort91:true,person:e.first==='tibo'?'poteto':'tibo',face:-1});return list;}
 function draw(e){
  if(!inView(e.x,e.y,100))return;const col=e.person==='tibo'?'#84ead4':'#c493ec';ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#09161899';ctx.beginPath();ctx.ellipse(0,15,17,6,0,0,TAU);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,16,22,8,0,0,TAU);ctx.stroke();ctx.save();ctx.scale(e.face||1,1);
  const base=RebirthArt.cell('paired',2);if(base){const half=e.person==='tibo'?0:1,bob=e.moving?Math.sin(gtime*10)*1.2:Math.sin(gtime*2)*.4;ctx.drawImage(base,half*128,0,128,256,-23,-72+bob,46,92);}else drawExpansionPerson(ctx,e.person,0,gtime*(e.moving?9:2));ctx.restore();
  ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#091618';const name=e.person==='tibo'?'Tibo':'Poteto';ctx.strokeText(name,0,-64);ctx.fillStyle=col;ctx.fillText(name,0,-64);ctx.restore();
 }
 function marker(){const e=G&&G.duoEscort91;if(!e||G.town||G.ended||state==='dying')return;const target=e.phase==='waiting'?e:e.phase==='reunion'?e.other:null;if(target)qArrow(target.x,target.y-30,'#a2dfd2','∞');}
 function hud(){
  let el=$('duoEscortStatus91');if(!el){el=document.createElement('div');el.id='duoEscortStatus91';Object.assign(el.style,{position:'fixed',top:'calc(env(safe-area-inset-top) + 112px)',left:'50%',transform:'translateX(-50%)',maxWidth:'min(380px,90vw)',padding:'8px 14px',border:'1px solid #84ead477',borderRadius:'8px',background:'#102025eb',color:'#cde8df',font:'12px system-ui',textAlign:'center',pointerEvents:'none',zIndex:4});document.body.appendChild(el);}
  const e=G&&G.duoEscort91,on=e&&!G.town&&['play','paused'].includes(state);el.style.display=on?'block':'none';if(!on)return;
  if(e.phase==='waiting')el.textContent='A lost traveler is calling · approach them';
  else if(e.phase==='following')el.textContent=(e.first==='tibo'?'Tibo':'Poteto')+' follows · '+Math.floor(e.walked)+' / 60 seconds walking · any direction';
  else if(e.phase==='reunion')el.textContent='Their companion is nearby · approach to reunite them';
  else el.style.display='none';
 }
 return {tick,actors,draw,hud,marker};
})();

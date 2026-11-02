const test=require('node:test'),assert=require('node:assert/strict');
const F=require('../assets/field-ui.js');
test('HUD panels stay within safe bounds and do not overlap across common viewports',()=>{
 for(const [w,h]of [[320,568],[390,844],[620,900],[800,400],[900,600],[1280,720],[1920,1080]])for(const inset of [0,20]){
  const s={t:12,l:inset,r:inset,b:24},L=F.layout(w,h,s,6,6,true);
  for(const p of [L.hero,L.clock,L.stats,L.xp,L.dock,L.boss]){
   assert.ok(p.x>=s.l&&p.y>=s.t,JSON.stringify({w,p}));assert.ok(p.x+p.w<=w-s.r+.01);assert.ok(p.y+p.h<=h-s.b);assert.ok(p.w>0&&p.h>0);
  }
  assert.ok(L.hero.x+L.hero.w<=L.clock.x+.01);
  if(!L.compact)assert.ok(L.clock.x+L.clock.w<=L.stats.x);
  assert.ok(L.dock.y>L.boss.y+L.boss.h);
 }
});
test('loadout hover coordinates match scaled and resized canvas positions',()=>{
 for(const scale of [1,1.15,1.5,2]){
  const r={left:30,top:50,width:960,height:540},width=1920,height=1080;
  const p=F.pointer(30+143*scale/2,50+512*scale/2,r,width,height,scale);
  assert.equal(p.x,143);assert.equal(p.y,512);
 }
});
const {run}=require('../tools/smoke-game.cjs');
test('HUD rendering preserves run state and registers active skill and passive hit areas',()=>{
 assert.equal(run(`(()=>{startRun('warlock');G.t=905;G.expansion.difficulty=4;G.passives.might=2;G.weapons[0].lvl=6;G.boss=spawnEnemy('lost_hollow',{x:50,y:0});P.hp=10;const before=JSON.stringify(serializeRun().G);hudBegin();drawFieldHUD();drawFieldDock();hudEnd();if(JSON.stringify(serializeRun().G)!==before)throw Error('HUD changed run');return LO_RECTS.length===G.weapons.length+1&&LO_RECTS.every(r=>r[2]>0&&r[3]>0);})()`),true);
});
test('new pause screen retains inspection, return routes and restored-run countdown',()=>{
 assert.equal(run(`(()=>{startRun('druid');G.t=306;G.kills=80;pauseGame();if($('pauseHeroName').textContent!=='Druid'||!$('pauseRunStats').innerHTML.includes('5:06'))throw Error('pause summary missing');continueRun();renderBuild();goSettings('pause');closeSettings();if(state!=='paused')throw Error('settings resumed');if(G.t!==306||G.kills!==80)throw Error('pause advanced');resumeGame();return state==='countdown'&&G.cdT===3;})()`),true);
});

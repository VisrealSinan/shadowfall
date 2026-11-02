const test=require('node:test'),assert=require('node:assert/strict');
const {run,w}=require('../tools/smoke-game.cjs');
const F=require('../assets/field-ui.js');
test('every weapon and passive has a valid illustrated card and dock region',()=>{
 assert.equal(run(`(()=>{for(const [kind,defs]of [['w',WDEF],['p',PDEF]])for(const id of Object.keys(defs)){const a=SkillArt.info(kind,id),r=a.rect;if(!r||r.length!==4||r[0]<0||r[1]<0||r[0]+r[2]>a.atlas.width||r[1]+r[3]>a.atlas.height)throw Error(kind+':'+id);if(!SkillArt.html(kind,id).includes(a.atlas.src))throw Error('missing art');}return SkillArt.info('w','colossus').index===17&&SkillArt.info('p','vigor').group==='boons';})()`),true);
});
test('all Graveshade race portraits fit square, tall and wide picture frames',()=>{
 assert.equal(run(`(()=>{for(const race of Object.keys(RACES)){const v=ActorAnimations.variant({cls:'myers',race});if(!v)throw Error(race);for(const [w,h]of [[64,64],[80,100],[260,300],[360,210]]){const p=Polish87.portraitLayout(w,h,v),b=p.bounds;if(p.x+b[0]*p.scale<p.pad-.01||p.y+b[1]*p.scale<p.pad-.01||p.x+b[2]*p.scale>w-p.pad+.01||p.y+b[3]*p.scale>h-p.pad+.01)throw Error(race+' cropped');}}return true;})()`),true);
});
test('XP stays at the bottom, below the skill dock, including safe areas',()=>{
 for(const [w,h]of [[320,568],[800,400],[1280,720],[1920,1080]]){const L=F.layout(w,h,{b:24},6,6,true);assert.equal(L.xp.y,h-35);assert.ok(L.dock.y+L.dock.h<L.xp.y-12);}
});
test('offscreen boss arrows intersect safe bounds in every direction',()=>{
 const b={left:27,right:1253,top:114,bottom:550};
 for(let a=0;a<Math.PI*2;a+=.15){const p=F.edgeMarker(640+Math.cos(a)*3000,360+Math.sin(a)*3000,1280,720,b);assert.ok(p);assert.ok(p.x>=b.left-.01&&p.x<=b.right+.01);assert.ok(p.y>=b.top-.01&&p.y<=b.bottom+.01);}
 assert.equal(F.edgeMarker(300,200,1280,720,b),null);
});
test('three successive shop portals work, including a boss appearing after a portal opens',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.pending=0;for(let i=0;i<3;i++){G.boss=null;G.t=G.portalNext||100;portalTick(.01);if(!G.portal)throw Error('no portal '+i);P.x=G.portal.x;P.y=G.portal.y;const boss=spawnEnemy('colossus',{x:P.x+200,y:P.y});G.boss=boss;portalTick(.01);if(!G.town)throw Error('entry '+i);const town=G.town;enterTown();if(G.town!==town)throw Error('nested town');exitTown();if(G.town||!enemies.includes(boss))throw Error('return '+i);boss.dead=true;}return G.townVisits===3;})()`),true);
});
test('town save/restore still allows the next portal visit',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.pending=0;enterTown();saveRun();continueRun();if(!G.town)throw Error('town restore');exitTown();state='play';G.pending=0;G.boss=null;G.t=G.portalNext;portalTick(.01);P.x=G.portal.x;P.y=G.portal.y;portalTick(.01);return !!G.town;})()`),true);
});
test('automatic passives consume earned levels in bounded batches without scene, jump or flash',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.weapons=Object.entries(WDEF).filter(([id,d])=>d.cls==='rogue').slice(0,SKILL_SLOTS).map(([id,d])=>({id,lvl:d.max,t:0}));G.expansion.randomPassives=true;G.pending=19;G.level=20;const before=G.weapons.map(w=>w.lvl).join(','),old=[show,burst,triggerJump];let calls=0;show=burst=triggerJump=()=>calls++;try{openLevelUp();if(G.pending!==11||state!=='play')throw Error('batch');openLevelUp();openLevelUp();if(G.pending!==0||G.weapons.map(w=>w.lvl).join(',')!==before||calls)throw Error('visual flash');const sum=Object.values(G.passives).reduce((a,b)=>a+b,0);if(sum!==19)throw Error('lost levels '+sum);return !drainAutomaticLevels();}finally{[show,burst,triggerJump]=old;}})()`),true);
});
test('manual level selection remains available and random builds cannot award free levels',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.pending=1;openLevelUp(true);if(state!=='levelup'||!G.luChoices.length)throw Error('manual selection');startRun('rogue');G.expansion.randomAll=true;G.pending=0;const before=JSON.stringify(G.weapons);openLevelUp(true);return G.pending===0&&JSON.stringify(G.weapons)===before;})()`),true);
});
test('quiet automatic salvage preserves shards and Soul Lure preserves attraction',()=>{
 assert.equal(run(`(()=>{startRun('rogue');const old=toast;let notices=0;toast=()=>notices++;try{const strong=genGear('boss',{r:4,ty:'head'}),weak=genGear('drop',{r:0,ty:'head'});strong.st={armor:999};G.gear.head=strong;const before=G.salvage;autoGear(weak);if(G.salvage!==before+salvVal(weak)||notices)throw Error('salvage');picks=[{k:'lure',x:P.x,y:P.y},{k:'gold',x:P.x+500,y:P.y,v:1}];gems=[{x:P.x+600,y:P.y,v:1,tier:0,sp:0,pop:0}];updatePickups(.01);return gems[0].pull&&picks.some(p=>p.k==='gold'&&p.pull)&&notices===0;}finally{toast=old;}})()`),true);
});
test('PC keyboard pause accepts Escape and leaves P unused',()=>{
 run(`startRun('rogue');G.pending=0;`);
 const event=code=>({code,key:code==='Escape'?'Escape':'p',target:null,preventDefault(){},stopPropagation(){}});
 w.dispatchTestEvent('keydown',event('KeyP'));assert.equal(run('state'),'play');
 w.dispatchTestEvent('keydown',event('Escape'));assert.equal(run('state'),'paused');
});
test('rendered sheet enemies never touch the expensive legacy sprite getter',()=>{
 assert.equal(run(`(()=>{startRun('rogue');enemies=[];const e=spawnEnemy('bone',{x:10,y:10}),d=Object.getOwnPropertyDescriptor(SPR.enemy,'bone'),old=EnemyArtwork.draw;let calls=0;Object.defineProperty(SPR.enemy,'bone',{configurable:true,get(){throw Error('legacy baker');}});EnemyArtwork.draw=()=>{calls++;return true;};try{render(.016);return calls>0;}finally{EnemyArtwork.draw=old;Object.defineProperty(SPR.enemy,'bone',d);}})()`),true);
});

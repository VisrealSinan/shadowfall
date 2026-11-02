const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const R=require('../assets/rebirth-rules.js');
const {run}=require('../tools/smoke-game.cjs');

test('all classes and three Druid styles retain nineteen usable combat skills',()=>{
 const rosters=JSON.parse(run(`JSON.stringify(Object.keys(CLASSES).flatMap(cls=>(cls==='druid'?['caster','cat','tree']:['caster']).map(form=>({cls,form,ids:RebirthRules.eligible(WDEF,cls,form,catBan)}))))`));
 assert.equal(rosters.length,25);
 for(const r of rosters){assert.equal(r.ids.length,19,r.cls+'/'+r.form);assert.equal(new Set(r.ids).size,19);}
});

test('all new balanced skills cast with finite cooldowns and animation cues',()=>{
 assert.ok(run(`(()=>{let count=0;for(const cls of Object.keys(CLASSES)){startRun(cls);P.hp=P.maxHp;const e=spawnEnemy('bone',{x:50,y:0});e.hp=e.maxHp=1e9;buildGrid();for(const [id,d] of Object.entries(WDEF)){if(!d.balanced85||d.cls!==cls)continue;if(d.cat){G.weapons=[{id:'catform',lvl:6}];G.form='cat';}else if(d.tree){G.weapons=[{id:'treeform',lvl:6}];G.form='tree';}else {G.weapons=[{id:CLASSES[cls].weapon,lvl:6}];G.form=null;}G.actorCue=null;const cd=WFIRE[id]({id,lvl:6});if(!Number.isFinite(cd)||cd<0||!G.actorCue)throw Error(id+' failed');count++;}}return count;})()`)>100);
});

test('army budgets preserve each learned type and two high level colossi under pressure',()=>{
 for(let cap=6;cap<=18;cap++)for(let level=1;level<=6;level++){
  const d={shade:20,archer:3,brute:level>=5?2:1,hound:6,imp:4,colossus:level>=5?2:1},p=R.army(d,cap);
  assert.equal(Object.values(p).reduce((a,b)=>a+b,0),cap);
  for(const k in d){assert.ok(p[k]>=1,k);assert.ok(p[k]<=d[k]);}
  if(cap>=8&&level>=5)assert.equal(p.colossus,2);
 }
 assert.deepEqual(R.army({},12),{shade:0,archer:0,brute:0,hound:0,imp:0,colossus:0});
});

test('Colossus survives learning into a full army, death, respawn and restored late run',()=>{
 assert.equal(run(`(()=>{startRun('summoner');G.weapons=['familiars','archers','brute','hounds','imps'].map(id=>({id,lvl:6,t:0}));G.passives.legion=6;recalc();updateMinions(.01);if(minions.length!==minionCap())throw Error('army not full');G.weapons.push({id:'colossus',lvl:6,t:0});updateMinions(.01);let big=minions.filter(m=>m.type==='colossus');if(big.length!==2)throw Error('colossus starved');minionDie(big[0]);updateMinions(.01);if(!minions.includes(big[0])||!big[0].dead)throw Error('respawn slot lost');updateMinions(big[0].respawn+.1);if(big[0].dead||big[0].hp<=0)throw Error('no respawn');const snap=serializeRun();restoreRun(snap);updateMinions(.01);for(let i=0;i<120;i++)updateMinions(.1);return minions.filter(m=>m.type==='colossus'&&!m.dead).length===2&&minions.length<=minionCap();})()`),true);
});

test('every class/race has five actions, including Druid form rigs and secret classes',()=>{
 assert.equal(run(`(()=>{let n=0;for(const cls of Object.keys(CLASSES))for(const race of Object.keys(RACES))for(const sex of ['male','female'])for(const form of cls==='druid'?['','cat','tree']:['']){const v=ActorAnimations.variant({cls,race,gender:sex,form});if(!v)throw Error([cls,race,sex,form].join('/'));for(const action of ['idle','run','attack','casting','dodge']){if(!v.animations[action])throw Error(v.key+' '+action);G.actorCue={action,at:gtime};const f=ActorAnimations.frame({cls,race,world:true,t:gtime},v);if(f.action!==action||!Number.isFinite(f.phase))throw Error('action frame');}n++;}return n;})()`),400);
 const idle=R.motion('tree','idle',.25),runPose=R.motion('cat','run',.25),heavy=R.motion('tree','run',.25);
 assert.notDeepEqual(idle,runPose);assert.notEqual(runPose.stride,heavy.stride);
});

test('Graveshade keeps legacy unlock and talent IDs with original identity and no immunity',()=>{
 assert.equal(run(`(()=>{save.classes.myers=1;save.cxp.myers=12345;const n=TALENTS.myers[0].nodes[0];save.talents.myers={[n.id]:1};const copy=structuredClone(save);startRun('myers');if(CLASSES.myers.name!=='Graveshade'||CLASSES.myers.stats.invincible)throw Error('identity or immunity');if(!graveshadeTalentIcon85(n).includes('graveshade-sigil'))throw Error('missing original art');return copy.classes.myers===1&&copy.cxp.myers===12345&&n.id==='myers_tal_0_0'&&TALENTS.myers.flatMap(t=>t.nodes).length===48;})()`),true);
});

test('all eight art atlases contain valid nonempty bounded source regions',()=>{
 const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('assets/art-v85-manifest.js','utf8')+';this.art=ART_V85;',c);
 assert.equal(Object.keys(c.art.atlases).length,8);
 for(const a of Object.values(c.art.atlases)){assert.ok(fs.statSync(a.src).size>10000);assert.equal(a.regions.length,a.cols*a.rows);for(const [x,y,w,h]of a.regions){assert.ok(w>0&&h>0);assert.ok(x>=0&&y>=0&&x+w<=a.width&&y+h<=a.height);}}
});

test('ending summary is read-only and reflects the actual character and map',()=>{
 assert.equal(run(`(()=>{startRun('myers');G.t=901;G.kills=1200;G.map='castle';G.level=31;const before=JSON.stringify(save);renderEndingSummary85();renderEndingSummary85();return JSON.stringify(save)===before&&$('endingClass').textContent==='Graveshade'&&$('endingKills').textContent==='1,200'&&$('endingLevel').textContent===31&&$('endingMap').textContent===MAPNAME36.castle;})()`),true);
});

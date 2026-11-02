const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs');
const Rig=require('../assets/motion-rig.js'),{run}=require('../tools/smoke-game.cjs');
test('the audit has zero missing actor, form, enemy, summon or vendor action sets',()=>{
 const s=JSON.parse(run('JSON.stringify(MotionCompletion.summary())'));assert.equal(s.actorVariants,474);assert.equal(s.formVariants,40);assert.equal(s.enemySheets,s.enemies);assert.equal(s.enemies,214);assert.equal(s.summons,6);assert.equal(s.vendors,5);
 assert.equal(run(`Object.values(ACTOR_ANIMATION_MANIFEST.variants).concat(Object.values(ACTOR_ANIMATION_MANIFEST.forms)).filter(v=>!v.src||v.atlas).length`),0);
 assert.equal(run(`Object.values(ENEMY_ART_MANIFEST).filter(v=>!v.action_sheet||!EnemyArtwork.actions.every(a=>v.action_sheet.animations[a])).length`),0);
});
test('150 compiled sheets expose genuine frame ranges, including eight-frame enemy playback',()=>{
 assert.equal(run(`(()=>{let count=0;for(const group of ['actors','forms','enemies','summons','vendors'])for(const s of Object.values(MOTION86[group])){for(const [action,a]of Object.entries(s.animations)){const f=MotionCompletion.sample(s,action,a.frame_duration_ms*(a.frames-1)/1000,0);if(f.column!==a.frames-1||f.row!==a.row)throw Error(s.src+' '+action);}count++;}return count;})()`),150);
 const src=fs.readFileSync('assets/enemy-art.js','utf8');assert.ok(src.includes('Math.floor(s.phase*count)'));assert.ok(src.includes('available-1'));
});
test('rig archetypes articulate different limbs and keep every pose finite',()=>{
 for(const kind of ['walker','heavy','quadruped','paired','rooted','winged','hover','crawler','ooze'])for(const action of ['idle','run','attack','casting','dodge','hurt','death','greet','trade','work','spawn'])for(const phase of [0,.2,.5,.8,1]){
  const p=Rig.pose(kind,action,phase,12);for(const [x,y]of [[.2,.3],[.4,.8],[.8,.6]])assert.ok(Rig.vertex(x,y,kind,p).every(Number.isFinite));
 }
 assert.notDeepEqual(Rig.vertex(.8,.6,'walker',Rig.pose('walker','attack',.5)),Rig.vertex(.8,.6,'walker',Rig.pose('walker','idle',.5)));
 assert.notDeepEqual(Rig.pose('winged','run',.2),Rig.pose('heavy','run',.2));
});
test('a summon plays spawn, attack, hit and death without losing its reserved respawn slot',()=>{
 assert.equal(run(`(()=>{startRun('summoner');G.weapons.push({id:'colossus',lvl:6,t:0});updateMinions(.01);const m=minions.find(m=>m.type==='colossus');if(MotionCompletion.minionPose(m).action!=='spawn')throw Error('no spawn');G.t+=2;m.atk=1;MotionCompletion.trackMinion(m);if(MotionCompletion.minionPose(m).action!=='attack')throw Error('no attack');m.flash=.1;MotionCompletion.trackMinion(m);if(MotionCompletion.minionPose(m).action!=='hurt')throw Error('no hurt');minionDie(m);if(!MotionCompletion.minionVisible(m)||MotionCompletion.minionPose(m).action!=='death')throw Error('no death');G.t+=2;if(MotionCompletion.minionVisible(m))throw Error('permanent corpse');const before=minions.length;updateMinions(m.respawn+.1);return minions.includes(m)&&minions.length===before&&!m.dead&&MotionCompletion.minionPose(m).action==='spawn';})()`),true);
});
test('visual vendor interactions and animated scenery do not change the run or allocations',()=>{
 assert.equal(run(`(()=>{startRun('rogue');const n=npcSpawn('merchant'),snap=()=>JSON.stringify({...serializeRun(),at:0});n.near=true;const before=snap(),a=MotionCompletion.vendorPose('merchant',gtime,n),untouched=before===snap();n.near=false;MotionCompletion.vendorPose('merchant',gtime+2,n);state='npc';npcCur=n;const beforeTrade=snap(),p=MotionCompletion.vendorPose('merchant',gtime+2,n);return a.action==='greet'&&p.action==='trade'&&untouched&&beforeTrade===snap();})()`),true);
 assert.equal(run(`(()=>{startRun('rogue');const snap=()=>JSON.stringify({...serializeRun(),at:0}),before=snap();for(let i=0;i<200;i++)MotionCompletion.propFrame({width:64,height:64},{k:'tree',id:i});const s=MotionCompletion.summary();return s.ambientFrameCache<=96&&snap()===before&&MotionCompletion.propKind('rock')==='';})()`),true);
});
test('forced preview/death actions override combat cues, and pauses freeze summon animation time',()=>{
 assert.equal(run(`(()=>{startRun('myers');const v=ActorAnimations.variant({cls:'myers',race:G.race});G.actorCue={action:'attack',at:gtime};const f=ActorAnimations.frame({cls:'myers',race:G.race,world:true,action:'death',actionTime:.7},v);if(f.action!=='death')throw Error('death interrupted');startRun('summoner');updateMinions(.01);const m=minions[0],before=JSON.stringify(MotionCompletion.minionPose(m));pauseGame();gtime+=30;return before===JSON.stringify(MotionCompletion.minionPose(m));})()`),true);
});
test('an imp completes its casting sequence before returning to locomotion',()=>{
 assert.equal(run(`(()=>{startRun('summoner');G.weapons.push({id:'imps',lvl:6,t:0});updateMinions(.01);const m=minions.find(m=>m.type==='imp');G.t+=2;m.atk=1;MotionCompletion.trackMinion(m);G.t+=.71;if(MotionCompletion.minionPose(m).action!=='casting')throw Error('truncated cast');G.t+=.1;return ['idle','walk'].includes(MotionCompletion.minionPose(m).action);})()`),true);
});

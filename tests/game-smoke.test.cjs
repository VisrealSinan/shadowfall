const test=require('node:test'),assert=require('node:assert/strict');
const {run}=require('../tools/smoke-game.cjs');
test('all game scripts initialize with legacy expansion skills and the complete Shaman roster',()=>{
  const counts=JSON.parse(run('JSON.stringify(Object.fromEntries(Object.keys(CLASSES).map(c=>[c,Object.values(WDEF).filter(d=>(d.expansion||Number.isInteger(d.shaman92))&&d.cls===c).length])))'));
  for(const [cls,count] of Object.entries(counts))assert.equal(count,cls==='shaman'?19:cls==='druid'?18:6,cls);
  assert.equal(run('Object.values(ARMOR_BY_ID).filter(o=>o.outfitShardCost).length'),Object.keys(counts).length*5);
});
test('every class starts, updates, renders and casts every new skill',()=>{
  const done=run(`(()=>{const done=[];for(const cls of Object.keys(CLASSES)){startRun(cls);G.pending=0;const e=spawnEnemy('bone',{x:55,y:0});e.hp=e.maxHp=1e7;buildGrid();for(const [id,d] of Object.entries(WDEF)){if(!d.expansion||d.cls!==cls)continue;const cd=WFIRE[id]({id,lvl:6});if(!Number.isFinite(cd))throw Error(id+' cooldown');}update(.05,false);render(.05);done.push(cls);}return done.length;})()`);
  assert.equal(done,24);
});
test('hunter is immune, survives save/restore, and unlocks mortal Myers after 180 active seconds',()=>{
  const result=JSON.parse(run(`(()=>{startRun('rogue');G.t=900;expansionTick(.05);const h=enemies.find(e=>e.type==='myers_hunter');const hp=h.hp;damage(h,1e12);killEnemy(h);if(h.dead||h.hp!==hp)throw Error('hunter was killable');const snap=serializeRun();restoreRun(snap);G.t=1080;expansionTick(.05);if(!save.classes.myers)throw Error('unlock missing');startRun('myers');const before=P.hp;P.inv=0;P.dodge=0;hurtPlayer(30);return JSON.stringify({hp:P.hp,before,invincible:CLASSES.myers.stats.invincible||false});})()`));
  assert.ok(result.hp<result.before);assert.equal(result.invincible,false);
});
test('final boss victory and endless choice persist through serialization',()=>{
  assert.equal(run(`(()=>{startRun('rogue');G.t=900;expansionDirector();const b=enemies.find(e=>e.type==='lost_sovereign');killEnemy(b);G.pending=0;update(.05,false);if(state!=='victory')throw Error(state);const snap=serializeRun();restoreRun(snap);if(!expansionState().finalDefeated)throw Error('lost victory');expansionState().endless=true;resumeGame();return state;})()`),'play');
});
test('starting form talents are unique, exclusive, and cost exactly one point',()=>{
  assert.equal(run(`(()=>{const nodes=TALENTS.druid.flatMap(t=>t.nodes).filter(n=>n.startForm);if(nodes.length!==3)throw Error('duplicate form nodes');save.cxp.druid=10000;const tr={d_start_cat:1};const pts=talentPoints('druid',tr);if(pts.spent!==1)throw Error('wrong point cost');const tree=TAL_BY_ID['druid:d_start_tree'];if(!talCanAdd('druid',tree,tr,10))throw Error('forms not exclusive');return true;})()`),true);
});
test('the final boss cannot be followed by a lethal hit before the victory choice',()=>{
  assert.equal(run(`(()=>{startRun('rogue');G.t=900;expansionDirector();killEnemy(enemies.find(e=>e.type==='lost_sovereign'));const hp=P.hp;P.inv=0;hurtPlayer(1e9);return P.hp===hp;})()`),true);
});
test('a selected Druid form starts without extra levels, and custom skills survive restore',()=>{
  assert.equal(run(`(()=>{save.talents.druid={d_start_cat:1};startRun('druid');if(G.pending!==0||G.weapons[0].id!=='catform')throw Error('bad form start');addWeapon('x_druid_cat_0');const snap=serializeRun();restoreRun(snap);return G.weapons.some(w=>w.id==='x_druid_cat_0')&&expansionState().startForm==='cat';})()`),true);
});

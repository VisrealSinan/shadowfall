const test=require('node:test'),assert=require('node:assert/strict');
const N=require('../assets/nightforge.js');
test('Nightforge bulk prices equal sequential purchases and spend regular Shards only',()=>{
 const a={shards:100000,shadowExpansion:{shards:7}},b=structuredClone(a);
 const price=N.quote(a,'power',5);assert.equal(price,5500);assert.equal(N.buy(a,'power',5).price,price);
 for(let i=0;i<5;i++)N.buy(b,'power');assert.deepEqual(a,b);assert.equal(a.shadowExpansion.shards,7);assert.equal(N.store(a).spent,5500);
});
test('Nightforge rejects invalid, unaffordable and unsafe purchases without spending',()=>{
 const s={shards:499};N.store(s);const before=structuredClone(s);
 for(const [key,count] of [['power',1],['unknown',1],['reach',-1],['reach',0],['reach',100]])assert.equal(N.buy(s,key,count),null);
 assert.deepEqual(s,before);s.shards=NaN;assert.equal(N.buy(s,'power'),null);assert.equal(N.cost(Number.MAX_SAFE_INTEGER),null);
});
test('Nightforge benefits have diminishing gains and remain below the declared limits',()=>{
 for(const [key,t] of Object.entries(N.TRACKS)){
   assert.equal(N.value(key,0),0);assert.ok(N.value(key,2)-N.value(key,1)<N.value(key,1));
   assert.ok(N.value(key,1000000)<t.limit);assert.ok(N.cost(100)>N.cost(10));
 }
 const s={nightforge:{ranks:{power:-4,vitality:'bad'},spent:Infinity}};assert.deepEqual(N.bonuses(s),{maxHp:0,dmg:0,pickup:0});
});
const {run}=require('../tools/smoke-game.cjs');
test('all new achievements have stable unique IDs and valid rewards',()=>{
 assert.equal(run(`(()=>{const ids=ACH.map(a=>a.id);if(new Set(ids).size!==ids.length)throw Error('duplicate achievement');const list=ACH.filter(a=>a.id.startsWith('nf_'));if(list.length!==81)throw Error(list.length);for(const a of list){if(!(a.shards>0)&&!GEN_BY_ID[a.rw])throw Error(a.id+' reward');if(a.rw)previewCos(a.rw);}return true;})()`),true);
});
test('existing progress awards Shards exactly once across achievement reloads',()=>{
 assert.equal(run(`(()=>{G=null;save.ach.p.g_kills=50000;save.shards=0;achCheck(true);const first=save.shards;if(!save.ach.done.nf_kills50000||first<1000)throw Error('no retro reward');achCheck(true);achInit();return save.shards===first;})()`),true);
});
test('Nightforge bonuses apply only to new normal runs and survive restore without growing',()=>{
 assert.equal(run(`(()=>{save.nightforge={ranks:{vitality:0,power:0,reach:0},spent:0};startRun('rogue');const damage=P.dmg;save.shards=1e7;Nightforge.buy(save,'power',10);recalc();if(P.dmg!==damage)throw Error('existing run buffed');startRun('rogue');if(!(P.dmg>damage))throw Error('new run unbuffed');const buff=P.dmg,snap=serializeRun();Nightforge.buy(save,'power',10);restoreRun(snap);if(Math.abs(P.dmg-buff)>.00001)throw Error('restored run changed');startRun('rogue',{date:'2026-11-01',seed:1,race:'elf',map:'forest'});if(G.nightforgeBonus.dmg||G.nightforgeBonus.maxHp)throw Error('daily buffed');return true;})()`),true);
});
test('Lost Shadow, final-boss and difficulty counters survive save/restore without duplicate final credit',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.expansion.difficulty=5;const e=spawnEnemy('lost_hollow',{x:50,y:0});killEnemy(e);const boss=spawnEnemy('lost_sovereign',{x:60,y:0});killEnemy(boss);killEnemy(boss);if(G.achRun.nf_lost!==1||G.achRun.nf_final!==1||G.achRun.nf_difficulty5!==1)throw Error('incorrect counters');const snap=serializeRun();restoreRun(snap);if(G.achRun.nf_final!==1)throw Error('counter lost');return true;})()`),true);
});
test('Nightforge and achievement menus render with mixed Shard, cosmetic and map rewards',()=>{
 assert.equal(run(`(()=>{state='shop';shopTab='forge';renderShop();achTab='gen';achKey='all';renderAch();achTab='class';renderAch();return true;})()`),true);
});

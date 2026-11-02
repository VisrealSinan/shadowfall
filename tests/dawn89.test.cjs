const test=require('node:test'),assert=require('node:assert/strict'),{run,w}=require('../tools/smoke-game.cjs');
test('secret races stay hidden until earned; honk unlocks only while playing',()=>{
 run(`delete save.ach.done.secret_goose88;delete save.ach.done.secret_undying88;save.ach.p.g_honk88=0;state='title';`);
 assert.equal(run(`visibleRaceIds88().length`),8);
 const type=key=>w.dispatchTestEvent('keydown',{key,ctrlKey:false,altKey:false,metaKey:false});
 'honk'.split('').forEach(type);assert.equal(run(`raceAvailable88('goose')`),false);
 run(`startRun('rogue')`);'honk'.split('').forEach(type);assert.equal(run(`raceAvailable88('goose')`),true);
});
test('only deaths count, exactly once, and the hundredth unlocks Undead',()=>{
 assert.equal(run(`(()=>{save.ach.p.g_deaths88=99;delete save.ach.done.secret_undying88;startRun('rogue');P.hp=0;showGameOver(true);if(save.ach.p.g_deaths88!==99||raceAvailable88('undead'))throw Error('retreat counted');startRun('rogue');P.hp=0;showGameOver(false);showGameOver(false);return save.ach.p.g_deaths88===100&&raceAvailable88('undead');})()`),true);
});
test('Chosen One cannot give a free starting level or choice',()=>{
 assert.equal(run(`(()=>{save.meta.chosen=1;for(const cls of Object.keys(CLASSES)){startRun(cls);if(G.level!==1||G.pending!==0||G.xp!==0)throw Error(cls+' free level');}save.meta.chosen=0;return true;})()`),true);
});
test('new origins have male/female bodies, ancestry and real stat tradeoffs',()=>{
 assert.equal(run(`(()=>{for(const race of ['undead','goose']){save.race=race;for(const sex of ['male','female']){ActorAnimations.setGender('rogue',race,sex);const v=ActorAnimations.variant({cls:'rogue',race});if(!v.src.includes(race+'-'+sex))throw Error('body');startRun('rogue');if(!(P.maxHp>0&&P.speed>0&&P.healMul>0))throw Error('stats');}if(RaceTalents.trees[race].length!==3)throw Error('ancestry');if(!Object.values(RACES[race].st).some(v=>v<0)||!Object.values(RACES[race].st).some(v=>v>0))throw Error('balance');}save.race='elf';return true;})()`),true);
});
test('duo links empower finishers, build and spend resonance, and preserve it on continue',()=>{
 assert.equal(run(`(()=>{startRun('tibopoteto');enemies=[];const e=spawnEnemy('bone',{x:50,y:0});e.hp=e.maxHp=1e8;buildGrid();const old=damage;let total=0;damage=(e,n)=>total+=n;try{Dawn88.cast({lvl:1},0);if(!e.duoLink88||G.duoResonance88!==1)throw Error('link');total=0;Dawn88.cast({lvl:1},0);if(total!==40.5)throw Error('linked pair '+total);for(let i=0;i<9;i++)Dawn88.cast({lvl:1},1);if(G.duoResonance88!==6)throw Error('cap');saveRun();continueRun();if(G.duoResonance88!==6)throw Error('continue');enemies=[];const e2=spawnEnemy('bone',{x:50,y:0});e2.hp=e2.maxHp=1e8;buildGrid();Dawn88.cast({lvl:1},5);if(G.duoResonance88!==0)throw Error('spend');return true;}finally{damage=old;}})()`),true);
});
test('every duo skill has dedicated card art and every talent has a unique identity',()=>{
 assert.equal(run(`(()=>{const nodes=TALENTS.tibopoteto.flatMap(t=>t.nodes);if(new Set(nodes.map(n=>n.name)).size!==48||nodes.some(n=>/Resolve [0-9]|Technique [0-9]|Instinct [0-9]/.test(n.name)))throw Error('generic tree');for(const [i,id]of Dawn88.ids.entries()){const a=SkillArt.info('w',id);if(a.group!=='duo88'||a.index!==i)throw Error('card');for(let lv=1;lv<=6;lv++){startRun('tibopoteto');const e=spawnEnemy('bone',{x:50,y:0});e.hp=e.maxHp=1e8;buildGrid();if(!Number.isFinite(WFIRE[id]({id,lvl:lv})))throw Error('cast');}}return true;})()`),true);
});
test('duo and new race portrait bounds fit small and large frames',()=>{
 assert.equal(run(`(()=>{for(const cls of ['tibopoteto','rogue'])for(const race of Object.keys(RACES))for(const sex of ['male','female']){if(cls==='rogue'&&!RACES[race].secret)continue;const v=ActorAnimations.variant({cls,race,gender:sex});for(const [w,h]of [[48,48],[64,64],[80,100],[260,300]]){const p=Polish87.portraitLayout(w,h,v,cls),b=p.bounds;if(p.x+b[0]*p.scale<p.pad-.01||p.x+b[2]*p.scale>w-p.pad+.01||p.y+b[1]*p.scale<p.pad-.01||p.y+b[3]*p.scale>h-p.pad+.01)throw Error(cls+'/'+race+' crop');}}return true;})()`),true);
});

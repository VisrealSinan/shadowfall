const test=require('node:test'),assert=require('node:assert/strict'),{run}=require('../tools/smoke-game.cjs');
const reset=`delete save.classes.tibopoteto;delete save.ach.done.secret_duo_trial90;save.ach.p.g_duo_trial90=0;startRun('rogue');`;
const setup=`${reset}const old=obResolve;obResolve=()=>{};try{`;
const close=`}finally{obResolve=old;}`;
const recruit=`G.t=600;DuoEscort91.tick(.1);const e=G.duoEscort91;P.x=e.x;P.y=e.y;DuoEscort91.tick(.1);`;
test('one lost companion appears at ten minutes, joins on approach and never auto-unlocks',()=>{
 assert.equal(run(`(()=>{${setup}G.t=599.9;DuoEscort91.tick(.1);if(G.duoEscort91)throw Error('early');G.t=600;DuoEscort91.tick(.1);const e=G.duoEscort91;if(e.phase!=='waiting'||DuoEscort91.actors().length!==1)throw Error('spawn');for(let i=0;i<700;i++)DuoEscort91.tick(.1);if(e.walked||save.classes.tibopoteto)throw Error('idle');P.x=e.x;P.y=e.y;DuoEscort91.tick(.1);return e.phase==='following'&&e.walked===0;${close}})()`),true);
});
test('sixty seconds of actual walking in any direction leads to a second companion and reunion',()=>{
 assert.equal(run(`(()=>{${setup}${recruit}P.moving=true;for(let i=0;i<599;i++){P.x+=(Math.floor(i/150)%2?-1:1)*P.spdPx*.1;DuoEscort91.tick(.1);}if(e.phase!=='following'||save.classes.tibopoteto)throw Error('early finish');P.x+=P.spdPx*.1;DuoEscort91.tick(.1);if(e.phase!=='reunion'||e.walked!==60||DuoEscort91.actors().length!==2)throw Error('partner');P.x=e.other.x;P.y=e.other.y;DuoEscort91.tick(.1);if(!save.classes.tibopoteto||!save.ach.done.secret_duo_trial90||e.phase!=='reunited')throw Error('unlock');const stamp=save.ach.done.secret_duo_trial90;DuoEscort91.tick(.1);return stamp===save.ach.done.secret_duo_trial90;${close}})()`),true);
});
test('stationary input, pause, town, teleports and long frame gaps cannot farm the walking timer',()=>{
 assert.equal(run(`(()=>{${setup}${recruit}P.moving=true;for(let i=0;i<20;i++)DuoEscort91.tick(.1);if(e.walked)throw Error('blocked');P.x+=1000;DuoEscort91.tick(.1);if(e.walked)throw Error('teleport');state='paused';P.x+=10;DuoEscort91.tick(.1);state='play';G.town={};DuoEscort91.tick(.1);G.town=null;DuoEscort91.tick(.1);const before=e.walked;P.x+=10;DuoEscort91.tick(60);return e.walked<=before+.101;${close}})()`),true);
});
test('escort persists through continue and starts over in a fresh hunt',()=>{
 assert.equal(run(`(()=>{${setup}${recruit}P.moving=true;for(let i=0;i<100;i++){P.x+=P.spdPx*.1;DuoEscort91.tick(.1);}const before=JSON.stringify(G.duoEscort91);saveRun();continueRun();if(JSON.stringify(G.duoEscort91)!==before)throw Error('save');startRun('rogue');return !G.duoEscort91;${close}})()`),true);
});
test('encounter is absent in daily challenges and when duo is already owned; either partner can lead',()=>{
 assert.equal(run(`(()=>{${setup}G.t=600;G.daily=true;DuoEscort91.tick(.1);if(G.duoEscort91)throw Error('daily');G.daily=false;save.classes.tibopoteto=1;DuoEscort91.tick(.1);if(G.duoEscort91)throw Error('owned');delete save.classes.tibopoteto;G.obSeed=0;DuoEscort91.tick(.1);if(G.duoEscort91.first!=='tibo')throw Error('tibo');delete G.duoEscort91;G.obSeed=1;DuoEscort91.tick(.1);return G.duoEscort91.first==='poteto';${close}})()`),true);
});
test('real gameplay movement updates the escort after player movement and collision',()=>{
 assert.equal(run(`(()=>{${setup}${recruit}P.inv=999;keys.add('KeyD');update(.016);keys.delete('KeyD');return G.duoEscort91.walked>0&&G.duoEscort91.walked<=.017;${close}})()`),true);
});

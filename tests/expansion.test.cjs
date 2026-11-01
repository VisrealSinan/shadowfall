const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../assets/expansion-rules.js');
test('new progression is isolated and bounded',()=>{assert.equal(R.newRun(99).difficulty,5);assert.equal(R.newRun().nextLost,500);const s={shards:99};R.profile(s).shards++;assert.equal(s.shards,99);assert.equal(R.profile(s).shards,1);});
test('15 minute enemies are tougher; damage jumps at 20 minutes',()=>{assert.equal(R.multipliers(899).hp,1);assert.equal(R.multipliers(900).hp,1.35);assert.equal(R.multipliers(1199).damage,1);assert.equal(R.multipliers(1200).damage,1.5);assert.ok(R.multipliers(1200,5).damage>R.multipliers(1200,1).damage);});
test('passive randomization requires a full maxed main skill loadout',()=>{const defs={a:{max:6}};const run={weapons:Array.from({length:6},()=>({id:'a',lvl:6}))};assert.equal(R.passiveReady(run,defs),true);run.weapons[0].lvl=5;assert.equal(R.passiveReady(run,defs),false);run.weapons.pop();assert.equal(R.passiveReady(run,defs),false);});

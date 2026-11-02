const test=require('node:test'),assert=require('node:assert/strict'),{run}=require('../tools/smoke-game.cjs');
const reset=`delete save.ach.done.secret_goose_trial90;delete save.ach.done.secret_duo_trial90;delete save.ach.done.secret_goose88;delete save.classes.tibopoteto;save.ach.p.g_goose_trial90=0;save.ach.p.g_duo_trial90=0;`;
test('new unlocks are secret and existing profile records cannot grant them',()=>{
 assert.equal(run(`(()=>{${reset}G=null;save.best=99999;save.totalKills=999999;save.ach.p.g_boss=9999;achCheck(true);achTab='gen';renderAchievementHall();if($('achList').children.some(c=>c.innerHTML.includes('Untamed Migration')||c.innerHTML.includes('Together Again')))throw Error('secret visible');return ACH_BY_ID.secret_goose_trial90.secret&&ACH_BY_ID.secret_duo_trial90.secret&&!save.classes.tibopoteto&&!raceAvailable88('goose');})()`),true);
});
test('Goose needs both thresholds in one new hunt, with no revival',()=>{
 assert.equal(run(`(()=>{${reset}startRun('rogue');G.t=599;G.kills=1000;achCheck(true);if(raceAvailable88('goose'))throw Error('time');G.t=600;G.kills=999;achCheck(true);if(raceAvailable88('goose'))throw Error('kills');G.kills=1000;for(const flag of ['revived','raceReviveUsed','undyingUsed']){G[flag]=true;achCheck(true);if(raceAvailable88('goose'))throw Error(flag);G[flag]=false;}achCheck(true);return raceAvailable88('goose')&&!!save.ach.done.secret_goose_trial90;})()`),true);
});
test('the former boss and skill requirements no longer unlock the duo',()=>{
 assert.equal(run(`(()=>{${reset}startRun('rogue');G.t=9999;G.bossKills=99;G.weapons=Object.keys(WDEF).filter(id=>WDEF[id].cls==='rogue').slice(0,6).map(id=>({id,lvl:6}));achCheck(true);return !save.classes.tibopoteto;})()`),true);
});
test('old continued hunts and daily challenges are ineligible; fresh-run marker survives continue',()=>{
 assert.equal(run(`(()=>{${reset}startRun('rogue');G.t=900;G.kills=1000;G.bossKills=5;G.weapons=Object.keys(WDEF).filter(id=>WDEF[id].cls==='rogue').slice(0,6).map(id=>({id,lvl:1}));const snapshot=serializeRun();delete snapshot.G.secretTrial90;restoreRun(snapshot);achCheck(true);if(save.classes.tibopoteto||raceAvailable88('goose'))throw Error('old run');snapshot.G.secretTrial90=true;snapshot.G.daily=true;snapshot.G.challengeDate='2026-11-02';restoreRun(snapshot);achCheck(true);if(save.classes.tibopoteto||raceAvailable88('goose'))throw Error('daily');snapshot.G.daily=false;snapshot.G.challengeDate='';restoreRun(snapshot);saveRun();continueRun();achCheck(true);return raceAvailable88('goose')&&!save.classes.tibopoteto;})()`),true);
});
test('end-of-hunt settlement catches the last milestone and persists rewards once',()=>{
 assert.equal(run(`(()=>{${reset}startRun('rogue');G.t=900;G.kills=1000;G.bossKills=5;G.weapons=Object.keys(WDEF).filter(id=>WDEF[id].cls==='rogue').slice(0,6).map(id=>({id,lvl:1}));G.duoEscort91={phase:'reunited'};showGameOver(true);const stamp=save.ach.done.secret_duo_trial90;showGameOver(true);const profile=JSON.parse(localStorage.getItem(SAVE_KEY));return !!profile.classes.tibopoteto&&!!profile.ach.done.secret_goose_trial90&&stamp===save.ach.done.secret_duo_trial90&&save.ach.p.g_duo_trial90===1;})()`),true);
});
test('challenge progress never accumulates across separate hunts',()=>{
 assert.equal(run(`(()=>{${reset}startRun('rogue');G.t=600;G.kills=500;showGameOver(true);startRun('rogue');G.t=600;G.kills=500;showGameOver(true);return !raceAvailable88('goose')&&!save.classes.tibopoteto;})()`),true);
});

const test=require('node:test'),assert=require('node:assert/strict');
const {run}=require('../tools/smoke-game.cjs');
test('settings opened during a hunt freeze time and return to pause without ending it',()=>{
 assert.equal(run(`(()=>{startRun('rogue');G.t=123;G.kills=42;goSettings('pause');if(state!=='paused')throw Error('not paused');const old=G.t;frame(performance.now()+100);if(G.t!==old||G.kills!==42||G.ended)throw Error('run changed');closeSettings();if(state!=='paused'||G.t!==old)throw Error('back resumed run');resumeGame();return state==='play'&&G.t===123;})()`),true);
});
test('settings preserve countdown and existing preferences through open and close',()=>{
 assert.equal(run(`(()=>{startRun('rogue');state='countdown';save.audio.music=.23;save.audio.sfx=.41;save.rumble=false;save.jumpSfx=false;save.jumpBtn=true;save.spellVisibilityExpansion=35;goSettings('pause');if(!G.countdownNext||state!=='paused')throw Error('countdown lost');if($('vol_music').value!==23||$('vol_sfx').value!==41||$('spellVisibilityExpansion').value!==35)throw Error('preferences lost');goKeys('settings');goSettings(settingsFrom);if(settingsFrom!=='pause')throw Error('context lost');closeSettings();resumeGame();return state==='countdown'&&G.cdT===3&&save.audio.music===.23&&!save.rumble&&!save.jumpSfx&&save.jumpBtn&&save.spellVisibilityExpansion===35;})()`),true);
});
test('settings outside a hunt return to the main menu',()=>{
 assert.equal(run(`(()=>{goTitle();goSettings('title');if(settingsFrom!=='title')throw Error('wrong origin');closeSettings();return state==='title'&&$('btnMuteT').textContent.includes('Settings')&&$('btnMuteP').textContent.includes('Settings');})()`),true);
});

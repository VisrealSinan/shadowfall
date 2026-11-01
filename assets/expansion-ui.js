/* Lost Shadows and run progression integration. */
function expansionNew(challenge) {
  const p = ShadowExpansion.profile(save), map = selMap36();
  return ShadowExpansion.newRun(challenge || !p.clears[map] ? 1 : p.difficulty);
}
function expansionState() {
  if (!G.expansion) { G.expansion = ShadowExpansion.newRun(); G.expansion.nextLost = (Math.floor(G.kills / 500) + 1) * 500; }
  return G.expansion;
}
function expansionEnemy(e) {
  const m = ShadowExpansion.multipliers(G.t, expansionState().difficulty);
  e.hp *= m.hp; e.maxHp = e.hp; e.dmg *= m.damage; e.spd *= m.speed;
}
function expansionDirector() {
  if (G.town) return;
  const x = expansionState();
  if (G.kills >= x.nextLost && !enemies.some(e => !e.dead && ETYPES[e.type].lostShadow)) {
    const type = ShadowExpansion.LOST[x.lostCount % ShadowExpansion.LOST.length];
    x.lostCount++; x.nextLost += ShadowExpansion.LOST_EVERY;
    const b = spawnEnemy(type); b.hp *= 1 + x.lostCount * .25; b.maxHp = b.hp;
    if (!G.boss || G.boss.dead) G.boss = b;
    announce('LOST SHADOW', ETYPES[type].name + ' · defeat it for an Outfit Shard', '#c58bff', 'boss'); saveRun();
  }
  if (G.t >= 900 && !x.finalSpawned) {
    x.finalSpawned = true; const b = spawnEnemy('lost_sovereign'); G.boss = b;
    announce('FINAL BOSS', 'The Lost Sovereign · defeat it to complete this round', '#ff5a5a', 'boss'); saveRun();
  }
}
function expansionKill(e) {
  const d = ETYPES[e.type], x = expansionState();
  if (d.lostShadow) {
    ShadowExpansion.profile(save).shards++; persist();
    toast('◆ Outfit Shard earned · spend in Wardrobe', '#d9a0ff', 3);
  }
  if (e.type === 'lost_sovereign') { x.finalDefeated = true; }
}
function expansionTick(dt) {
  const x = expansionState(), p = ShadowExpansion.profile(save);
  if (G.t >= 900 && !p.clears[G.map] && !G.challengeDate) { p.clears[G.map] = 1; persist(); toast('Map cleared · Difficulty unlocked', '#ffd24a', 3); }
}
function expansionVictory() {
  state = 'victory'; setJoy(false); keys.clear(); show('victoryExpansion'); $('pauseBtn').classList.add('hidden');
  $('victoryStatsExpansion').textContent = fmtTime(G.t) + ' survived · ' + G.kills + ' kills · ' + G.bossKills + ' bosses';
  saveRun();
}
function expansionSettle() {
  const p = ShadowExpansion.profile(save), key = G.cls;
  p.best[key] = Math.max(p.best[key] || 0, Math.floor(G.t));
}
function expansionSelect() {
  let panel = $('runOptionsExpansion');
  if (!panel) { panel = document.createElement('div'); panel.id = 'runOptionsExpansion'; panel.className = 'stats'; $('select').appendChild(panel); }
  const p = ShadowExpansion.profile(save), cleared = !!p.clears[selMap36()];
  panel.innerHTML = '<label>Difficulty <input id="difficultyExpansion" type="range" min="1" max="5" step="1" value="'+(cleared ? p.difficulty || 1 : 1)+'" '+(!cleared?'disabled':'')+'><output id="difficultyValueExpansion">'+(cleared ? p.difficulty || 1 : 1)+'</output></label><div>'+(cleared?'Higher difficulty increases enemy health and damage.':'Survive 15 minutes on this map to unlock difficulty.')+'</div>';
  $('difficultyExpansion').oninput = e => { p.difficulty = +e.target.value; $('difficultyValueExpansion').textContent = p.difficulty; persist(); };
}
function initExpansion() {
  SCREENS.push('victoryExpansion');
  const bases = ['colossus', 'warden', 'mother'];
  const names = ['Lost Shadow: Hollow Titan', 'Lost Shadow: Cinder Knight', 'Lost Shadow: Veil Mother'];
  ShadowExpansion.LOST.forEach((id,i) => { ETYPES[id] = { ...ETYPES[bases[i]], name: names[i], hp: ETYPES[bases[i]].hp * 1.6, artBase: bases[i], t0: 1e9, lostShadow: true }; });
  ETYPES.lost_sovereign = { ...ETYPES.colossus, name: 'The Lost Sovereign', hp: 3200, dmg: 38, artBase: 'colossus', t0: 1e9 };
  for (const id of [...ShadowExpansion.LOST, 'lost_sovereign']) {
    const base = ETYPES[id].artBase;
    EDRAW[id] = (g, a) => { g.save(); g.filter = id === 'lost_cinder' ? 'hue-rotate(300deg)' : 'hue-rotate(70deg) saturate(.5)'; EDRAW[base](g, a); g.restore(); g.strokeStyle = '#c58bff'; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 30, 27, 7, 0, 0, TAU); g.stroke(); };
  }
  const screen = document.createElement('div'); screen.id = 'victoryExpansion'; screen.className = 'screen dim';
  screen.innerHTML = '<div class="spacer"></div><h2>Round Complete</h2><p>The Lost Sovereign has fallen.</p><p id="victoryStatsExpansion" class="stats"></p><button class="btn primary" id="endExpansion">End Round · Bank Rewards</button><button class="btn" id="endlessExpansion">Continue · Endless</button><p class="stats">Endless continues this run. Enemies hit harder after 20 minutes.</p><div class="spacer"></div>';
  document.body.appendChild(screen);
  $('endExpansion').onclick = () => showGameOver(true);
  $('endlessExpansion').onclick = () => { expansionState().endless = true; G.nextBoss = G.t + 180; resumeGame(); };
}

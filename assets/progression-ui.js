/* UI integration for Daily Challenges and Class Mastery. */
let masteryClass70 = 'rogue', masteryFrom70 = 'title', dailyViewDate70 = '';
function masteryRank70(cls) { return HuntProgress.claimed(save, cls); }
function masteryTitle70(cls) {
  const n = HuntProgress.store(save).titles[cls] | 0;
  return n > 0 && n <= masteryRank70(cls) ? HuntProgress.MASTERY[n - 1].name + ' ' + CLASSES[cls].name : '';
}
function masteryAura70(cls) {
  const a = HuntProgress.store(save).auras[cls], n = masteryRank70(cls);
  return a === 'crown' && n >= 4 ? 'mastery_crown' : a === 'motes' && n >= 3 ? 'mastery_motes' : '';
}
function drawMasteryAura70(g, aura, t, front) {
  if (aura !== 'mastery_motes' && aura !== 'mastery_crown') return false;
  g.save();
  if (!front) { g.strokeStyle = '#d9b76b'; g.globalAlpha = .65; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, 17, 20, 6, 0, 0, TAU); g.stroke(); }
  for (let i = 0; i < 5; i++) {
    const a = t * 1.4 + i * TAU / 5, isFront = Math.sin(a) > 0;
    if (front !== isFront) continue;
    const x = Math.cos(a) * 20, y = 10 + Math.sin(a) * 6 - Math.sin(t * 2 + i) * 3;
    glowDot(g, x, y, 4, i % 2 ? '#ffd88a' : '#d1a0ff', .7);
  }
  if (aura === 'mastery_crown' && front) {
    g.strokeStyle = '#ffe1a0'; g.fillStyle = '#c88cff'; g.lineWidth = 1.4;
    const y = -58 + Math.sin(t * 2) * 1.5;
    g.beginPath(); g.moveTo(-10, y + 7); g.lineTo(-12, y); g.lineTo(-5, y + 4); g.lineTo(0, y - 3); g.lineTo(5, y + 4); g.lineTo(12, y); g.lineTo(10, y + 7); g.closePath(); g.stroke();
    g.fillRect(-1, y + 2, 2, 2);
  }
  g.restore(); return true;
}
function dailyPlan70() { return HuntProgress.plan(); }
function refreshProgressPortrait70() {
  if (state === 'daily' && $('dailyHero70')) { const p = dailyPlan70(); heroPortrait($('dailyHero70'), p.cls, 'crimson', 1, p.race); }
  else if (state === 'mastery' && $('masteryHero70')) heroPortrait($('masteryHero70'), masteryClass70, save.outfit, .95);
}
function dailyTierText70(t) { return `Survive ${fmtTime(t.time)} · ${t.kills} foes` + (t.bosses ? ` · ${t.bosses} boss` : ''); }
function goDaily70() { state = 'daily'; show('daily'); renderDaily70(); }
function renderDaily70() {
  const p = dailyPlan70(), r = HuntProgress.record(save, p.date), mods = dailyMods50(p.date);
  dailyViewDate70 = p.date;
  $('dailySub70').textContent = p.date + ' · resets at 00:00 UTC · unlimited attempts';
  $('dailyContent70').innerHTML = `<section class="hunt-card"><div class="hunt-kicker">One day. One shared starting setup.</div><div class="hunt-hero"><canvas id="dailyHero70"></canvas><div><h3>${CLASSES[p.cls].name} in ${MAPNAME36[p.map]}</h3><p>${RACES[p.race].name} · ${WDEF[CLASSES[p.cls].weapon].name}</p><div class="hunt-tags">${mods.map(k => `<span>${MODS50[k].ic} ${MODS50[k].n}</span>`).join('')}</div></div></div><div class="hunt-note">${mods.map(k => MODS50[k].d).join(' ')}<br>Standard loadout: no Armory upgrades, talents, keepsakes, outfit bonuses or mastery perks. Today's map is available for this challenge even if it is locked in normal hunts. Level-up choices and combat can differ between attempts.</div><div class="hunt-statline"><span>Best score <b>${r.score.toLocaleString()}</b></span><span>${r.attempts} finished attempt${r.attempts === 1 ? '' : 's'}</span><span>${r.paid}/3 rewards earned</span></div>${r.score ? `<p>Best attempt: ${fmtTime(r.time)} · ${r.kills} foes · ${r.bosses} bosses</p>` : ''}<p>Score = seconds survived + 2 per foe + 100 per boss. Records and rewards are saved on this device.</p></section><section><div class="hunt-kicker">Reach every objective in a single attempt</div><div class="hunt-grid">${HuntProgress.DAILY.map((t,i) => `<article class="hunt-tier${r.paid > i ? ' done' : ''}"><h4>${t.name}</h4><p>${dailyTierText70(t)}</p><p class="reward">+${t.shards} ◆ Shards</p><span class="hunt-state">${r.paid > i ? '✓ Reward earned' : 'Awarded when your attempt ends'}</span></article>`).join('')}</div><p class="hunt-sub">Rewards are paid once per UTC date. Keep playing to improve your best score. Continue Run preserves the date your attempt started.</p></section>`;
  heroPortrait($('dailyHero70'), p.cls, 'crimson', 1, p.race);
  $('btnDailyStart70').textContent = r.paid === 3 ? 'Play Again · Improve Best' : 'Begin Daily Challenge';
}
function startDaily70() {
  // Compute the date again at click time; an open menu may cross midnight.
  const begin = () => { const p = dailyPlan70(); startRun(p.cls, p); saveRun(); };
  if (loadRun()) {
    askConfirm('Start a Daily Challenge?', 'Your current hunt will end as a retreat, banking its earned Shards and class XP. The new challenge uses today\'s fixed setup.', 'Start Daily', () => { abandonSavedRun(); begin(); });
  } else begin();
}
function goMastery70(from = 'title', cls = save.lastClass) {
  masteryFrom70 = from; masteryClass70 = menuClassIds().includes(cls) ? cls : 'rogue'; state = 'mastery'; show('mastery'); renderMastery70();
}
function renderMastery70() {
  const cls = masteryClass70, rank = masteryRank70(cls), lv = classLevel(cls).lvl, s = HuntProgress.stats(save, cls, lv), store = HuntProgress.store(save), own = !!save.classes[cls];
  $('masterySub70').textContent = 'Progress is shared across races and male/female models of each class. Past class XP and achievement records count.';
  const list = $('masteryClasses70'); list.innerHTML = '';
  for (const id of menuClassIds()) {
    const b = document.createElement('button'); b.dataset.masteryClass = id; b.className = id === cls ? 'on' : ''; b.setAttribute('aria-pressed', id === cls);
    b.innerHTML = `<span>${CLASSES[id].name}${save.classes[id] ? '' : ' · locked'}</span><small>${masteryRank70(id)}/4</small>`;
    b.onclick = () => { masteryClass70 = id; renderMastery70(); const next = list.querySelector(`[data-mastery-class="${id}"]`); next.focus({preventScroll:true}); next.scrollIntoView({block:'nearest'}); }; list.appendChild(b);
  }
  const metrics = [['level','Class level',v=>v],['kills','Total foes',v=>v.toLocaleString()],['time','Best survival',fmtTime],['bosses','Total bosses',v=>v]];
  const title = masteryTitle70(cls), aura = store.auras[cls];
  $('masteryMain70').innerHTML = `<section class="hunt-card"><div class="hunt-kicker">CLASS MASTERY · ${rank}/4 CLAIMED</div><div class="hunt-hero"><canvas id="masteryHero70"></canvas><div><h3>${CLASSES[cls].name}</h3><p>${title || 'Build your legend, one hunt at a time.'}</p><p>Lv ${lv} · ${s.kills.toLocaleString()} foes · ${fmtTime(s.time)} best · ${s.bosses} bosses</p></div></div><p>${own ? 'Claim each rank in order. Rewards belong to this class and work with every race and body.' : 'Unlock this class in the Armory to claim its rewards.'} Mastery perks apply to normal hunts; Daily Challenges use the standard loadout.</p><div class="mastery-looks"><button data-title="0" class="${!title ? 'on' : ''}" aria-pressed="${!title}">No title</button>${HuntProgress.MASTERY.slice(0,rank).map((t,i)=>`<button data-title="${i+1}" class="${store.titles[cls]===i+1?'on':''}" aria-pressed="${store.titles[cls]===i+1}">${t.name} title</button>`).join('')}${rank >= 3 ? `<button data-aura="" class="${!aura?'on':''}" aria-pressed="${!aura}">No mastery aura</button><button data-aura="motes" class="${aura==='motes'?'on':''}" aria-pressed="${aura==='motes'}">Mastery Motes</button>` : ''}${rank >= 4 ? `<button data-aura="crown" class="${aura==='crown'?'on':''}" aria-pressed="${aura==='crown'}">Mastery Crown</button>` : ''}</div>${rank >= 3 ? '<p>Mastery auras take priority over the Wardrobe aura for this class. Choose No mastery aura to use your Wardrobe look.</p>' : ''}</section><div class="hunt-grid">${HuntProgress.MASTERY.map((t,i)=>{
    const done = rank > i, ready = HuntProgress.ready(s,t), pct = Math.floor(metrics.reduce((n,[k])=>n+Math.min(1,t[k]?s[k]/t[k]:1),0)/metrics.length*100);
    return `<article class="hunt-tier mastery-tier${done?' done':''}"><div class="hunt-kicker">RANK ${i+1}</div><h4>${t.name}</h4>${metrics.filter(([k])=>t[k]>0).map(([k,label,fmt])=>`<div class="mastery-check${s[k]>=t[k]?' met':''}"><span>${label}</span><b>${fmt(Math.min(s[k],t[k]))} / ${fmt(t[k])}</b></div>`).join('')}<div class="hunt-meter" role="progressbar" aria-label="${t.name} mastery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div><p class="reward">+${t.shards} ◆ · ${t.reward}</p><button class="btn small${!done&&ready&&rank===i&&own?' primary':''}" data-claim="${i}" ${done||!ready||rank!==i||!own?'disabled':''}>${done?'✓ Claimed':rank<i?'Claim previous rank first':ready&&own?'Claim Reward':'Keep hunting'}</button></article>`;
  }).join('')}</div>`;
  heroPortrait($('masteryHero70'), cls, save.outfit, .95);
  for (const b of $('masteryMain70').querySelectorAll('[data-claim]')) b.onclick = () => {
    if (!save.classes[cls]) return;
    const reward = HuntProgress.claim(save, cls, classLevel(cls).lvl, +b.dataset.claim);
    if (!reward) return; persist(); Snd.play('buy'); renderMastery70();
    $('masteryMessage70').textContent = `${CLASSES[cls].name}: ${reward.name} claimed · +${reward.shards} Shards`;
  };
  for (const b of $('masteryMain70').querySelectorAll('[data-title]')) b.onclick = () => { store.titles[cls] = +b.dataset.title; persist(); renderMastery70(); };
  for (const b of $('masteryMain70').querySelectorAll('[data-aura]')) b.onclick = () => { store.auras[cls] = b.dataset.aura; persist(); renderMastery70(); };
}
function progressionSummary70(daily, cls) {
  const s = HuntProgress.stats(save, cls, classLevel(cls).lvl), n = masteryRank70(cls), next = HuntProgress.MASTERY[n];
  let out = '';
  if (daily.date) out += `<section class="hunt-summary"><b>Daily Challenge · ${daily.date}</b><p>Score ${daily.score.toLocaleString()} · personal best ${daily.best.toLocaleString()}</p><p>${daily.ranks.length ? daily.ranks.join(' + ') + ' earned · +' + daily.shards + ' ◆' : 'Replay to improve your best. Each daily reward is paid once.'}</p></section>`;
  out += `<section class="hunt-summary"><b>${CLASSES[cls].name} Mastery · ${n}/4</b><p>${masteryTitle70(cls) || (next ? 'Next rank: ' + next.name : 'Every rank claimed')}${next && HuntProgress.ready(s,next) ? ' · Reward ready in Class Mastery!' : ''}</p></section>`;
  return out;
}
function updateDailyTrack70() {
  const b = $('dailyTrack70'), on = G && G.challengeDate && ['play','countdown','paused'].includes(state);
  b.classList.toggle('hidden', !on); if (!on) return;
  const q = $('qTrack'), qr = !q.classList.contains('hidden') ? q.getBoundingClientRect() : null;
  b.style.top = Math.ceil(Math.max((SAFE.t + Math.max(HUD_BOT, G.boss && !G.boss.dead ? 128 : 0)) * UIS, qr ? qr.bottom : 0) + 8) + 'px';
  const n = HuntProgress.DAILY.reduce((n,t)=>HuntProgress.qualifies(G,t)?n+1:n,0), t = HuntProgress.DAILY[n];
  b.innerHTML = `<span>Daily · ${G.challengeDate} · ${n}/3 goals</span><small>${t ? `${t.name}: ${fmtTime(Math.min(G.t,t.time))}/${fmtTime(t.time)} · ${Math.min(G.kills,t.kills)}/${t.kills} foes${t.bosses?' · '+Math.min(G.bossKills,t.bosses)+'/'+t.bosses+' boss':''}` : 'All goals reached · rewards bank when the run ends'}</small>`;
}
function initHunts70() {
  HuntProgress.store(save);
  bind('btnDaily70', goDaily70); bind('btnDailyBack70', goTitle); bind('btnDailyStart70', startDaily70);
  bind('btnMastery70', () => goMastery70()); bind('btnSelMastery70', () => goMastery70('select',selClass)); bind('btnOverMastery70', () => goMastery70('over',G.cls));
  bind('btnMasteryBack70', () => { if (masteryFrom70 === 'select') goSelect(); else if (masteryFrom70 === 'over' && G) { state='over'; show('over'); } else goTitle(); });
  $('dailyTrack70').onclick = () => { if (state === 'play' || state === 'countdown') pauseGame(); };
  setInterval(() => { updateDailyTrack70(); if (state === 'daily' && dailyViewDate70 !== HuntProgress.day()) renderDaily70(); }, 400);
}

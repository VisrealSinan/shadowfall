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
  e.biteExpansion = G.t >= 1200;
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
    achAdd('nf_lost', 1);
    const earned = prepRewardSettings().outfitShards; ShadowExpansion.profile(save).shards += earned; persist();
    toast('◆ '+earned+' Outfit Shard'+(earned===1?'':'s')+' earned · spend in Wardrobe', '#d9a0ff', 3);
  }
  if (e.type === 'lost_sovereign' && !x.finalDefeated) { nightforgeRecordFinal(); x.finalDefeated = true; }
}
function expansionTick(dt) {
  expansionHuntTick(dt);
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
function initExpansion() {
  SCREENS.push('victoryExpansion');
  expansionInitSecrets();
  expansionInitSkills();
  expansionInitControls();
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
  buildArt(); // Register lazy art entries for the newly added enemies.
  $('endExpansion').onclick = () => showGameOver(true);
  $('endlessExpansion').onclick = () => { if (!expansionState().endless) achAdd('nf_endless', 1); expansionState().endless = true; G.nextBoss = G.t + 180; resumeGame(); };
}
function expansionOpacity() { return Math.max(5, Math.min(100, Number(save.spellVisibilityExpansion) || 100)); }
function expansionStart() {
  const x = expansionState(); x.randomAll = !G.challengeDate && !!save.randomBuildExpansion;
  if (G.cls === 'druid') {
    x.startForm = G.tf.startCat ? 'cat' : G.tf.startTree ? 'tree' : G.tf.startCaster ? 'caster' : '';
    const f = G.tf.startCat ? 'catform' : G.tf.startTree ? 'treeform' : '';
    if (f && !G.weapons.some(w=>w.id===f)) { if (f === 'catform') G.weapons = G.weapons.filter(w=>w.id !== CLASSES.druid.weapon); addWeapon(f); }
  }
  if (x.randomAll) {
    const pool = Object.keys(WDEF).filter(id => WDEF[id].cls === G.cls && !WDEF[id].form && (!WDEF[id].cat || druidForm()==='cat') && (!WDEF[id].tree || druidForm()==='tree') && (!WDEF[id].caster || !druidForm()) && !(druidForm()==='cat' && catBan(id)));
    if (pool.length) { const i=G.weapons.findIndex(w=>w.id===CLASSES[G.cls].weapon); if(i>=0)G.weapons.splice(i,1); addWeapon(pick(pool)); }
  }
}
function expansionRandomControl() {
  let b = $('randomPassiveExpansion');
  if (!b) { b=document.createElement('button'); b.id='randomPassiveExpansion'; b.className='btn small'; $('levelup').insertBefore(b,$('choices')); }
  const x=expansionState(),ready=ShadowExpansion.passiveReady(G,WDEF,SKILL_SLOTS);
  b.hidden=!ready; b.textContent=x.randomPassives?'Random passives: ON':'Randomize all future passives';
  b.onclick=()=>{x.randomPassives=!x.randomPassives; buildChoices();saveRun();};
}
function expansionAutoChoice(ch) {
  const x=expansionState(),ready=ShadowExpansion.passiveReady(G,WDEF,SKILL_SLOTS);
  const pool=x.randomAll?ch: x.randomPassives&&ready?ch.filter(o=>o.k==='p'):[];
  if(!pool.length)return;
  const run=G,choices=G.luChoices,o=pick(pool);
  setTimeout(()=>{if(G===run&&state==='levelup'&&G.luChoices===choices&&G.pending>0)applyChoice(o);},20);
}
function expansionWard(body) {
  const p=ShadowExpansion.profile(save),items=(ARMOR_SETS[wardCls]||[]).filter(o=>o.outfitShardCost);
  const section=document.createElement('section');section.className='stats';
  section.innerHTML='<h3>Lost Shadow outfits</h3><p>◆ '+p.shards+' Outfit Shards · cosmetic only · earned from Lost Shadows</p>';
  for(const o of items){const own=!!p.looks[o.id],eq=save.cos.armor[wardCls]===o.id,b=document.createElement('button');b.className='btn small';b.textContent=o.name+' · '+(eq?'Worn':own?'Wear':o.outfitShardCost+' ◆');b.disabled=eq||(!own&&p.shards<o.outfitShardCost);b.onclick=()=>{if(!p.looks[o.id]){if(p.shards<o.outfitShardCost)return;p.shards-=o.outfitShardCost;p.looks[o.id]=1;}save.cos.armor[wardCls]=o.id;persist();renderWard();};section.appendChild(b);}
  body.appendChild(section);
}
function expansionInitControls() {
  const p=ShadowExpansion.profile(save);
  const settings=document.createElement('div');settings.className='settings-visibility';settings.innerHTML='<label for="spellVisibilityExpansion">Player spell visibility</label><input id="spellVisibilityExpansion" type="range" min="5" max="100" step="5" value="'+expansionOpacity()+'"><output id="spellVisibilityValueExpansion">'+expansionOpacity()+'%</output><p>Fades your spells and decorative particles. Enemy attacks and warning zones stay visible.</p>';
  $('settingsVisibility').appendChild(settings);$('spellVisibilityExpansion').oninput=e=>{save.spellVisibilityExpansion=+e.target.value;$('spellVisibilityValueExpansion').textContent=e.target.value+'%';persist();};
  const random=document.createElement('label');random.className='selection-random';random.innerHTML='<input id="randomBuildExpansion" type="checkbox" '+(save.randomBuildExpansion?'checked':'')+'> Random build · auto-pick skills and passives every level';$('selectionRandom').appendChild(random);$('randomBuildExpansion').onchange=e=>{save.randomBuildExpansion=e.target.checked;persist();};
  const palettes=[['Moonlit','#28386a','#080d22','#a8dfff','stars'],['Ember','#a43a20','#270905','#ffd08a','stripes'],['Verdant','#28543d','#061e11','#b5ff9a','scales'],['Ivory','#c4bbc9','#36303b','#fff3cf','filigree'],['Voidbound','#38224d','#0e0417','#ee9dff','runes']];
  for(const cls of Object.keys(CLASSES)){
    ARMOR_SETS[cls] ||= [];
    palettes.forEach(([name,main,shade,trim,motif],i)=>{const id='lostlook_'+cls+'_'+i;if(ARMOR_BY_ID[id])return;const o={...AS(id,name+' '+CLASSES[cls].name,main,shade,trim,motif),cls,outfitShardCost:i+1};ARMOR_SETS[cls].push(o);ARMOR_BY_ID[id]=o;});
  }
  const forms=[['cat','Shadowcat','startCat'],['caster','Wildcaller','startCaster'],['tree','Elderbark','startTree']];
  forms.forEach(([form,name,flag],bi)=>{const n={id:'d_start_'+form,n:'Start as '+name,name:'Start as '+name,ic:bi===0?'🐾':bi===1?'✿':'♣',t:1,c:0,m:1,e:{},f:flag,startForm:form,bi,slot:-1,d:'Choose your starting form. Only one starting form talent may be selected. Costs 1 talent point.'};TALENTS.druid[bi].nodes.unshift(n);TAL_BY_ID['druid:'+n.id]=n;});
  const tip=document.createElement('div');tip.id='skillHoverExpansion';Object.assign(tip.style,{position:'fixed',display:'none',pointerEvents:'none',zIndex:1000,maxWidth:'320px',padding:'12px',border:'1px solid #ba8be8',borderRadius:'10px',background:'#140b24',fontSize:'13px',color:'#eee6ff'});document.body.appendChild(tip);
  cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect(),pos=FieldHUD.pointer(e.clientX,e.clientY,r,W,H,UIS),x=pos.x,y=pos.y,it=LO_RECTS.find(b=>x>=b[0]&&x<=b[0]+b[2]&&y>=b[1]&&y<=b[1]+b[3]);if(state!=='play'||!it){tip.style.display='none';return;}tip.innerHTML=loDetail(it[4]);tip.style.display='block';tip.style.left=Math.max(8,Math.min(innerWidth-330,e.clientX+12))+'px';tip.style.top=Math.min(innerHeight-tip.offsetHeight-8,e.clientY+16)+'px';});cv.addEventListener('pointerleave',()=>tip.style.display='none');
}
function expansionHUD() {
  let el=$('huntTimerExpansion');if(!el){el=document.createElement('div');el.id='huntTimerExpansion';Object.assign(el.style,{position:'fixed',left:'50%',bottom:'130px',transform:'translateX(-50%)',pointerEvents:'none',fontSize:'13px',color:'#e8e2f5',background:'#160c24dd',padding:'5px 10px',borderRadius:'8px',zIndex:4});document.body.appendChild(el);}
  const x=G&&G.expansion,on=x&&x.huntStarted!==undefined&&!x.huntComplete&&['play','countdown'].includes(state);el.style.display=on?'block':'none';if(on)el.textContent='Lanternless Pursuer · survive '+fmtTime(Math.max(0,180-(x.huntElapsed||0)));
  const tip=$('skillHoverExpansion');if(tip&&state!=='play')tip.style.display='none';
}

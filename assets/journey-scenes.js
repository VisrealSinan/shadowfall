let raceTreeRace='elf',raceTreeFrom='prep';
const RACE_FLAG_TEXT={catRevive:'Once per run, survive a lethal hit at 20% HP.',elfVolley:'Every 12s, strike up to 3 nearby foes with ancestral starlight.',ogreQuake:'Every 14s, slam nearby foes with an ancestral shockwave.',trollMend:'Every 20s, recover 8% of your maximum HP.',foxFire:'Every 10s, erupt in a damaging foxfire pulse.',shadeVeil:'Taking a hit grants +25% evasion for 2s (12s cooldown).'};
function raceNodeText(n){const labels={maxHp:'max HP',regen:'HP / sec',armor:'armor',dmg:'damage',crit:'crit chance',dodge:'evasion',speed:'move speed',cd:'cooldown reduction',xp:'XP gain',area:'area',range:'range',pickup:'pickup range',dr:'damage reduction',critMul:'critical damage',arrowDmg:'arrow damage',arcane:'arcane power',nature:'nature power',fire:'fire power',burn:'burn damage',minion:'minion damage',minionHp:'minion health',lifesteal:'life drain',dot:'affliction damage',dur:'duration',spread:'affliction spread',pierce:'pierce',feral:'feral power',bleed:'bleed damage'};return Object.entries(n.stats).map(([k,v])=>'+'+(['maxHp','regen','armor','spread','pierce'].includes(k)?Number(v.toFixed(2)):(v*100).toFixed(1)+'%')+' '+(labels[k]||k)+' per rank').concat(n.flag?[RACE_FLAG_TEXT[n.flag]]:[]).join(' · ');}
function prepRewardSettings(){return RunPrep.rewards(expansionState().difficulty,!!G.challengeDate);}
function recordMapProgress(){if(G&&!G.ended&&RunPrep.record(save,G))persist();}
function drawPreparedHero(canvas,cls,race){if(!canvas)return;const w=canvas.clientWidth||280,h=canvas.clientHeight||360,d=Math.min(2,window.devicePixelRatio||1);if(canvas.width!==w*d||canvas.height!==h*d){canvas.width=w*d;canvas.height=h*d;}const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);const k=Math.min(w/90,h/105);g.translate(w/2,h*.74);g.scale(k,k);const tf=talentFx(cls).f||{},form=cls==='druid'?(tf.startCat?'cat':tf.startTree?'tree':null):null;drawHero(g,{cls,race,outfit:save.outfit,cos:heroCos(cls,race),gear:stashOf(cls),gearOver:save.gearOver,form,t:gtime,atk:0});}
function runPrepTick(){if(state==='prep')drawPreparedHero($('prepHero'),selClass,raceOf(save.race));else if(state==='raceTalents')drawPreparedHero($('raceTreeHero'),CLASSES[selClass]?selClass:clsOf(save.lastClass),raceTreeRace);}
function goRunPrep(){state='prep';show('runPrep');keys.clear();renderRunPrep();}
function renderRunPrep(){
 const map=selMap36(),cls=selClass,race=raceOf(save.race),p=ShadowExpansion.profile(save),d=p.clears[map]?RunPrep.clamp(p.difficulty):1,rewards=RunPrep.rewards(d),record=RunPrep.store(save)[map],cp=talentPoints(cls),rp=RaceTalents.points(save,race);
 $('prepClass').textContent=CLASSES[cls].name;$('prepRace').textContent=RACES[race].name;$('prepWeapon').textContent=WDEF[CLASSES[cls].weapon].name;
 $('prepMap').textContent=MAPNAME36[map];$('prepMapArt').style.backgroundImage='url("'+mapPreview39(map,640,300)+'")';
 $('prepBest').textContent=record?fmtTime(record.best):'No run recorded';$('prepBestContext').textContent=record?(CLASSES[record.cls]?CLASSES[record.cls].name:'Survivor')+' · '+(record.daily?'Daily Challenge':'Difficulty '+record.difficulty):p.clears[map]?'Previously cleared · detailed map records begin with this update.':'Your next hunt begins this map’s record.';
 $('prepDifficulty').value=d;$('prepDifficulty').disabled=!p.clears[map];$('prepDifficultyName').textContent=rewards.name+' · '+d+'/5';$('prepDifficultyLock').textContent=p.clears[map]?'Higher stakes. Greater rewards.':'Survive 15:00 on this map in a normal hunt to unlock higher difficulties.';
 $('prepEnemyStats').textContent='Enemy health ×'+(1+(d-1)*.35).toFixed(2)+' · damage ×'+(1+(d-1)*.25).toFixed(2);
 $('prepShardBonus').textContent='×'+rewards.shards.toFixed(2);$('prepXpBonus').textContent='×'+rewards.xp.toFixed(2);$('prepOutfitBonus').textContent=rewards.outfitShards+' / Lost Shadow';
 $('prepClassPoints').textContent=cp.spent+' allocated / '+cp.total+' earned · 51 max';$('prepRacePoints').textContent=rp.spent+' allocated / '+rp.level+' earned · 30 max';
 const mods=modsForRun50();$('prepTwists').textContent=mods.length?'Twists: '+mods.map(k=>MODS50[k].n).join(' · '):'Standard rules · no twists selected';$('prepRandom').textContent=save.randomBuildExpansion?'Random build enabled':'Choose your skills during the hunt';
 drawPreparedHero($('prepHero'),cls,race);
}
function goRaceTalents(from='prep'){raceTreeFrom=from;raceTreeRace=raceOf(save.race);state='raceTalents';show('raceTalents');renderRaceTalents();}
function renderRaceTalents(){
 const race=raceTreeRace,p=RaceTalents.points(save,race),store=RaceTalents.store(save),allocation=store.talents[race];$('raceTreeTitle').textContent=RACES[race].name+' · Ancestry';$('raceTreePoints').textContent=p.free+' available';$('raceTreeCap').textContent=p.spent+' allocated · '+p.level+'/30 points earned · 30 maximum';$('raceTreeXp').textContent='Race level '+p.level+'/30 · '+(p.need?Math.floor(p.into)+' / '+p.need+' XP':'Maximum level reached');
 $('raceTreeXpBar').style.width=(p.need?Math.min(100,p.into/p.need*100):100)+'%';
 const tabs=$('raceTreeTabs');tabs.innerHTML='';for(const id of RACE_IDS){const b=document.createElement('button');b.textContent=RACES[id].name;b.className=id===race?'on':'';b.setAttribute('aria-pressed',String(id===race));b.onclick=()=>{raceTreeRace=id;renderRaceTalents();};tabs.appendChild(b);}
 const host=$('raceTreeBranches');host.innerHTML='';for(const [bi,branch]of RaceTalents.trees[race].entries()){
  const col=document.createElement('section');col.className='ancestry-branch';col.innerHTML='<header><span>PATH 0'+(bi+1)+'</span><h3>'+branch.name+'</h3></header>';
  for(const n of branch.nodes){const r=allocation[n.id]||0,prev=branch.nodes[n.tier-1],open=!prev||allocation[prev.id]===prev.max,card=document.createElement('article');card.className='ancestry-node'+(r?' learned':'')+(n.flag?' capstone':'')+(!open?' sealed':'');
   card.innerHTML='<div><span class="ancestry-symbol">'+(n.tier===4?'✧':'◇')+'</span><strong>'+n.name+'</strong><b>'+r+'/'+n.max+'</b></div><p>'+raceNodeText(n)+'</p><footer><span>'+(!open?'Requires '+prev.name+' at max rank':n.tier===4?'Ancestral capstone':'1 point per rank')+'</span></footer>';
   for(const delta of [-1,1]){const b=document.createElement('button');b.textContent=delta>0?'+':'−';b.setAttribute('aria-label',(delta>0?'Learn ':'Remove rank from ')+n.name);b.disabled=delta>0?(!open||!p.free||r>=n.max):(!r||branch.nodes.slice(n.tier+1).some(next=>allocation[next.id]));b.onclick=()=>{if(RaceTalents.allocate(save,race,n.id,delta)){persist();Snd.play('pick');renderRaceTalents();}};card.querySelector('footer').appendChild(b);}col.appendChild(card);
  }host.appendChild(col);
 }
 $('raceTreeReset').disabled=!p.spent;$('raceTreeReset').onclick=()=>{RaceTalents.store(save).talents[race]={};persist();renderRaceTalents();};drawPreparedHero($('raceTreeHero'),CLASSES[selClass]?selClass:clsOf(save.lastClass),race);
}
function raceTalentTick(dt){
 if(!G.raceTal||G.challengeDate||G.town)return;const flags=G.raceTal.f||{},timers=G.raceTimers||(G.raceTimers={});
 const periodic=(flag,seconds,fn)=>{if(!flags[flag])return;timers[flag]=(timers[flag]===undefined?seconds:timers[flag])-dt;if(timers[flag]<=0){timers[flag]=seconds;fn();}};
 periodic('elfVolley',12,()=>{for(const e of nearestN(P.x,P.y,3,340)){damage(e,20+G.level*2,{src:'@ancestry'});effects.push({k:'bolt',x:e.x,y:e.y,x0:P.x,y0:P.y-20,life:.3,max:.3,seed:1,col:'#b8dfff',src:'@ancestry'});}});
 periodic('ogreQuake',14,()=>{areaHit(P.x,P.y,125*P.area,25+G.level*2,100);effects.push({k:'boom',x:P.x,y:P.y,r:125,life:.4,max:.4,col:'#dec79c',src:'@ancestry'});});
 periodic('trollMend',20,()=>heal(P.maxHp*.08,true));
 periodic('foxFire',10,()=>{areaHit(P.x,P.y,105*P.area,(18+G.level*1.5)*P.fire,30);effects.push({k:'boom',x:P.x,y:P.y,r:105,life:.4,max:.4,col:'#ffb06a',src:'@ancestry'});});
 if(timers.veilCd>0)timers.veilCd-=dt;if(timers.veilT>0){timers.veilT-=dt;if(timers.veilT<=0)recalc();}
}
function raceTalentHurt(){const flags=G.raceTal&&G.raceTal.f||{},t=G.raceTimers||(G.raceTimers={});if(flags.shadeVeil&&!(t.veilCd>0)){t.veilCd=12;t.veilT=2;recalc();}}
function raceTalentRevive(){if(!G.raceTal||!G.raceTal.f.catRevive||G.raceReviveUsed)return false;G.raceReviveUsed=true;P.hp=Math.max(1,P.maxHp*.2);P.inv=2;toast('Ninth Breath · ancestry refuses death','#e6c18a',3);return true;}
function initJourneyScenes(){
 RaceTalents.migrate(save);const cleared=ShadowExpansion.profile(save).clears,history=save.ach&&save.ach.p||{};if(history.f15)cleared.forest=1;if(history.c15)cleared.castle=1;for(const z of Object.values(ZN39))if(z.prog&&history[z.prog])cleared[z.prev]=1;const old=loadRun();if(old&&old.G)RunPrep.record(save,old.G);SCREENS.push('runPrep','raceTalents');
 $('prepDifficulty').oninput=e=>{const p=ShadowExpansion.profile(save);p.difficulty=p.clears[selMap36()]?RunPrep.clamp(e.target.value):1;persist();renderRunPrep();};
 $('prepBack').onclick=goMaps;$('prepBegin').onclick=()=>{Snd.init();startRun(selClass);};$('prepClassTalents').onclick=()=>goTalents(selClass,'prep');$('prepRaceTalents').onclick=()=>goRaceTalents('prep');
 $('raceTreeBack').onclick=()=>raceTreeFrom==='prep'?goRunPrep():goRace();$('btnRaceTalents').onclick=()=>goRaceTalents('race');
}

/* Secret characters, encounters, and hand-authored skill names. */
function expansionInitSecrets() {
  const secret = (id, name, weapon, color, desc, stats) => {
    CLASSES[id]={name,role:id==='tibopoteto'?'Codex & Grok · Paired Survivor':'Secret Survivor',flavor:id==='myers'?'The shape walks again.':'Two signals. One heartbeat.',desc,weapon,wname:weapon,art:'dagger',tint:color,cost:0,secret:true,passive:id==='myers'?'Relentless':'Shared Signal',pdesc:id==='myers'?'A durable melee survivor. The playable character takes damage normally.':'Two people fight together as one survivor with shared health.',stats,chips:['Secret class',id==='myers'?'Melee':'Duo']};
    CLS_COL[id]=color;CLASS_LOOK[id]={...CLASS_LOOK.rogue};CLASS_PAL[id]={...CLASS_PAL.rogue};GCLS[id]=GCLS.rogue||['dmg','crit','speed'];
    TALENTS[id]=['Resolve','Technique','Instinct'].map((name,bi)=>TTREE(name,['✦','◈','♥'][bi],color,Array.from({length:16},(_,i)=>[id+'_tal_'+bi+'_'+i,name+' '+(i+1),['✦','◈','♥'][bi],bi===0?{dmg:.015}:bi===1?{cd:.01}:{maxHp:4}])));
    TALENTS[id].forEach((tr,bi)=>tr.nodes.forEach(n=>{n.bi=bi;TAL_BY_ID[id+':'+n.id]=n;}));
  };
  secret('myers','Michael Myers','x_myers_0','#bfc5da','Survive the invincible hunter for three minutes after 15:00. Playable Michael is mortal.',{maxHp:145,armor:2,speed:.92,crit:.05});
  secret('tibopoteto','Tibo & Poteto','x_tibopoteto_0','#84ead4','A fictional duo inspired by the community joke: Tibo and Poteto share one playable unit.',{maxHp:110,speed:1.02,crit:.06,area:1.05});
  ETYPES.myers_hunter={name:'Michael Myers',hp:999999,spd:36,dmg:30,r:13,xp:0,t0:1e9,size:58,ai:'chase',heavy:true,invincible:true,puff:'#d4d9e6'};
  EDRAW.myers_hunter=(g,a)=>{g.save();g.scale(1.45,1.45);drawExpansionPerson(g,'myers',0,a.p*TAU);g.restore();};
  for(const [id,base,name,hp,dmg] of [['night_revenant','armor','Night Revenant',180,26],['dread_hound','wolf','Dread Hound',100,22]]){
    ETYPES[id]={...ETYPES[base],name,hp,dmg,t0:900,artBase:base,puff:'#e078ff',cap:3};
    EDRAW[id]=(g,a)=>{EDRAW[base](g,a);g.fillStyle='#e078ff';g.fillRect(-3,-30,6,3);};
  }
  let buffer='';document.addEventListener('keydown',e=>{if(state!=='play'||e.ctrlKey||e.altKey||e.metaKey||e.key.length!==1)return;buffer=(buffer+e.key.toLowerCase()).slice(-10);if(buffer==='tibopoteto')expansionUnlock('tibopoteto');});
}
function expansionUnlock(cls) {
  if(save.classes[cls])return;save.classes[cls]=1;persist();toast(CLASSES[cls].name+' unlocked!',CLS_COL[cls],5);Snd.play('chest');
}
function expansionHuntTick(dt) {
  if(G.t<900)return;
  const x=expansionState();
  if(!x.bite && G.t>=1200){x.bite=true;for(const e of enemies)if(!e.dead&&!e.biteExpansion){e.dmg*=1.5;e.biteExpansion=true;}toast('The shadows bite harder · +50% enemy damage', '#ff6b80',3);}
  if(x.huntComplete)return;
  if(x.huntStarted===undefined){x.huntStarted=G.t;x.huntElapsed=0;announce('THE SHAPE IS WATCHING','Michael Myers is invincible · survive his pursuit for 3 minutes','#d4d9e6','boss');}
  x.huntElapsed=Math.max(0,G.t-x.huntStarted);
  if(x.huntElapsed>=180){x.huntComplete=true;for(const e of enemies)if(e.type==='myers_hunter')e.dead=true;expansionUnlock('myers');toast('The Shape withdraws. You survived.', '#d4d9e6',4);return;}
  if(!enemies.some(e=>!e.dead&&e.type==='myers_hunter'))spawnEnemy('myers_hunter');
}
function expansionHunterMove(e,dt,dying) {
  const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;e.face=dx<0?-1:1;
  if(!dying){e.x+=dx/d*e.spd*dt;e.y+=dy/d*e.spd*dt;if(d<P.r+e.r+3)hurtPlayer(e.dmg,e);}
}
function drawExpansionPerson(g,kind,offset=0,t=0,cos) {
  const set=cos&&ARMOR_BY_ID[cos.armor],col=set?set.cloak:kind==='myers'?'#27374a':kind==='tibo'?'#378e83':'#26242e',trim=set?set.trim:kind==='tibo'?'#82f6dc':'#d9d5e4';
  g.save();g.translate(offset,Math.sin(t)*.8);g.fillStyle=col;g.fillRect(-9,-25,18,29);g.fillRect(-12,-21,4,25);g.fillRect(8,-21,4,25);g.fillStyle='#12131b';g.fillRect(-8,3,6,15);g.fillRect(2,3,6,15);g.fillStyle=kind==='myers'?'#e7e4db':'#ebc5b1';g.beginPath();g.ellipse(0,-34,8,11,0,0,TAU);g.fill();g.fillStyle=kind==='poteto'?'#312734':'#493c38';g.fillRect(-8,-45,16,5);if(kind==='poteto'){g.fillRect(-10,-41,4,21);g.fillRect(7,-41,4,21);}g.fillStyle='#17131d';g.fillRect(-5,-36,3,3);g.fillRect(3,-36,3,3);g.fillStyle=trim;g.fillRect(-5,-21,10,3);if(kind==='myers'){g.save();g.translate(12,-8);g.rotate(-.2);g.fillStyle='#bfc8d3';g.beginPath();g.moveTo(0,0);g.lineTo(4,20);g.lineTo(6,0);g.closePath();g.fill();g.restore();}else{g.strokeStyle=trim;g.lineWidth=2;g.beginPath();g.arc(12,-9,6,0,TAU);g.stroke();}g.restore();
}
function drawExpansionHero(g,o) {
  const cos=o.cos||heroCos(o.cls,raceOf(o.race||save.race)),t=(o.t||0)*(o.moving?9:2);
  if(cos.aura)drawAura(g,cos.aura,o.t||0,false);
  if(o.cls==='myers')drawExpansionPerson(g,'myers',0,t,cos);
  else {g.save();g.scale(.85,.9);drawExpansionPerson(g,'tibo',-11,t,cos);drawExpansionPerson(g,'poteto',11,t+Math.PI,cos);g.strokeStyle='#dc97eb';g.lineWidth=2;g.beginPath();g.moveTo(-9,-9);g.quadraticCurveTo(0,-3,9,-9);g.stroke();g.restore();}
  if(cos.aura)drawAura(g,cos.aura,o.t||0,true);
}
const EXPANSION_SKILLS = {
  rogue: ['Gutter Waltz','Viper Pin','Blackglass Ring','Caltrop Garden','Assassin’s Promise','Midnight Reprise'],
  warlock: ['Hex Lance','Grave Needles','Coven Circle','Rotting Covenant','Soul Mortgage','Black Benediction'],
  summoner: ['Spectral Talon','Soul Flock','Bone Procession','Grave Nursery','Shepherd’s Mercy','Legion Echo'],
  ranger: ['Falcon Strike','Bramble Volley','Hunter’s Perimeter','Thicket Ambush','Trailkeeper','Silver Flight'],
  reaper: ['Pale Severance','Grave Splinters','Widow’s Orbit','Charnel Ground','Borrowed Breath','Last Toll'],
  rift: ['Faultline Cut','Prism Shards','Event Horizon','Folded Space','Rift Shelter','Parallel Strike'],
  mage: ['Astral Spear','Ice Needles','Solar Corona','Runic Weather','Mana Bloom','Prismatic Echo'],
  paragon: ['Eclipse Spear','Eightfold Volley','Twilight Halo','Convergence Field','Dawn’s Mercy','Ascendant Echo'],
  paladin: ['Oathbreaker’s Bane','Judgment Bolts','Sanctuary Ring','Consecrated Ground','Merciful Light','Vow Reprisal'],
  engineer: ['Rail Spike','Shrapnel Fan','Induction Loop','Sawblade Workshop','Field Repair','Clockwork Echo'],
  alchemist: ['Acid Needle','Volatile Salvo','Catalyst Ring','Mercury Pool','Restorative Vapor','Chain Reaction'],
  bard: ['Dissonant Note','Arpeggio','Resonant Chorus','Lullaby Ground','Mending Verse','Final Refrain'],
  bloodknight: ['Arterial Cut','Crimson Shards','Sanguine Halo','Blood Marsh','Red Communion','Pulse Reprise'],
  chrono: ['Second Hand','Minute Shards','Clockface Ring','Stolen Moment','Mended Timeline','Yesterday’s Blade'],
  maestro: ['Signal Spike','Glitch Packets','Bass Orbit','Feedback Floor','Recovery Track','Double Drop'],
  unraveler: ['Needle of Fate','Loose Stitches','Threadbare Halo','Plague Tapestry','Mended Thread','Final Pull'],
  gunslinger: ['Deadeye Slug','Scattershot','Gunsmoke Ring','Powder Trail','Second Wind','Ricochet Reprise'],
  river: ['Rose Thorn','Petal Storm','Blossom Halo','Ember Meadow','Wildflower Heart','Screaming Echo'],
  visage: ['Unseen Cut','Caller’s Knives','Dread Circle','Silent Street','Stolen Nerve','Wrong Number'],
  bearlina: ['Bramble Maul','Honey Thorns','Moonpaw Ring','Rooted Den','Wild Honey','Bear Hug Reprise'],
  myers: ['Kitchen Knife','Silent Sweep','Haddonfield Circle','Cold Footsteps','Second Breath','The Shape Returns'],
  tibopoteto: ['Codex Link','Grok Spark','Two Halves','Common Ground','Together Again','Perfect Pair'],
  druid_caster: ['Sunthorn Lance','Wispseed Volley','Equinox Ring','Moonflower Grove','Springwater','Season’s Echo'],
  druid_cat: ['Moonfang','Razor Paws','Predator’s Circle','Hunting Ground','Nine Lives','Twin Pounce'],
  druid_tree: ['Ironroot Hammer','Bark Shards','Ancient Rings','Root Network','Sapwell','Elder’s Reprisal']
};
function expansionInitSkills() {
  const slow=new Set(['chrono','bard','rift','mage','druid_tree']),bleed=new Set(['rogue','reaper','bloodknight','myers','visage','druid_cat','bearlina']);
  for(const [key,names] of Object.entries(EXPANSION_SKILLS)) {
    const cls=key.startsWith('druid_')?'druid':key;if(!CLASSES[cls])continue;
    const form=key.startsWith('druid_')?key.slice(6):'',color=CLS_COL[cls]||CLASSES[cls].tint||'#b48aff';
    names.forEach((name,i)=>{
      const id='x_'+key+'_'+i,melee=key==='myers'||form==='cat',range=melee?100:320;
      const modes=['strike','fan','ring','field','mend','echo'],mode=modes[i];
      const desc=Array.from({length:6},(_,lv)=>{
        const power=18+lv*7,n=2+Math.floor(lv/2);
        return mode==='strike'?`Strike the nearest foe for ${power*2} damage.`:mode==='fan'?`Hit up to ${n+1} foes in a forward fan for ${power} damage each.`:mode==='ring'?`Burst around you for ${power} damage within ${100+lv*8} range.`:mode==='field'?`Create a ${3+lv*.25}s field for ${8+lv*3} damage per second.`:mode==='mend'?`Heal ${3+lv*2} HP when a foe is nearby, and pulse for ${power} damage.`:`Strike ${n} times for ${power} damage with delayed echoes.`;
      });
      WDEF[id]={name,cls,max:6,ic:['✦','⋙','◉','✥','✚','〰'][i],desc,dir:form==='cat'?'feral':form==='tree'?'guard':form==='caster'?'nature':undefined,cat:form==='cat',tree:form==='tree',caster:form==='caster',expansion:true};
      const config={id,cls,mode,color,range,melee,slow:slow.has(key),bleed:bleed.has(key),form};
      WFIRE[id]=w=>expansionCast(w,config);
    });
  }
}
function expansionCast(w,c) {
  const lv=Math.max(1,Math.min(6,w.lvl)),power=18+(lv-1)*7;
  const radius=(100+(lv-1)*8)*P.area,range=c.range*P.area;
  const hit=(e,n=power)=>{if(!e||e.dead)return;damage(e,n,{src:c.id,col:c.color});if(c.bleed)applyBleed(e,2+lv,2.5,false);if(c.slow){e.slow=Math.max(e.slow||0,.3);e.slowT=Math.max(e.slowT||0,1+lv*.2);}};
  const pulse=(x,y,r)=>effects.push({k:'boom',x,y,r,life:.35,max:.35,col:c.color,src:c.id});
  const targets=nearestN(P.x,P.y,8,range);
  if(c.mode==='strike'){if(!targets.length)return -.1;hit(targets[0],power*2);pulse(targets[0].x,targets[0].y,20+lv*2);return 1.4-lv*.06;}
  if(c.mode==='fan'){if(!targets.length)return -.1;const angle=Math.atan2(targets[0].y-P.y,targets[0].x-P.x);let n=0;for(const e of targets){if(Math.abs(angDiff(Math.atan2(e.y-P.y,e.x-P.x),angle))>.9)continue;hit(e);pulse(e.x,e.y,16);if(++n>=3+Math.floor((lv-1)/2))break;}return 3-lv*.12;}
  if(c.mode==='ring'){query(P.x,P.y,radius+30,e=>{if(Math.hypot(e.x-P.x,e.y-P.y)<=radius+e.r)hit(e);});pulse(P.x,P.y,radius);return 4-lv*.15;}
  if(c.mode==='field'){
    const tg=c.melee?{x:P.x,y:P.y}:targets[0];if(!tg)return -.1;
    effects.push({k:'zone',x:tg.x,y:tg.y,r:radius*.7,life:3+(lv-1)*.25,max:3+(lv-1)*.25,dps:8+(lv-1)*3,tick:0,col:c.color,src:c.id});return 7-lv*.2;
  }
  if(c.mode==='mend'){if(!targets.length)return -.1;heal(3+(lv-1)*2);hit(targets[0]);pulse(P.x,P.y,45);return 10-lv*.4;}
  if(!targets.length)return -.1;
  for(let i=0;i<2+Math.floor((lv-1)/2);i++){const e=targets[i%targets.length];G.later.push({t:i*.18,src:c.id,f:()=>{if(e.dead)return;hit(e);pulse(e.x,e.y,22);}});}return 5-lv*.18;
}

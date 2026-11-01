/* Armory Nightforge and additional achievement goals. */
let forgeQuantity=1;
function forgeDisplay(key,value) { return key==='vitality'?'+'+value.toFixed(2)+' max HP':'+'+(value*100).toFixed(2)+'% '+Nightforge.TRACKS[key].unit; }
function renderNightforge(list) {
  const n=Nightforge.store(save),intro=document.createElement('section');intro.className='stats';
  intro.innerHTML='<h3 style="text-align:center">Nightforge</h3><p>Temper your legacy with surplus ◆ Shards.<br>Repeatable ranks, rising costs and diminishing returns.<br>Bonuses apply to <b>new normal runs</b>; Daily Challenges use their standard setup.</p><p><b>'+Nightforge.total(save).toLocaleString()+'</b> total ranks · <b>'+n.spent.toLocaleString()+' ◆</b> invested</p><label>Ranks per purchase <select id="forgeQuantity"><option value="1">1 rank</option><option value="5">5 ranks</option><option value="10">10 ranks</option></select></label>';
  list.appendChild(intro);$('forgeQuantity').value=String(forgeQuantity);$('forgeQuantity').onchange=e=>{forgeQuantity=+e.target.value;renderShop();};
  for(const [key,t] of Object.entries(Nightforge.TRACKS)) {
    const r=n.ranks[key],price=Nightforge.quote(save,key,forgeQuantity),now=Nightforge.value(key,r),next=Nightforge.value(key,r+forgeQuantity),d=document.createElement('div');d.className='card';
    d.innerHTML='<div class="ic">'+t.icon+'</div><div class="tx"><div class="nm">'+t.name+'</div><div class="sub">Rank '+r.toLocaleString()+'</div><div class="ds">'+forgeDisplay(key,now)+' → <b>'+forgeDisplay(key,next)+'</b><br>Next '+forgeQuantity+' rank'+(forgeQuantity===1?'':'s')+' · diminishing gains<br>Approaches '+forgeDisplay(key,t.limit)+' over time</div></div>';
    const b=document.createElement('button');b.className='buy';b.disabled=price===null||save.shards<price;b.textContent=price===null?'Unavailable':price.toLocaleString()+' ◆';b.setAttribute('aria-label','Buy '+forgeQuantity+' '+t.name+' ranks for '+price+' Shards');
    b.onclick=()=>{const result=Nightforge.buy(save,key,forgeQuantity);if(!result){renderShop();return;}persist();achCheck(false);Snd.play('buy');renderShop();};d.appendChild(b);list.appendChild(d);
  }
  const note=document.createElement('p');note.className='stats';note.textContent='Uses regular Shards. Outfit Shards are kept for Lost Shadow outfits. Purchases are permanent.';list.appendChild(note);
}
function newAchievementReward(a) { return a.rw?rewardName(a.rw):a.shards?'+'+a.shards.toLocaleString()+' ◆ Shards':a.un||'Achievement'; }
function nightforgeRunStats() {
  if(!G||G.ended)return;
  achMax('nf_survival_t',Math.floor(G.t));
}
function nightforgeRecordFinal() {
  achAdd('nf_final',1);
  const d=expansionState().difficulty;
  if(d>=3)achAdd('nf_difficulty3',1);
  if(d>=5)achAdd('nf_difficulty5',1);
}
function nightforgeAura(g,aura,t,front) {
  const c=GEN_BY_ID[aura];if(!c||!c.forgeColor)return false;
  g.save();g.strokeStyle=g.fillStyle=c.forgeColor;g.globalAlpha=.8;g.lineWidth=1.2;
  if(!front){g.beginPath();g.ellipse(0,17,20,6,0,0,TAU);g.stroke();}
  for(let i=0;i<5;i++){const a=t*1.2+i*TAU/5;if((Math.sin(a)>0)!==front)continue;const x=Math.cos(a)*20,y=6+Math.sin(a)*6-Math.sin(t*2+i)*2;g.beginPath();g.moveTo(x,y-3);g.lineTo(x+2,y);g.lineTo(x,y+3);g.lineTo(x-2,y);g.closePath();g.fill();}g.restore();return true;
}
function initNightforge() {
  Nightforge.store(save);
  function cosmetic(id,name,slot,color) { const c={id,name,slot};if(slot==='eye')c.v=color;else c.forgeColor=color;GEN_COS.push(c);GEN_BY_ID[id]=c;return id; }
  function add(a) { if(ACH_BY_ID[a.id])return;ACH.push(a);ACH_BY_ID[a.id]=a; }
  function goal(id,name,desc,k,target,shards,extras={}) { add({id:'nf_'+id,cat:'gen',name,desc,ic:'✦',k,goal:target,shards,...extras}); }
  for(const cls of Object.keys(CLASSES)) {
    const c=CLASSES[cls],color=mixHex(CLS_COL[cls]||c.tint||'#b68aff','#ffffff',.4);
    add({id:'nf_'+cls+'_10k',cat:'class',key:cls,name:c.name+': Shadow Veteran',ic:'☠',desc:'Banish 10,000 foes as '+c.name+' across all runs',goal:10000,k:'c_'+cls+'_k',shards:1000});
    const rw=cosmetic('nf_aura_'+cls,c.name+' Soulfire','aura',color);
    add({id:'nf_'+cls+'_30m',cat:'class',key:cls,name:c.name+': Beyond the Dawn',ic:'⌛',desc:'Survive 30:00 in one run as '+c.name,goal:1800,k:'c_'+cls+'_t',time:1,rw});
  }
  const flare=cosmetic('nf_eye_soulflare','Soulflare Eyes','eye','#ffcd8a');
  const eternal=cosmetic('nf_aura_eternal','Eternal Night Halo','aura','#a8a2ff');
  const lost=cosmetic('nf_eye_lost','Lost Prism Eyes','eye','#e9b0ff');
  const sovereign=cosmetic('nf_aura_sovereign','Sovereign Shards','aura','#ffc67a');
  const forgeEye=cosmetic('nf_eye_forge','Nightforge Ember Eyes','eye','#ff9f68');
  const forgeAura=cosmetic('nf_aura_forge','Nightforge Constellation','aura','#8affdf');
  [50000,100000,250000].forEach((n,i)=>goal('kills'+n,['Shadow Legion','Nightfall Reaper','A Quarter Million Shadows'][i],'Banish '+n.toLocaleString()+' foes in total','g_kills',n,1000*(i+1),i===2?{rw:flare,shards:0}:{}));
  [50,100,250].forEach((n,i)=>goal('boss'+n,['Crown Collector','Thronebreaker','No Kings Remain'][i],'Slay '+n+' bosses in total','g_boss',n,750*(i+1)));
  [100,250].forEach((n,i)=>goal('quests'+n,['Night Road Champion','Every Road Remembered'][i],'Complete '+n+' in-run quests','g_quests',n,1000*(i+1)));
  [1800,2700,3600].forEach((n,i)=>goal('time'+n,['After the Dawn','The Longest Night','One Hour in Shadow'][i],'Survive '+fmtTime(n)+' in a single run','nf_survival_t',n,1000*(i+1),{time:1,f:()=>Math.max(save.best||0,achEff('nf_survival_t')), ...(i===2?{rw:eternal,shards:0}:{})}));
  [1,10,50].forEach((n,i)=>goal('lost'+n,['A Shadow Unmade','Lost and Found','No Shadows Lost'][i],'Defeat '+n+' Lost Shadow'+(n===1?'':'s')+' (progress tracked from this update)','nf_lost',n,500*(i+1),i===2?{rw:lost,shards:0}:{}));
  [1,10,50].forEach((n,i)=>goal('final'+n,['The Sovereign Falls','Crowns to Dust','End of Sovereigns'][i],'Defeat the final boss '+n+' time'+(n===1?'':'s')+' (from this update)','nf_final',n,750*(i+1),i===2?{rw:sovereign,shards:0}:{}));
  goal('difficulty3','Into the Deep','Defeat a final boss on difficulty 3 or higher','nf_difficulty3',1,1500);
  goal('difficulty5','Master of the Dark','Defeat a final boss on difficulty 5','nf_difficulty5',1,3000);
  [1,10].forEach((n,i)=>goal('endless'+n,['One More Night','The Night Never Ends'][i],'Choose Continue Endless '+n+' time'+(n===1?'':'s')+' (from this update)','nf_endless',n,500*(i+1)));
  [1,25,100].forEach((n,i)=>goal('forge'+n,['First Tempering','Emberheart','Forged Among the Stars'][i],'Invest in '+n+' total Nightforge ranks',null,n,0,{f:()=>Nightforge.total(save),...(i===0?{shards:100}:i===1?{rw:forgeEye}:{rw:forgeAura})}));
  [10000,100000,1000000].forEach((n,i)=>goal('spent'+n,['A Fortune in Fire','Fuel for the Night','A Million Shards Forged'][i],'Invest '+n.toLocaleString()+' regular Shards in the Nightforge',null,n,1000*(i+1),{f:()=>Nightforge.store(save).spent}));
  [3,6].forEach((n,i)=>goal('maps'+n,['Far Horizons','Six Dawns'][i],'Survive 15:00 on '+n+' different maps',null,n,1000*(i+1),{f:()=>Object.values(ShadowExpansion.profile(save).clears).filter(Boolean).length}));
  [5,25].forEach((n,i)=>goal('looks'+n,['Shadow Tailor','A Wardrobe of Shadows'][i],'Own '+n+' Lost Shadow outfits',null,n,1000*(i+1),{f:()=>Object.values(ShadowExpansion.profile(save).looks).filter(Boolean).length}));
  [12,23].forEach((n,i)=>goal('classes'+n,['Many Faces of Night','Every Shadow Has a Name'][i],'Start hunts as '+n+' different classes',null,n,1500*(i+1),{f:()=>Object.keys(save.ach.played.cls).filter(c=>CLASSES[c]).length}));
}

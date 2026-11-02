/* Secret origins and a linked-caster identity. Historical class/talent/skill IDs remain stable. */
const Dawn88=(()=>{
 const names=['Codex Link','Grok Spark','Two Halves','Common Ground','Together Again','Perfect Pair',...RebirthRules.names.tibopoteto];
 const modes=['link','chain','orbit','bridge','mend','accord','chain','orbit','link','mend','bridge','mend','orbit','accord','chain','link','bridge','mend','accord'];
 const ids=['x_tibopoteto_0','x_tibopoteto_1','x_tibopoteto_2','x_tibopoteto_3','x_tibopoteto_4','x_tibopoteto_5',...Array.from({length:13},(_,i)=>'v85_tibopoteto_'+i)];
 const descriptions=(mode,l)=>{
  const p=18+(l-1)*7,n=2+Math.floor((l-1)/2),r=100+(l-1)*8;
  return {link:`Tibo and Poteto strike the nearest foe for ${p} damage each. The second hit deals 25% more to a linked foe.`,chain:`Poteto arcs violet energy through up to ${n+1} different foes for ${p} damage each, linking them for 3 seconds.`,orbit:`Twin pulses deal ${p} damage to foes within ${r} range; linked foes take a second half-strength hit.`,bridge:`A teal-violet bridge pierces foes in a 320-range line for ${p*2} damage and links them for 3 seconds.`,mend:`Near a foe, recover ${3+(l-1)*2} HP and discharge ${p} damage. A linked target restores 2 additional HP.`,accord:`Consume up to 6 Resonance, gained by your other duo casts. Strike up to ${n} foes for ${p} damage plus 10% per charge. Linked foes take 25% more.`}[mode];
 };
 function cast(w,index){
  const lv=Math.max(1,Math.min(6,w.lvl)),power=18+(lv-1)*7,mode=modes[index],id=ids[index],r=(100+(lv-1)*8)*P.area;
  const targets=nearestN(P.x,P.y,16,320*P.range);if(!targets.length)return -.1;
  const now=G.t,linked=e=>e.duoLink88>now,fx=G.tf||{},linkedBonus=fx.duoAccord88?.4:.25;
  const pulse=(e,col,rad=22)=>effects.push({k:'boom',x:e.x,y:e.y,r:rad,life:.3,max:.3,col,src:id});
  const hit=(e,n,col)=>{if(e.dead)return;damage(e,n,{src:id,col});pulse(e,col);};
  const mark=e=>e.duoLink88=now+(fx.duoCodex88?5:3);
  let cd=3;
  if(mode==='link'){const e=targets[0],bonus=linked(e)?1+linkedBonus:1;hit(e,power,'#80ead3');hit(e,power*bonus,'#bf8fe9');mark(e);cd=1.65;}
  if(mode==='chain'){targets.slice(0,3+Math.floor((lv-1)/2)).forEach(e=>{hit(e,power,'#bf8fe9');mark(e);});cd=3.5;}
  if(mode==='orbit'){for(const e of targets)if(Math.hypot(e.x-P.x,e.y-P.y)<=r+e.r){const was=linked(e);hit(e,power*(was?1.5:1),'#80ead3');mark(e);}pulse(P,'#bf8fe9',r);cd=4.4;}
  if(mode==='bridge'){const e=targets[0],dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;for(const e of targets){const x=e.x-P.x,y=e.y-P.y,along=x*ux+y*uy;if(along>=0&&along<=320*P.range&&Math.abs(x*uy-y*ux)<24*P.area+e.r){hit(e,power*2,'#80ead3');mark(e);}}effects.push({k:'bolt',x:P.x+ux*320*P.range,y:P.y+uy*320*P.range,x0:P.x,y0:P.y,life:.25,max:.25,seed:0,col:'#bf8fe9',src:id});cd=5.5;}
  if(mode==='mend'){const e=targets[0];heal(3+(lv-1)*2+(linked(e)?2:0));hit(e,power,'#80ead3');mark(e);cd=10-lv*.4;}
  if(mode==='accord'){const charge=Math.min(6,G.duoResonance88||0);G.duoResonance88=0;for(const e of targets.slice(0,2+Math.floor((lv-1)/2)))hit(e,power*(1+.1*charge)*(linked(e)?1+linkedBonus:1),'#d9b4ff');pulse(P,'#80ead3',r);cd=5.5;}
  else G.duoResonance88=Math.min(6,(G.duoResonance88||0)+1);
  return cd*(fx.duoPoteto88?.9:1);
 }
 function talents(){
  const branches=[['Tibo · Codex','✧','#80ead3',['Open Grimoire','Index of Sparks','Teal Script','Patient Study','Margin Notes','Binding Word','Arcane Reach','Bright Ink','Codex Rhythm','Runic Lens','Linked Pages','Spellcraft','Living Current','Ancient Syntax','Keeper of Signals','Unbroken Link'],['dmg','xp','range','area']],['Poteto · Tempest','ϟ','#bd8fea',['Violet Spark','Forked Thought','Wild Current','Stormstep','Charged Focus','Crackling Wit','Unbound Arc','Electric Veil','Storm Rhythm','Spark Prism','Violet Wake','Surging Will','Thunder Heart','Chain Reaction','Last Spark','Tempest Unbound'],['crit','critMul','speed','cd']],['Shared Fate','∞','#d4b67c',['Shared Breath','Common Ground','Guarded Promise','Heartline','Close Company','Signal Shelter','Twin Resolve','Gentle Orbit','Kindred Ward','Paired Hope','Resonant Bond','Steady Hands','Crossed Stars','Twofold Dawn','Never Alone','Perfect Accord'],['maxHp','armor','regen','dr']]];
  const values={dmg:.015,xp:.012,range:.02,area:.018,crit:.006,critMul:.025,speed:.01,cd:.008,maxHp:4,armor:.25,regen:.07,dr:.006};
  TALENTS.tibopoteto.forEach((tr,bi)=>{const [name,ic,col,list,stats]=branches[bi];Object.assign(tr,{name,ic,col});tr.nodes.forEach((n,i)=>{const k=stats[i%4];Object.assign(n,{n:list[i],name:list[i],ic,e:{[k]:values[k]},duo88:true});if(n.cap){n.e={};n.f=['duoCodex88','duoPoteto88','duoAccord88'][bi];n.d=['Links last 5 seconds instead of 3.','Duo skills recharge 10% faster.','Linked targets take 40% bonus damage from paired finishers instead of 25%.'][bi];}});});
 }
 // Only newly started, normal hunts can satisfy these single-run challenges.
 // Merely opening menus or loading historical profile records never grants them.
 function trialReady90(which){
  if(!G||G.ended||G.secretTrial90!==true||G.daily||G.challengeDate)return false;
  if(which==='goose')return G.t>=600&&G.kills>=1000&&!G.revived&&!G.raceReviveUsed&&!G.undyingUsed;
  if(which==='duo')return G.duoEscort91?.phase==='reunited';
  return false;
 }
 function recordSecretTrials90(){
  for(const [trial,key]of [['goose','g_goose_trial90'],['duo','g_duo_trial90']])if(trialReady90(trial)){G.achRun=G.achRun||{};G.achRun[key]=1;}
 }
 function init(){
  const secret=[{id:'secret_undying88',cat:'gen',name:'The Hundredth Ending',ic:'☠',desc:'Die in 100 hunts. The grave finally opens a different door.',k:'g_deaths88',goal:100,un:'Undead race',secret:true},{id:'secret_goose88',cat:'gen',name:'Peace Was Never an Option',ic:'♧',desc:'Answer the hidden call during a hunt.',k:'g_honk88',goal:1,un:'Goose race',secret:true}];
  secret.push(
   {id:'secret_goose_trial90',cat:'gen',name:'Untamed Migration',ic:'♧',desc:'In a normal hunt started after v90, survive 10 minutes and banish 1,000 foes before using any revival.',goal:1,k:'g_goose_trial90',f:()=>Math.max(achEff('g_goose_trial90'),trialReady90('goose')?1:0),un:'Goose race',secret:true},
   {id:'secret_duo_trial90',cat:'gen',name:'Together Again',ic:'∞',desc:'Find a lost companion after 10 minutes in a normal hunt, walk with them for 60 seconds in any direction, then reunite them with their partner.',goal:1,k:'g_duo_trial90',f:()=>Math.max(achEff('g_duo_trial90'),trialReady90('duo')?1:0),un:'Tibo & Poteto class',unlockClass:'tibopoteto',secret:true}
  );
  for(const a of secret){ACH.push(a);ACH_BY_ID[a.id]=a;}
  let code='';window.addEventListener('keydown',e=>{if(state!=='play'||e.ctrlKey||e.altKey||e.metaKey||e.target?.matches?.('input,textarea,[contenteditable]')||e.key.length!==1)return;code=(code+e.key.toLowerCase()).slice(-4);if(code==='honk'&&!raceAvailable88('goose')){save.ach.p.g_honk88=1;achCheck();persist();toast('HONK! Goose origin unlocked.','#f2d49c',4);code='';}});
  talents();Object.assign(CLASSES.tibopoteto,{role:'Linked Casters · Resonance',desc:'Tibo writes teal links into the horde. Poteto threads violet lightning through them. Their shared Resonance powers paired finishers.',passive:'Shared Resonance',pdesc:'Duo skills build up to 6 Resonance. Accord finishers spend it for up to 60% more damage. Links empower paired attacks.',chips:['Tibo · Codex','Poteto · Storm','Shared Resonance'],wname:'Codex Link'});
  ids.forEach((id,i)=>{Object.assign(WDEF[id],{name:names[i],duo88:i,desc:Array.from({length:6},(_,j)=>descriptions(modes[i],j+1))});WFIRE[id]=w=>cast(w,i);});
  if(typeof DAWN89_ART!=='undefined'){
   Object.assign(ART_V87.atlases,{duo88:DAWN89_ART.cards});
   Object.assign(ACTOR_ANIMATION_MANIFEST.variants,DAWN89_ART.actors);
   for(const race of ['undead','goose']){
    ACTOR_ANIMATION_MANIFEST.variants['bearlina/'+race+'/bear-form']=DAWN89_ART.actors['bearlina/'+race+'/male'];
    for(const sex of ['male','female'])for(const form of ['cat','tree'])ACTOR_ANIMATION_MANIFEST.forms[['druid',race,sex,form].join('/')]=ACTOR_ANIMATION_MANIFEST.forms[['druid',race==='undead'?'shade':'cat',sex,form].join('/')];
   }
  }
 }
 return {init,cast,ids,descriptions,trialReady90,recordSecretTrials90};
})();

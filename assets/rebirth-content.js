function initRebirthContent(){
 // Rename visible content while keeping the historical ID so every old unlock,
 // outfit, XP balance, talent allocation and saved hunter remains compatible.
 Object.assign(CLASSES.myers,{name:'Graveshade',role:'Melee · Gravekeeper',flavor:'There is no road the grave cannot follow.',desc:'An oathbound crypt sentinel in blackened funerary armour. Graveshade closes in with patient steps, then reaps the horde with a spectral grave-sickle. His bronze lantern burns for the unburied.',passive:'Unburied Resolve',pdesc:'145 base vitality and 2 armour withstand close combat. A deliberate stride is 8% slower; the playable gravekeeper takes damage normally.',chips:['Grave-sickle','Heavy armour','Patient pursuit']});
 ETYPES.myers_hunter.name='The Lanternless Pursuer';
 const rename=['Grave-sickle','Pallbearer’s Sweep','Sepulchre Ring','Funeral March','Unburied Resolve','Last Lantern'];
 rename.forEach((name,i)=>WDEF['x_myers_'+i].name=name);
 const forms=['caster','cat','tree'];
 for(const cls of Object.keys(CLASSES))for(const form of cls==='druid'?forms:['caster']){
  const key=cls==='druid'?'druid_'+form:cls,pool=RebirthRules.eligible(WDEF,cls,form,catBan),need=RebirthRules.SKILLS_PER_STYLE-pool.length,list=RebirthRules.names[key]||[];
  if(need<0||list.length<need)throw Error('Unbalanced skill roster: '+key+' '+pool.length);
  for(let i=0;i<need;i++){
   const id='v85_'+key+'_'+i,mode=['strike','fan','ring','field','mend','echo'][i%6],color=CLS_COL[cls]||'#a7d4bf',isCat=cls==='druid'&&form==='cat',isTree=cls==='druid'&&form==='tree',melee=isCat||['myers','rogue','reaper','bloodknight','bearlina'].includes(cls);
   const desc=Array.from({length:6},(_,lv)=>{const p=18+lv*7;return mode==='strike'?'Strike nearby prey for '+p*2+' damage.':mode==='fan'?'Strike up to '+(3+Math.floor(lv/2))+' foes for '+p+' damage.':mode==='ring'?'A '+(100+lv*8)+'-range burst deals '+p+' damage.':mode==='field'?'Leave a '+(3+lv*.25)+'s field dealing '+(8+lv*3)+' damage per second.':mode==='mend'?'Recover '+(3+lv*2)+' HP near a foe and strike for '+p+' damage.':'Release '+(2+Math.floor(lv/2))+' delayed strikes for '+p+' damage each.';});
   WDEF[id]={name:list[i],cls,max:6,ic:['✦','⋙','◉','✥','✚','〰'][i%6],desc,balanced85:true,cat:isCat,tree:isTree,caster:cls==='druid'&&form==='caster',dir:cls==='druid'?(isCat?'feral':isTree?'guard':'nature'):undefined};
   const config={id,cls,mode,color,range:melee?110:320,melee,slow:['chrono','bard','rift','mage'].includes(cls)||isTree,bleed:['rogue','reaper','myers','bloodknight','bearlina'].includes(cls)||isCat,form:cls==='druid'?form:''};
   WFIRE[id]=w=>expansionCast(w,config);
  }
 }
 // Existing node IDs/rank limits and prerequisite layout are retained.
 const themes=[
  ['Unbroken Pursuit','⌁','#8ab9b0',['Patient Steps','Dreadwake','Hollow Trail','Relentless Gait','Cryptstride','Unfaltering','Echo of Footfalls','Long Road','Graveward March','Nightwatch','Hunt Without End','Iron Patience','Lanternless Path','Last Pursuit','Oath of the Road','No Grave Unreached'],['speed','dodge','maxHp','pickup']],
  ['Dusk Reaping','☾','#c0a978',['Sickle Edge','Burial Rite','Pale Crescent','Graveglass','Reaper’s Reach','Bronze Verdict','Antlered Crown','Last Harvest','Ossuary Echo','Dread Requiem','Pallbearer','Final Toll','Spectral Steel','Hollow Moon','Sepulchral Oath','Crescent Ascendant'],['dmg','crit','area','critMul']],
  ['Lantern Oath','✧','#bb8d64',['Funeral Lantern','Unburied Flesh','Bronze Ward','Kindled Resolve','Crypt Armour','Pale Ember','Hearth of Bones','Keeper’s Mercy','Warded Flame','Soul Vessel','Ashen Mantle','Unbroken Plate','Restless Light','Gravefire','Last Vigil','The Lantern Endures'],['maxHp','armor','regen','dr']]
 ];
 TALENTS.myers.forEach((tr,bi)=>{const [name,ic,col,names,stats]=themes[bi];tr.name=name;tr.ic=ic;tr.col=col;tr.nodes.forEach((n,i)=>{n.n=n.name=names[i];n.ic=ic;const stat=stats[i%stats.length],value={speed:.012,dodge:.006,maxHp:4,pickup:.025,dmg:.02,crit:.008,area:.025,critMul:.025,armor:.3,regen:.06,dr:.008}[stat];n.e={[stat]:value*(n.cap?3:1)};});});
 RebirthArt.registerActors();
}

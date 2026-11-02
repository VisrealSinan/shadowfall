/* Data-only v85 rules; internal class/skill IDs stay stable for saved games. */
const RebirthRules=(()=>{
 const SKILLS_PER_STYLE=19;
 function eligible(defs,cls,form='caster',catBan=()=>false){return Object.keys(defs).filter(id=>{const d=defs[id];return d.cls===cls&&!d.form&&(!d.cat||form==='cat')&&(!d.tree||form==='tree')&&(!d.caster||form==='caster')&&(cls!=='druid'||form!=='cat'||!catBan(id));});}
 function army(desired,cap){
  const priority=['colossus','brute','archer','imp','hound','shade'],p=Object.fromEntries(priority.map(k=>[k,0]));let room=Math.max(0,Math.floor(cap));
  const take=k=>{if(room&&p[k]<(desired[k]||0)){p[k]++;room--;return true;}return false;};
  priority.forEach(take);take('colossus');take('brute');
  while(room){let used=false;for(const k of ['shade','archer','hound','imp','brute','colossus'])used=take(k)||used;if(!used)break;}
  return {shade:p.shade,archer:p.archer,brute:p.brute,hound:p.hound,imp:p.imp,colossus:p.colossus};
 }
 const names={
 rogue:['Widowstep','Obsidian Shiv','Rooftop Requiem','Venom Lantern','Night Contract'],
 warlock:['Cinder Hex','Withered Crown','Grave Chorus','Pact of Thorns','Soulglass'],
 summoner:['Wisp Shepherd','Ossuary Choir','Gravewarden Seal','Spirit Relay'],
 ranger:['Moonfeather','Blackthorn Trail','Kestrel Oath','Quiver of Dawn','Briar Watch'],
 reaper:['Mourning Bell','Ashen Crescent','Pale Orchard','Soul Ferry','Tollkeeper'],
 rift:['Glasswake','Splinter Gate','Fracture Choir','Void Compass','Broken Horizon'],
 paladin:['Dawnward','Votive Hammer','Oathfire','Last Sanctuary'],
 engineer:['Copper Swarm','Kinetic Anchor','Magnetic Wake','Pressure Valve'],
 alchemist:['Quicksilver Thorn','Vitreous Bloom','Distiller’s Mercy','Noxious Halo'],
 bard:['Hollow Chord','Silver Cadence','Dirge of Embers','Wandering Chorus'],
 bloodknight:['Veinbreaker','Crimson Vow','Bloodglass','Sanguine Requiem'],
 chrono:['Clockwork Thorn','Dawn Repeated','Borrowed Hour','Timeless Orbit'],
 maestro:['Phase Packet','Counterbeat','Copper Chorus','Signal Bloom'],
 unraveler:['Last Stitch','Woundweaver','Hollow Pattern','Thread of Dawn'],
 gunslinger:['Brass Verdict','Gravepowder','Iron Mercy','Aftershot','Ashen Chamber'],
 river:['Roseglass','Wildfire Petal','Thornwake','Moonlit Canopy','Flowering Wrath'],
 visage:['Hushed Verdict','Doorway Shadow','Whispered Threat','Final Footfall','Midnight Witness'],
 bearlina:['Ancient Paw','Briar Breakfast','Hearthguard','Honeywake','Woodland Oath'],
 paragon:['Crown of Convergence'],
 myers:['Crypt Hook','Lantern Shards','Burial Ground','Pallbearer’s Oath','Gravekeeper’s Wake','Bronze Eclipse','Sickle Reprise','Dread Harvest','Antlered Verdict','Silent Procession','Sepulchral Ward','Hollow Beacon','Last Procession'],
 tibopoteto:['Twin Current','Shared Orbit','Concord Lance','Linked Fate','Resonant Bridge','Paired Promise','Signal Shelter','Twofold Dawn','Affinity Pulse','Crossed Stars','Common Cause','Heartline','Perfect Accord'],
 druid_caster:['Solstice Bloom','Thorned Comet','Verdant Covenant'],
 druid_cat:['Bramble Fang','Lunar Rake','Prowler’s Wake','Moonlit Ambush','Wild Instinct','Elder Claw'],
 druid_tree:[]
 };
 function motion(kind,action,p,seed=0){
  const cycle=Math.sin(p*Math.PI*2),wave=Math.sin(p*Math.PI),heavy=kind==='tree'||kind==='colossus',cat=kind==='cat'||kind==='hound',tempo=.85+(seed%11)*.025;
  const o={x:0,y:0,sx:1,sy:1,angle:0,stride:0,glow:0};
  if(action==='idle'){o.sy+=cycle*(heavy?.009:.018);o.sx-=cycle*.004;}
  if(action==='run'){o.y=-Math.abs(cycle)*(heavy?1.5:cat?4:2.7);o.angle=cycle*(heavy?.012:cat?.035:.04);o.stride=cycle*(cat?5:3)*tempo;o.sy+=cycle*.012;}
  if(action==='attack'){o.x=wave*(heavy?3:cat?8:5);o.angle=wave*(cat?.12:.085);o.sy-=wave*.035;o.glow=wave;}
  if(action==='casting'){o.y=-wave*(heavy?2:5);o.sx+=wave*.035;o.sy+=wave*.025;o.angle=Math.sin(p*Math.PI*2)*.025;o.glow=wave;}
  if(action==='dodge'){o.x=wave*(cat?12:8);o.angle=-wave*.14;o.sx+=wave*.12;o.sy-=wave*(heavy?.12:.22);o.stride=cycle*3;}
  return o;
 }
 return {SKILLS_PER_STYLE,eligible,army,names,motion};
})();
if(typeof module!=='undefined')module.exports=RebirthRules;

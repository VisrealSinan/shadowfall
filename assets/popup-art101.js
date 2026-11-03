/* Shared painted identities for transient UI as well as permanent menus. */
const PopupArt101=(()=>{
 const images=new Map();
 const quests={slay:['w','knives'],elite:['p','slayer'],zone:['p','shield'],relics:['shard','shard'],untouched:['p','armor'],escort:['w','familiars'],totems:['w','blightbolt'],skirmish:['p','might'],soulharvest:['p','wisdom'],trailblazer:['p','haste'],watch:['p','revive'],beacons:['w','lantern'],ritual:['p','wisdom'],courier:['prop',20],ward:['p','shield'],chain:['p','haste'],twinhunt:['p','slayer']};
 const events={meteor:['w','meteor'],thief:['p','greed'],hunt:['p','slayer'],fog:['w','familiars'],swarm:['w','hounds'],altar:['prop',39]};
 const landmarks={stones:['prop',23],elder:['w','treeform'],camp:['prop',18],crypt:['prop',1],forge:['prop',43],throne:['prop',50],gibbet:['prop',49]};
 const offers={heal:['heal','heal'],lvl:['p','wisdom'],lvl2:['p','wisdom'],reroll:['p','luck'],magnet:['p','magnet'],edge:['p','might'],haste:['p','haste'],hide:['p','armor'],bet:['p','luck'],bet2:['p','luck'],evo:['p','wisdom'],horde:['w','meteor'],glimjar:['heal','heal'],shrinechest:['prop',20],nightcap:['heal','heal'],minibar:['prop',28],cocoa:['heal','heal'],giftbox:['prop',30],cider:['heal','heal'],treatbag:['prop',30],coolant:['prop',37],memshard:['shard','shard'],stew:['heal','heal'],crate:['prop',5],broth:['heal','heal'],ped:['prop',39],ward:['p','revive'],b_blood:['p','might'],b_greed:['p','greed'],b_wis:['p','wisdom'],b_swift:['p','haste'],b_renew:['p','renewal'],b_ward:['p','armor'],b_magnet:['p','magnet'],b_fury:['p','haste'],b_gamble:['p','luck']};
 function html(ref,cls='popup-image101'){
  if(!ref)return '';
  if(ref[0]==='prop')return '<img class="'+cls+'" src="assets/prop99-'+ref[1]+'.png" alt="" aria-hidden="true">';
  return SkillArt.html(ref[0],ref[1],cls);
 }
 function quest(q){return html(q.k==='sig'?['w',CLASSES[G.cls].weapon]:quests[q.k]);}
 function event(k){return html(events[k]);}
 function landmark(k){return html(landmarks[k]);}
 function offer(o){return html(o.a&&['lvl','lvl2','evo'].includes(o.k)?[o.k==='evo'?'e':o.a.k,o.k==='evo'?o.a:o.a.id]:offers[o.k]);}
 function achievement(a){
  const cls=(a.cat==='class'&&a.key)||a.cls||(a.rw&&ARMOR_BY_ID[a.rw]?.cls);
  const race={cat:'haste',elf:'wisdom',ogre:'might',dwarf:'armor',troll:'renewal',kitsune:'luck',scale:'shield',shade:'lifesteal'}[a.cat==='race'&&a.key];
  return html(cls&&CLASSES[cls]?['w',CLASSES[cls].weapon]:race?['p',race]:a.creep?['w','reap']:a.shards?['shard','shard']:['p','wisdom']);
 }
 function draw(g,ref,x,y,size){
  if(!ref)return false;
  if(ref[0]!=='prop')return SkillArt.draw(g,{k:ref[0],id:ref[1]},x,y,size);
  const src='assets/prop99-'+ref[1]+'.png';let im=images.get(src);if(!im){im=new Image();images.set(src,im);im.src=src;}
  if(!im.complete||!im.naturalWidth)return false;
  const k=size/Math.max(im.width,im.height);g.drawImage(im,x+(size-im.width*k)/2,y+(size-im.height*k)/2,im.width*k,im.height*k);return true;
 }
 return {html,quest,event,landmark,offer,achievement,draw,quests,events,landmarks,offers};
})();

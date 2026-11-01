const test=require('node:test'),assert=require('node:assert/strict');
const O=require('../assets/actor-outfits.js');
test('outfit palettes change fabric while preserving transparency and warm skin',()=>{
 const data=new Uint8ClampedArray([110,28,180,255,235,187,155,255,100,50,20,0]);
 const old=Array.from(data);O.recolor(data,3,1,{hue:.76,hasColor:true},{cloak:'#176f64',cloak2:'#062622',trim:'#a8e8d3'});
 assert.notDeepEqual(Array.from(data.slice(0,3)),old.slice(0,3));assert.deepEqual(Array.from(data.slice(4,8)),old.slice(4,8));assert.deepEqual(Array.from(data.slice(8)),old.slice(8));assert.equal(data[3],255);
});
test('all sheet-backed armor sets retain modern race/body/action variants',()=>{
 const {run}=require('../tools/smoke-game.cjs');
 const result=JSON.parse(run(`(()=>{startRun("rogue");let outfits=0,actions=0;for(const [key,v] of Object.entries(ACTOR_ANIMATION_MANIFEST.variants)){const [cls,race,gender]=key.split('/');for(const armor of ARMOR_SETS[cls]){const o={cls,race,gender,cos:{armor:armor.id},t:.3};if(ActorAnimations.variant(o)!==v)throw Error('legacy fallback '+key+' '+armor.id);const a=ActorAnimations.frame(o,v);const b=ActorAnimations.frame({...o,cos:{armor:''}},v);if(a.row!==b.row||a.column!==b.column)throw Error('frame drift');outfits++;for(const action of Object.keys(v.animations)){G.actorCue={action,at:gtime};const f=ActorAnimations.frame({...o,world:true},v);if(f.action!==action)throw Error('wrong action '+action);if(!Number.isFinite(f.row)||!Number.isFinite(f.column))throw Error(action);actions++;}}}return JSON.stringify({outfits,actions});})()`));
 assert.ok(result.outfits>3000);assert.ok(result.actions>10000);
});
test('loading and loaded outfits both avoid the old renderer, and wardrobe refreshes on load',()=>{
 const fs=require('fs'),vm=require('vm'),drawn=[];let im,refreshes=0;
 const v={src:'modern.png',cell_width:256,cell_height:256,anchor:[128,232],animations:{idle:{row:0,frames:6,frame_duration_ms:100,loop:true}}};
 const c={ACTOR_ANIMATION_MANIFEST:{variants:{'warlock/elf/male':v}},save:{race:'elf'},heroCos:()=>({armor:'new'}),raceOf:x=>x,ARMOR_BY_ID:{new:{id:'new'}},ActorOutfits:{frame:()=>({modernOutfit:true})},Image:class{constructor(){im=this;this.complete=false;this.naturalWidth=0;}},state:'ward',renderWard:()=>refreshes++};
 vm.createContext(c);vm.runInContext(fs.readFileSync('assets/actor-animations.js','utf8')+'\nthis.actor=ActorAnimations;',c);
 const g={save(){},restore(){},fillText(){},drawImage(x){drawn.push(x);}};
 assert.equal(c.actor.draw(g,{cls:'warlock',race:'elf',gender:'male',t:0}),true);assert.equal(drawn.length,0);
 im.complete=true;im.naturalWidth=1536;im.onload();assert.equal(refreshes,1);
 assert.equal(c.actor.draw(g,{cls:'warlock',race:'elf',gender:'male',t:0}),true);assert.equal(drawn[0].modernOutfit,true);
});

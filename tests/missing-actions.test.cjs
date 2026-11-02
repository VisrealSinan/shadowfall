const test=require('node:test'),assert=require('node:assert/strict');
const {run}=require('../tools/smoke-game.cjs');
test('every playable variant and form has all eight animation actions',()=>{
 assert.equal(run(`(()=>{for(const v of [...Object.values(ACTOR_ANIMATION_MANIFEST.variants),...Object.values(ACTOR_ANIMATION_MANIFEST.forms)])for(const action of ['idle','run','attack','casting','dodge','hurt','death','ultimate'])if(!v.animations[action])throw Error(v.src+' '+action);return true;})()`),true);
});
test('supplemented actions draw their own sheet and retain the original idle source',()=>{
 assert.equal(run(`(()=>{
  startRun('ranger');const v=ActorAnimations.variant({cls:'ranger',race:'elf',gender:'female'}),original=v.src;
  const previous=Image;Image=class {constructor(){this.complete=true;this.naturalWidth=2048;}};
  try{
   for(const action of ['hurt','death','ultimate','idle']){
    let source;const g=new Proxy({drawImage(im){source=im.src;}},{get:(o,k)=>k in o?o[k]:()=>{}});
    ActorAnimations.draw(g,{cls:'ranger',race:'elf',gender:'female',action,actionTime:.2,cos:{},t:0});
    if(source!==(action==='idle'?original:v.animations[action].sheet.src))throw Error(action+' wrong sheet '+source);
   }
   if(v.src!==original)throw Error('original replaced');return true;
  }finally{Image=previous;}
 })()`),true);
});
test('legacy characters play their death sheet through the gameplay death renderer',()=>{
 assert.equal(run(`(()=>{startRun('ranger');G.dyingT=.7;return MotionCompletion.playerDeath();})()`),true);
});

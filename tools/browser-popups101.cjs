const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const deps=path.resolve(path.dirname(process.execPath),'../node_modules');
let pw;try{pw=require('playwright');}catch{pw=require(path.join(deps,'playwright'));}
(async()=>{
 const browser=await pw.chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],bad=[],shots=[],checks=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push([r.status(),r.url()]);});
  await page.goto('http://127.0.0.1:4173/?debug=1');await page.waitForFunction(()=>window.VS);
  await page.evaluate(()=>{startRun('engineer');G.pending=0;state='paused';P.hp=P.maxHp=1e7;});
  async function shot(name){await page.waitForTimeout(180);await page.screenshot({path:'artifacts/popup101-'+name+'.png',fullPage:true});shots.push(name);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name+' overflows');}
  async function icons(selector){const count=await page.locator(selector+' .popup-image101,'+selector+' .inline-image101').count();assert.ok(count,selector+' missing painted art');await page.evaluate(async selector=>{for(const el of document.querySelectorAll(selector+' .popup-image101,'+selector+' .inline-image101')){const src=el.tagName==='IMG'?el.src:/url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage)?.[1];if(!src)throw Error('No painted source: '+el.outerHTML);const im=new Image();im.src=src;await im.decode();const r=el.getBoundingClientRect();if(!r.width||!r.height)throw Error('Empty art cell: '+el.outerHTML);}},selector);return count;}
  const coverage=await page.evaluate(async()=>{
   const refs=[...Object.values(PopupArt101.quests),...Object.values(PopupArt101.events),...Object.values(PopupArt101.landmarks),...Object.values(PopupArt101.offers)];
   for(const ref of refs){const src=ref[0]==='prop'?'assets/prop99-'+ref[1]+'.png':SkillArt.info(ref[0],ref[1]).atlas.src;const im=new Image();im.src=src;await im.decode();}
   const missing=Object.keys(QDEF).filter(k=>k!=='sig'&&!PopupArt101.quests[k]).concat(Object.keys(NOFF).filter(k=>!PopupArt101.offers[k]),Object.keys(EVD28).filter(k=>!PopupArt101.events[k]),Object.keys(LMD28).filter(k=>!PopupArt101.landmarks[k]));
   return {quests:Object.keys(QDEF).length,events:Object.keys(EVD28).length,landmarks:Object.keys(LMD28).length,offers:Object.keys(NOFF).length,achievements:ACH.length,missing};
  });assert.deepEqual(coverage.missing,[]);
  // Every offer, including all nine free shrine blessings and themed town goods.
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===390?844:1000});
   for(const type of ['merchant','gambler','smith','stranger','shrine']){
    await page.evaluate(type=>{state='npc';show('npc');npcCur={nt:type,T:55,visits:1,say:NPCS[type].hi[0],fixed:type==='shrine',offers:Object.keys(NOFF).filter(k=>type==='shrine'?k.startsWith('b_'):!k.startsWith('b_')).map(k=>({k,p:5,left:1,...(['lvl','lvl2'].includes(k)?{a:{k:'w',id:CLASSES[G.cls].weapon}}:k==='evo'?{a:CLASSES[G.cls].weapon}:{})}))};G.gold=999;renderNpc();},type);
    checks.push({width,type,icons:await icons('#npc')});await shot(type+'-'+width);
   }
   // Actual quest progress handler produces start, failure, and gear reward banners.
   await page.evaluate(()=>{npcCur=null;state='play';show(null);qBanClear();_achQ.length=0;clearTimeout(_achT);$('achBanner').classList.remove('on');G.quests=[];questStart('courier');});
   await icons('#qBan');await shot('quest-start-'+width);
   await page.evaluate(()=>{qBanClear();const q=G.quests[0];questFail(q,0,'Time ran out');});await icons('#qBan');await shot('quest-fail-'+width);
   await page.evaluate(()=>{qBanClear();questStart('skirmish');qBanClear();questDone(G.quests[0],0);});await shot('quest-reward-'+width);
   await page.evaluate(()=>{qBanClear();w28EvStart('meteor');G.banner.age=1;G.banner.life=G.banner.max-1;toasts=[];render(.016);});await shot('event-start-'+width);
   await page.evaluate(()=>{qBanClear();w28EvEnd(true);});await icons('#qBan');await shot('event-reward-'+width);
   await page.evaluate(()=>{qBanClear();w28EvStart('altar');w28EvEnd(false,'Time ran out');});await icons('#qBan');await shot('event-fail-'+width);
   await page.evaluate(()=>{qBanClear();clearTimeout(_achT);_achQ.length=0;_achBusy=false;state='play';_achQ.push(ACH.find(a=>a.cat==='class'));_achNext();});await icons('#achBanner');await shot('achievement-'+width);
   await page.evaluate(()=>{clearTimeout(_achT);$('achBanner').classList.remove('on');G.banner=null;state='levelup';show('levelup');G.luChoices=[{k:'w',id:'rivetgun'},{k:'heal'},{k:'shard'}];buildChoices();});await shot('levelup-'+width);
   await page.evaluate(()=>{tcFly($('choices').firstElementChild);});assert.equal(await page.locator('#tcFx .back').evaluate(el=>getComputedStyle(el).display),'none');await page.waitForTimeout(650);
   await page.evaluate(()=>{goCodex('engineer','pause');});await icons('#cdxList');await shot('codex-'+width);
   await page.evaluate(()=>{state='paused';show('pause');renderBuild();});await icons('#loadoutP');await shot('pause-'+width);
   await page.evaluate(()=>{openGear('boss',genGear('boss',{r:4}));});await shot('gear-'+width);
   await page.evaluate(()=>{askConfirm('Exit this run?','Your earned rewards will be banked.','Exit',()=>{},'Keep playing');});await shot('confirm-'+width);await page.evaluate(()=>cfmClose(false));
  }
  // Exercise all result banners, not just the screenshot samples.
  await page.evaluate(()=>{state='play';show(null);G.banner=null;clearTimeout(_achT);$('achBanner').classList.remove('on');});
  const resultCoverage=await page.evaluate(()=>{
   let landmarks=0,events=0,quests=0;
   for(const k of Object.keys(LMD28)){qBanClear();w28Claim({k,key:1e8+landmarks,x:P.x,y:P.y,h:1});if(!$('qBan').innerHTML.includes('popup-image101'))throw Error('Landmark '+k);landmarks++;}
   for(const k of Object.keys(EVD28))for(const ok of [true,false]){qBanClear();w28EvStart(k);w28EvEnd(ok);if(!$('qBan').innerHTML.includes('popup-image101'))throw Error('Event '+k);events++;}
   for(const k of Object.keys(QDEF)){qBanClear();G.quests=[];questStart(k);if(!$('qBan').innerHTML.includes('popup-image101'))throw Error('Quest '+k);quests++;}
   return {landmarks,events,quests};
  });
  await page.evaluate(()=>{state='ach';show('ach');achTab='class';renderAch();});await icons('#achList');await shot('hall');
  await page.evaluate(()=>{goShop();shopTab='up';mtPick=MTREE[0].nodes[0].id;renderShop();});await shot('armory-detail');
  assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
  const report={coverage,resultCoverage,checks,screenshots:shots,errors,bad};fs.writeFileSync('artifacts/popup101-browser-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

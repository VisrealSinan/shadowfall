function drawEndingHero85(){
 if(!G||state!=='over'||!$('over').classList.contains('on'))return;const cv=$('overHero'),w=cv.clientWidth||240,h=cv.clientHeight||300,d=Math.min(2,window.devicePixelRatio||1);
 if(cv.width!==w*d||cv.height!==h*d){cv.width=w*d;cv.height=h*d;}const g=cv.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);g.translate(w/2,h*.79);const k=Math.min(w/100,h/108);g.scale(k,k);drawHero(g,{cls:G.cls,race:G.race,form:G.form,outfit:G.outfit||save.outfit,gear:G.gear,gearOver:save.gearOver,t:gtime,atk:0});
}
function refreshEndingArt85(){drawEndingHero85();}
function renderEndingSummary85(){
 $('endingRace').textContent=RACES[raceOf(G.race)].name;$('endingClass').textContent=CLASSES[G.cls].name;$('endingMap').textContent=MAPNAME36[G.map];
 $('endingMode').textContent=G.challengeDate?'Daily Challenge · '+G.challengeDate:'Difficulty '+((G.expansion&&G.expansion.difficulty)||1)+(G.expansion&&G.expansion.endless?' · Endless':'');
 $('endingKills').textContent=G.kills.toLocaleString('en-US');$('endingLevel').textContent=G.level;
 $('endingSubtitle').textContent=G.expansion&&G.expansion.finalDefeated?'The sovereign has fallen. Your harvest is secured.':'The night remembers your fight. Your earned progress is secured.';
 drawEndingHero85();
}
function graveshadeTalentIcon85(n){
 const col=['#8ab9b0','#c0a978','#bb8d64'][n.bi],id='g85_'+n.id,marks=Array.from({length:5},(_,i)=>{const a=(i*72+(n.slot||0)*9)*Math.PI/180;return '<path d="M'+(40+Math.cos(a)*31).toFixed(1)+' '+(40+Math.sin(a)*31).toFixed(1)+'l2 -2"/>';}).join('');
 const shapes=[
  '<path d="M24 22l-8-9m10 17L13 25m43-3l8-9M54 30l13-5M26 25l14 7 14-7-4 30-10 10-10-10z"/><path d="M34 39l5 4-6 2m13-6l-5 4 6 2M40 34v23"/>',
  '<path d="M25 61l28-42M51 19c23 7 16 30-2 33 9-11 9-20-1-26M22 58l7 5"/><path d="M18 18c-9 20 1 38 20 43"/>',
  '<path d="M30 25l3-9h14l3 9M26 30h28l-4 28H30zM25 25h30M28 63h24M40 16v-5"/><path d="M40 34c-13 15-3 23 0 17 5 7 13-5 0-17z"/>'
 ];
 return '<svg class="tim graveshade-sigil" viewBox="0 0 80 80" aria-hidden="true"><defs><radialGradient id="'+id+'"><stop stop-color="#304d46"/><stop offset="1" stop-color="#101a1c"/></radialGradient></defs><rect x="1" y="1" width="78" height="78" rx="9" fill="url(#'+id+')"/><g fill="none" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="34" opacity=".35"/>'+marks+shapes[n.bi]+'</g></svg>';
}
function rebirthTalentScene85(){
 const el=$('talents');el.dataset.rebirthClass=talCls;const art=RebirthArt.actorPortrait(talCls,raceOf(save.race));
 el.style.setProperty('--tal-modern-hero',art?'url("'+art+'")':'none');
 const map=RebirthArt.vista(selMap36(),800,360);el.style.setProperty('--tal-modern-landscape',map?'url("'+map+'")':'none');
}
function rebirthTalentTreeArt85(){
 const art=RebirthArt.actorPortrait(talCls,raceOf(save.race));
 for(const tree of $('talTree').children){if(tree.style)tree.style.setProperty('--tal-modern-hero',art?'url("'+art+'")':'none');}
}
function initRebirthScenes(){
 const legacy=window.mapPreview39;window.mapPreview39=(map,w,h)=>RebirthArt.vista(map,w,h)||(legacy?legacy(map,w,h):'');
}

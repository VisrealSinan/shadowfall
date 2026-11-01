/* The three chapters before a hunt share navigation, with their own visual identities. */
function selectionRaceScene(){
 const r=RACES[raceOf(selRace)],p=RaceTalents.points(save,selRace);
 $('originName').textContent=r.name;$('originRole').textContent=r.role;$('originFlavor').textContent=r.flavor;
 $('originPoints').textContent=p.level+' / 30 ancestry points earned';
 $('raceSelectedLabel').textContent=r.name+' selected';
 selectionSceneTick();
}
function selectionClassScene(){
 const c=CLASSES[selClass],p=talentPoints(selClass),r=RACES[raceOf(save.race)];
 $('callingName').textContent=c.name;$('callingRole').textContent=c.role;$('callingFlavor').textContent=c.flavor;
 $('callingDescription').textContent=c.desc;$('callingPassive').textContent=c.passive;$('callingPassiveText').textContent=c.pdesc;
 $('callingLevel').textContent='Class level '+classLevel(selClass).lvl+' · '+p.spent+' / '+p.total+' points allocated';
 $('callingRace').textContent=r.name;$('classSelectedLabel').textContent=c.name+' selected';
 $('select').style.setProperty('--selection-accent',c.col||'#cba4dc');
 selectionSceneTick();
}
function selectionMapScene(){
 const cur=selMap36(),list=MAPINFO39.concat(ZN39_ORDER.map(k=>Object.assign({k},ZN39[k].info))),m=list.find(x=>x.k===cur),record=RunPrep.store(save)[cur];
 $('atlasName').textContent=MAPNAME36[cur];$('atlasDescription').textContent=m?m.bl:'';
 $('atlasFoes').textContent=m?m.mobs:'';$('atlasBosses').textContent=m?m.boss:'';$('atlasHaven').textContent=m?m.town:'';
 $('atlasArt').style.backgroundImage='url("'+mapPreview39(cur,1000,420)+'")';
 $('atlasRecord').textContent=record?fmtTime(record.best):'No run recorded';
 $('mapSelectedLabel').textContent=MAPNAME36[cur]+' selected';
 const all=Array.from($('mapList').children),open=all.filter(b=>!b.className.includes('locked')).length;
 $('atlasCount').textContent=open+' / '+all.length+' destinations open';
}
function selectionSceneTick(){
 if(state==='race')drawPreparedHero($('originHero'),selClass,raceOf(selRace));
 else if(state==='select')drawPreparedHero($('callingHero'),selClass,raceOf(save.race));
}

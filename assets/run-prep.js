const RunPrep = (() => {
 const clamp=d=>Math.max(1,Math.min(5,Math.floor(Number(d)||1)));
 const names=['Dusk','Haunted','Relentless','Nightmare','Lost'];
 function rewards(d,daily=false){d=daily?1:clamp(d);return {difficulty:d,name:names[d-1],shards:1+(d-1)*.35,xp:1+(d-1)*.25,outfitShards:1+Math.floor((d-1)/2)};}
 function store(save){if(!save.mapRecords||typeof save.mapRecords!=='object'||Array.isArray(save.mapRecords))save.mapRecords={};return save.mapRecords;}
 function record(save,run){if(!run||!run.map||!Number.isFinite(run.t)||run.t<0)return false;const all=store(save),old=all[run.map];if(old&&Number(old.best)>=run.t)return false;all[run.map]={best:Math.floor(run.t),cls:run.cls,race:run.race,difficulty:clamp(run.expansion&&run.expansion.difficulty),daily:!!run.challengeDate};return true;}
 return {clamp,rewards,store,record};
})();
if(typeof module!=='undefined')module.exports=RunPrep;

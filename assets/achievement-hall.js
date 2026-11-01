/* Search and ordering are pure so the archive never changes achievement progress. */
const AchievementHall = (() => {
 const progress=(a,done,current)=>done(a)?1:Math.max(0,Math.min(1,current(a)/a.goal));
 function select(list,{tab='class',key='all',status='all',query='',sort='closest'},done,current) {
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return list.filter(a=>a.cat===tab&&(key==='all'||!a.key||a.key===key))
   .filter(a=>{const p=progress(a,done,current);return status==='all'||status==='earned'&&done(a)||status==='progress'&&!done(a)&&p>0||status==='locked'&&!done(a)&&p===0;})
   .filter(a=>words.every(w=>(a.name+' '+a.desc).toLowerCase().includes(w)))
   .sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='recent'?(Number(done(b))||0)-(Number(done(a))||0)||a.name.localeCompare(b.name):Number(!!done(a))-Number(!!done(b))||progress(b,done,current)-progress(a,done,current)||a.name.localeCompare(b.name));
 }
 return {select,progress};
})();
if(typeof module!=='undefined')module.exports=AchievementHall;
let hallPortraitObserver=null;
let hallStatus='all',hallQuery='',hallSort='closest';
function hallEscape(s) { return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function renderAchievementHall() {
 const done=a=>save.ach.done[a.id],visible=ACH.filter(a=>!hid46(a.key)),earned=ACH.filter(done).length,pct=Math.round(earned/ACH.length*100);
 $('achPct').textContent=pct+'%';$('achCount').textContent=earned.toLocaleString()+' / '+ACH.length.toLocaleString()+' honors inscribed';
 $('echoSeal').style.setProperty('--completion',pct+'%');$('echoRank').textContent=pct>=90?'Keeper of legends':pct>=60?'Chronicler of shadows':pct>=25?'Bearer of the flame':'The first embers';
 $('echoEarned').textContent=earned.toLocaleString();$('echoRemaining').textContent=(ACH.length-earned).toLocaleString();$('echoRewards').textContent=ACH.filter(a=>done(a)&&a.rw).length.toLocaleString();
 const chapters={class:['Classes','Paths of the hunter'],race:['Races','Bloodlines of the realm'],gen:['General','Legends of the night']};
 for(const b of $('achTabs').children){const list=visible.filter(a=>a.cat===b.dataset.t),c=chapters[b.dataset.t];b.classList.toggle('on',b.dataset.t===achTab);b.setAttribute('aria-pressed',String(b.dataset.t===achTab));b.innerHTML='<span class="echo-chapter-symbol">'+({class:'⚔',race:'❖',gen:'✧'}[b.dataset.t])+'</span><span>'+c[0]+'<small>'+c[1]+'</small></span><b>'+list.filter(done).length+'/'+list.length+'</b>';}
 const keys=achTab==='class'?menuClassIds().filter(k=>ARMOR_SETS[k]):achTab==='race'?RACE_IDS:[],filter=$('achFilter');
 filter.innerHTML='';if(keys.length){const label=document.createElement('label');label.htmlFor='echoSubject';label.textContent=achTab==='class'?'Class':'Race';const select=document.createElement('select');select.id='echoSubject';select.innerHTML='<option value="all">Every '+(achTab==='class'?'class':'race')+'</option>'+keys.map(k=>'<option value="'+k+'">'+hallEscape((CLASSES[k]||RACES[k]).name)+'</option>').join('');select.value=keys.includes(achKey)?achKey:'all';select.onchange=e=>{achKey=e.target.value;renderAch();};filter.append(label,select);}
 $('echoSearch').value=hallQuery;$('echoSort').value=hallSort;
 for(const b of $('echoStatus').children){b.classList.toggle('on',b.dataset.status===hallStatus);b.setAttribute('aria-pressed',String(b.dataset.status===hallStatus));}
 const list=AchievementHall.select(visible,{tab:achTab,key:achKey,status:hallStatus,query:hallQuery,sort:hallSort},done,achCur);
 $('echoListTitle').textContent=chapters[achTab][0]==='General'?'Legends of the night':achKey!=='all'&&keys.includes(achKey)?(CLASSES[achKey]||RACES[achKey]).name:achTab==='class'?'Paths of the hunter':'Bloodlines of the realm';
 $('echoResults').textContent=list.length+' honor'+(list.length===1?'':'s')+' on display';
 const host=$('achList');if(hallPortraitObserver)hallPortraitObserver.disconnect();
 hallPortraitObserver=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const a=ACH_BY_ID[e.target.dataset.reward];if(a&&a.rw){const pv=previewCos(a.rw);cosPortrait(e.target,pv.cls,pv.race,pv.cos,1.25);}hallPortraitObserver.unobserve(e.target);}},{root:$('ach'),rootMargin:'180px'}):null;
 host.innerHTML='';
 if(!list.length){host.innerHTML='<div class="echo-empty"><span aria-hidden="true">◇</span><h3>No inscriptions here</h3><p>Try another chapter, a different filter, or a shorter search.</p><button class="echo-reset" id="echoReset">Clear filters</button></div>';$('echoReset').onclick=()=>{hallQuery='';hallStatus='all';achKey='all';renderAch();};}
 for(const a of list){
  const unlocked=!!done(a),cur=achCur(a),p=Math.round(AchievementHall.progress(a,done,achCur)*100),status=unlocked?'Inscribed':cur>0?'Within reach':'Unwritten',fmt=n=>a.time?fmtTime(n):n.toLocaleString('en-US');
  const d=document.createElement('article');d.className='echo-card'+(unlocked?' done':'')+(a.prestige?' prestige':'');d.dataset.ach=a.id;
  const group=a.key&&(CLASSES[a.key]||RACES[a.key]),stamp=group?group.name:a.prestige?'Prestige honor':'Realm honor';
  d.innerHTML='<div class="echo-card-top"><span class="echo-icon" aria-hidden="true">'+a.ic+'\uFE0E</span><span class="echo-kind">'+hallEscape(stamp)+'</span><span class="echo-state">'+(unlocked?'✓ ':'')+status+'</span></div><h3>'+hallEscape(a.name)+'</h3><p class="echo-desc">'+hallEscape(a.desc)+'</p><div class="echo-progress" role="progressbar" aria-label="'+hallEscape(a.name)+'" aria-valuemin="0" aria-valuemax="'+a.goal+'" aria-valuenow="'+cur+'"><i style="width:'+p+'%"></i></div><div class="echo-numbers"><span>'+fmt(cur)+' <em>/ '+fmt(a.goal)+'</em></span><b>'+p+'%</b></div><div class="echo-reward">'+(a.rw?'<canvas aria-hidden="true"></canvas>':'<span class="echo-shard" aria-hidden="true">'+(a.shards?'◆':'♜')+'</span>')+'<div><small>'+(unlocked?'REWARD EARNED':a.un?'UNLOCKS':'THE REWARD')+'</small><span>'+hallEscape(newAchievementReward(a))+'</span></div>'+(unlocked?'<span class="echo-earned-mark" aria-label="Unlocked">✧</span>':'')+'</div>';
  host.appendChild(d);if(a.rw){const canvas=d.querySelector('canvas');canvas.dataset.reward=a.id;if(hallPortraitObserver)hallPortraitObserver.observe(canvas);else{const pv=previewCos(a.rw);cosPortrait(canvas,pv.cls,pv.race,pv.cos,1.25);}}
 }
 const closest=visible.filter(a=>!done(a)).sort((a,b)=>AchievementHall.progress(b,done,achCur)-AchievementHall.progress(a,done,achCur))[0];
 $('echoNextName').textContent=closest?closest.name:'Every honor, remembered';$('echoNextText').textContent=closest?closest.desc:'Your archive is complete. The shadows will remember your name.';
 const next=$('echoNext');next.hidden=!closest;next.onclick=()=>{achTab=closest.cat;achKey=closest.key||'all';hallQuery='';hallStatus='all';hallSort='closest';renderAch();$('echoListTitle').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
}
function initAchievementHall() {
 $('echoSearch').oninput=e=>{hallQuery=e.target.value;renderAch();};
 $('echoSearch').onkeydown=e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();hallQuery='';renderAch();e.target.blur();}};
 $('echoSort').onchange=e=>{hallSort=e.target.value;renderAch();};
 for(const b of $('echoStatus').children)b.onclick=()=>{hallStatus=b.dataset.status;renderAch();};
}

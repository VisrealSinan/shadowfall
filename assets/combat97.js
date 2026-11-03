/* Message routing and named legendary drops, v97. */
const Combat97=(()=>{
 let owner=null,box=null,list=null,lines=[];
 const important=text=>/quest|horde|monster wave|boss|night falls|dawn breaks|shrine|hollow bell|bellkeeper|world event|surge|guardians awake|stage \d/i.test(text);
 function ensure(){if(box)return;const style=document.createElement('style');style.textContent='#runLog97{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:calc(142px + env(safe-area-inset-bottom));width:min(330px,30vw);z-index:5;color:#d4dfdf;background:#0c181ee8;border:1px solid #647d7866;border-radius:8px;font:12px/1.45 system-ui;box-shadow:0 3px 12px #0006}#runLog97 header{font-size:10px;letter-spacing:.15em;color:#b6c6ba;padding:6px 10px;border-bottom:1px solid #647d7833}#runLog97 .history{max-height:155px;overflow-y:auto;overscroll-behavior:contain;padding:6px 10px;scrollbar-width:thin}#runLog97 p{margin:0 0 6px;overflow-wrap:anywhere}#runLog97 time{opacity:.5;font-size:10px;margin-right:7px}@media(max-width:700px){#runLog97{left:8px;bottom:calc(225px + env(safe-area-inset-bottom));width:min(230px,55vw);font-size:11px}#runLog97 .history{max-height:90px}}';document.head?document.head.appendChild(style):document.body.appendChild(style);box=document.createElement('section');box.id='runLog97';box.setAttribute('role','log');box.setAttribute('aria-label','Hunt messages');box.setAttribute('aria-live','polite');const heading=document.createElement('header');heading.textContent='HUNT LOG';list=document.createElement('div');list.className='history';box.appendChild(heading);box.appendChild(list);document.body.appendChild(box);}
 function reset(){if(owner===G)return;owner=G;lines=[];if(list)list.innerHTML='';}
 function log(text,col='#d4dfdf',sub=''){ensure();reset();const msg=String(text)+(sub?' · '+String(sub):''),last=lines.at(-1);if(last&&last.msg===msg&&G.t-last.at<2)return last;const p=document.createElement('p'),time=document.createElement('time'),body=document.createElement('span');time.textContent=fmtTime(G.t||0);body.textContent=msg;body.style.color=/^#[\da-f]{3,8}$/i.test(col)?col:'#d4dfdf';p.appendChild(time);p.appendChild(body);list.appendChild(p);const entry={msg,at:G.t,node:p};lines.push(entry);while(lines.length>80)lines.shift().node.remove();list.scrollTop=list.scrollHeight;return entry;}
 function hud(){if(!box)return;reset();box.style.display=G&&!G.ended&&state==='play'?'block':'none';}
 const legends=[
 ['ashen_crown','Crown of the Last Ember','head','ember',{fire:.16,armor:2}],
 ['stormglass','Stormglass Heart','trinket','storm',{area:.1,crit:.06}],
 ['briar_oath','Briar Oathplate','chest','thorns',{maxHp:28,armor:2}],
 ['winter_pilgrim','Winter Pilgrim Treads','feet','frost',{speed:.08,frost:.12}],
 ['dawn_bastion','Dawn Bastion','shoulders','aegis',{maxHp:22,regen:.5}],
 ['soulkeeper','Soulkeeper Pendant','neck','soul',{dur:.12,lifesteal:.015}],
 ['red_hour','Signet of the Red Hour','ring','rush',{crit:.07,critMul:.2}],
 ['gilded_horizon','Girdle of the Gilded Horizon','waist','greed',{pickup:.25,xp:.12}]
 ];
 function install(){
  const oldToast=toast;toast=function(text,col,dur,sub){if(!G||G.ended||important(String(text)+' '+(sub||'')))return oldToast.apply(this,arguments);return log(text,col,sub);};
  const oldAnnounce=announce;announce=function(a,b,col,snd){if(G&&!G.ended&&/evolution|ultimate ready/i.test(a))return log(a,col,b);return oldAnnounce.apply(this,arguments);};
  const oldAch=achBanner;achBanner=function(a){if(G&&!G.ended)return log('Achievement · '+a.name,'#ffe1a1',a.rw?'Reward: '+rewardName(a.rw):a.un||'');return oldAch.apply(this,arguments);};
  const originalGear=genGear;genGear=function(kind,o={}){const item=originalGear.apply(this,arguments);if(item.r!==4||o.fx&&!o.legend||!o.legend&&Math.random()>=.4)return item;const pool=legends.filter(q=>(o.legend||q[2]===item.t)&&(!o.legend||q[0]===o.legend));if(!pool.length)return item;const def=pick(pool); // Named relics use the existing legendary tier and proc engines.
   const relic=originalGear(kind,{...o,r:4,ty:def[2],fx:def[3]});relic.name=def[1];relic.legend97=def[0];for(const [k,v]of Object.entries(def[4]))relic.st[k]=gRound(k,v);relic.col='#d5a95a';relic.look=2;return relic;};
 }
 return {install,hud,log,important,legends,history:()=>lines.map(x=>({text:x.msg,at:x.at}))};
})();

/* Map-independent quest objectives. Reuse the existing painted prop collection. */
const Quests100 = (() => {
  const ids = ['skirmish','soulharvest','trailblazer','watch','beacons','ritual','courier','ward','chain','twinhunt'];
  function register() {
    const definitions = {
      skirmish: ['⚔','#f3ad78','Thin the Ranks',q=>`Defeat ${q.goal} foes of any kind`,q=>`Foes ${q.n}/${q.goal}`],
      soulharvest: ['◆','#9cdaec','Soul Harvest',q=>`Gather ${q.goal} base XP from experience gems`,q=>`Gem XP ${Math.floor(q.n)}/${q.goal}`],
      trailblazer: ['➶','#b6dfa2','Trailblazer',q=>`Travel ${q.goal} paces on foot; teleports do not count`,q=>`Paces ${Math.floor(q.n)}/${q.goal}`],
      watch: ['◷','#c4c8ed','Weather the Storm',q=>`Stay alive in the field for ${q.goal} seconds`,q=>`Survive ${Math.floor(q.n)}/${q.goal}s`],
      beacons: ['⚑','#e8cf8b','Wayfinder Signals',()=> 'Visit three marked survey beacons in order',q=>`Beacons ${q.n}/${q.goal}`],
      ritual: ['✧','#cdb6ef','Threefold Rite',()=> 'Channel each of three marked seals for 3 seconds; leaving pauses the channel',q=>`Seals ${q.n}/${q.goal} · ${(q.charge||0).toFixed(1)}/3s`],
      courier: ['▣','#e1bc8b','The Last Delivery',()=> 'Collect the marked supply chest, then return it to the starting camp',q=>q.n?'Return supplies to camp':'Find the supply chest'],
      ward: ['◎','#93ddcb','Defend the Ward',q=>`Defeat ${q.goal} foes within the ward while you also stand inside it`,q=>`Ward ${q.n}/${q.goal}`],
      chain: ['ϟ','#f1bb90','Break Their Momentum',q=>`Defeat ${q.goal} foes without letting 12 seconds pass between kills`,q=>`Chain ${q.n}/${q.goal} · ${Math.ceil(q.streak||0)}s`],
      twinhunt: ['☠','#efc58b','Two Bounties',()=> 'Defeat two marked champions, one after the other',q=>`Champions ${q.n}/${q.goal}`]
    };
    for (const [id,[ic,col,title,desc,short]] of Object.entries(definitions)) QDEF[id]={ic,col,name:()=>title,desc,short};
    Q_EARLY.push('skirmish','soulharvest','trailblazer','watch','beacons','courier');
    Q_ALL.push(...ids);
  }
  function localType(type) {
    if (heart36() && HEARTSUB[type]) type=HEARTSUB[type];
    if (zn39() && zn39().sub[type]) type=zn39().sub[type];
    return type;
  }
  function roster() {
    return [...new Set(Object.keys(ETYPES).filter(k=>onMap28(k)&&ETYPES[k].t0<=G.t&&ETYPES[k].t0<1e8&&!ETYPES[k].boss&&!ETYPES[k].mini&&!ETYPES[k].totem).map(localType))];
  }
  // Query actual generated collision chunks, including points beyond the viewport.
  function clearSegment(a,b,r=P.r+5) {
    const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy;
    for(let i=Math.floor((Math.min(a.x,b.x)-r-120)/OBC);i<=Math.floor((Math.max(a.x,b.x)+r+120)/OBC);i++)
      for(let j=Math.floor((Math.min(a.y,b.y)-r-120)/OBC);j<=Math.floor((Math.max(a.y,b.y)+r+120)/OBC);j++)
        for(const o of obChunk(i,j)) {
          if(o.gone)continue;
          const t=l2?clamp(((o.x-a.x)*dx+(o.y-a.y)*dy)/l2,0,1):0;
          if(Math.hypot(o.x-a.x-dx*t,o.y-a.y-dy*t)<o.r+r)return false;
        }
    return true;
  }
  function point(from=P,min=180,max=300,angle=rand(TAU),radius=P.r+5) {
    // Each selected leg is a clear walking corridor, rather than a point merely
    // outside a collider. Shorten a leg in dense areas before using the anchor.
    for(const scale of [1,.65,.35,.12])for(let n=0;n<24;n++) {
      const a=angle+n*2.39996323,d=rand(min,max)*scale;
      const p={x:r1(from.x+Math.cos(a)*d),y:r1(from.y+Math.sin(a)*d)};
      if(clearSegment(from,p,Math.max(1,P.r-.1))&&clearSegment(p,p,radius))return p;
    }
    return {x:from.x,y:from.y};
  }
  function reachable(p,from=P,radius=P.r+5) {
    if(clearSegment(from,p,Math.max(1,P.r-.1))&&clearSegment(p,p,radius))return p;
    const d=Math.hypot(p.x-from.x,p.y-from.y);
    return point(from,Math.min(d,180),Math.min(d,400),Math.atan2(p.y-from.y,p.x-from.x),radius);
  }
  function start(q) {
    const t=G.t;
    if(!ids.includes(q.k))return false;
    if(q.k==='skirmish')q.goal=Math.min(80,25+Math.floor(t/30));
    if(q.k==='soulharvest')q.goal=Math.min(180,30+Math.floor(t/8));
    if(q.k==='trailblazer'){q.goal=Math.min(1800,900+Math.floor(t/2));q.lastX=P.x;q.lastY=P.y;}
    if(q.k==='watch'){q.goal=Math.min(60,35+Math.floor(t/60));q.T=q.max=q.goal+30;}
    if(q.k==='beacons'||q.k==='ritual') {
      q.goal=3;q.points=[];let anchor=P;
      for(let i=0;i<3;i++){const p=point(anchor,160,260,rand(TAU));q.points.push(p);anchor=p;}
      q.charge=0;q.T=q.max=q.k==='ritual'?110:90;
    }
    if(q.k==='courier'){q.goal=2;q.home={x:P.x,y:P.y};q.target=point(P,260,400);}
    if(q.k==='ward'){Object.assign(q,point(P,150,240));q.r=175;q.goal=Math.min(40,10+Math.floor(t/60));q.T=q.max=100;}
    if(q.k==='chain'){q.goal=Math.min(16,6+Math.floor(t/180));q.streak=0;}
    if(q.k==='twinhunt'){q.goal=2;q.ty=qEliteType();qSpawnElite(q);q.T=q.max=150;}
    return true;
  }
  function prepare(q) {
    if(q.k==='slay') {
      const pool=roster(),counts={};for(const e of enemies)if(!e.dead&&pool.includes(e.type))counts[e.type]=(counts[e.type]||0)+1;
      if(!pool.includes(q.ty))q.ty=pool.slice().sort((a,b)=>(counts[b]||0)-(counts[a]||0))[0];
    }
    if(q.k==='zone'){const p=reachable(q);q.x=p.x;q.y=p.y;}
    if(q.k==='relics')for(const r of q.rel)if(!r[2]){const p=reachable({x:r[0],y:r[1]});r[0]=p.x;r[1]=p.y;}
    if(q.k==='escort') {
      const p=reachable(q),target=reachable({x:q.tx,y:q.ty2},p);
      q.x=p.x;q.y=p.y;q.tx=target.x;q.ty2=target.y;q.d0=Math.max(1,Math.hypot(q.tx-q.x,q.ty2-q.y));
    }
    q.checked100=true;
  }
  function totem(q) {
    const p=point(P,200,370,rand(TAU),Math.max(P.r+5,ETYPES.totem.r+4)),e=spawnEnemy('totem',p);
    e.qid=q.id;e.hx=e.x;e.hy=e.y;
    return e;
  }
  function maintain(q,dt) {
    if(q.T<=0)return;
    if(!q.checked100)prepare(q); // Includes older continued runs.
    if(q.k==='totems') {
      const live=enemies.filter(e=>!e.dead&&e.qid===q.id);
      for(const e of live){if(!q.placed100){const p=reachable(e,P,Math.max(P.r+5,e.r+4));e.x=e.hx=p.x;e.y=e.hy=p.y;}}
      for(let i=live.length;i<q.goal-q.n;i++)totem(q);
      q.placed100=true;
    }
    if(q.k==='slay'&&(q.supply100=(q.supply100||0)-dt)<=0&&q.n<q.goal) {
      q.supply100=5;
      const alive=enemies.filter(e=>!e.dead&&e.type===q.ty).length;
      // Keep a small number of quarry available even if the normal spawn mix changes.
      if(alive<4&&enemies.length<ECAP)for(let i=alive;i<Math.min(4,q.goal-q.n);i++) {
        const p=point(P,270,400,rand(TAU),Math.max(P.r+5,ETYPES[q.ty].r+4));spawnEnemy(q.ty,p);
      }
    }
  }
  function kill(q,e) {
    if(ETYPES[e.type]?.totem)return;
    if(q.k==='skirmish')q.n++;
    if(q.k==='chain'){if(!(q.streak>0))q.n=0;q.n++;q.streak=12;}
    if(q.k==='ward'&&Math.hypot(P.x-q.x,P.y-q.y)<=q.r&&Math.hypot(e.x-q.x,e.y-q.y)<=q.r)q.n++;
    if(q.k==='twinhunt'&&e.qid===q.id)q.n++;
  }
  function gem(g) {
    if(!G||G.town||G.ended||!(g.v>0)||!Number.isFinite(g.x)||!Number.isFinite(g.y))return;
    for(const q of G.quests||[])if(q.k==='soulharvest')q.n+=g.v;
  }
  function tick(q,dt) {
    if(!ids.includes(q.k))return false;
    const step=Math.min(dt,Math.max(0,q.T+dt));
    if(q.k==='watch')q.n+=step;
    if(q.k==='trailblazer') {
      const d=Math.hypot(P.x-q.lastX,P.y-q.lastY);
      if(P.moving&&d<=Math.max(25,P.spdPx*step*3))q.n+=d;
      q.lastX=P.x;q.lastY=P.y;
    }
    if(q.k==='chain'){q.streak=Math.max(0,q.streak-step);if(!q.streak)q.n=0;}
    if(q.k==='beacons'||q.k==='ritual') {
      const p=q.points[q.n];if(p&&Math.hypot(P.x-p.x,P.y-p.y)<42) {
        if(q.k==='beacons'){q.n++;Snd.play('gem');}
        else {q.charge+=step;if(q.charge>=3-1e-7){q.n++;q.charge=0;Snd.play('shimmer');}}
      }
    }
    if(q.k==='courier') {
      const p=q.n?q.home:q.target;
      if(Math.hypot(P.x-p.x,P.y-p.y)<42){q.n++;Snd.play('pick');}
    }
    if(q.k==='twinhunt'&&q.T>0&&q.n<q.goal&&!qElite(q)){q.ty=qEliteType();qSpawnElite(q);}
    return true;
  }
  function target(q) {
    if(q.k==='beacons'||q.k==='ritual')return q.points[q.n];
    if(q.k==='courier')return q.n?q.home:q.target;
    if(q.k==='ward')return q;
    return null;
  }
  function marker(g,p,col,prop,label,progress=0) {
    if(!p||!inView(p.x,p.y,110))return;
    g.save();g.translate(p.x,p.y);g.strokeStyle=col;g.lineWidth=2;g.fillStyle=hexA(col,.1);
    g.beginPath();g.ellipse(0,0,36,26,0,0,TAU);g.fill();g.stroke();
    if(progress){g.lineWidth=4;g.beginPath();g.ellipse(0,0,40,30,0,-Math.PI/2,-Math.PI/2+TAU*progress);g.stroke();}
    const im=Art99.prop(prop);if(im)g.drawImage(im,-28,-50,56,56);
    g.font='bold 10px system-ui';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#08141b';g.strokeText(label,0,-53);g.fillStyle=col;g.fillText(label,0,-53);g.restore();
  }
  function world(q) {
    const p=target(q);if(!p)return;
    const col=QDEF[q.k].col;
    if(q.k==='ward'&&inView(q.x,q.y,q.r+20)) {
      ctx.save();ctx.fillStyle=hexA(col,.08);ctx.strokeStyle=hexA(col,.6);ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,TAU);ctx.fill();ctx.stroke();ctx.restore();
    }
    marker(ctx,p,col,q.k==='courier'?(q.n?'tent':'vchest'):q.k==='ritual'?'altar':'vobel',q.k==='courier'?(q.n?'Return to camp':'Supplies'):q.k==='ward'?'Defend the ward':`${q.k==='ritual'?'Seal':'Beacon'} ${q.n+1}/3`,q.k==='ritual'?q.charge/3:0);
  }
  function hud(q) {const p=target(q);if(p)qArrow(p.x,p.y-12,QDEF[q.k].col,QDEF[q.k].ic);}
  function lights(q,L){const p=target(q);if(p)L(p.x,p.y-15,65,.6);}
  return {ids,register,localType,roster,clearSegment,point,reachable,start,prepare,maintain,totem,kill,gem,tick,world,hud,lights};
})();

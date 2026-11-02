/* Source-aware, bounded canvas spell art. Rendering never mutates combat objects. */
const SpellVisuals94=(()=>{
 const styles={
 rogue:['steel','#e1d9ec','#9e405b','Crossed steel and vanishing cuts'],warlock:['hex','#b6ec76','#a469cd','Broken curse seals'],summoner:['soul','#b5e9e2','#8098dc','Spirits and bone gates'],ranger:['feather','#bbd99b','#e5c79c','Fletching and woodland arrows'],reaper:['scythe','#c8c2e9','#7756a7','Harvest crescents'],rift:['rift','#a6a6ff','#ec93e6','Fractured dimensional windows'],druid:['vine','#a9df81','#d4b770','Growing roots and leaves'],mage:['crystal','#b8ddff','#8c98ed','Faceted arcane crystals'],paladin:['sun','#ffe9a6','#cf9b50','Radiant oath rays'],engineer:['gear','#e4ba77','#75c8db','Interlocking teeth and circuitry'],alchemist:['flask','#b9e77e','#e6b568','Glass vessels and rising reagents'],bard:['note','#f1d88d','#d19cda','Musical staves and notes'],bloodknight:['blood','#f78a9a','#a92758','Blood lances and droplets'],chrono:['clock','#ecdbab','#80d7da','Clock hands and displaced ticks'],maestro:['signal','#87f4e8','#ef86d7','Waveforms and digital bars'],unraveler:['thread','#e9b5f0','#9c8be3','Needles and unraveling threads'],gunslinger:['cartridge','#ffdc91','#d68d62','Cartridges and powder sparks'],river:['rose','#ffabd0','#ffb57b','Rose petals and cinder'],visage:['eye','#e4e2f2','#a68ce2','Watching eyes and static'],paragon:['eclipse','#fff0bf','#a59cea','Eclipses and constellations'],bearlina:['paw','#e8c18a','#a9d587','Claw marks and honeycomb'],myers:['lantern','#d6d7c5','#8fbeb6','Grave lanterns and sickles'],tibopoteto:['duo','#91e8d5','#cd9cf0','Two interwoven signals'],shaman:['totem','#96dfce','#edc18b','Carved spirit masks and storm forks']
 };
 const hash=id=>{let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return h;};
 function info(id){const d=WDEF[id];if(!d||!styles[d.cls])return null;let [motif,primary,accent,label]=styles[d.cls];if(d.cls==='druid')motif=d.cat?'paw':d.tree?'vine':'vine';if(d.cls==='mage'){if(/frost|ice|shard|blizz|cold/i.test(id+' '+d.name)){motif='crystal';primary='#c1efff';accent='#6aaade';}else if(/fire|flame|meteor|ember/i.test(id+' '+d.name)){motif='flame';primary='#ffb26f';accent='#f26d57';}else if(/light|thunder|storm/i.test(id+' '+d.name))motif='storm';}return {cls:d.cls,motif,primary,accent,label,seed:hash(id)};}
 function line(g,points){g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
 function ring(g,r,start=0,end=Math.PI*2){g.beginPath();g.arc(0,0,r,start,end);g.stroke();}
 function leaf(g,x,y,a){g.save();g.translate(x,y);g.rotate(a);g.beginPath();g.moveTo(-.3,0);g.quadraticCurveTo(0,-.3,.35,0);g.quadraticCurveTo(0,.3,-.3,0);g.fill();g.restore();}
 function motif(g,k,t){
  switch(k){
   case 'steel':line(g,[[-.7,.5],[.6,-.5],[.2,.1],[-.7,.5]]);line(g,[[-.45,-.7],[.45,.7]]);break;
   case 'hex':for(let i=0;i<3;i++){g.rotate(Math.PI*2/3);line(g,[[0,-.9],[.6,.35],[-.6,.35],[-.2,-.4]]);}break;
   case 'soul':g.beginPath();g.moveTo(0,.9);g.bezierCurveTo(-1,.2,-.6,-.9,0,-.8);g.bezierCurveTo(.7,-.8,.8,.1,0,.9);g.stroke();line(g,[[-.25,-.3],[-.25,-.1]]);line(g,[[.25,-.3],[.25,-.1]]);break;
   case 'feather':line(g,[[-.8,.6],[.8,-.6],[.2,-.6]]);for(let i=0;i<4;i++)line(g,[[-.7+i*.2,.5-i*.15],[-.7+i*.2,.1-i*.15]]);break;
   case 'scythe':g.beginPath();g.moveTo(-.6,.8);g.lineTo(.3,-.6);g.bezierCurveTo(.8,-.7,1,.1,.7,.6);g.bezierCurveTo(.55,0,.4,-.2,.1,-.3);g.stroke();break;
   case 'rift':line(g,[[-.7,-.6],[-.2,-.8],[-.35,.1],[-.8,.7]]);line(g,[[.2,-.8],[.7,-.6],[.35,.1],[.65,.8],[.1,.5]]);break;
   case 'vine':g.beginPath();g.moveTo(0,.9);g.bezierCurveTo(-.8,.1,.8,-.1,0,-.9);g.stroke();leaf(g,-.25,.15,-.5);leaf(g,.25,-.3,.5);break;
   case 'crystal':line(g,[[0,-.9],[.6,-.2],[.3,.7],[0,.9],[-.5,.3],[-.4,-.5],[0,-.9],[0,.9]]);line(g,[[-.4,-.5],[.6,-.2],[-.5,.3]]);break;
   case 'sun':ring(g,.35);for(let i=0;i<8;i++){g.rotate(Math.PI/4);line(g,[[0,-.5],[0,-.9]]);}break;
   case 'gear':for(let i=0;i<8;i++){g.rotate(Math.PI/4);line(g,[[-.2,-.6],[-.2,-.85],[.2,-.85],[.2,-.6]]);}ring(g,.55);ring(g,.2);break;
   case 'flask':line(g,[[-.2,-.8],[.2,-.8],[.2,-.35],[.65,.55],[.5,.8],[-.5,.8],[-.65,.55],[-.2,-.35],[-.2,-.8]]);line(g,[[-.45,.3],[.45,.3]]);g.beginPath();g.arc(.4,-.6,.1,0,7);g.stroke();break;
   case 'note':for(let i=-1;i<=1;i++)line(g,[[-.8,i*.3],[.8,i*.3]]);g.beginPath();g.ellipse(-.2,.3,.23,.14,-.4,0,7);g.fill();line(g,[[0,.3],[0,-.7],[.6,-.5],[.6,.15]]);break;
   case 'blood':g.beginPath();g.moveTo(0,-.9);g.bezierCurveTo(-.2,-.3,-.8,.3,-.4,.7);g.bezierCurveTo(.1,1,.9,.4,0,-.9);g.fill();break;
   case 'clock':ring(g,.75);for(let i=0;i<12;i++){g.rotate(Math.PI/6);line(g,[[0,-.6],[0,-.73]]);}line(g,[[Math.cos(t)*.5,Math.sin(t)*.5],[0,0],[0,-.5]]);break;
   case 'signal':for(let i=0;i<7;i++){const h=.2+.55*Math.abs(Math.sin(t*2+i));line(g,[[-.8+i*.26,-h],[-.8+i*.26,h]]);}break;
   case 'thread':for(let i=0;i<4;i++){g.beginPath();g.moveTo(-.9,-.6+i*.4);g.bezierCurveTo(-.3,.9-i*.3,.3,-.9+i*.3,.9,.5-i*.3);g.stroke();}line(g,[[-.6,.8],[.6,-.8],[.5,-.4]]);break;
   case 'cartridge':line(g,[[-.8,-.2],[.4,-.2],[.9,0],[.4,.2],[-.8,.2],[-.8,-.2]]);line(g,[[-.5,-.2],[-.5,.2]]);break;
   case 'rose':for(let i=0;i<5;i++){g.rotate(Math.PI*2/5);leaf(g,0,-.38,Math.PI/2);}ring(g,.18);break;
   case 'eye':g.beginPath();g.moveTo(-.9,0);g.quadraticCurveTo(0,-.85,.9,0);g.quadraticCurveTo(0,.85,-.9,0);g.stroke();ring(g,.25);line(g,[[-.8,.7],[-.3,.7]]);break;
   case 'eclipse':ring(g,.6);g.beginPath();g.arc(.25,0,.55,-1.4,1.4);g.stroke();for(let i=0;i<4;i++){g.rotate(Math.PI/2);line(g,[[0,-.8],[0,-1]]);}break;
   case 'paw':for(let i=0;i<3;i++){g.beginPath();g.moveTo(-.6+i*.45,-.8);g.quadraticCurveTo(-.9+i*.45,0,-.25+i*.45,.8);g.stroke();}break;
   case 'lantern':line(g,[[-.4,-.45],[.4,-.45],[.5,.6],[-.5,.6],[-.4,-.45],[0,-.85],[.4,-.45]]);line(g,[[0,-.3],[0,.4]]);ring(g,.16);break;
   case 'duo':for(const d of [-1,1]){g.save();g.translate(d*.3,0);g.scale(.55,1);ring(g,.65);g.restore();g.strokeStyle=g.fillStyle;}break;
   case 'totem':line(g,[[-.55,-.8],[.55,-.8],[.4,.6],[0,.9],[-.4,.6],[-.55,-.8]]);line(g,[[-.4,-.3],[-.1,0],[0,-.2],[.1,0],[.4,-.3]]);line(g,[[-.2,.4],[.2,.4]]);break;
   case 'flame':g.beginPath();g.moveTo(0,-1);g.bezierCurveTo(.3,-.1,1,.1,.4,.7);g.bezierCurveTo(-.8,1,-.8,0,-.2,-.4);g.quadraticCurveTo(-.3,.3,0,-1);g.fill();break;
   case 'storm':line(g,[[.3,-.9],[-.5,.1],[.1,0],[-.3,.9],[.6,-.2],[0,-.1]]);break;
  }
 }
 function stamp(g,d,x,y,r,t,alpha=1){g.save();g.translate(x,y);g.scale(r,r);g.globalAlpha*=alpha;g.strokeStyle=d.primary;g.fillStyle=d.accent;g.lineWidth=1.5/Math.max(.1,r);g.lineJoin='round';g.lineCap='round';motif(g,d.motif,t);g.restore();}
 function projectile(g,p,t){const d=info(p.src);if(!d||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;const angle=Math.atan2(p.vy||0,p.vx||1);g.save();g.translate(p.x,p.y);g.rotate(angle);stamp(g,d,-5,0,Math.min(13,Math.max(5,(p.r||3)*1.3)),t,.8);g.restore();return true;}
 function effect(g,f,t,layer){const d=info(f.src);if(!d||!Number.isFinite(f.x)||!Number.isFinite(f.y)||!Number.isFinite(f.r)||f.r<=0||!Number.isFinite(f.max)||f.max<=0||f.life<=0)return false;
  const field=f.k==='zone';if(field?layer!=='ground':layer!=='over'||!['boom','nova'].includes(f.k))return false;
  if(!inView(f.x,f.y,f.r+30))return true;
  const p=Math.min(1,Math.max(0,1-f.life/f.max)),alpha=field?Math.min(1,p*8,f.life*2):Math.sin(Math.PI*Math.min(.99,p+.03)),r=f.r*(field?1:.35+p*.65),n=field?7:5;
  g.save();g.globalAlpha*=alpha;g.translate(f.x,f.y);if(field)g.scale(1,.8);
  g.strokeStyle=d.accent;g.lineWidth=1.3;g.fillStyle=d.accent;
  const phase=field?t*.4:p*2,organic=['vine','rose','paw'].includes(d.motif),cut=['steel','scythe','cartridge','feather'].includes(d.motif);
  if(cut){
   for(let i=0;i<5;i++){g.save();g.rotate((d.seed%17)*.2+i*.26);const y=(i-2)*r*.24;g.globalAlpha*=.8;line(g,[[-r*(.25+p*.4),y],[r*(.45+p*.4),y-r*.16]]);stamp(g,d,r*.4,y,Math.min(13,r*.2),t);g.restore();}
  }else if(organic){
   for(let i=0;i<6;i++){g.save();g.rotate(i*Math.PI/3);g.beginPath();g.moveTo(0,0);g.bezierCurveTo(r*.25,-r*.3,r*.5,r*.3,r*.9,Math.sin(phase+i)*r*.12);g.stroke();for(let j=1;j<4;j++)stamp(g,d,r*j*.22,Math.sin(j*2+i+phase)*r*.12,Math.min(15,r*.17),t,.7);g.restore();}
  }else if(d.motif==='thread'||d.motif==='rift'){
   for(let i=0;i<6;i++){g.save();g.rotate(i*Math.PI/3+phase*.1);g.beginPath();g.moveTo(-r,Math.sin(i+phase)*r*.3);g.bezierCurveTo(-r*.3,r*.5,r*.3,-r*.5,r,Math.cos(i+phase)*r*.3);g.stroke();g.restore();}stamp(g,d,0,0,Math.min(28,r*.4),t);
  }else if(d.motif==='clock'||d.motif==='gear'||d.motif==='eclipse'||d.motif==='sun'){
   g.save();g.rotate(phase*.3);stamp(g,d,0,0,r*.85,t,.8);g.restore();for(let i=0;i<8;i++){const a=i*Math.PI/4-phase*.2;g.save();g.translate(Math.cos(a)*r*.9,Math.sin(a)*r*.9);g.rotate(a);line(g,[[-4,0],[4,0]]);g.restore();}
  }else if(d.motif==='signal'||d.motif==='note'||d.motif==='duo'){
   for(let j=0;j<3;j++){g.strokeStyle=j%2?d.primary:d.accent;g.beginPath();for(let i=0;i<=24;i++){const x=(i/12-1)*r,y=Math.sin(i*.45+phase*3+j)*r*(.1+j*.07);i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}for(let i=0;i<3;i++)stamp(g,d,(i-1)*r*.6,Math.sin(phase+i)*r*.35,Math.min(18,r*.2),t);
  }else if(d.motif==='blood'||d.motif==='flask'||d.motif==='flame'){
   for(let i=0;i<9;i++){const a=i*2.4+d.seed%9,rr=r*(.3+((i*.17+phase*.12)% .65));stamp(g,d,Math.cos(a)*rr,Math.sin(a)*rr,Math.min(18,r*(.09+i*.012)),t,.7);}stamp(g,d,0,0,Math.min(27,r*.35),t);
  }else{
   for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.sin(phase)*.15;g.save();g.translate(Math.cos(a)*r*.72,Math.sin(a)*r*.72);g.rotate(Math.sin(phase+i)*.3);stamp(g,d,0,0,Math.min(22,r*.24),t+i,.75);g.restore();}stamp(g,d,0,0,Math.min(27,r*.4),t,.8);
  }
  g.restore();return true;
 }
 return {styles,info,motif,stamp,projectile,effect};
})();

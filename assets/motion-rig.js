/* Shared animation authoring rig. The sheet compiler and live fallbacks use the
   same articulated poses; no motion changes a gameplay position or collision. */
const MotionRig=(()=>{
 const TAU=Math.PI*2,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 const pulse=(p,a,b,c)=>p<a||p>c?0:p<b?smooth((p-a)/(b-a)):1-smooth((p-b)/(c-b));
 function kind(key,base='walker'){
  if(/paired|tibopoteto/.test(key))return 'paired';
  if(/cat$|hound|wolf|boar|mare|moonhowl|lizard/.test(key))return 'quadruped';
  if(/bat|moth|hornet|harpy|wyvern|drake|crow|owl|gloamwing/.test(key))return 'winged';
  if(/spider|widow|skit|grub|worm|rattler/.test(key))return 'crawler';
  if(/tree|root|shrine|totem/.test(key))return 'rooted';
  if(/ooze|blob|slime/.test(key))return 'ooze';
  if(/ghost|wisp|wraith|shade|oracle|archivist/.test(key)&&!/graveshade/.test(key))return 'hover';
  return base;
 }
 function pose(kind,action,p,seed=0){
  p=clamp(p);const c=Math.sin(TAU*p),s=Math.cos(TAU*p),hit=pulse(p,.05,.48,.95),wind=pulse(p,0,.72,1),heavy=['heavy','rooted','colossus','brute','tree'].includes(kind),fly=['winged','hover'].includes(kind);
  const a={x:0,y:0,angle:0,sx:1,sy:1,arms:[0,0],legs:[0,0],knees:[0,0],head:0,tail:0,wings:0,cloth:0,alpha:1,glow:0};
  if(action==='idle'){a.sy+=c*.012;a.y=fly?c*.012:0;a.arms=[c*.025,-c*.018];a.head=s*.012;a.tail=c*.045;a.cloth=s*.012;a.wings=kind==='winged'?c*.12:0;}
  if(action==='run'||action==='walk'){
   a.legs=[c*(heavy?.15:.34),-c*(heavy?.15:.34)];a.knees=[Math.max(0,s)*.18,Math.max(0,-s)*.18];a.arms=[-c*.20,c*.20];a.y=-Math.abs(s)*(heavy?.006:.022);a.angle=c*(heavy?.008:.018);a.head=-c*.014;a.tail=s*.11;a.cloth=s*.028;a.wings=c*.28;
  }
  if(action==='windup'){a.angle=-wind*.045;a.arms=[-wind*.3,wind*.20];a.sy-=wind*.04;a.legs=[wind*.05,-wind*.05];a.head=-wind*.035;a.glow=wind*.4;}
  if(action==='attack'){
   const back=pulse(p,0,.20,.45),strike=pulse(p,.22,.54,1);a.x=(strike*(heavy?.035:.065)-back*.025);a.y=-strike*.013;a.angle=strike*.075-back*.045;a.arms=[-back*.35+strike*.56,back*.23-strike*.42];a.legs=[-strike*.14,strike*.14];a.knees=[strike*.08,0];a.head=-strike*.035;a.tail=-strike*.1;a.wings=-strike*.18;a.glow=hit;
  }
  if(['casting','greet','trade','work','ultimate','spawn'].includes(action)){
   const q=action==='work'?pulse(p,0,.25,.65):hit;
   a.arms=action==='trade'?[-q*.1,-q*.42]:action==='greet'?[q*.42,-q*.12]:action==='work'?[-q*.50,q*.28]:[-q*.33,q*.38];a.head=q*.035;a.y=-q*(action==='ultimate'?.045:.02);a.sx+=q*.015;a.cloth=c*.025*hit;a.glow=q;a.wings=q*.3;
   if(action==='spawn'){a.sy=.72+.28*smooth(p);a.y=(1-smooth(p))*.08;a.alpha=smooth(p);}
  }
  if(action==='dodge'){a.x=-hit*.07;a.sy-=hit*.20;a.sx+=hit*.08;a.angle=-hit*.16;a.arms=[hit*.22,-hit*.20];a.legs=[hit*.30,-hit*.30];a.head=hit*.04;a.tail=-hit*.2;}
  if(action==='hurt'){const q=1-smooth(p);a.x=-q*.035;a.angle=-q*.08;a.sy-=hit*.04;a.arms=[q*.12,-q*.18];a.head=q*.08;}
  if(action==='death'){const q=smooth(clamp((p-.08)/.8));a.angle=-q*(fly?.25:.55);a.sy-=q*(fly?.18:.36);a.y=q*.06;a.legs=[-q*.25,q*.30];a.arms=[q*.25,-q*.4];a.head=q*.18;a.alpha=1-smooth(clamp((p-.62)/.38));a.wings=q*.32;}
  if(kind==='quadruped'){a.legs=a.legs.map(x=>x*1.35);a.y*=1.2;a.head*=1.5;}
  if(kind==='ooze'){a.sx+=c*(action==='idle'?.025:.07);a.sy-=c*(action==='idle'?.02:.06);a.arms=[0,0];a.legs=[0,0];}
  // A stable, small per-actor difference avoids synchronized armies.
  a.cloth*=.9+(Math.abs(seed)%7)*.025;return a;
 }
 function rotate(x,y,cx,cy,a){const c=Math.cos(a),s=Math.sin(a);return [cx+(x-cx)*c-(y-cy)*s,cy+(x-cx)*s+(y-cy)*c];}
 function vertex(x,y,kind,a){
  const origX=x,origY=y;
  const paired=kind==='paired',cx=paired?(x<.5?.32:.68):.5,bodyWidth=paired?.18:.34;
  const side=x<cx?-1:1,i=side<0?0:1,dist=Math.abs(x-cx);
  const outer=smooth((dist-bodyWidth*.16)/(bodyWidth*.65)),arm=outer*pulse(y,.12,.50,1);
  if(arm>0){const r=rotate(x,y,cx+side*bodyWidth*.55,.36,a.arms[i]*arm);x=r[0];y=r[1];}
  const leg=smooth((origY-.62)/.3);
  if(leg>0&&!['hover','winged','ooze','rooted'].includes(kind)){
   const r=rotate(x,y,cx+side*bodyWidth*.28,.67,a.legs[i]*leg);x=r[0];y=r[1]-a.knees[i]*smooth((origY-.78)/.18)*.10;
  }
  const head=(1-smooth((origY-.24)/.15))*(1-smooth(dist/(bodyWidth*.6)));
  if(head>0){const r=rotate(x,y,cx,.31,a.head*head);x=r[0];y=r[1];}
  if(['quadruped','crawler'].includes(kind)){
   const low=smooth((origY-.57)/.30),phase=Math.sin((origX*3.7+(origY>.7?.5:0))*Math.PI);x+=low*phase*a.legs[i]*.06;y-=low*Math.max(0,phase*a.legs[i])*.05;
   x+=smooth((.32-origX)/.25)*a.tail*.1;
  }
  if(kind==='winged'){const wing=smooth((Math.abs(origX-.5)-.1)/.30);y+=a.wings*wing*.22;x+=(origX-.5)*a.wings*wing*.12;}
  if(kind==='hover'){x+=Math.sin(origY*9)*a.cloth*.5;y+=Math.sin(origX*7)*a.tail*.12;}
  if(kind==='rooted'){x+=Math.sin(origY*5)*a.tail*(1-origY)*.25;}
  x+=a.cloth*Math.sin(origY*10)*(1-smooth((origY-.65)/.28))*outer;
  const r=rotate(.5+(x-.5)*a.sx,.9+(y-.9)*a.sy,.5,.90,a.angle);return [r[0]+a.x,r[1]+a.y];
 }
 function triangle(g,im,s,d,w,h){
  const [s0,s1,s2]=s,[d0,d1,d2]=d,den=(s1[0]-s0[0])*(s2[1]-s0[1])-(s2[0]-s0[0])*(s1[1]-s0[1]);
  if(Math.abs(den)<1e-8)return;
  const ux=((d1[0]-d0[0])*(s2[1]-s0[1])-(d2[0]-d0[0])*(s1[1]-s0[1]))/den,
   vx=((d2[0]-d0[0])*(s1[0]-s0[0])-(d1[0]-d0[0])*(s2[0]-s0[0]))/den,
   uy=((d1[1]-d0[1])*(s2[1]-s0[1])-(d2[1]-d0[1])*(s1[1]-s0[1]))/den,
   vy=((d2[1]-d0[1])*(s1[0]-s0[0])-(d1[1]-d0[1])*(s2[0]-s0[0]))/den;
  // A subpixel overlap prevents hairline cracks between antialiased triangles.
  const cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3,clip=d.map(q=>{const dx=q[0]-cx,dy=q[1]-cy,k=.35/Math.max(1,Math.hypot(dx,dy));return [q[0]+dx*k,q[1]+dy*k];});
  g.save();g.beginPath();g.moveTo(...clip[0]);g.lineTo(...clip[1]);g.lineTo(...clip[2]);g.closePath();g.clip();g.transform(ux,uy,vx,vy,d0[0]-ux*s0[0]-vx*s0[1],d0[1]-uy*s0[0]-vy*s0[1]);g.drawImage(im,0,0,w,h);g.restore();
 }
 function draw(g,im,kind,action,phase,seed=0,steps=8){
  const w=im.width,h=im.height,a=pose(kind,action,phase,seed),points=[];
  for(let y=0;y<=steps;y++)for(let x=0;x<=steps;x++){const q=vertex(x/steps,y/steps,kind,a);points.push([q[0]*w,q[1]*h]);}
  g.save();g.globalAlpha*=a.alpha;g.imageSmoothingEnabled=true;
  for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){
   const i=y*(steps+1)+x,src=[[x*w/steps,y*h/steps],[(x+1)*w/steps,y*h/steps],[(x+1)*w/steps,(y+1)*h/steps],[x*w/steps,(y+1)*h/steps]],dst=[points[i],points[i+1],points[i+steps+2],points[i+steps+1]];
   triangle(g,im,[src[0],src[1],src[2]],[dst[0],dst[1],dst[2]],w,h);triangle(g,im,[src[0],src[2],src[3]],[dst[0],dst[2],dst[3]],w,h);
  }g.restore();return a;
 }
 function secondary(kind,action,t,seed=0){const q=Math.sin(t*2.7+seed*.61),fly=['winged','hover'].includes(kind);return {x:q*.18,y:fly?q*.55:0,angle:q*(action==='run'||action==='walk'?.002:.004),sy:1+q*.003};}
 return {kind,pose,vertex,draw,secondary,pulse,clamp};
})();
if(typeof module!=='undefined')module.exports=MotionRig;

/* Dedicated enemy action sheets, with static-art motion and native fallbacks. */
const EnemyArtwork = (() => {
  const images = new Map(), frames = new Map(), poses = new Map(), actors = new WeakMap();
  let posePixels=0;const metrics={hits:0,misses:0,masks:0};
  function discardPose(key){const f=poses.get(key);if(f){posePixels-=f.pixels;poses.delete(key);for(const [k,v]of frames)if(v.poseKey===key)frames.delete(k);}}
  const hasSheet=type=>!!(ENEMY_ART_MANIFEST[type]?.action_sheet||(typeof MOTION86!=='undefined'&&MOTION86.enemies[type]));
  const actions = ['idle','walk','windup','attack','hurt','death'];
  function profile(type) {
    const d=ETYPES[type];
    if (d.totem) return 'rooted';
    if (/ooze|slime|blob|splitter|dewblob/.test(type)) return 'ooze';
    if (eFloats(type)||d.fly||PXA.mobs.FLOAT[type]) return /bat|hornet|moth|crow|raven|owl/.test(type)?'winged':'hover';
    if (d.heavy||d.boss) return 'heavy';
    return RANGED[type]?'caster':'walker';
  }
  function load(type) {
    const entry = ENEMY_ART_MANIFEST[type]; if (!entry) return null;
    if (images.has(type)) {
      const image = images.get(type); images.delete(type); images.set(type,image); return image;
    }
    const image = new Image(); images.set(type,image);
    if (images.size > 48) images.delete(images.keys().next().value);
    image.onload = () => {
      for (const key of frames.keys()) if (key.startsWith(type+'|')) frames.delete(key);
      for (const key of poses.keys()) if (key.startsWith(type+'|')) discardPose(key);
      const d = Object.getOwnPropertyDescriptor(SPR.enemy,type);
      if (d && !d.get && !hasSheet(type)) for (let i=0;i<5;i++) SPR.rq.push([type,i]);
      // Bound decoded atlas memory as well as the number of cached enemies.
      let pixels=0;for(const im of images.values())pixels+=im.naturalWidth*im.naturalHeight;
      for(const [key,im] of images){if(pixels<=32*1024*1024)break;if(im===image)continue;pixels-=im.naturalWidth*im.naturalHeight;images.delete(key);}
    };
    image.enemySheet=entry.action_sheet||null;
    image.onerror=()=>{if(image.enemySheet){image.enemySheet=null;image.src=entry.src;}};
    image.src = image.enemySheet?.src || entry.src;
    return image;
  }
  function pose(type,action,index) {
    if (!actions.includes(action)) return null;
    const K=PXA_K||1, size=Math.round(eSz(type));
    const available=images.get(type)?.enemySheet?.animations[action]?.frames||6;
    index=Math.max(0,Math.min(available-1,Math.floor(index)));
    const key=[type,action,index,K].join('|');
    if (poses.has(key)) {metrics.hits++;const record=poses.get(key);poses.delete(key);poses.set(key,record);return record;}
    const image=images.get(type);
    if (!image || !image.complete || !image.naturalWidth) return null;
    metrics.misses++;
    const sheet=image.enemySheet;
    const c=document.createElement('canvas');c.width=c.height=Math.round(size*K);
    const g=c.getContext('2d'), p=index/5, cycle=index/6*Math.PI*2, wave=Math.sin(Math.PI*p), kind=profile(type);
    const floating=kind==='hover'||kind==='winged', heavy=kind==='heavy'||kind==='rooted';
    const fit=.76, scale=fit*size*K/Math.max(image.width,image.height), w=image.width*scale,h=image.height*scale;
    const bottom=floating?size*.5*K+h/2:size*.94*K;
    let sx=1,sy=1,dx=0,dy=0,angle=0,alpha=1;
    if(action==='idle'){sy+=Math.sin(cycle)*.018;sx-=Math.sin(cycle)*.006;dy=floating?Math.sin(cycle)*size*K*.025:0;}
    if(action==='walk'){
      const stride=Math.sin(cycle);angle=stride*(heavy?.018:.045);dy=-Math.abs(stride)*size*K*(floating?.025:.018);
      if(kind==='ooze'){sx+=stride*.07;sy-=stride*.06;}
      else if(kind==='winged'){sx+=stride*.08;sy-=stride*.045;}
      else sy+=stride*(heavy?.012:.025);
    }
    if(action==='windup'){dx=-size*K*.018*wave;sy-=wave*.055;sx+=wave*.035;angle=-wave*(heavy?.025:.07);}
    if(action==='attack'){dx=size*K*.025*wave;dy=-size*K*.015*wave;angle=wave*(heavy?.035:.06);sx+=wave*.045;sy-=wave*.025;}
    if(action==='hurt'){dx=-size*K*.025*(1-p);angle=-(heavy?.04:.10)*(1-p);sx+=wave*.04;sy-=wave*.05;}
    if(action==='death'){alpha=1-p;sy=1-p*(floating?.38:.65);sx=1+p*.10;angle=(floating?.12:.20)*p;dy=floating?-size*K*p*.05:0;}
    g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
    if(sheet){
      if(ENEMY_ART_MANIFEST[type].filter)g.filter=ENEMY_ART_MANIFEST[type].filter;
      const a=sheet.animations[action],cellW=sheet.cell_width,cellH=sheet.cell_height;
      const bounds=sheet.bounds,span=Math.max(bounds[2]-bounds[0],bounds[3]-bounds[1]);
      // Fit asymmetric weapons/tails around the shared anchor as well as the
      // overall bounds. A wide pose must not push its opposite edge off-canvas.
      const radius=Math.max(1,sheet.anchor[0]-bounds[0],bounds[2]-sheet.anchor[0]);
      const s=Math.min(.76*size*K/span,.46*size*K/radius,
        floating?Infinity:.90*size*K/Math.max(1,sheet.anchor[1]-bounds[1]),
        floating?Infinity:.04*size*K/Math.max(1,bounds[3]-sheet.anchor[1]));
      const x=c.width/2-sheet.anchor[0]*s;
      const y=floating?c.height/2-(bounds[1]+bounds[3])/2*s:size*.94*K-sheet.anchor[1]*s;
      g.drawImage(image,index*cellW,a.row*cellH,cellW,cellH,x,y,cellW*s,cellH*s);g.filter='none';
    }else{
    g.save();g.globalAlpha=alpha;g.translate(c.width/2+dx,bottom+dy);g.rotate(angle);g.scale(sx,sy);
    // Horizontal bands add a small stride/wing ripple without cutting out limbs.
    if(action==='walk'&&!heavy){
      const bands=12;
      for(let i=0;i<bands;i++){
        const y0=Math.floor(i*image.height/bands),y1=Math.floor((i+1)*image.height/bands),q=(i+.5)/bands;
        const ripple=Math.sin(cycle+q*Math.PI*2)*size*K*.012*(floating?1-q:q*q);
        g.drawImage(image,0,y0,image.width,y1-y0,-w/2+ripple,-h+y0*scale,w,(y1-y0)*scale+.2*K);
      }
    }else g.drawImage(image,-w/2,-h,w,h);
    g.restore();
    }
    if(action==='hurt'){g.globalCompositeOperation='source-atop';g.fillStyle=`rgba(255,245,230,${.65*(1-p)})`;g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';}
    if(action==='windup'){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,145,95,.2)';g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';}
    c.k=K;c.px=0;
    const silhouette=color=>{const s=document.createElement('canvas');s.width=c.width;s.height=c.height;const sg=s.getContext('2d');sg.drawImage(c,0,0);sg.globalCompositeOperation='source-atop';sg.fillStyle=color;sg.fillRect(0,0,s.width,s.height);s.k=K;s.px=0;return s;};
    // Silhouettes describe the creature, not its soft ground shadow.
    // The direct sheet path normally needs only the colour frame. Allocate
    // silhouettes when a facing, warning or legacy renderer actually uses one.
    const masks={};
    if (!floating && action!=='death') {
      g.save();g.globalCompositeOperation='destination-over';
      const x=c.width/2,y=size*.94*K,rx=Math.max(3,size*.20)*K,ry=Math.max(1.2,size*.055)*K;
      g.translate(x,y);g.scale(1,ry/rx);const grad=g.createRadialGradient(0,0,0,0,0,rx);
      grad.addColorStop(0,'rgba(5,4,12,.45)');grad.addColorStop(1,'rgba(5,4,12,0)');g.fillStyle=grad;g.beginPath();g.arc(0,0,rx,0,Math.PI*2);g.fill();g.restore();
    }
    const record={img:c,external:true,dedicated:!!sheet,action,index,profile:kind,pixels:c.width*c.height,poseKey:key};
    for(const [name,col]of [['flash','#ffffff'],['dark','#140a1e'],['heat','#ff2a1e']])Object.defineProperty(record,name,{enumerable:true,get(){if(name==='heat'&&action!=='windup')return null;if(!masks[name]){masks[name]=silhouette(col);metrics.masks++;const pixels=c.width*c.height;record.pixels+=pixels;if(poses.has(key))posePixels+=pixels;}return masks[name];}});
    poses.set(key,record);posePixels+=record.pixels;
    while(poses.size>1&&(poses.size>640||posePixels>16*1024*1024))discardPose(poses.keys().next().value);
    return record;
  }
  function frame(type,index) {
    const key=[type,index,PXA_K||1,SPR.keyPh].join('|');if(frames.has(key))return frames.get(key);
    const record=pose(type,index===4?'windup':'walk',index===4?3:Math.round(index*1.5));if(!record)return null;
    // The legacy cache expects masks only on its first movement frame.
    const result={img:record.img,external:true,dedicated:record.dedicated,poseKey:record.poseKey,flash:index===0?record.flash:null,dark:index===0?record.dark:null};frames.set(key,result);
    if (frames.size>256) frames.delete(frames.keys().next().value);
    return result;
  }
  function actor(e){let a=actors.get(e);if(!a){a={attack:-Infinity,hit:-Infinity,moving:false,wind:false,windAt:gtime,ai:e.ai,st:e.st};actors.set(e,a);}return a;}
  function attack(e){const a=actor(e);if(gtime-a.attack>.55)a.attack=gtime;}
  function hit(e){actor(e).hit=gtime;}
  function update(e,sp,fired){
    const a=actor(e),wind=eWind(e,ETYPES[e.type]),charge=e.st==='charge'||e.st==='dash';
    if((fired&&!wind)||(a.wind&&!wind)||(charge&&a.st!==e.st)||(e.ai>a.ai+.2&&!wind))attack(e);
    if(wind&&!a.wind)a.windAt=gtime;
    a.wind=wind;a.ai=e.ai;a.st=e.st;a.moving=sp>1&&!e.under;
  }
  function state(e,wind){
    const a=actor(e),speed=Math.max(.5,Math.min(2,e.spd/70)),loop=(gtime*(profile(e.type)==='heavy'?1.1:1.8)*speed+e.seed)%1;
    if(e.frzT>0)return {action:'idle',phase:0};
    if(gtime-a.hit<.22)return {action:'hurt',phase:(gtime-a.hit)/.22};
    if(wind)return {action:'windup',phase:Math.min(.98,Math.max(0,(gtime-a.windAt)/.7))};
    if(gtime-a.attack<.42)return {action:'attack',phase:(gtime-a.attack)/.42};
    return {action:a.moving?'walk':'idle',phase:loop};
  }
  function draw(g,e,o){
    const s=state(e,o.wind),count=ENEMY_ART_MANIFEST[e.type]?.action_sheet?.animations[s.action]?.frames||6,f=pose(e.type,s.action,Math.floor(s.phase*count));
    if(!f){load(e.type);return false;}
    const width=o.dw*(o.vf?.9:1);
    g.save();g.translate(e.x+o.jx,o.by);g.rotate(o.tilt);g.scale(e.face<0?-1:1,1);
    g.drawImage(f.img,-width/2,-o.dh-o.bob,width,o.dh);
    if(o.vf<0&&s.action!=='hurt'){g.globalAlpha*=.2;g.drawImage(f.dark,-width/2,-o.dh-o.bob,width,o.dh);}
    if(f.heat){g.globalAlpha*=.22+.08*Math.sin(gtime*22+e.seed);g.drawImage(f.heat,-width/2,-o.dh-o.bob,width,o.dh);}
    g.restore();return true;
  }
  function death(g,c){
    // Preserve the special boss, hush and mimic death choreography.
    if(['b36','hush','gift45'].includes(c.s))return false;
    const u=Math.min(1,c.t/c.d),count=ENEMY_ART_MANIFEST[c.k]?.action_sheet?.animations.death.frames||6,f=pose(c.k,'death',Math.min(count-1,Math.floor(u*count)));if(!f)return false;
    const size=eSz(c.k)*c.sc;
    g.save();g.translate(c.x,c.y+size/2);g.scale(c.f,1);g.globalAlpha*=1-u;
    g.drawImage(f.img,-size/2,-size,size,size);
    if(u>.15){g.fillStyle=ETYPES[c.k].puff||'#c8b6ff';for(let i=0;i<6;i++){const a=i*Math.PI/3+c.sd;g.fillRect(Math.cos(a)*size*u*.4,-size*.35+Math.sin(a)*size*u*.25,2,2);}}
    g.restore();return true;
  }
  function stats(){return {...metrics,poses:poses.size,posePixels,images:images.size,legacyFrames:frames.size};}
  return {load,frame,pose,profile,track:actor,update,attack,hit,state,draw,death,actions,hasSheet,stats,types:Object.keys(ENEMY_ART_MANIFEST)};
})();

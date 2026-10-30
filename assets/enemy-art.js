/* Static ZIP designs, with cached procedural motion and native-art fallback. */
const EnemyArtwork = (() => {
  const images = new Map(), frames = new Map();
  function load(type) {
    const entry = ENEMY_ART_MANIFEST[type]; if (!entry) return null;
    if (images.has(type)) {
      const image = images.get(type); images.delete(type); images.set(type,image); return image;
    }
    const image = new Image(); images.set(type,image);
    if (images.size > 48) images.delete(images.keys().next().value);
    image.onload = () => {
      for (const key of frames.keys()) if (key.startsWith(type+'|')) frames.delete(key);
      const d = Object.getOwnPropertyDescriptor(SPR.enemy,type);
      if (d && !d.get) for (let i=0;i<5;i++) SPR.rq.push([type,i]);
    };
    image.src = entry.src;
    return image;
  }
  function frame(type,index) {
    const image=images.get(type);
    if (!image || !image.complete || !image.naturalWidth) return null;
    const K=PXA_K||1, size=Math.round(eSz(type));
    const key=[type,index,K,SPR.keyPh].join('|');
    if (frames.has(key)) return frames.get(key);
    const c=document.createElement('canvas');c.width=c.height=Math.round(size*K);
    const g=c.getContext('2d'), wind=index===4, phase=(index%4)*Math.PI/2;
    const floating=eFloats(type)||!!PXA.mobs.FLOAT[type];
    const pulse=wind?1.015:1+Math.sin(phase)*.012;
    const fit=floating?.80:.84, scale=fit*size*K/Math.max(image.width,image.height);
    const w=image.width*scale,h=image.height*scale*pulse;
    const bob=wind?0:Math.sin(phase)*Math.min(1.2,size*.025);
    const bottom=floating?size*.50*K+h/2+bob*K:size*.94*K-Math.abs(bob)*K;
    g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
    g.drawImage(image,(c.width-w)/2+(wind?size*.015*K:0),bottom-h,w,h);
    if (wind) {g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,210,145,.22)';g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';}
    c.k=K;c.px=0;
    const silhouette=color=>{const s=document.createElement('canvas');s.width=c.width;s.height=c.height;const sg=s.getContext('2d');sg.drawImage(c,0,0);sg.globalCompositeOperation='source-atop';sg.fillStyle=color;sg.fillRect(0,0,s.width,s.height);s.k=K;s.px=0;return s;};
    // Silhouettes describe the creature, not its soft ground shadow.
    const flash=index===0?silhouette('#ffffff'):null,dark=index===0?silhouette('#140a1e'):null;
    if (!floating) {
      g.save();g.globalCompositeOperation='destination-over';
      const x=c.width/2,y=size*.94*K,rx=Math.max(3,size*.20)*K,ry=Math.max(1.2,size*.055)*K;
      g.translate(x,y);g.scale(1,ry/rx);const grad=g.createRadialGradient(0,0,0,0,0,rx);
      grad.addColorStop(0,'rgba(5,4,12,.45)');grad.addColorStop(1,'rgba(5,4,12,0)');g.fillStyle=grad;g.beginPath();g.arc(0,0,rx,0,Math.PI*2);g.fill();g.restore();
    }
    const record={img:c,flash,dark,external:true};frames.set(key,record);
    if (frames.size>256) frames.delete(frames.keys().next().value);
    return record;
  }
  return {load,frame,types:Object.keys(ENEMY_ART_MANIFEST)};
})();

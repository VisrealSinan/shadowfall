/* Palette variants of the current actor sheets. Original frames, alpha and animation stay intact. */
const ActorOutfits = (() => {
  const frames = new Map(), profiles = new WeakMap();
  const LIMIT = 96; // At 256px this bounds outfit-frame pixels to roughly 24 MiB.
  function rgb(hex) { return [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255); }
  function hsl(r,g,b) {
    const hi=Math.max(r,g,b),lo=Math.min(r,g,b),d=hi-lo,l=(hi+lo)/2;
    if(!d)return [0,0,l];
    let h=hi===r?(g-b)/d+(g<b?6:0):hi===g?(b-r)/d+2:(r-g)/d+4;
    return [h/6,d/(1-Math.abs(2*l-1)),l];
  }
  function color(h,s,l) {
    const a=s*Math.min(l,1-l),f=n=>{const k=(n+h*12)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1));};
    return [f(0)*255,f(8)*255,f(4)*255];
  }
  const distance=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));
  function canvas(w,h) { const c=document.createElement('canvas');c.width=w;c.height=h;return c; }
  function profile(im,v) {
    if(profiles.has(im))return profiles.get(im);
    const c=canvas(v.cell_width,v.cell_height),g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(im,0,v.animations.idle.row*v.cell_height,c.width,c.height,0,0,c.width,c.height);
    const data=g.getImageData(0,0,c.width,c.height).data,bins=new Float64Array(36);
    let top=c.height,bottom=0;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>40){top=Math.min(top,y);bottom=Math.max(bottom,y);}
    for(let y=Math.floor(top+(bottom-top)*.4);y<bottom;y++)for(let x=0;x<c.width;x++){
      const i=(y*c.width+x)*4;if(data[i+3]<80)continue;
      const [h,s,l]=hsl(data[i]/255,data[i+1]/255,data[i+2]/255);
      // Gold trim and warm skin do not decide the primary fabric hue.
      if(s>.2&&l>.04&&l<.85&&!(h<.15&&l>.38))bins[Math.floor(h*36)%36]+=s*(1-l);
    }
    let best=0;for(let i=1;i<36;i++)if(bins[i]>bins[best])best=i;
    const result={hue:(best+.5)/36,hasColor:bins[best]>0,tintFur:v.src.includes('bearlina')};profiles.set(im,result);return result;
  }
  function recolor(data,width,height,source,armor) {
    const main=hsl(...rgb(armor.cloak)),trim=hsl(...rgb(armor.trim)),shadow=hsl(...rgb(armor.cloak2));
    let top=height,bottom=0;
    for(let i=0;i<data.length;i+=4)if(data[i+3]>40){const y=Math.floor(i/4/width);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    for(let i=0;i<data.length;i+=4){
      if(!data[i+3])continue;
      const r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255,[h,s,l]=hsl(r,g,b);
      const head=Math.floor(i/4/width)<top+(bottom-top)*.26;
      if(!source.tintFur&&(head||(h>.02&&h<.095&&l>.38)))continue;
      const match=source.hasColor&&s>.16&&distance(h,source.hue)<.12;
      const dark=s<.2&&l<.25;
      // Preserve face, hair and uncolored highlights; dye fabric and its metallic edging.
      const gold=h>.09&&h<.18&&s>.45&&l>.22;
      if(!match&&!dark&&!gold)continue;
      const target=gold&&!match?trim:main;
      const shade=l<.18?shadow:target;
      const light=Math.max(.025,Math.min(.93,l*.6+target[2]*Math.sqrt(l)*.65));
      const out=color(shade[0],Math.min(.9,shade[1]*.85+s*.15),light);
      for(let k=0;k<3;k++)data[i+k]=Math.round(out[k]);
    }
    return data;
  }
  function frame(im,v,f,armor) {
    const key=[v.src,f.row,f.column,armor.id,armor.cloak,armor.cloak2,armor.trim].join('|');
    if(frames.has(key)){const c=frames.get(key);frames.delete(key);frames.set(key,c);return c;}
    const c=canvas(v.cell_width,v.cell_height),g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(im,f.column*v.cell_width,f.row*v.cell_height,c.width,c.height,0,0,c.width,c.height);
    const pixels=g.getImageData(0,0,c.width,c.height);
    recolor(pixels.data,c.width,c.height,profile(im,v),armor);g.putImageData(pixels,0,0);
    frames.set(key,c);while(frames.size>LIMIT)frames.delete(frames.keys().next().value);
    return c;
  }
  return {frame,recolor,hsl,cacheSize:()=>frames.size,clear:()=>frames.clear()};
})();
if(typeof module!=='undefined')module.exports=ActorOutfits;

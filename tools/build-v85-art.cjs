/* Record atlas regions without altering generated source pixels. */
const fs=require('fs'),path=require('path');let canvas;
try{canvas=require('@napi-rs/canvas');}catch{canvas=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const atlases={
 graveshade:{src:'assets/graveshade-races.png',cols:4,rows:4},
 paired:{src:'assets/paired-survivor-races.png',cols:4,rows:4},
 forms:{src:'assets/druid-form-races.png',cols:4,rows:4},
 vendors:{src:'assets/vendors-modern.png',cols:3,rows:2},
 summons:{src:'assets/summons-modern.png',cols:3,rows:2},
 vistas:{src:'assets/map-vistas-modern.png',cols:3,rows:4},
 ground:{src:'assets/world-materials-modern.png',cols:3,rows:4},
 props:{src:'assets/world-props-modern.png',cols:3,rows:4}
};
(async()=>{
 for(const [name,a]of Object.entries(atlases)){
  const im=await canvas.loadImage(a.src),c=canvas.createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);const data=g.getImageData(0,0,c.width,c.height).data;a.width=im.width;a.height=im.height;a.regions=[];
  for(let row=0;row<a.rows;row++)for(let col=0;col<a.cols;col++){
   const x0=Math.round(col*im.width/a.cols),y0=Math.round(row*im.height/a.rows),x1=Math.round((col+1)*im.width/a.cols),y1=Math.round((row+1)*im.height/a.rows);
   let l=x1,t=y1,r=x0,b=y0;
   if(name==='vistas'||name==='ground'){l=x0;t=y0;r=x1-1;b=y1-1;}
   else for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*c.width+x)*4+3]>40){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
   if(r<l||b<t)throw Error('Empty generated region '+name+' '+row+' '+col);
   a.regions.push([l,t,r-l+1,b-t+1]);
  }
 }
 const result={atlases,races:['cat','elf','ogre','dwarf','troll','kitsune','scale','shade'],maps:['forest','castle','heart','cellar','valor','glade','inferno','hollow','moonpatch','neural'],vendors:['merchant','gambler','smith','stranger','shrine'],summons:['shade','archer','brute','hound','imp','colossus']};
 fs.writeFileSync('assets/art-v85-manifest.js','/* Generated sprite regions; atlas source pixels are preserved. */\nconst ART_V85 = '+JSON.stringify(result)+';\n');console.log('Recorded eight atlases with map, character, summon, vendor and prop regions.');
})().catch(e=>{console.error(e);process.exitCode=1;});

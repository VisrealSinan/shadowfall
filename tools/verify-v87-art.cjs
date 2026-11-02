/* Inspect shipped source regions using software canvas; no desktop access. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');let C;try{C=require('@napi-rs/canvas');}catch{C=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const {run}=require('./smoke-game.cjs'),atlases=JSON.parse(run('JSON.stringify(ART_V87.atlases)'));
(async()=>{
 const cv=C.createCanvas(1200,1830),g=cv.getContext('2d');g.fillStyle='#172326';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#e5debc';g.font='22px Georgia';g.fillText('Shadowfall v87 · shipped art crops',24,30);
 let row=0;
 for(const [key,a]of Object.entries(atlases)){
  const im=await C.loadImage(a.src),raw=C.createCanvas(im.width,im.height),rg=raw.getContext('2d');rg.drawImage(im,0,0);const d=rg.getImageData(0,0,im.width,im.height).data;
  if(!a.opaque){assert.ok(d[3]<8,key+' transparent background');for(const r of a.regions)assert.ok(r[0]>0&&r[1]>0&&r[0]+r[2]<im.width&&r[1]+r[3]<im.height,key+' source-edge crop');}
  g.fillStyle='#c5c2ad';g.font='14px system-ui';g.fillText(key,24,56+row*142);
  a.regions.forEach((r,i)=>{const x=20+(i%12)*98,y=64+(row+Math.floor(i/12))*142,k=Math.min(90/r[2],110/r[3]);g.fillStyle='#253438';g.fillRect(x,y,92,114);g.drawImage(im,...r,x+(92-r[2]*k)/2,y+(114-r[3]*k)/2,r[2]*k,r[3]*k);});row+=Math.ceil(a.regions.length/12);
 }
 // Check complete Graveshade idle poses at their actual portrait transform.
 const variants=JSON.parse(run(`JSON.stringify(Object.values(MOTION86.actors).filter(v=>v.key.startsWith('myers/')))`));
 const portraits=C.createCanvas(16*80,130),pg=portraits.getContext('2d');pg.fillStyle='#172326';pg.fillRect(0,0,portraits.width,portraits.height);
 for(const [i,v]of variants.entries()){
  const im=await C.loadImage(v.src),p=JSON.parse(run('JSON.stringify(Polish87.portraitLayout(72,100,'+JSON.stringify(v)+'))')),s=76/v.cell_height*v.display_scale,frame=C.createCanvas(72,100),fg=frame.getContext('2d');fg.translate(p.x,p.y);fg.scale(p.scale,p.scale);fg.drawImage(im,0,0,256,256,-v.anchor[0]*s,18-v.anchor[1]*s,256*s,256*s);
  const d=fg.getImageData(0,0,72,100).data;for(let y=0;y<100;y++)for(let x=0;x<72;x++)if(x<2||x>69||y<2||y>97)assert.ok(d[(y*72+x)*4+3]<16,'portrait edge '+v.key);pg.drawImage(frame,i*80+4,5);pg.fillStyle='#e5debc';pg.font='8px system-ui';pg.fillText(v.key.split('/')[1],i*80+4,119);
 }
 fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/art-v87-contact.png',cv.toBuffer('image/png'));fs.writeFileSync('artifacts/graveshade-v87-contact.png',portraits.toBuffer('image/png'));console.log('Verified 120 art regions and '+variants.length+' complete Graveshade portraits.');
})().catch(e=>{console.error(e);process.exitCode=1;});

const fs=require('fs'),path=require('path');let C;try{C=require('@napi-rs/canvas');}catch{C=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const specs={martial:{src:'assets/skill-art-martial-v87.png',cols:4,rows:6,opaque:true},arcane:{src:'assets/skill-art-arcane-v87.png',cols:4,rows:6,opaque:true},wilds:{src:'assets/skill-art-wilds-v87.png',cols:4,rows:6,opaque:true},boons:{src:'assets/skill-art-boons-v87.png',cols:4,rows:6,opaque:true},shops:{src:'assets/town-shops-v87.png',cols:3,rows:4},props0:{src:'assets/world-props-strip-0-v87.png',cols:4,rows:1},props1:{src:'assets/world-props-strip-1-v87.png',cols:4,rows:1},props2:{src:'assets/world-props-strip-2-v87.png',cols:4,rows:1}};
(async()=>{for(const [name,a]of Object.entries(specs)){
 const im=await C.loadImage(a.src),cv=C.createCanvas(im.width,im.height),g=cv.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,cv.width,cv.height).data;a.width=im.width;a.height=im.height;
 let xs=Array.from({length:a.cols+1},(_,i)=>Math.round(i*im.width/a.cols)),ys=Array.from({length:a.rows+1},(_,i)=>Math.round(i*im.height/a.rows));
 if(name.startsWith('props'))for(let j=1;j<a.cols;j++){
  const ideal=xs[j],radius=Math.floor(im.width/a.cols*.15);let best=Infinity,chosen=ideal;
  for(let x=ideal-radius;x<=ideal+radius;x++){let n=0;for(let y=0;y<im.height;y++)if(d[(y*im.width+x)*4+3]>24)n++;const score=n*1000+Math.abs(x-ideal);if(score<best){best=score;chosen=x;}}
  if(best>=1000)throw Error(name+' has overlapping props at column '+j);xs[j]=chosen;
 }
 // Find the dark gutters in every icon sheet; painted rows vary in height.
 // Uniform slicing can leak the next illustration into the bottom of a tile.
 if(a.opaque)for(let j=1;j<a.rows;j++){
  const ideal=ys[j],radius=Math.floor(im.height/a.rows*.35);let best=Infinity,chosen=ideal;
  for(let y=ideal-radius;y<=ideal+radius;y++){let n=0;for(let x=0;x<im.width;x+=3){const i=(y*im.width+x)*4;n+=d[i]+d[i+1]+d[i+2];}const score=n+Math.abs(y-ideal)*.05;if(score<best){best=score;chosen=y;}}ys[j]=chosen;
 }
 a.regions=[];for(let row=0;row<a.rows;row++)for(let col=0;col<a.cols;col++){
  const x0=xs[col],x1=xs[col+1],y0=ys[row],y1=ys[row+1];let l=x1,t=y1,r=x0,b=y0;
  if(a.opaque){l=x0+3;t=y0+3;r=x1-4;b=y1-4;}else{
   for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(d[(y*im.width+x)*4+3]>32){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
   if(r<l||b<t)throw Error(name+' empty cell');
   if(name.startsWith('props')&&(l===0||r===im.width-1||t===0||b===im.height-1))throw Error(name+' cropped sprite '+col);
  }a.regions.push([l,t,r-l+1,b-t+1]);
 }
 console.log(name+' '+a.regions.length+' complete regions');
}fs.writeFileSync('assets/art-v87-manifest.js','/* Actual source regions for the v87 painted icon, shop and complete prop art. */\nconst ART_V87='+JSON.stringify({atlases:specs})+';\n');})().catch(e=>{console.error(e);process.exitCode=1;});

/* Pixel QA: real decoding, alpha bounds and distinct poses, not metadata alone. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');let C;try{C=require('@napi-rs/canvas');}catch{C=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('assets/motion86-manifest.js','utf8')+';this.m=MOTION86;',c);
(async()=>{let sheets=0,frames=0;const failures=[];for(const group of ['actors','forms','enemies','summons','vendors'])for(const [key,s]of Object.entries(c.m[group])){
 const im=await C.loadImage(s.src),cv=C.createCanvas(s.cell_width,s.cell_height),g=cv.getContext('2d');if(im.width!==s.columns*s.cell_width||im.height!==s.rows*s.cell_height)failures.push(key+' dimensions');
 for(const [action,a]of Object.entries(s.animations)){
  const hashes=new Set();for(let f=0;f<a.frames;f++){
   g.clearRect(0,0,cv.width,cv.height);g.drawImage(im,f*cv.width,a.row*cv.height,cv.width,cv.height,0,0,cv.width,cv.height);const d=g.getImageData(0,0,cv.width,cv.height).data;hashes.add(crypto.createHash('sha256').update(d).digest('hex'));let count=0,edge=0;
   for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++)if(d[(y*cv.width+x)*4+3]>24){count++;if(x===0||y===0||x===cv.width-1||y===cv.height-1)edge++;}
   if(edge)failures.push(key+' '+action+' '+f+' clipped');if(!count&&action!=='death'&&!(action==='spawn'&&f===0))failures.push(key+' '+action+' '+f+' empty');frames++;
  }if(hashes.size<4)failures.push(key+' '+action+' repeated poses');
 }sheets++;if(sheets%25===0)console.log('Decoded '+sheets+' sheets');await new Promise(r=>setImmediate(r));if(global.gc)global.gc();
 }fs.writeFileSync('artifacts/motion86-pixel-qa.json',JSON.stringify({sheets,frames,failures},null,2));if(failures.length)throw Error(failures.slice(0,12).join('\n')+'\n'+failures.length+' pixel failures');console.log(JSON.stringify({sheets,frames,clippedFrames:0,emptyRequiredFrames:0}));})().catch(e=>{console.error(e);process.exitCode=1;});

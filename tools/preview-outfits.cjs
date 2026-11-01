/* Render outfit QA with the real canvas engine; no browser or game saves required. */
const fs=require('fs'),path=require('path'),vm=require('vm');
let canvas;try{canvas=require('@napi-rs/canvas');}catch{canvas=require(path.resolve(path.dirname(process.execPath),'../node_modules/@napi-rs/canvas'));}
const {createCanvas,loadImage}=canvas;
const {run}=require('./smoke-game.cjs');
const ctx={document:{createElement:()=>createCanvas(1,1)}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('assets/actor-outfits.js','utf8')+'\nthis.outfits=ActorOutfits;',ctx);
(async()=>{
 const cls=process.argv[2]||'warlock',race=process.argv[3]||'elf',gender=process.argv[4]||'male';
 const v=JSON.parse(run(`JSON.stringify(ACTOR_ANIMATION_MANIFEST.variants[${JSON.stringify([cls,race,gender].join('/'))}])`));
 const outfits=JSON.parse(run(`JSON.stringify(ARMOR_SETS[${JSON.stringify(cls)}])`)),im=await loadImage(v.src);
 const width=(outfits.length+1)*150,out=createCanvas(width,260),g=out.getContext('2d');g.fillStyle='#140d22';g.fillRect(0,0,width,260);
 for(let i=0;i<=outfits.length;i++){
  const armor=outfits[i-1],f={row:v.animations.idle.row,column:0};const frame=armor?ctx.outfits.frame(im,v,f,armor):im;
  g.fillStyle='#251b36';g.fillRect(i*150+6,8,138,170);
  if(armor)g.drawImage(frame,0,0,v.cell_width,v.cell_height,i*150,8,150,150);else g.drawImage(im,0,f.row*v.cell_height,v.cell_width,v.cell_height,i*150,8,150,150);
  g.fillStyle='#eee3fc';g.font='bold 13px sans-serif';g.textAlign='center';const name=armor?armor.name:'Outfit colours';const words=name.split(' ');let line='',y=202;for(const word of words){const next=(line+' '+word).trim();if(g.measureText(next).width>140){g.fillText(line,i*150+75,y);y+=18;line=word;}else line=next;}g.fillText(line,i*150+75,y);
 }
 fs.mkdirSync('artifacts',{recursive:true});const dest=path.resolve('artifacts',`outfits-${cls}-${race}-${gender}.png`);fs.writeFileSync(dest,out.toBuffer('image/png'));console.log(dest);
})().catch(e=>{console.error(e);process.exitCode=1;});

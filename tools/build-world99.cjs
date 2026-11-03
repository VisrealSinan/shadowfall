const fs=require('fs'),path=require('path'),sharp=require(path.resolve(path.dirname(process.execPath),'../node_modules/sharp'));
const regions=[];
function bands(values){const out=[];for(const v of values){if(!out.length||v>out.at(-1)[1]+3)out.push([v,v]);else out.at(-1)[1]=v;}return out;}
async function extract(src,cols,rows,prefix,offset=0){
 const {data:d,info:m}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(d[3]>8)throw Error(src+' opaque background');
 // Use the actual transparent gutters: generated rows need not be evenly spaced.
 const ys=[];for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(d[(y*m.width+x)*4+3]>24){ys.push(y);break;}
 const ybands=bands(ys);if(ybands.length!==rows)throw Error(src+' unexpected row count '+ybands.length);
 for(let row=0;row<rows;row++){
  const [y0,y1]=ybands[row],xs=[];for(let x=0;x<m.width;x++)for(let y=y0;y<=y1;y++)if(d[(y*m.width+x)*4+3]>24){xs.push(x);break;}
  const xbands=bands(xs);if(xbands.length!==cols)throw Error(src+' unexpected column count in row '+row);
  for(let col=0;col<cols;col++){
   const [x0,x1]=xbands[col],i=offset+row*cols+col;
   if(x0<4||y0<4||x1>m.width-5||y1>m.height-5)throw Error(src+' clipped source '+i);
   const rect={left:x0-3,top:y0-3,width:x1-x0+7,height:y1-y0+7};
   const input=await sharp(src).extract(rect).resize(216,216,{fit:'inside'}).png().toBuffer(),meta=await sharp(input).metadata();
   await sharp({create:{width:256,height:256,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input,left:Math.round((256-meta.width)/2),top:240-meta.height}]).png().toFile('assets/'+prefix+i+'.png');
   regions.push({src,index:i,rect,output:'assets/'+prefix+i+'.png'});
  }
 }
}
(async()=>{
 await extract('handoffs/art99/propsA-fixed.png',5,5,'prop99-');
 await extract('handoffs/art99/propsB-fixed.png',5,5,'prop99-',25);
 const m=await sharp('handoffs/art99/propsB.png').metadata();
 const last=await sharp('handoffs/art99/propsB.png').extract({left:Math.round(m.width*5/6),top:Math.round(m.height*4/5),width:m.width-Math.round(m.width*5/6),height:m.height-Math.round(m.height*4/5)}).png().toBuffer();
 await sharp(last).trim({threshold:10}).resize(216,216,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).extend({top:24,bottom:16,left:20,right:20,background:{r:0,g:0,b:0,alpha:0}}).png().toFile('assets/prop99-50.png');
 await extract('handoffs/art99/units-fixed.png',4,4,'unit99-');
 const input=await sharp('handoffs/art99/hammer.png').trim({threshold:10}).resize(216,216,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
 await sharp({create:{width:256,height:256,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input,left:20,top:24}]).png().toFile('assets/unit99-15.png');
 fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/world99-crops.json',JSON.stringify(regions,null,2));
 console.log('Compiled 51 complete world props and 16 painted construct sprites.');
})().catch(e=>{console.error(e);process.exitCode=1});

/* Drawn action sets take priority; unfinished sheets use procedural motion. */
const ActorAnimations = (() => {
  const images = new Map();
  const variants = ACTOR_ANIMATION_MANIFEST.variants;
  const motionActions = {idle:2600, attack:420, casting:720, dodge:420};
  const motionStyles = {
    druid:{color:'#9df57b', lean:.10, lift:3},
    maestro:{color:'#3af0ff', lean:.07, lift:2},
    visage:{color:'#c8b8ff', lean:.15, lift:1},
    chrono:{color:'#7bcfff', lean:.06, lift:3}
  };
  function animation(v, action) {
    if (v.animations[action]) return v.animations[action];
    if (v.coverage === 'run-and-still' && motionActions[action]) {
      return {frames:1, frame_duration_ms:motionActions[action], loop:action === 'idle'};
    }
    return null;
  }
  function gender(cls, race) {
    return (save.spriteGender || {})[cls] || ((save.sex || {})[race || save.race] === 'f' ? 'female' : 'male');
  }
  function setGender(cls, race, sex) {
    save.spriteGender = save.spriteGender || {};
    save.spriteGender[cls] = sex;
    save.sex = save.sex || {};
    save.sex[race] = sex === 'female' ? 'f' : 'm';
  }
  function variant(o) {
    if (o.form) return null;
    const sex = o.cls === 'bearlina' ? 'bear-form' : (o.gender || gender(o.cls, o.race));
    return variants[[o.cls, o.race || save.race, sex].join('/')] || null;
  }
  function image(v) {
    if (images.has(v.src)) { const im = images.get(v.src); images.delete(v.src); images.set(v.src, im); return im; }
    const im = new Image(); images.set(v.src, im);
    // Bound decoded atlas memory; only visible/recent actors stay resident.
    // The class selector can display all 21 classes together. Retain enough
    // images for that view so load callbacks cannot cause eviction/reload loops.
    if (images.size > 32) images.delete(images.keys().next().value);
    im.onload = () => { if (state === 'select') renderSelect(); else if (state === 'race') renderRace(); };
    im.src = v.src;
    return im;
  }
  function cue(action) {
    const o = {cls:G.cls, race:G.race, form:G.form}, v = variant(o);
    if (!v || !animation(v, action)) return;
    const old = G.actorCue, a = old && animation(v, old.action);
    const priority = {attack:1, casting:2, dodge:3, ultimate:4};
    if (old && a && gtime < old.at + a.frames * a.frame_duration_ms / 1000 && priority[old.action] >= priority[action]) return;
    G.actorCue = {action, at:gtime};
  }
  function frame(o, v) {
    let action = o.moving ? 'run' : 'idle', elapsed = o.t || 0;
    const c = o.world && G.actorCue;
    if (c && animation(v, c.action)) {
      const a = animation(v, c.action), age = gtime - c.at;
      if (age >= 0 && age < a.frames * a.frame_duration_ms / 1000) { action = c.action; elapsed = age; }
    } else if (o.atk > 0 && animation(v, 'attack')) { action = 'attack'; elapsed = (1 - o.atk) * .6; }
    const procedural = v.coverage === 'run-and-still' && action !== 'run';
    const a = procedural ? {frames:1, frame_duration_ms:motionActions[action], loop:action === 'idle'} : v.animations[action];
    const duration = a.frames * a.frame_duration_ms / 1000;
    const phase = a.loop ? ((elapsed % duration) + duration) % duration / duration : Math.max(0, Math.min(1, elapsed / duration));
    if (procedural) return {action, row:v.animations.idle.row, column:0, procedural:true, phase};
    const n = Math.floor(elapsed * 1000 / a.frame_duration_ms);
    return {action, row:a.row, column:a.loop ? ((n % a.frames) + a.frames) % a.frames : Math.min(a.frames - 1, Math.max(0,n))};
  }
  function motion(g, cls, f) {
    const style = motionStyles[cls], p = f.phase, wave = Math.sin(Math.PI * p);
    // Feet remain anchored; these transforms never move the gameplay hitbox.
    g.translate(0,18);
    if (f.action === 'idle') { const breath = Math.sin(p * Math.PI * 2); g.scale(1 + breath*.006,1 + breath*.018); }
    if (f.action === 'attack') { g.translate((cls === 'maestro' ? -3 : 5)*wave,-wave); g.rotate(style.lean*wave); }
    if (f.action === 'casting') { g.translate(0,-style.lift*wave); g.rotate(Math.sin(p*Math.PI*2)*.035*wave); g.scale(1+wave*.025,1+wave*.025); }
    if (f.action === 'dodge') { g.translate(7*wave,0); g.rotate(-.12*wave); g.scale(1+wave*.09,1-wave*.16); }
    if (cls === 'visage' && f.action !== 'idle') g.globalAlpha *= 1-wave*.20;
    g.translate(0,-18);
  }
  function motionEffect(g, cls, f) {
    if (f.action === 'idle') return;
    const p = f.phase, wave = Math.sin(Math.PI*p), style = motionStyles[cls];
    if (wave <= 0) return;
    g.save(); g.globalAlpha *= wave*.65; g.strokeStyle = g.fillStyle = style.color; g.lineWidth = 1.4;
    if (f.action === 'dodge') {
      for (let i=0;i<3;i++) { g.beginPath(); g.moveTo(-20-i*3,-8+i*7); g.lineTo(-8-i*2,-8+i*7); g.stroke(); }
    } else if (f.action === 'attack') {
      g.beginPath(); g.arc(4,-14,17+wave*5,-1.1+p*.4,.5+p*.4); g.stroke();
    } else if (cls === 'maestro') {
      for (let i=0;i<5;i++) { const x=(i-2)*8, h=3+Math.abs(Math.sin(p*Math.PI*3+i))*9; g.fillRect(x-1,10-h,2,h); }
      g.beginPath(); g.ellipse(0,14,17+wave*7,5,0,0,Math.PI*2); g.stroke();
    } else if (cls === 'chrono') {
      const r=18+wave*4; g.beginPath(); g.arc(0,-13,r,p*2,p*2+Math.PI*1.6); g.stroke();
      for(let i=0;i<8;i++) { const a=i*Math.PI/4+p;g.beginPath();g.moveTo(Math.cos(a)*(r-3),-13+Math.sin(a)*(r-3));g.lineTo(Math.cos(a)*(r+1),-13+Math.sin(a)*(r+1));g.stroke(); }
    } else if (cls === 'druid') {
      for(let i=0;i<4;i++) { const a=i*Math.PI/2+p*3;g.beginPath();g.ellipse(Math.cos(a)*22,-10+Math.sin(a)*15,4,1.7,a,0,Math.PI*2);g.fill(); }
    } else {
      for(let i=0;i<3;i++) { g.beginPath();g.arc(0,-12,17+i*4,p*2+i,p*2+i+.9);g.stroke(); }
    }
    g.restore();
  }
  function draw(g, o) {
    const v = variant(o); if (!v) return false;
    const im = image(v); if (!im.complete || !im.naturalWidth) return false;
    const f = frame(o,v), k = (o.cls === 'bearlina' ? 88 : 76) / v.cell_height * (v.display_scale || 1);
    g.save(); g.imageSmoothingEnabled = false;
    if (o.outfit === 'ashen') g.filter = 'grayscale(.8)';
    else if (o.outfit === 'midnight') g.filter = 'hue-rotate(165deg) saturate(.8)';
    g.save();
    if (f.procedural && motionStyles[o.cls]) motion(g,o.cls,f);
    g.drawImage(im, f.column*v.cell_width, f.row*v.cell_height, v.cell_width, v.cell_height,
      -v.anchor[0]*k, 18-v.anchor[1]*k, v.cell_width*k, v.cell_height*k);
    g.restore();
    if (f.procedural && motionStyles[o.cls]) motionEffect(g,o.cls,f);
    g.restore(); return true;
  }
  return {variant, gender, setGender, frame, cue, draw};
})();

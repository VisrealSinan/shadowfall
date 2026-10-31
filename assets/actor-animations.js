/* Full action sets take priority; run-only drafts use a still idle pose. */
const ActorAnimations = (() => {
  const images = new Map();
  const variants = ACTOR_ANIMATION_MANIFEST.variants;
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
    if (!v || !v.animations[action]) return;
    const old = G.actorCue, a = old && v.animations[old.action];
    const priority = {attack:1, casting:2, dodge:3, ultimate:4};
    if (old && a && gtime < old.at + a.frames * a.frame_duration_ms / 1000 && priority[old.action] >= priority[action]) return;
    G.actorCue = {action, at:gtime};
  }
  function frame(o, v) {
    let action = o.moving ? 'run' : 'idle', elapsed = o.t || 0;
    const c = o.world && G.actorCue;
    if (c && v.animations[c.action]) {
      const a = v.animations[c.action], age = gtime - c.at;
      if (age >= 0 && age < a.frames * a.frame_duration_ms / 1000) { action = c.action; elapsed = age; }
    } else if (o.atk > 0 && v.animations.attack) { action = 'attack'; elapsed = (1 - o.atk) * .6; }
    const a = v.animations[action], n = Math.floor(elapsed * 1000 / a.frame_duration_ms);
    return {action, row:a.row, column:a.loop ? ((n % a.frames) + a.frames) % a.frames : Math.min(a.frames - 1, Math.max(0,n))};
  }
  function draw(g, o) {
    const v = variant(o); if (!v) return false;
    const im = image(v); if (!im.complete || !im.naturalWidth) return false;
    const f = frame(o,v), k = (o.cls === 'bearlina' ? 88 : 76) / v.cell_height;
    g.save(); g.imageSmoothingEnabled = false;
    if (o.outfit === 'ashen') g.filter = 'grayscale(.8)';
    else if (o.outfit === 'midnight') g.filter = 'hue-rotate(165deg) saturate(.8)';
    g.drawImage(im, f.column*v.cell_width, f.row*v.cell_height, v.cell_width, v.cell_height,
      -v.anchor[0]*k, 18-v.anchor[1]*k, v.cell_width*k, v.cell_height*k);
    g.restore(); return true;
  }
  return {variant, gender, setGender, frame, cue, draw};
})();

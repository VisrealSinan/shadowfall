/* Shared progression rules: deliberately independent of rendering and browser state. */
const ShadowExpansion = (() => {
  const LOST_EVERY = 500, FINAL_TIME = 900, HUNT_TIME = 180;
  const LOST = ['lost_hollow', 'lost_cinder', 'lost_veil'];
  function profile(save) {
    const p = save.shadowExpansion || (save.shadowExpansion = {});
    for (const k of ['clears', 'looks', 'best']) if (!p[k] || typeof p[k] !== 'object' || Array.isArray(p[k])) p[k] = {};
    p.shards = Math.max(0, Math.floor(Number(p.shards) || 0));
    return p;
  }
  function newRun(difficulty = 1) { return { difficulty: Math.max(1, Math.min(5, Math.floor(+difficulty || 1))), nextLost: LOST_EVERY, lostCount: 0, finalSpawned: false, finalDefeated: false, endless: false }; }
  function multipliers(t, difficulty = 1) { const d = Math.max(1, Math.min(5, +difficulty || 1)); return { hp: (1 + (d - 1) * .35) * (t >= 900 ? 1.35 : 1), damage: (1 + (d - 1) * .25) * (t >= 1200 ? 1.5 : 1), speed: t >= 900 ? 1.08 : 1 }; }
  function passiveReady(run, defs, slots = 6) { return run.weapons.length >= slots && run.weapons.every(w => defs[w.id] && w.lvl >= defs[w.id].max); }
  return { LOST_EVERY, FINAL_TIME, HUNT_TIME, LOST, profile, newRun, multipliers, passiveReady };
})();
if (typeof module !== 'undefined') module.exports = ShadowExpansion;

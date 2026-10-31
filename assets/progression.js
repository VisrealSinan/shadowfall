/* Daily and mastery rules. All rewards are local to the player's existing save. */
const HuntProgress = (() => {
  const finite = v => Number.isFinite(+v) ? Math.max(0, +v) : 0;
  const day = (now = new Date()) => now.toISOString().slice(0, 10);
  function hash(text) { let n = 2166136261; for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0; return n; }
  const DAILY = [
    { name: 'Bronze', time: 180, kills: 100, bosses: 0, shards: 75 },
    { name: 'Silver', time: 360, kills: 250, bosses: 0, shards: 150 },
    { name: 'Gold', time: 600, kills: 500, bosses: 1, shards: 300 }
  ];
  const MASTERY = [
    { name: 'Initiate', level: 3, kills: 150, time: 180, bosses: 0, shards: 75, reward: 'Initiate title' },
    { name: 'Adept', level: 8, kills: 750, time: 300, bosses: 0, shards: 150, reward: 'Adept title · +1 starting reroll' },
    { name: 'Veteran', level: 15, kills: 2500, time: 600, bosses: 3, shards: 300, reward: 'Veteran title · Mastery Motes aura' },
    { name: 'Master', level: 25, kills: 7500, time: 900, bosses: 10, shards: 600, reward: 'Master title · Mastery Crown aura' }
  ];
  function plan(key = day()) {
    const seed = hash('shadowfall-daily-v1:' + key);
    const classes = ['rogue', 'warlock', 'summoner', 'ranger', 'druid', 'mage', 'bearlina'];
    const maps = ['forest', 'castle', 'heart', 'cellar', 'valor', 'glade', 'inferno', 'hollow', 'neural'];
    // Separate hashes keep the rotating class and map independent.
    return { date: key, cls: classes[hash(key + ':class') % classes.length], race: 'elf', map: maps[hash(key + ':map') % maps.length], seed };
  }
  function store(save) {
    if (!save.hunts || typeof save.hunts !== 'object' || Array.isArray(save.hunts)) save.hunts = {};
    const s = save.hunts;
    for (const k of ['days', 'claims', 'titles', 'auras']) if (!s[k] || typeof s[k] !== 'object' || Array.isArray(s[k])) s[k] = {};
    return s;
  }
  function record(save, key) {
    const all = store(save).days;
    if (!all[key] || typeof all[key] !== 'object' || Array.isArray(all[key])) all[key] = {};
    const r = all[key];
    for (const k of ['attempts', 'score', 'time', 'kills', 'bosses', 'qualified', 'paid']) r[k] = finite(r[k]);
    r.qualified = Math.min(3, Math.floor(r.qualified)); r.paid = Math.min(3, Math.floor(r.paid));
    return r;
  }
  const score = run => Math.floor(finite(run.t)) + Math.floor(finite(run.kills)) * 2 + Math.floor(finite(run.bossKills)) * 100;
  const qualifies = (run, tier) => finite(run.t) >= tier.time && finite(run.kills) >= tier.kills && finite(run.bossKills) >= tier.bosses;
  function settleDaily(save, run) {
    const key = run.challengeDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key || '')) return { shards: 0, ranks: [], score: 0 };
    const r = record(save, key), n = score(run), ranks = []; let shards = 0;
    r.attempts++;
    if (n > r.score) { r.score = n; r.time = finite(run.t); r.kills = finite(run.kills); r.bosses = finite(run.bossKills); }
    const reached = DAILY.reduce((best, tier, i) => qualifies(run, tier) ? i + 1 : best, 0);
    r.qualified = Math.max(r.qualified, reached);
    for (let i = r.paid; i < r.qualified; i++) { shards += DAILY[i].shards; ranks.push(DAILY[i].name); }
    r.paid = Math.max(r.paid, r.qualified);
    return { shards, ranks, score: n, best: r.score, date: key };
  }
  function stats(save, cls, level) {
    const p = (save.ach && save.ach.p) || {};
    return { level: finite(level), kills: finite(p['c_' + cls + '_k']), time: finite(p['c_' + cls + '_t']), bosses: finite(p['c_' + cls + '_b']) };
  }
  const ready = (s, t) => ['level', 'kills', 'time', 'bosses'].every(k => finite(s[k]) >= t[k]);
  const claimed = (save, cls) => Math.min(4, Math.floor(finite(store(save).claims[cls])));
  function claim(save, cls, level, tier) {
    const s = store(save), n = claimed(save, cls);
    if (!Number.isInteger(tier) || tier !== n || !MASTERY[tier] || !ready(stats(save, cls, level), MASTERY[tier])) return null;
    s.claims[cls] = n + 1;
    save.shards = finite(save.shards) + MASTERY[tier].shards;
    return MASTERY[tier];
  }
  return { day, plan, DAILY, MASTERY, store, record, score, qualifies, settleDaily, stats, ready, claimed, claim };
})();
if (typeof module !== 'undefined') module.exports = HuntProgress;

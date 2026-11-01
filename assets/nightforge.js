/* Repeatable long-term Shard investments, independent of the UI and combat engine. */
const Nightforge = (() => {
  const TRACKS = {
    vitality: { name:'Soul Vessel', icon:'♥', stat:'maxHp', limit:60, unit:'max HP' },
    power: { name:'Shadow Edge', icon:'✦', stat:'dmg', limit:.3, unit:'damage' },
    reach: { name:'Soul Magnet', icon:'◎', stat:'pickup', limit:.75, unit:'pickup range' }
  };
  const rank = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  function store(save) {
    if(!save.nightforge || typeof save.nightforge!=='object' || Array.isArray(save.nightforge)) save.nightforge={};
    const n=save.nightforge;
    if(!n.ranks || typeof n.ranks!=='object' || Array.isArray(n.ranks)) n.ranks={};
    for(const key of Object.keys(TRACKS)) n.ranks[key]=rank(n.ranks[key]);
    n.spent=rank(n.spent);
    return n;
  }
  function cost(r) { if(!Number.isSafeInteger(r)||r<0)return null;const n=500+150*r+50*r*r;return Number.isSafeInteger(n)?n:null; }
  function quote(save,key,count=1) {
    if(!TRACKS[key] || ![1,5,10].includes(count))return null;
    const r=store(save).ranks[key];let total=0;
    for(let i=0;i<count;i++){const n=cost(r+i);if(n===null || !Number.isSafeInteger(total+n))return null;total+=n;}
    return total;
  }
  function value(key,r) { return TRACKS[key].limit * r/(r+50); }
  function bonuses(save) { const n=store(save),out={};for(const [key,t] of Object.entries(TRACKS))out[t.stat]=value(key,n.ranks[key]);return out; }
  function total(save) { return Object.values(store(save).ranks).reduce((n,r)=>n+r,0); }
  function buy(save,key,count=1) {
    const price=quote(save,key,count),n=store(save);
    if(price===null || !Number.isSafeInteger(save.shards) || save.shards<price || !Number.isSafeInteger(n.spent+price))return null;
    save.shards-=price;n.ranks[key]+=count;n.spent+=price;
    return {price,rank:n.ranks[key],count};
  }
  return {TRACKS,store,cost,quote,value,bonuses,total,buy};
})();
if(typeof module!=='undefined')module.exports=Nightforge;

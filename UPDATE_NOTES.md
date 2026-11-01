# Shadowfall v79 game update

These features are integrated into the main Shadowfall game and delivered through the standard launcher content update. No separate expansion or installation is required.

## New achievements and Nightforge (v79)

- 79 new achievements bring the total to 233. Goals include 30-minute survival and 10,000 kills for each class; longer global survival; lifetime kills, bosses and quests; Lost Shadows; final bosses; higher-difficulty victories; endless choices; outfit collecting; map exploration; and Nightforge milestones. Rewards include regular Shards and 29 eye/aura cosmetics. Every Shard reward is awarded once. Existing recorded kill/survival/class/map/outfit progress counts immediately. New encounter counters start tracking in v79.
- Armory → Nightforge provides repeatable investments using **regular Shards**, with 1-, 5- and 10-rank purchases. Outfit Shards are untouched. Prices are 500 + 150r + 50r² per rank in a track. Benefits are Lr/(r+50): Soul Vessel approaches +60 max HP, Shadow Edge +30% damage, and Soul Magnet +75% pickup range. Ranks remain repeatable while gains diminish. Purchases are permanent and are not refundable.
- Bonuses are captured at the start of each new normal run. Active/resumed runs keep their original bonus snapshot, and Daily Challenges exclude these bonuses.
- Achievement lists now support Shard-only rewards and map unlocks without attempting to draw a missing cosmetic.

## Progression and encounters

- A Lost Shadow appears every 500 kills, with one kill-triggered Lost Shadow alive at a time. Hollow Titan, Cinder Knight and Veil Mother share their roster across every map. Each grants one persistent **Outfit Shard**, a cosmetic currency separate from existing upgrade Shards.
- The Lost Sovereign is the final boss, arriving at 15:00. Its defeat pauses the hunt with **End Round** (bank rewards) and **Continue Endless**. The choice survives saving and restoring. The player cannot take damage between its defeat and choosing endless.
- Surviving 15 minutes unlocks difficulty 1–5 on that map for later normal runs. Each extra step adds 35% enemy health and 25% enemy damage. Daily Challenges remain at difficulty 1.
- After 15 minutes, new Night Revenants and Dread Hounds join all maps; newly spawned enemies gain 35% health and 8% speed. At 20 minutes enemy damage rises by 50%, including living enemies.
- Michael Myers begins an invincible, crowd-control-immune pursuit at 15:00. He moves at 36 base speed, slower than a Bone Walker's 40. Survive 180 active seconds to unlock a mortal, armored melee Michael Myers. Pauses and Safe Haven visits do not advance the chase. Ending the round before then does not unlock him; continue endless to finish the pursuit.
- Tibo & Poteto are a fictional two-person survivor with shared health. During a hunt, type `tibopoteto` to unlock the duo. Their teal/violet procedural art and named skills reference Codex and Grok. Source references: https://x.com/thsottiaux and https://x.com/poteto. X blocked fetching Poteto's profile; her characterization uses the user's description.

## Outfit artwork refresh (v78)

All 328 modern sheet variants now stay active when an armor set is selected, covering the 21 sheet-backed classes, their races, bodies and existing actions. Outfit colors are generated from the current artwork with a bounded frame cache; they preserve the existing silhouette and are not newly drawn clothing designs. Wardrobe, achievement, shop and equipment portraits refresh after a sheet loads. The two procedural secret characters and Druid transformations retain their existing dedicated renderers.

## Appearance and controls

- Every class, including the two secrets, has five new cosmetic outfits: Moonlit, Ember, Verdant, Ivory and Voidbound. They cost 1–5 Outfit Shards in the Wardrobe. Existing achievement outfits remain available.
- The spell visibility slider in Audio & Settings fades player spell passes and decorative particles from 5–100%. Enemy projectiles, attack telegraphs and hostile ground effects retain their visibility. Damage and collisions are unchanged.
- Hover the HUD's skill/passive icons to see descriptions. Pause-menu hover, focus and click details remain available.
- Before a normal run, enable Random Build to randomize the starter and automatically choose skills and passives at level-ups. It grants no extra skill levels. Daily Challenges ignore this setting.
- With six main skills fully leveled, the level-up screen offers automatic random passive choices for the rest of that run.
- The top row of each Druid talent tree includes a one-point starting form: Shadowcat, Wildcaller or Elderbark. These choices are mutually exclusive and lock the run's starting form choice. Existing talent saves are preserved.

## Skills

150 new named skills: six for each of 22 non-Druid classes, plus six each for Wildcaller, Shadowcat and Elderbark. Each set covers a targeted strike, forward multi-target attack, surrounding burst, persistent field, recovery attack and delayed multi-hit attack. Class/form themes set range, color, bleed or slow behavior. Skills use the existing six-level progression, cooldowns, damage accounting, save system and slot limits. The new secret classes also have three talent trees each.

## Verification and release

Run from this directory with Node 24:

```
node tools/check-syntax.cjs
node --test tests/*.test.cjs
```

The headless smoke harness runs the actual game scripts with inert browser, canvas and audio APIs. It starts, updates, renders and casts the new skills for all 23 classes; checks encounter persistence, mortality, victory, Druid form costs and restoration. This checks code paths, not image appearance or real-time balance. Visual playtesting was unavailable because browser access to the local preview was denied. Combat balance and the procedural character/outfit art still need human playtesting.

`version.json` includes the game assets and refreshed SHA-256 hashes; `sw.js` updates the offline cache. The launcher downloads the main game update from GitHub Pages. The existing launcher executable remains compatible.

The global leaderboard is deliberately deferred at the user's request until the future website work.

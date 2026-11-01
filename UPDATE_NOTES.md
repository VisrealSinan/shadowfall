# Shadowfall v83 game update

These features are integrated into the main Shadowfall game and delivered through the standard launcher content update. No separate expansion or installation is required.

## Settings in and outside a hunt (v83)

- A dedicated Settings button appears on the main menu and pause menu. The shared Settings screen groups music, sound effects, jump sound, player spell visibility, controller rumble and the phone jump button into Audio, Visibility and Controls panels.
- Settings opened during a hunt keep the run paused. Back/Escape returns to the pause menu; Resume is a separate choice. Settings opened from the main menu return there. The keyboard/controller reference returns to Settings with the same context.
- Preferences retain their existing saved values and apply immediately. Native keyboard slider adjustment, Tab navigation and toggle activation work inside Settings. Controller navigation and adjustment remain supported.

## Origins, Callings and the Night Atlas (v82)

- Race selection is now Origins: a full animated character showcase, bloodline cards, clear racial strengths and tradeoffs, body choices and direct ancestry access.
- Class selection is now Callings: a compact roster beside a customized hero, class description, signature passive, earned talent budget and outfit colours. Existing class unlock confirmations, gear, mastery, talents, Codex and random-build controls are retained.
- Map selection is now the Night Atlas: a large selected destination preview, recorded map best, enemies, bosses and safe haven, with a compact grid of open and locked destinations. Twists and the post-map preparation/difficulty flow remain available.
- All three scenes share chapter navigation, restrained colour palettes, serif headings, keyboard/controller controls, visible focus, reduced-motion support and layouts for smaller screens.

## Hall of Echoes, preparation and ancestry (v81)

- Achievements now live in the Hall of Echoes, with an engraved completion seal, chapter navigation, search, status filters, nearest/recent/name sorting and a next-goal spotlight. Reward portraits load when near the viewport. Reduced-motion and keyboard input are supported.
- Flow: race → class → map → **Run Preparation** → hunt. Preparation previews the customized hero and destination, the recorded map best, talent budgets and difficulty rewards. The old class-selection difficulty slider is removed.
- Difficulty 1–5 awards run Shards at 1 / 1.35 / 1.70 / 2.05 / 2.40×; class and race XP at 1 / 1.25 / 1.50 / 1.75 / 2×; Outfit Shards per Lost Shadow at 1 / 1 / 2 / 2 / 3. Enemy scaling remains visible. Daily Challenge rewards and difficulty stay standard.
- Per-map survival records are saved at run checkpoints and settlement. Historical clears unlock higher difficulty, but exact historical map times cannot be reconstructed from old saves and are not invented.
- All eight races have three ancestry branches with five nodes each (120 nodes). One race point is earned per race level up to **30 points**. Class talents retain their separate **51-point cap**, now explicit in the header. Neither system spends Shards or adds Armory upgrades.
- Race XP carries across classes. Existing recorded race kills and the race’s best survival time seed a conservative starting XP balance once; subsequent finished runs award the displayed difficulty-adjusted race XP. Race resets are free and save immediately. Allocations apply to new normal runs and remain fixed through save/resume. Daily Challenges exclude ancestral talents.
- Cat Nine Lives, Elf Starweaver, Ogre Earthbreaker, Troll Bloodmender, Kitsune Foxfire and Shade Veilwalk have triggered capstones; other capstones strengthen their racial paths. Revival usage and racial cooldowns survive saves. Prerequisites and earned point caps are validated on load.

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

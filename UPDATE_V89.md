# Shadowfall v89

## Changes

- Hidden Goose origin: type `honk` during an active hunt to earn its secret achievement. Male/female art and three ancestry branches are included. Bonuses: +12% speed, +30% knockback, +4% evasion. Costs: -15% HP and -10% range.
- Secret Undead origin: The Hundredth Ending unlocks after 100 recorded deaths. Retreats, victories, abandoned runs and repeat settlement calls do not count. Earlier builds did not store a reliable death total, so old hunt counts are not guessed into deaths.
- Undead gains +15% HP, +1 armor and +1% life drain, with -35% non-regeneration healing and -8% speed. Includes male/female bodies, class palette support and three ancestry trees: Gravebound, Soul Hunger and Restless.
- Tibo & Poteto remain one shared survivor. Nineteen existing skill IDs now use dedicated link, chain, orbit, piercing bridge, linked healing and Resonance finisher behavior. Non-finisher casts build up to six Resonance; finishers spend it for up to +60% damage. Continue Run preserves Resonance.
- Replace 48 generic duo talent names/effects with Tibo / Poteto / Shared Fate branches. Their capstones lengthen links, accelerate duo casts, and strengthen linked finishers. Existing talent IDs, ranks, prerequisites and allocations remain intact.
- Twenty painted duo emblems provide dedicated art for all nineteen skill cards and the talent nodes. New sanctuary artwork appears in Class Mastery; the duo's talent scene uses its own twin-current bridge artwork.
- Correct the duo's animation poses with separate partner timing and pivots, overscan, and checked frame bounds. Preserve its gameplay size; use containment framing for its portraits, including the small origin pictures.
- New hunts begin at level 1 with zero pending upgrades. Chosen One gives +5 vitality instead of a free level choice, preserving the purchased perk's value.
- Preserve and integrate the concurrently authored v88 supplementary animations. Original idle sheets remain the source for idle; missing hurt/death/ultimate actions use their own supplements.

## Validation

- All game scripts parse; all 81 automated tests pass on the combined build.
- Browser preview: desktop origin selection, duo talents, Class Mastery, mobile mastery, new origin selection and illustrated level choices; zero page errors.
- Software-canvas checks decode 24 new action sheets / 1,536 frames, verify visible bounds and nonempty active poses, and create `artifacts/animations-v89.png` for visual review.
- Tests cover the 99-to-100 death unlock, duplicate settlement, retreat exclusion, hidden origins, the honk trigger, all class starts with Chosen One owned, both new bodies, ancestry, 114 duo skill-level casts, linked damage, Resonance spending, save/continue, illustrated card mappings and portrait containment.
- Independently rechecked the concurrent animation update: 328 supplemental sheets / 7,808 frames; no clipped or empty required frames. Combined with the new sheets, 9,344 animation frames passed pixel QA.
- Installed v89 locally: 1,512 verified content files; launcher selects the v89 cache. Existing saves are preserved and the prior pointer is backed up under `E:/Shadowfall/update-backups/2026-11-02T13-08-07-099Z/`.
- Content manifests contain exact file sizes and SHA-256 hashes for launcher installation. Local installation preserves existing saves and backs up the active content pointer.

## Generated art

Built-in imagegen mode. Original PNGs and transparency are preserved in the project. The source atlas's actual row boundary is y=638, rather than an assumed midpoint; the compiler uses that boundary to keep all skeleton feet and remove neighboring pixels from Goose.

### assets/sanctuary-duo-v89.png

Opaque. Final prompt:

Create a production background artwork atlas for Shadowfall, hand-painted dark fantasy RPG, wide landscape image divided into TWO equal vertical panels left and right, seamless inside each panel, no text no UI no borders. LEFT panel: majestic abandoned gothic mastery sanctuary with bronze rank medallions, unlit foreground platform, distant vaulted arches, teal lanterns and warm golden rays, detailed upper and side areas with quiet dark center for UI overlay. RIGHT panel: unique paired-survivor talent background, two luminous magical currents one jade teal and one violet intertwine like a double helix above an ancient stone bridge, twin distant towers, starry night, intricate copper circuits woven into moss, dark center and lower area so talent nodes can overlay. Beautiful premium painterly fantasy game art, controlled magical lighting, charcoal green and antique bronze palette. Save project asset.

### assets/secret-origins-v89.png

Transparent background. Final prompt:

Production sprite atlas for Shadowfall hand-painted dark fantasy RPG. Exact TWO columns TWO rows of FOUR separate full body characters on genuine transparent alpha. Top left male undead adventurer: slender walking skeleton with pale green soul eyes, ragged charcoal bronze armor and a small teal lantern. Top right female undead adventurer: distinct skull, long silver hair, tattered dark green hooded coat and bronze belt, violet soul eyes. Bottom left male goose adventurer: actual white goose with long neck, orange beak webbed feet, dark teal little adventurer cape and bronze shoulder guard. Bottom right female goose adventurer: actual white goose with long neck, orange beak webbed feet, purple little cape and feather brooch. Three quarter overhead standing view, facing slightly right, clearly separated legs and arms or wings so sprites can be animated. Each full figure fits in central 65 percent of its cell with abundant transparent margin. No floor no shadow no background no labels no text no borders no gridlines. Readable silhouettes, crisp beautiful painted fantasy sprites, four cells equal dimensions, no overlap.

### assets/duo-skills-v89.png

Opaque. Final prompt:

Production ability icon atlas Shadowfall painted dark fantasy RPG. Exact 4 columns 5 rows, twenty equal square dark charcoal cells. No text letters labels borders gridlines. Each icon uses teal Tibo magic and violet Poteto magic, brass highlights. Read row major: 1 teal open grimoire firing two linked bolts; 2 violet lightning jumping between three skulls; 3 teal and violet intertwined orbit rings; 4 two sigils linked by a straight bright bridge; 5 two hands holding a mending heart; 6 teal and violet stars colliding; 7 teal current weaving through violet current; 8 orbiting twin gemstones; 9 double magical lance; 10 twin shields linked by a chain; 11 resonant bridge of light; 12 paired heart pendants; 13 shelter dome over twin candles; 14 twin dawn suns; 15 concentric affinity pulse; 16 crossed violet teal stars; 17 two hands raising banner; 18 heart traced by magical thread; 19 perfect linked circle; 20 twin crystal crown. All separate readable emblems, rich painted detail, consistent dark backgrounds, no object crossing its cell, central 75 percent of each square.

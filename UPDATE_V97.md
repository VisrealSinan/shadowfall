# Shadowfall v97 — Hunt log, particle performance and eight legendary relics

Routine hunt messages, equipment notices, evolution notices and achievements now enter a bounded, scrollable bottom-left Hunt Log. Repeated messages coalesce briefly; the history holds 80 entries and resets with a new run. World-event/boss/stage banners and quest announcements retain their central presentation. Desktop and narrow-screen layouts keep the log above the bottom controls. DOM content is inserted as text.

The performance investigation isolated an expensive particle-rendering path: every decorative particle used a canvas opacity filter even at 100% visibility. Higher enemy and spell density after five minutes increases particle traffic and multiplies those filtered draws. Particle rendering now multiplies the existing fade alpha by the visibility preference, preserving reduced-opacity settings without per-particle filter surfaces. Full-opacity cast and field passes also avoid no-op filters. Gameplay, enemy population, hitboxes and damage timing remain unchanged.

Controlled A/B: identical 6:00 scene, 180 enemies and 250 particles, headless Chrome software rendering with forced raster completion. Repeated median render times were approximately 712–725 ms before and 17.2–17.4 ms after eliminating the redundant filters. These are stress-benchmark render times, not predictions of live player FPS. The verification tool reproduces the legacy path inside the same page and tests both versions against the same state. Report: artifacts/performance97.json.

Eight new named legendary gear variants join the existing legendary pool:

- Crown of the Last Ember — head; Emberburst; fire and armor.
- Stormglass Heart — trinket; Stormcall; area and critical chance.
- Briar Oathplate — chest; Briarthorns; health and armor.
- Winter Pilgrim Treads — feet; Rime Aura; speed and frost.
- Dawn Bastion — shoulders; Aegis; health and regeneration.
- Soulkeeper Pendant — neck; Soulfeast; duration and lifesteal.
- Signet of the Red Hour — ring; Bloodrush; critical chance and damage.
- Girdle of the Gilded Horizon — waist; Greed; pickup and XP.

Existing rarity probabilities remain unchanged. Compatible legendary rolls have a 40% chance to become a named relic; original legendary variants remain available. The relics use existing proc engines with fixed themed bonus stats, and participate in equipment, save migration, comparisons, salvage and keepsakes.

Verification: targeted message routing, bounded history, all eight relics generating/equipping/applying procs and surviving Save/Continue/keepsake conversion, slot/rarity preservation and reduced-visibility particle rendering without opacity filters. Desktop and mobile Chrome screenshots are in artifacts/hunt-log97*.png. The full regression suite and release manifest are checked before installation.

Final validation: all 153 tests pass; desktop/mobile Chrome verification reports zero page errors. Local v97 installation verified 1,545 files and preserved saves.

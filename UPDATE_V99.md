# Shadowfall v99 - Art consistency and complete crops

Portraits now fit the complete idle artwork for every class, race, body variant and Druid form. This replaces the enlarged bust crop that cut off bodies, weapons, ears or headwear in smaller character previews. Vendor portraits use bounds measured across all animation frames. Existing painted skill art is contained in 136 padded square cells instead of stretched into square slots.

The remaining legacy presentation paths receive matching detailed painted fantasy art:

- 30 equipment thumbnails (three appearances across ten slots) and eight dedicated named legendary illustrations.
- Four permanent Armory branch environments, painted stat emblems and Nightforge emblems.
- The Hollow Bellkeeper, the Unheard, both shrine states, XP crystals, coins, potions and loot chests. The shrine charge indicator and hostile warning circle stay visible.
- 51 scenery sprites covering the remaining obstacle and ground-decoration routes, including map-specific props, crates, barrels, campfires, braziers, workshop pieces and seasonal decorations.
- 16 physical construct sprites, including Engineer turrets, traps and drones, the homunculus, subwoofer, wisp, chronomine, spindle, River plants, spectral visage and a holy war hammer. Echoes and decoys use the existing modern character art; Holoneko uses the existing painted cat-form animation.

Only drawing and menu presentation change. Collision, damage, targeting, durations, cooldowns, rewards, progression and saves keep their existing rules. Modern character action sheets, enemy animation sheets, map vistas, shops and talent paintings are retained. Historical fallback renderers remain available while an asset loads; this release does not delete unused historical art.

Artwork was generated and repaired with the built-in image_gen tool. Final sources and exact prompts are in handoffs/art99/. The runtime loads optimized project-local files. World sprite extraction follows actual alpha gutters instead of assuming uniform generated rows. Crops retain transparency and padding. The holy hammer replaces the sheet's incorrect axe silhouette.

Verification:

- Source audit: 31,936 animation frames in 955 sheet sources; zero clipped frame edges, invalid atlas rectangles or dimension errors.
- Portrait pixel review: 514 variants at 64x64 and 120x160, 1,028 checks, zero edge failures.
- 75 transparent runtime sprites checked for empty content and edge clipping; zero failures.
- Chrome: all four Armory branches, desktop class selection, Nightforge, every obstacle art route, updated equipment and encounter assets, painted world actors and constructs, and a 390-pixel mobile Armory. No page errors, missing requests or horizontal overflow.
- Syntax checks and all 164 regression tests pass, including six new coverage checks for crop metadata, icon routes, scenery coverage, visual-only construct rendering and preserved progression.

Audit reports and screenshots are generated under artifacts/ (not shipped). Rebuild tools: build-art99.cjs, build-world99.cjs and build-crops99.cjs. Visual QA tools: audit-art99.cjs, verify-art99.cjs, verify-portraits99.cjs and browser-art99.cjs.

# Shadowfall v94 — Class spell identities, first pass

All 24 callings now resolve source-aware canvas spell styles. Shared player burst/nova and persistent zone rendering uses class-specific silhouettes and compositions. Existing projectiles gain a small class signature. Steel cuts, feathers, scythes, roots, crystals, solar rays, gears, flasks, notes, blood, clocks, waveforms, threads, cartridges, roses, eyes, eclipses, claws, lanterns, paired signals and totem masks have separate geometry. Mage fire, ice and storm names resolve elemental motifs; Druid cat skills use claws.

This is the first class-identity pass, not a complete bespoke animation for every skill. Existing specialized beams, cones, transformations, summons and ultimates retain their renderers. Further work should author each skill's windup, travel, impact, lingering state and evolution within its class language. Current artwork is procedural canvas linework rather than new painted sprite sheets.

Hostile warnings, hostile goo and enemy projectiles retain their rendering. Combat objects, damage, cooldowns, hitboxes, source accounting and save schema are unchanged. Player spell visibility uses the existing renderer's opacity filter. Offscreen effects are culled and each effect draws a bounded number of strokes.

Validation: syntax check; full regression suite; additional coverage for all class/skill identity resolution, all ranks' finite geometry, canvas state balance, combat-data immutability and hostile-effect fallthrough. Headless Chrome renders a 24-class comparison and the actual mixed-effect combat renderer with zero page errors. Review sheet: artifacts/spell-identities94.png.

# Shadowfall v98 — Painted talent-tree identities

All 24 class talent screens now use three individually painted branch environments: 72 different scenes, with calling-specific subjects, branch palettes, node silhouettes, capstone frames, prerequisite paths and painted skill emblems. Tibo & Poteto and Shaman retain their dedicated emblem sets and receive new matching scenes. Other classes use their own existing painted skill atlas art, selected from the relevant skill/stat talent. Rank badges, available/learned/locked states and keyboard focus remain visible above the paintings.

Examples include Mage's volcanic forge, frozen library and celestial observatory; Druid's hunting grove, spirit sanctuary and root cathedral; Engineer's fortification workshop, powder store and clockwork reactor; and Tibo & Poteto's codex sanctuary, storm observatory and twin-lantern bridge. Every other class receives its own three settings, rather than palette swaps.

The ten ancestry screens also receive origin-appropriate painted branch treatments, reusing selected environments from the new class collection, plus painted stat emblems. They do not add another 30 unique paintings.

The update changes presentation only. Talent IDs, point budgets, prerequisites, allocations, capstones, starting-path gates and combat effects retain their existing behavior. Narrow displays show one full branch at a time; tabs and touch branch switching remain available. Reduced-motion preferences are respected. The former procedural tree backdrop is skipped where new paintings are available.

Art pipeline: built-in image_gen generated six 3-column × 4-row source atlases. Sources and exact prompts are preserved in handoffs/talent-art98/. tools/build-talents98.cjs extracts each scene with clean gutters and compiles 72 optimized 420×560 WebP backgrounds, totaling approximately 2.67 MB. Runtime backgrounds are assets/talent98-CLASS-BRANCH.webp. No generated asset is referenced from outside the project.

Verification covers unique nonempty assets for all 72 branches, painted icons for every talent, immutable class/race definitions and saved progress during rendering, and allocation/apply/reset behavior. Browser review covers all 24 classes, all narrow branch choices, ancestry screens, touch interaction and reduced motion. Screenshots and the browser report are in artifacts/.

Final verification: 158/158 regression tests pass. Chrome verified 24 classes, 72 desktop branch scenes, 72 narrow branch selections, all ten ancestry screens, reduced motion and allocation/apply/reset with zero page errors or missing assets. Native touch taps switch branches correctly on Druid, Tibo & Poteto and Shaman. Runtime artwork totals 2,666,268 bytes.

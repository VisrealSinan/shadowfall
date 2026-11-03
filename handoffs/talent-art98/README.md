# Talent art v98 source package

Generated with the built-in image_gen tool. The exact six generation prompts are in prompts.json. Each atlas is a uniform 3-column, 4-row layout; each row supplies one class and its three branches.

Atlas order:
1. Rogue, Warlock, Summoner, Ranger
2. Reaper, Rift, Druid, Mage
3. Paragon, Paladin, Engineer, Alchemist
4. Bard, Blood Knight, Chronomancer, Maestro
5. Unraveler, Gunslinger, River, Visage
6. Bearlina, Graveshade, Tibo & Poteto, Shaman

Rebuild from the source directory with `node tools/build-talents98.cjs`. The tool extracts a two-pixel inset to avoid neighboring-scene fragments and compiles optimized 420×560 WebP backgrounds under assets/talent98-*.webp. It requires the bundled sharp library. Sources are retained here; the runtime manifest includes the compiled assets only.

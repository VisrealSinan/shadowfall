# Shadowfall v95 — Individual Mage spell visuals

Mage is the first full class pass after v94's roster-wide foundation. All 19 spells have explicit compositions: school-sensitive Prism Bolt, lobbed Cinder Orb, Ember Wake flames, descending Skyfall Meteor, faceted Rime Shards, branching Glacial Pulse, segmented Hoarfrost Ward, Astral Orb rings, Leyline Lance filaments, Shimmerstep gates, three-school Prismatic Comet, Arcane Barrage stars, Pyroclasm eruptions, Astral Spear, Ice Needles, Solar Corona, Runic Weather, Mana Bloom and Prismatic Echo.

All 13 existing evolutions gain structural changes: spectral prisms, a solar corona, phoenix wings, doubled meteor rings, clustered glacier spines, a crystalline snow seal, extra ward segments, paired moons, a second ley filament, constellation gates, linked trinity cores, radial tempest traces and branching fire fissures. The six expansion skills currently have no evolution definitions; this visual release does not introduce new progression rules.

Elemental Cataclysm retains its original gameplay schedule. A bounded visual scene adds fire orbiters during the meteor storm, crystalline expansion at the 1.9-second freeze and rotating arcane seals from the 2.4-second ray phase. Existing damage, stun, burn and targeting code is unchanged.

Individual Mage renderers take priority over v94's class motifs. Other classes retain their existing presentation. Hostile effects fall through unchanged, player visibility filters still apply, and rendering consumes no random numbers or combat state. New art uses procedural canvas geometry and gradients.

Validation includes actual casting, updating and rendering for all 19 Mage skills at all six ranks in base and existing evolved states; finite geometry, balanced context, combat state immutability, elemental projectiles, hostile fallthrough and ultimate scheduling. Browser comparison sheet: artifacts/mage-spells95.png. Further classes remain future work.

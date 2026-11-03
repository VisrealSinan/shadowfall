# Shadowfall v100 - Quests for every map

The regular in-run quest pool grows from eight to eighteen quests. All eighteen can be offered and completed on all ten maps: Gloomwood, Ashen Citadel, Heartfall Belfry, The Weeping Cellar, the Valorfields, the Mossreach Shrines, Neon Perdition, Gourdmas Hollow, the Hallowmoon Patch and the Neural Foundry.

| New quest | Objective |
| --- | --- |
| Thin the Ranks | Defeat a group of foes of any kind. |
| Soul Harvest | Gather base experience from XP gems; purchased lessons do not count. |
| Trailblazer | Travel on foot; teleport displacement does not count. |
| Weather the Storm | Survive a period of time in the field. |
| Wayfinder Signals | Visit three marked survey beacons in sequence. |
| Threefold Rite | Channel three seals for three seconds each; leaving pauses the current channel. |
| The Last Delivery | Collect a supply chest and return it to the starting camp. |
| Defend the Ward | Defeat foes inside the ward while also standing inside it. |
| Break Their Momentum | Chain kills without a gap longer than twelve seconds. |
| Two Bounties | Hunt two marked champions, one after another. |

The first quest still appears around 1:00. Six of the new objectives join the early pool; all eighteen are in rotation after 2:00. The existing one-quest limit, rising to two after 6:00, stays in place. Quests retain their timers, gear/gold/Shard rewards and achievement credit. Two Bounties uses the existing harder-quest reward multiplier. Goals scale with elapsed run time and have caps.

All-map fixes:

- Quarry and champion selection resolves the map's actual enemy substitutions. Empty fields no longer fall back to a forest-only target. Cull quests keep up to four quarry available when the natural spawn mix is sparse.
- Circles, relics, totems and new objectives use real collision chunks. Each destination has a clear walking corridor from its anchor. Escort placement validates the spirit-to-shrine route; dense scenery may shorten a route.
- Signature Strike accepts equipped skill and companion kills instead of requiring a replaced starter. Lethal-hit attribution now uses the already-resolved damage source, including explicit source arguments.
- Missing totems are restored rather than counted as kills. Missing marked champions also return. Failure cleanup and actual kill credit retain their roles.
- Quest phases, locations, channel progress and countdowns live in the normal run snapshot. Existing continued quests are checked on their first field update. Town time and rewards from XP lessons do not advance the new objectives.

New world markers reuse the existing painted scenery collection. They have field indicators, edge arrows and quest tracker text. Quest banners remain central and do not intercept controls. Rendering introduces no extra per-frame sprite baking or pixel reads.

Verification: all eighteen objective types complete through their normal progress handlers and pay rewards on each of the ten maps (180 combinations). Tests also cover three scenery seeds per map away from the spawn safe area, actual local quarry with empty enemy lists, all 24 classes' skill/companion credit, missing-target recovery, failure cleanup, JSON save/continue, teleport exclusion, gem-only XP credit, town pauses, ward conditions, kill-chain expiry and seal channel pauses. Chrome renders all 180 map/quest combinations with no page errors, failed requests or mobile horizontal overflow; banners remain noninteractive. Reports/screenshots are generated in artifacts/.

Final validation: syntax checks pass and all 173 regression tests pass.

# Shadowfall v92 — Shaman

Shaman unlocks in the Armory for **600 Shards**. It is a normal purchasable class, with 105 base HP, 1 armor, a slightly deliberate stride, a signature Spirit Bolt, 19 class-exclusive combat skills, three full talent trees, its own ultimate, class XP, mastery, gear preferences, evolutions, achievements and armor rewards.

## Three paths

- **Totem Covenant:** six persistent world totems: Thunder, Ember, Tide, Earth, Wind and Ancestor. Damage, healing, knockback and nearby support auras give them separate jobs. Three can be active at once; recasting a type replaces its previous instance and relocates it. The capstone permits a fourth totem and rewards overlapping placements.
- **Stormforged Melee:** Stormstrike, timed Windfury/Flametongue/Frostbrand/Earthguard imbues, and a Spirit Wolf cleave. Imbues add extra strikes, elemental damage, slows and defensive stats. The capstone supplies controlled melee sustain.
- **Elemental Tempest:** Chain Lightning, Lava Burst, Hailstorm, Cyclone, Earthquake and Primal Convergence. Chaining, delayed impacts, burning fields, pulls and knockback support ranged control. The capstone adds elemental slowing.

Spirit Bolt completes the **19-skill roster**, matching the other classes. Every skill has six ranks and an evolution paired with a real, accessible passive.

**Primal Rhythm:** skill casts build up to six Maelstrom, with an extra charge when switching schools. At full charge, the next ordinary cast discharges an ancestral shockwave. Primal Convergence spends the charges on its stronger finisher. The ultimate, **Call of the Ancestors**, raises three totems, awakens all imbues briefly and sends out a primal shockwave.

## Choose a starting style after the first hunt

Each tree has one highlighted talent at the top: **Begin as Totem Keeper**, **Begin as Stormforged**, or **Begin as Elementalist**. These unlock after the first completed normal Shaman hunt. They are free and mutually exclusive, and do not count toward tier prerequisites or the class's 51 earned talent points. Reset supports these free selections even with zero points spent.

A selection replaces Spirit Bolt with Thunder Totem, Stormstrike or Chain Lightning at rank 1 on the next normal hunt. It grants no extra skill, level or upgrade choice and does not restrict the rest of the skill pool. Daily Challenges ignore saved starting-path choices and do not complete the first-hunt gate.

## Presentation

The paths use three distinct painted scenes, node shapes and palettes: a carved jade spirit shrine, an amber storm forge and a blue elemental mountain vista. A dedicated twenty-emblem atlas supplies cards, evolutions, loadout art and talent icons. Six standalone painted totem sprites appear in the world's depth-sort pass. Narrow desktop windows use one readable tree at a time; touch controls retain the existing swipe/tap interface.

Twenty race/body variants cover all ten origins, including Undead and Goose. Each has eight animation actions (idle, run, attack, casting, dodge, hurt, death, ultimate), 1,280 decoded frames in total. Existing wardrobe recoloring and portrait containment apply. Totems, imbues, path and Maelstrom are saved with the run and restored by Continue Run.

## Validation

- Eleven targeted tests cover the skill roster, evolution passives and art, first-hunt gating, free selections, exclusivity/reset, all 114 skill/rank casts, persistent totem pulses and caps, imbue hits and expiry, proximity auras/healing, Maelstrom, Save/Continue, Daily Challenges, the ultimate and all race/body portrait bounds.
- Headless Chrome exercises the real Armory purchase (600 → 0 Shards), first hunt, starting-path application, normal level-1 start with one skill and no pending upgrade, all three tree layouts, touch controls, combat and illustrated card selection.
- Software-canvas QA decodes all twenty sheets / 1,280 frames, verifies required visible poses and empty margins, and renders the contact sheet `artifacts/shaman-art92.png`.
- All 104 regression tests pass, and the release manifest’s file sizes/SHA-256 hashes are verified before installation and publication.

## Art assets and prompts

Built-in imagegen mode. Final project assets:

- `E:/Shadowfall/source/assets/shaman-bodies-v92.png`
- `E:/Shadowfall/source/assets/shaman-skills-v92.png`
- `E:/Shadowfall/source/assets/shaman-trees-v92.png`
- `E:/Shadowfall/source/assets/shaman-totems-v92.png`

Actor and world-totem assets preserve the generated alpha. The skill atlas's painted layout is five columns and four rows; the compiler locates its actual dark row/column separators rather than assuming the requested geometry. Sprite source rectangles are authored separately to avoid neighboring-tail fragments.

### Character atlas (transparent)

Production character sprite atlas for Shadowfall dark fantasy action RPG. EXACT FOUR COLUMNS and FIVE ROWS, 20 equal cells on genuine transparent background. Each cell one separate complete full-body SHAMAN, three quarter overhead standing pose facing slightly right, with separate legs and arms for mesh animation, jade and charcoal scale leather, antique brass, small carved glowing spirit totem at hip, a stone-headed lightning mace in right hand, azure and amber elemental sparks, distinctive original fantasy costume. No ground shadows, scenery, words, labels, gridlines, borders or UI. All figure including ears tails weapon fits central 70 percent of its own cell with transparent gutters all sides; no neighboring overlap. Consistent premium hand-painted fantasy RPG art and proportions. Read row-major: row1 male cat human with ears and tail, female cat human, male long-eared elf, female long-eared elf; row2 male hulking green ogre, female green ogre, male stocky bearded dwarf, female stocky dwarf; row3 male tall blue troll with tusks, female troll, male fox-eared kitsune with orange tail, female kitsune; row4 male green-scaled lizard humanoid, female scaled lizard humanoid, male translucent violet shadow humanoid, female translucent violet shadow humanoid; row5 male skeletal undead, female skeletal undead with silver hair, male actual white goose with orange beak and webbed feet in tiny shaman cape carrying a little rune totem, female actual white goose with violet-trim shaman cape. Each is clearly the SAME SHAMAN CLASS expressed through the race and body. Generous gutters, whole sprites no clipping.

Final edit prompt:

Repair this production sprite atlas while preserving these exact 20 Shaman characters and race/body order. Output an EXACT uniform 4-column 5-row grid of equal cells on genuine transparent alpha. SHRINK EACH character to use at most 62 percent of its cell width and 72 percent of cell height, center it in its own cell, with large empty fully transparent gutters on ALL FOUR sides. Keep the complete body, every tail, every ear, and the ENTIRE mace including blue lightning halo visible INSIDE its own cell. Restore cropped mace tips on the right edge. No part of any character may enter its neighboring cell. Keep all 20 distinct characters in their original order and same hand-painted art style. Separate each sprite completely, no scenery no words no gridlines no drop shadows no colored backdrops. Priority is complete, uncropped, individually separated sprites with broad transparent margins.

### Skill atlas (opaque)

Production skill emblem atlas Shadowfall premium hand-painted dark fantasy RPG. Exact FOUR columns FIVE rows, 20 equal square cells. Dark charcoal backgrounds, bronze accents. NO text labels letters numbers borders or gridlines. Individual central icon per cell, entirely inside cell with padding. Row-major subjects: 1 stone shaman mace with spiraling teal lightning; 2 carved thunder totem with blue crystals; 3 ember totem with orange braziers; 4 tide totem with blue healing water; 5 stone guardian totem; 6 totem of howling wind; 7 ancestral spirit totem with jade ghost flame; 8 two stone maces crashing together; 9 mace engulfed in a wind spiral; 10 fiery weapon enchantment; 11 icy weapon enchantment; 12 earthen armor on a warrior fist; 13 ghost wolf biting lightning; 14 chain lightning between rocks; 15 erupting lava fissure; 16 icy hail shards; 17 elemental tornado; 18 earthquake wave; 19 three elements converging around a crystal; 20 ancestral elemental crown. Totem icons primarily jade and aged copper, melee icons amber and bronze, elemental icons azure orange and ice. Consistent elegant style, readable at small size, all different.

### Tree backgrounds (opaque)

Production talent-tree background atlas for Shadowfall dark fantasy RPG. Wide landscape divided into exactly THREE equal vertical panels, same horizon and atmospheric perspective, no borders no text no labels no characters no UI. LEFT panel TOTEM path: ancient stone shrine, tall carved jade spirit totems, spectral green flames and floating ancestor lights, moss, dark forest copper lanterns, quiet dark central space for nodes. CENTER panel MELEE ENHANCEMENT path: dramatic bronze and amber storm forge, pair of ancient stone maces on anvil at bottom edge, lightning coiling through hanging runic chains, black volcanic stone, warm sparks at edges, dark uncluttered center for talent nodes. RIGHT panel ELEMENTAL path: primeval mountain overlook with swirling azure thunderclouds, molten lava stream and icy blue crystalline formations, three elemental currents winding together, dark quiet central space for nodes. Premium detailed painterly dark-fantasy environmental art, jewel colors restrained in deep charcoal shadows. Art must fill three equal panels, no black borders or gridlines.

### Totem sprites (transparent)

Production sprite atlas for Shadowfall dark fantasy game, exact THREE columns TWO rows, SIX separate whole carved spirit totems, genuine alpha transparent background. Three quarter overhead camera. Each full object fits central 65 percent of its equal cell with generous clear gutters, no floor, no text labels numbers borders gridlines. Detailed painterly fantasy game props. Row1 left Thunder totem: carved jade stone pole with blue lightning crystals and bronze bands; middle Ember totem: black volcanic carved pole with orange flame bowl and copper runes; right Tide totem: aged bronze and dark wood pole with sapphire water orb and flowing water. Row2 left Earth totem: sturdy moss-covered gray stone guardian pillar, amber eyes and broad base; middle Wind totem: slender carved teal pillar with floating silver feather rings; right Ancestor totem: ancient jade spirit mask on a copper pole, spectral ghost flame above. Six distinct silhouettes, consistent scale, complete bases and tips no cropping.

Final edit prompt:

Edit this game sprite atlas. KEEP all six totems, their appearance, positions, scale, and exact 3 by 2 cell arrangement. Remove ALL background, fog, colored glow backdrop, ground and haze between and around the totems. Output genuine transparent alpha empty background, with zero opaque rectangle per sprite. Keep only the six hard-edged totem objects, crystalline tips, contained flames and dangling ornaments. Broad fully transparent gutters on all sides of each object. No drop shadows or ground planes. Preserve each complete totem within its cell, no cropping. This is a transparent sprite sheet, not a scene.
